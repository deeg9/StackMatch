import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Message as MessageType } from "@/types" // Use our MessageType

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id
    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    const supabase = createClient()
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is part of the conversation (RLS should handle this, but good for explicit check)
    const { count: participantCount, error: participationError } = await supabase
      .from("conversation_participants")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUser.id)

    if (participationError || participantCount === 0) {
      return NextResponse.json({ error: "Forbidden or conversation not found" }, { status: 403 })
    }

    // Get messages for the conversation
    const { data: messagesData, error } = await supabase
      .from("messages")
      .select(`
        id,
        conversation_id,
        sender_id,
        content,
        attachments,
        is_encrypted,
        is_edited,
        edited_at,
        created_at,
        profiles (id, full_name, avatar_url)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Messages fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    const formattedMessages: MessageType[] = messagesData.map((msg) => ({
      id: msg.id,
      conversation_id: msg.conversation_id,
      conversationId: msg.conversation_id, // alias
      sender_id: msg.sender_id,
      content: msg.content,
      attachments: msg.attachments,
      is_encrypted: msg.is_encrypted,
      encrypted: msg.is_encrypted, // alias
      is_edited: msg.is_edited,
      edited_at: msg.edited_at,
      created_at: msg.created_at,
      timestamp: msg.created_at, // alias
      sender: msg.profiles
        ? {
            // profiles can be null if sender_id is null or profile deleted
            id: msg.profiles.id,
            full_name: msg.profiles.full_name || "Unknown User",
            avatar_url: msg.profiles.avatar_url || "/placeholder.svg?height=32&width=32",
          }
        : {
            id: msg.sender_id || "unknown",
            full_name: "Unknown User",
            avatar_url: "/placeholder.svg?height=32&width=32",
          },
    }))

    // Update last_read_at for the current user in this conversation
    await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", currentUser.id)

    return NextResponse.json({ messages: formattedMessages })
  } catch (error) {
    console.error("Messages API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id
    // Ensure senderId comes from authenticated user, not request body for security
    const supabase = createClient()
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const senderId = currentUser.id

    const { content, attachments, is_encrypted } = (await request.json()) as {
      content: string
      attachments?: any // jsonb
      is_encrypted?: boolean
    }

    if (!content && !attachments) {
      // Allow messages with only attachments
      return NextResponse.json({ error: "Content or attachments are required" }, { status: 400 })
    }
    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    // Insert message
    const { data: messageData, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content || "", // Ensure content is not null
        attachments,
        is_encrypted: is_encrypted || false,
      })
      .select(`
        id,
        conversation_id,
        sender_id,
        content,
        attachments,
        is_encrypted,
        is_edited,
        edited_at,
        created_at,
        profiles (id, full_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error("Message creation error:", error)
      // RLS might prevent insertion if user is not a participant
      return NextResponse.json({ error: `Failed to send message: ${error.message}` }, { status: 500 })
    }

    // Update conversation's updated_at timestamp
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    const formattedMessage: MessageType = {
      id: messageData.id,
      conversation_id: messageData.conversation_id,
      conversationId: messageData.conversation_id, // alias
      sender_id: messageData.sender_id,
      content: messageData.content,
      attachments: messageData.attachments,
      is_encrypted: messageData.is_encrypted,
      encrypted: messageData.is_encrypted, // alias
      is_edited: messageData.is_edited,
      edited_at: messageData.edited_at,
      created_at: messageData.created_at,
      timestamp: messageData.created_at, // alias
      sender: messageData.profiles
        ? {
            id: messageData.profiles.id,
            full_name: messageData.profiles.full_name || "Unknown User",
            avatar_url: messageData.profiles.avatar_url || "/placeholder.svg?height=32&width=32",
          }
        : {
            id: senderId,
            full_name: "You",
            avatar_url: currentUser.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32",
          }, // Fallback for sender if profile join fails
    }

    // TODO: Trigger WebSocket event for real-time update to other participants
    // e.g., wsManager.sendRealtimeMessage(conversationId, formattedMessage);

    return NextResponse.json({
      success: true,
      message: formattedMessage,
    })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
