import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/server"
import { generateAIResponseServer } from "@/lib/ai-listing/server-ai-utils"

export async function POST(request: Request) {
  console.log("[SERVER] 🔍 AI CONVERSATION: Starting conversation handler...")

  try {
    // Parse request body
    const body = await request.json()
    const { message, sessionId } = body

    if (!message || !sessionId) {
      console.error("[SERVER] ❌ AI CONVERSATION: Missing required fields")
      return NextResponse.json({ error: "Missing required fields: message and sessionId" }, { status: 400 })
    }

    console.log("[SERVER] 🔍 AI CONVERSATION: Message received, session:", sessionId)

    // Get user from session
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      console.error("[SERVER] ❌ AI CONVERSATION: User not authenticated")
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const userId = session.user.id
    console.log("[SERVER] 🔍 AI CONVERSATION: User authenticated:", userId)

    // Generate AI response
    const response = await generateAIResponseServer(message, sessionId, userId)

    if (!response.success) {
      console.error("[SERVER] ❌ AI CONVERSATION: Failed to generate response:", response.error)
      return NextResponse.json({ error: response.error || "Failed to generate AI response" }, { status: 500 })
    }

    console.log("[SERVER] ✅ AI CONVERSATION: Response generated successfully")
    return NextResponse.json({
      message: response.text,
      sessionId: response.sessionId,
    })
  } catch (error) {
    console.error("[SERVER] ❌ AI CONVERSATION: Unexpected error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? getErrorMessage(error) : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
