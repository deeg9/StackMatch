import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function GET() {
  console.log("[SERVER] 🔍 SIMPLE TEST: Starting basic test...")

  try {
    // Basic environment check
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      hasDeepInfra: !!process.env.DEEPINFRA_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    console.log("[SERVER] ✅ SIMPLE TEST: Environment check:", envCheck)

    // Basic response
    const response = {
      success: true,
      message: "Simple test endpoint working",
      environment: envCheck,
      timestamp: new Date().toISOString(),
      serverTime: Date.now(),
    }

    console.log("[SERVER] ✅ SIMPLE TEST: Returning response")
    return NextResponse.json(response)
  } catch (error) {
    console.error("[SERVER] ❌ SIMPLE TEST: Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Simple test failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
