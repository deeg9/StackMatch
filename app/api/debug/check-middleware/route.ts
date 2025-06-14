import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function GET() {
  try {
    console.log("🔍 MIDDLEWARE CHECK: Starting...")

    // Check if we're in a middleware context
    const isMiddleware = typeof process !== "undefined" && process.env.NEXT_RUNTIME === "edge"

    console.log("🔍 MIDDLEWARE CHECK: Is middleware context:", isMiddleware)

    // Return as plain text to avoid JSON issues
    return new NextResponse(
      `
      Middleware check:
      Is middleware context: ${isMiddleware}
      Time: ${new Date().toISOString()}
    `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      },
    )
  } catch (error: any) {
    console.error("🔍 MIDDLEWARE CHECK: Error:", error)
    return new NextResponse(`Error: ${getErrorMessage(error) || "Unknown error"}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
