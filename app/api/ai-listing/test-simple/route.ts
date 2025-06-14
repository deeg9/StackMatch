import { NextResponse } from "next/server"

export async function GET() {
  console.log("[SERVER] 🔍 AI TEST: Simple test endpoint called")

  try {
    // Test environment variables
    const hasDeepInfraKey = !!process.env.DEEPINFRA_API_KEY
    console.log("[SERVER] 🔍 AI TEST: DEEPINFRA_API_KEY available:", hasDeepInfraKey)

    // Test dynamic import
    console.log("[SERVER] 🔍 AI TEST: Testing dynamic AI SDK import...")
    const { generateText } = await import("ai")
    console.log("[SERVER] ✅ AI TEST: AI SDK imported successfully")

    return NextResponse.json({
      success: true,
      message: "AI listing system is working",
      hasDeepInfraKey,
      aiSdkImported: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[SERVER] ❌ AI TEST: Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return GET() // Same logic for POST
}
