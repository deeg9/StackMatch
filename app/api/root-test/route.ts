import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

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
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 })
  }
}
