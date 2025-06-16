import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get conversations for the user
    const { data: conversations, error } = await supabase
      .from("conversation_participants")
      .select(`
        conversation_id,
        conversations!inner (
          id,
          project_title,
          encryption_enabled,
          created_at,
          updated_at
        )
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    // Get participants for each conversation
    const conversationIds = conversations.map((c: any) => c.conversations.id)

    const { data: participants, error: participantsError } = await supabase
      .from("conversation_participants")
      .select(`
        conversation_id,
        user_id,
        users!inner (
          id,
          first_name,
          last_name,
          avatar_url,
          user_type,
          last_active
        )
      `)
      .in("conversation_id", conversationIds)

    if (participantsError) {
      console.error("Error fetching participants:", participantsError)
      return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 })
    }

    // Get last message for each conversation
    const { data: lastMessages, error: messagesError } = await supabase
      .from("messages")
      .select(`
        id,
        conversation_id,
        content,
        message_type,
        created_at,
        sender_id,
        users!inner (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false })

    if (messagesError) {
      console.error("Error fetching last messages:", messagesError)
    }

    // Format conversations
    const formattedConversations = conversations.map((conv: any) => {
      const convParticipants = participants
        .filter((p: any: any) => p.conversation_id === conv.conversations.id)
        .map((p: any) => ({
          id: p.users.id,
          name: `${p.users.first_name} ${p.users.last_name}`.trim(),
          avatar: p.users.avatar_url,
          userType: p.users.user_type,
          isOnline: false, // Will be updated by presence
          lastSeen: p.users.last_active,
        }))

      const lastMessage = lastMessages?.find((m: any) => m.conversation_id === conv.conversations.id)
      const lastMessageFormatted = lastMessage
        ? {
            id: lastMessage.id,
            conversationId: lastMessage.conversation_id,
            senderId: lastMessage.sender_id,
            senderName: `${lastMessage.users.first_name} ${lastMessage.users.last_name}`.trim(),
            senderAvatar: lastMessage.users.avatar_url,
            content: lastMessage.content,
            type: lastMessage.message_type,
            timestamp: lastMessage.created_at,
            readBy: [],
            encrypted: false,
          }
        : undefined

      return {
        id: conv.conversations.id,
        participants: convParticipants,
        lastMessage: lastMessageFormatted,
        unreadCount: 0, // TODO: Calculate actual unread count
        createdAt: conv.conversations.created_at,
        updatedAt: conv.conversations.updated_at,
        projectTitle: conv.conversations.project_title,
        encryptionEnabled: conv.conversations.encryption_enabled,
      }
    })

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error("Error in realtime conversations API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, content, senderId, type = "TEXT" } = await request.json()

    if (!conversationId || !content || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Insert message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        message_type: type,
      })
      .select(`
        id,
        content,
        message_type,
        created_at,
        sender_id,
        conversation_id,
        users!inner (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error("Error creating message:", error)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    // Update conversation timestamp
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    const formattedMessage = {
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_id,
      senderName: `${message.users.first_name} ${message.users.last_name}`.trim(),
      senderAvatar: message.users.avatar_url || "/placeholder.svg?height=32&width=32",
      content: message.content,
      type: message.message_type,
      timestamp: message.created_at,
      encrypted: false,
      readBy: [],
    }

    return NextResponse.json({
      success: true,
      message: formattedMessage,
    })
  } catch (error) {
    console.error("Error in send message API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
