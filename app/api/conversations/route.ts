import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"
import type { UserProfile, Conversation, Participant, MessageSummary, ConversationType } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get("userId")

    if (!currentUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get conversation IDs the user is part of
    const { data: participations, error: participationError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", currentUserId)

    if (participationError) {
      console.error("Failed to fetch user participations:", participationError)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    if (!participations || participations.length === 0) {
      return NextResponse.json({ conversations: [] })
    }

    const conversationIds = participations.map((p: any) => p.conversation_id)

    // Get conversation details
    const { data: conversationsData, error: convError } = await supabase
      .from("conversations")
      .select(`
        id,
        type,
        listing_id,
        proposal_id,
        created_at,
        updated_at,
        listings (title),
        proposals (id) 
      `)
      .in("id", conversationIds)
      .order("updated_at", { ascending: false })

    if (convError) {
      console.error("Conversations fetch error:", convError)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    const enrichedConversations = await Promise.all(
      conversationsData.map(async (conv: any) => {
        // Get participants for this conversation
        const { data: participantsData, error: pError } = await supabase
          .from("conversation_participants")
          .select(`
            user_id,
            last_read_at,
            is_archived,
            joined_at,
            profiles (id, full_name, avatar_url, user_type)
          `)
          .eq("conversation_id", conv.id)

        if (pError) {
          console.error(`Error fetching participants for conv ${conv.id}:`, pError)
          // Continue with this conversation, participants will be empty
        }

        const participants: Participant[] =
          participantsData?.map((p: any) => {
            const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
            return {
              id: profile?.id || p.user_id,
              user_id: p.user_id,
              profile: profile as UserProfile,
              name: profile?.full_name || "Unknown User",
              avatar: profile?.avatar_url || "/placeholder.svg?height=40&width=40",
              last_read_at: p.last_read_at,
              is_archived: p.is_archived,
              joined_at: p.joined_at,
              isCurrentUser: p.user_id === currentUserId,
            };
          }) || []

        // Get latest message
        const { data: latestMessageData, error: lmError } = await supabase
          .from("messages")
          .select("id, content, created_at, sender_id, is_encrypted")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (lmError && lmError.code !== "PGRST116") {
          // PGRST116: single row not found (ok if no messages)
          console.error(`Error fetching latest message for conv ${conv.id}:`, lmError)
        }

        const lastMessage: MessageSummary | null = latestMessageData
          ? {
              id: latestMessageData.id,
              content: latestMessageData.content,
              timestamp: latestMessageData.created_at,
              senderId: latestMessageData.sender_id,
              encrypted: latestMessageData.is_encrypted || false,
            }
          : null

        // Get unread count
        // This is a simplified unread count. A more robust solution might involve message_read_receipts
        // or comparing message created_at with participant's last_read_at.
        let unreadCount = 0
        if (lastMessage && lastMessage.senderId !== currentUserId) {
          const participantSelf = participantsData?.find((p: any) => p.user_id === currentUserId)
          if (
            participantSelf?.last_read_at &&
            new Date(lastMessage.timestamp) > new Date(participantSelf.last_read_at)
          ) {
            unreadCount = 1 // Simplified: if last message is newer than last_read and not by self, count as 1 unread.
          } else if (!participantSelf?.last_read_at) {
            unreadCount = 1 // If never read, last message is unread.
          }
          // For a more accurate count, you'd query messages newer than last_read_at.
          const { count } = await supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .neq("sender_id", currentUserId)
            .gt("created_at", participantSelf?.last_read_at || new Date(0).toISOString())
          unreadCount = count || 0
        }

        const listing = Array.isArray(conv.listings) ? conv.listings[0] : conv.listings
        const projectTitle = listing?.title || (conv.proposal_id ? `Proposal Discussion` : "Direct Message")

        return {
          id: conv.id,
          type: conv.type,
          listing_id: conv.listing_id,
          proposal_id: conv.proposal_id,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          participants,
          lastMessage,
          unreadCount,
          projectTitle, // Derived title
        } as Conversation
      }),
    )

    return NextResponse.json({ conversations: enrichedConversations })
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      participantsUserIds, // Expecting an array of user IDs for participants
      type, // 'DIRECT', 'LISTING_INQUIRY', 'PROPOSAL_DISCUSSION'
      listingId,
      proposalId,
    } = (await request.json()) as {
      participantsUserIds: string[]
      type: ConversationType
      listingId?: string
      proposalId?: string
    }

    if (!participantsUserIds || participantsUserIds.length < 2) {
      return NextResponse.json({ error: "At least 2 participants required" }, { status: 400 })
    }
    if (!type) {
      return NextResponse.json({ error: "Conversation type is required" }, { status: 400 })
    }
    if ((type === "LISTING_INQUIRY" && !listingId) || (type === "PROPOSAL_DISCUSSION" && !proposalId)) {
      return NextResponse.json({ error: "Context ID (listing or proposal) required for this type" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    if (!currentUser || !participantsUserIds.includes(currentUser.id)) {
      return NextResponse.json({ error: "Current user must be a participant" }, { status: 403 })
    }

    // Use the get_or_create_conversation function
    // The function expects two user IDs. If more, it implies a group chat which the function isn't designed for.
    // For now, let's assume it's for 2 users. If you need group chats, the function needs modification.
    if (participantsUserIds.length !== 2) {
      // For now, let's handle simple 1-to-1 creation or find.
      // If you need group chat creation via API, this logic needs to be more robust.
      // A simpler approach for now: create a conversation and add all participants.
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({ type, listing_id: listingId, proposal_id: proposalId })
        .select()
        .single()

      if (convError) {
        console.error("Conversation creation error:", convError)
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
      }

      const participantInserts = participantsUserIds.map((userId: string) => ({
        conversation_id: conversation.id,
        user_id: userId,
      }))

      const { error: participantError } = await supabase.from("conversation_participants").insert(participantInserts)

      if (participantError) {
        console.error("Participant creation error:", participantError)
        // Consider rolling back conversation creation or handling cleanup
        return NextResponse.json({ error: "Failed to add participants" }, { status: 500 })
      }
      return NextResponse.json({ success: true, conversationId: conversation.id })
    } else {
      // Use the function for 2 participants
      const user1 = participantsUserIds[0]
      const user2 = participantsUserIds[1]

      const { data: conversationId, error: funcError } = await supabase.rpc("get_or_create_conversation", {
        p_user1_id: user1,
        p_user2_id: user2,
        p_type: type,
        p_listing_id: listingId,
        p_proposal_id: proposalId,
      })

      if (funcError) {
        console.error("get_or_create_conversation error:", funcError)
        return NextResponse.json({ error: "Failed to get or create conversation" }, { status: 500 })
      }
      return NextResponse.json({ success: true, conversationId })
    }
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
