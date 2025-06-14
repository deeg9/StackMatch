import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function GET() {
  // Multiple console log attempts
  console.log("🚨 DEBUG TEST: Starting - this should appear in logs")
  console.error("🚨 DEBUG TEST: Error log - this should appear in logs")
  console.warn("🚨 DEBUG TEST: Warning log - this should appear in logs")

  try {
    const timestamp = new Date().toISOString()
    console.log(`🚨 DEBUG TEST: Timestamp created: ${timestamp}`)

    const response = {
      success: true,
      message: "Debug test endpoint is working",
      timestamp,
      logs: [
        "Console log 1: Starting debug test",
        "Console log 2: Creating response",
        "Console log 3: About to return response",
      ],
    }

    console.log("🚨 DEBUG TEST: Response created:", JSON.stringify(response, null, 2))
    console.log("🚨 DEBUG TEST: About to return NextResponse")

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("🚨 DEBUG TEST: Caught error:", error)
    console.error("🚨 DEBUG TEST: Error message:", getErrorMessage(error))
    console.error("🚨 DEBUG TEST: Error stack:", getErrorStack(error))

    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
        stack: getErrorStack(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
