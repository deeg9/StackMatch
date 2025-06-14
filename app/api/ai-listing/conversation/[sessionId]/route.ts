import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser } from "@/lib/auth/api-utils"
import type { ConversationSession } from "@/types/ai-listing-types"

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params
    const supabase = createClient()

    const { data: conversation, error } = await supabase
      .from("listing_conversations")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .single()

    if (error || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    const session: ConversationSession = {
      id: conversation.id,
      sessionId: conversation.session_id,
      userId: conversation.user_id,
      messages: conversation.conversation_data || [],
      formState: conversation.form_state || {},
      createdAt: new Date(conversation.created_at),
      updatedAt: new Date(conversation.updated_at),
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = params
    const supabase = createClient()

    const { error } = await supabase
      .from("listing_conversations")
      .delete()
      .eq("session_id", sessionId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error deleting conversation:", error)
      return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
