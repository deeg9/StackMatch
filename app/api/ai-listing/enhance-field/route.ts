import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { enhanceFieldServer } from "@/lib/ai-listing/server-ai-utils"

export async function POST(request: Request) {
  console.log("[SERVER] 🔍 AI ENHANCE FIELD: Starting field enhancement handler...")

  try {
    // Parse request body
    const body = await request.json()
    const { field, content } = body

    if (!field || !content) {
      console.error("[SERVER] ❌ AI ENHANCE FIELD: Missing required fields")
      return NextResponse.json({ error: "Missing required fields: field and content" }, { status: 400 })
    }

    console.log("[SERVER] 🔍 AI ENHANCE FIELD: Enhancing field:", field)

    // Get user from session
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      console.error("[SERVER] ❌ AI ENHANCE FIELD: User not authenticated")
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    console.log("[SERVER] 🔍 AI ENHANCE FIELD: User authenticated:", session.user.id)

    // Enhance field
    const response = await enhanceFieldServer(field, content)

    if (!response.success) {
      console.error("[SERVER] ❌ AI ENHANCE FIELD: Failed to enhance field:", response.error)
      return NextResponse.json({ error: response.error || "Failed to enhance field" }, { status: 500 })
    }

    console.log("[SERVER] ✅ AI ENHANCE FIELD: Field enhanced successfully")
    return NextResponse.json({
      enhancedContent: response.enhancedContent,
      field: response.field,
    })
  } catch (error) {
    console.error("[SERVER] ❌ AI ENHANCE FIELD: Unexpected error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
