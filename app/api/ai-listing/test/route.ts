import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function GET(request: NextRequest) {
  console.log("[SERVER] 🔍 AI LISTING TEST: Simple test endpoint called")

  try {
    // Test environment variables
    const hasDeepInfraKey = !!process.env.DEEPINFRA_API_KEY
    console.log("[SERVER] 🔍 AI LISTING TEST: DEEPINFRA_API_KEY present:", hasDeepInfraKey)

    // Test database connection
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = createClient()

    console.log("[SERVER] 🔍 AI LISTING TEST: Testing database connection...")
    const { data, error } = await supabase.from("listing_conversations").select("count").limit(1)

    if (error) {
      console.error("[SERVER] ❌ AI LISTING TEST: Database error:", error)
    } else {
      console.log("[SERVER] ✅ AI LISTING TEST: Database connection successful")
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: {
        hasDeepInfraKey,
        databaseConnected: !error,
        databaseError: error?.message || null,
      },
    })
  } catch (error) {
    console.error("[SERVER] ❌ AI LISTING TEST: Test endpoint error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      },
      { status: 500 },
    )
  }
}
