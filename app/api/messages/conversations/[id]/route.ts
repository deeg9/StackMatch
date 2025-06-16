import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/client-wrapper"
import type { Message as MessageType } from "@/types/conversation-types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id
    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
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

    const formattedMessages: MessageType[] = messagesData.map((msg: any) => {
      // Handle case where profiles might be an array
      const profile = msg.profiles ? (Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles) : null;
      
      return {
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
        sender: profile
          ? {
              id: profile.id,
              full_name: profile.full_name || "Unknown User",
              avatar_url: profile.avatar_url || "/placeholder.svg?height=32&width=32",
            }
          : {
              id: msg.sender_id || "unknown",
              full_name: "Unknown User",
              avatar_url: "/placeholder.svg?height=32&width=32",
            },
      };
    })

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
    const supabase = await createClient()
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
      return NextResponse.json({ error: `Failed to send message: ${getErrorMessage(error)}` }, { status: 500 })
    }

    // Update conversation's updated_at timestamp
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    // Handle case where profiles might be an array
    const messageProfile = messageData.profiles ? (Array.isArray(messageData.profiles) ? messageData.profiles[0] : messageData.profiles) : null;
    
    const formattedMessage: MessageType = {
      id: messageData.id,
      conversation_id: messageData.conversation_id,
      sender_id: messageData.sender_id,
      content: messageData.content,
      is_encrypted: messageData.is_encrypted || false,
      message_type: (messageData.message_type as "TEXT" | "FILE" | "SYSTEM") || "TEXT",
      file_url: messageData.file_url || null,
      file_name: messageData.file_name || null,
      created_at: messageData.created_at,
      updated_at: messageData.updated_at || messageData.created_at,
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
