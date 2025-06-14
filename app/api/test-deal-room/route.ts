import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function GET() {
  console.log("🔍 TEST: GET endpoint reached")
  return NextResponse.json({
    message: "Test GET endpoint working",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  console.log("🔍 TEST: POST endpoint reached")

  try {
    const body = await request.json()
    console.log("🔍 TEST: Request body:", body)

    return NextResponse.json({
      message: "Test POST endpoint working",
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 TEST: Error:", error)
    return NextResponse.json(
      {
        error: "Failed to parse request",
        details: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      },
      { status: 400 },
    )
  }
}
