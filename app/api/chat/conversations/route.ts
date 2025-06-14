import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET - Fetch user's conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return new Response("User ID required", { status: 400 })
    }

    const { data: conversations, error } = await supabase
      .from("chat_conversations")
      .select(`
        id,
        title,
        context_data,
        is_active,
        last_message_at,
        created_at,
        chat_messages!inner(
          role,
          content,
          created_at
        )
      `)
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("last_message_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching conversations:", error)
      return new Response("Failed to fetch conversations", { status: 500 })
    }

    return Response.json(conversations)
  } catch (error) {
    console.error("Conversations API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

// POST - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const { userId, title, contextData } = await request.json()

    if (!userId) {
      return new Response("User ID required", { status: 400 })
    }

    const { data: conversation, error } = await supabase
      .from("chat_conversations")
      .insert({
        user_id: userId,
        title: title || "New Conversation",
        context_data: contextData || {},
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating conversation:", error)
      return new Response("Failed to create conversation", { status: 500 })
    }

    return Response.json(conversation)
  } catch (error) {
    console.error("Create conversation API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
