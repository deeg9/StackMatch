import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import type { Reaction as ReactionType } from "@/types"

export async function GET(request: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    const messageId = params.messageId
    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
    }
    const supabase = createServerClient()

    const { data: reactionsData, error } = await supabase
      .from("message_reactions")
      .select(`
        id,
        message_id,
        user_id,
        emoji,
        created_at,
        profiles (id, full_name)
      `)
      .eq("message_id", messageId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Reactions fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 })
    }

    const formattedReactions: ReactionType[] = reactionsData.map((r) => ({
      id: r.id,
      message_id: r.message_id,
      user_id: r.user_id,
      emoji: r.emoji,
      created_at: r.created_at,
      user: r.profiles ? { id: r.profiles.id, full_name: r.profiles.full_name || "Unknown User" } : undefined,
    }))

    // To match your previous structure of grouped reactions:
    const groupedReactions = formattedReactions.reduce(
      (acc, reaction) => {
        const emoji = reaction.emoji
        if (!acc[emoji]) {
          acc[emoji] = {
            emoji,
            count: 0,
            users: [], // array of user names
            userIds: [], // array of user IDs
            reactionDetails: [], // store full reaction objects if needed
          }
        }
        acc[emoji].count++
        acc[emoji].users.push(reaction.user?.full_name || "Unknown User")
        acc[emoji].userIds.push(reaction.user_id)
        acc[emoji].reactionDetails.push(reaction)
        return acc
      },
      {} as Record<
        string,
        { emoji: string; count: number; users: string[]; userIds: string[]; reactionDetails: ReactionType[] }
      >,
    )

    return NextResponse.json({ reactions: Object.values(groupedReactions) })
  } catch (error) {
    console.error("Reactions API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    const messageId = params.messageId
    const { emoji } = (await request.json()) as { emoji: string }

    const supabase = createServerClient()
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = currentUser.id

    if (!emoji) {
      return NextResponse.json({ error: "Emoji is required" }, { status: 400 })
    }
    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
    }

    // Check if user already reacted with this emoji
    const { data: existingReaction, error: selectError } = await supabase
      .from("message_reactions")
      .select("id")
      .eq("message_id", messageId)
      .eq("user_id", userId)
      .eq("emoji", emoji)
      .maybeSingle() // Use maybeSingle to handle 0 or 1 row

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116: single row not found (ok)
      console.error("Error checking existing reaction:", selectError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingReaction) {
      // Remove reaction if it already exists
      const { error: deleteError } = await supabase.from("message_reactions").delete().eq("id", existingReaction.id) // Delete by reaction ID for safety

      if (deleteError) {
        console.error("Reaction removal error:", deleteError)
        return NextResponse.json({ error: "Failed to remove reaction" }, { status: 500 })
      }
      return NextResponse.json({ success: true, action: "removed" })
    } else {
      // Add new reaction
      const { data: newReaction, error: insertError } = await supabase
        .from("message_reactions")
        .insert({
          message_id: messageId,
          user_id: userId,
          emoji,
        })
        .select("id, emoji, user_id, created_at, profiles(id, full_name)") // return the new reaction
        .single()

      if (insertError) {
        console.error("Reaction creation error:", insertError)
        return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 })
      }
      const formattedNewReaction: ReactionType = {
        id: newReaction.id,
        message_id: messageId,
        user_id: newReaction.user_id,
        emoji: newReaction.emoji,
        created_at: newReaction.created_at,
        user: newReaction.profiles
          ? { id: newReaction.profiles.id, full_name: newReaction.profiles.full_name || "Unknown User" }
          : undefined,
      }
      return NextResponse.json({ success: true, action: "added", reaction: formattedNewReaction })
    }
  } catch (error) {
    console.error("Reaction API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
