import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  console.log("[SERVER] 🔍 AI SAVE DRAFT: Starting save draft handler...")

  try {
    // Parse request body
    const body = await request.json()
    const { sessionId, formState } = body

    if (!sessionId) {
      console.error("[SERVER] ❌ AI SAVE DRAFT: Missing sessionId")
      return NextResponse.json({ error: "Missing required field: sessionId" }, { status: 400 })
    }

    console.log("[SERVER] 🔍 AI SAVE DRAFT: Draft save requested for session:", sessionId)

    // Get user from session
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      console.error("[SERVER] ❌ AI SAVE DRAFT: User not authenticated")
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const userId = session.user.id
    console.log("[SERVER] 🔍 AI SAVE DRAFT: User authenticated:", userId)

    // Check if conversation exists
    const { data: existingConversation, error: fetchError } = await supabase
      .from("listing_conversations")
      .select("id, form_state")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("[SERVER] ❌ AI SAVE DRAFT: Error fetching conversation:", fetchError)
      return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 })
    }

    // Update or create conversation
    if (existingConversation) {
      console.log("[SERVER] 🔍 AI SAVE DRAFT: Updating existing conversation")
      const { error: updateError } = await supabase
        .from("listing_conversations")
        .update({
          form_state: formState || existingConversation.form_state,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId)
        .eq("user_id", userId)

      if (updateError) {
        console.error("[SERVER] ❌ AI SAVE DRAFT: Error updating conversation:", updateError)
        return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 })
      }
    } else {
      console.log("[SERVER] 🔍 AI SAVE DRAFT: Creating new conversation")
      const { error: insertError } = await supabase.from("listing_conversations").insert({
        session_id: sessionId,
        user_id: userId,
        form_state: formState || {},
        conversation_data: [],
      })

      if (insertError) {
        console.error("[SERVER] ❌ AI SAVE DRAFT: Error creating conversation:", insertError)
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
      }
    }

    console.log("[SERVER] ✅ AI SAVE DRAFT: Draft saved successfully")
    return NextResponse.json({
      success: true,
      sessionId,
    })
  } catch (error) {
    console.error("[SERVER] ❌ AI SAVE DRAFT: Unexpected error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
