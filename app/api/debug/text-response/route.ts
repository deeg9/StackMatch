import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function GET() {
  try {
    console.log("🔍 TEXT RESPONSE: Starting...")

    // Create a simple text response instead of JSON
    const response = new NextResponse("This is a plain text response", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    })

    console.log("🔍 TEXT RESPONSE: Response created, about to return")
    return response
  } catch (error: any) {
    console.error("🔍 TEXT RESPONSE: Error:", error)

    // Return error as plain text
    return new NextResponse(`Error: ${getErrorMessage(error) || "Unknown error"}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
