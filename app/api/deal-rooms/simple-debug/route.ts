import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 SIMPLE DEBUG: Starting simple debug endpoint")

    // Test 1: Can we parse the request body?
    console.log("🔍 SIMPLE DEBUG: Test 1 - Parsing request body")
    const body = await request.json()
    console.log("🔍 SIMPLE DEBUG: Request body parsed successfully:", body)

    // Test 2: Can we return a simple response?
    console.log("🔍 SIMPLE DEBUG: Test 2 - Creating response")

    const response = {
      success: true,
      message: "Simple debug test successful",
      receivedData: body,
      timestamp: new Date().toISOString(),
    }

    console.log("🔍 SIMPLE DEBUG: Response created:", response)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("🔍 SIMPLE DEBUG: Error:", error)
    console.error("🔍 SIMPLE DEBUG: Error stack:", getErrorStack(error))

    return NextResponse.json(
      {
        success: false,
        error: "Simple debug test failed",
        details: getErrorMessage(error),
        stack: getErrorStack(error),
      },
      { status: 500 },
    )
  }
}
