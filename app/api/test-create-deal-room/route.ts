import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 TEST API: GET request received")

  try {
    return NextResponse.json({
      success: true,
      message: "Test API GET is working",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 TEST API GET Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "GET request failed",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  console.log("🔍 TEST API: POST request received")

  try {
    // Parse the request body
    const body = await request.json()
    console.log("🔍 TEST API: Request body:", body)

    const { proposalId, listingId } = body

    if (!proposalId) {
      console.log("🔍 TEST API: Missing proposalId")
      return NextResponse.json(
        {
          success: false,
          error: "Missing proposalId",
        },
        { status: 400 },
      )
    }

    // Create a mock deal room ID
    const mockDealRoomId = `test-deal-room-${Date.now()}`

    console.log("🔍 TEST API: Created mock deal room:", mockDealRoomId)

    // Return a successful response
    return NextResponse.json({
      success: true,
      message: "Test deal room created successfully",
      dealRoomId: mockDealRoomId,
      receivedData: {
        proposalId,
        listingId,
      },
    })
  } catch (error) {
    console.error("🔍 TEST API: Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
