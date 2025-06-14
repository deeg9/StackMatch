import { NextResponse } from "next/server"

export async function GET() {
  console.log("🌟 ROOT TEST: Starting root level API test")
  console.log("🌟 ROOT TEST: This is in the root /api directory")

  try {
    const result = {
      success: true,
      message: "Root level API test working",
      location: "/api/root-test",
      timestamp: new Date().toISOString(),
    }

    console.log("🌟 ROOT TEST: Result:", result)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("🌟 ROOT TEST: Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
