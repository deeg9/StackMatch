import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return new Response("Failed to fetch messages", { status: 500 })
    }

    // Transform to match the format expected by useChat
    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: new Date(msg.created_at),
    }))

    return Response.json(formattedMessages)
  } catch (error) {
    console.error("Messages API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
