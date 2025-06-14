import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 DEBUG MESSAGES: Starting POST request")
  console.log("🔍 DEBUG MESSAGES: Deal room ID:", params.id)
  console.log("🔍 DEBUG MESSAGES: Request URL:", request.url)
  console.log("🔍 DEBUG MESSAGES: Request method:", request.method)

  try {
    const body = await request.json()
    console.log("🔍 DEBUG MESSAGES: Request body:", JSON.stringify(body, null, 2))

    // Simple response without any database calls
    return NextResponse.json({
      success: true,
      message: "Debug endpoint working",
      dealRoomId: params.id,
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 DEBUG MESSAGES: Error parsing JSON:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to parse JSON: " + String(error),
      },
      { status: 400 },
    )
  }
}
