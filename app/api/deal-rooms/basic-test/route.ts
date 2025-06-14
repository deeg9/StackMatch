import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 BASIC TEST: Starting basic test endpoint")

  try {
    return NextResponse.json({
      success: true,
      message: "Basic API test successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 BASIC TEST: Error:", error)
    return NextResponse.json(
      {
        error: "Basic test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
