import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const timestamp = new Date().toISOString()

  try {
    console.log(`🔍 [${timestamp}] SIMPLE TEST: Starting simple test for deal room:`, params.id)

    // Just return a simple success response
    const response = {
      success: true,
      dealRoomId: params.id,
      timestamp,
      message: "Simple test endpoint working",
    }

    console.log(`🔍 [${timestamp}] SIMPLE TEST: Returning response:`, response)

    return NextResponse.json(response)
  } catch (error) {
    console.error(`🔍 [${timestamp}] SIMPLE TEST: Error:`, error)
    return NextResponse.json(
      {
        error: "Simple test failed",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
