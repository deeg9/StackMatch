import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const timestamp = new Date().toISOString()

  console.log(`🔍 [${timestamp}] MINIMAL TEST: Starting minimal test`)
  console.log(`🔍 [${timestamp}] MINIMAL TEST: Deal room ID:`, params.id)

  try {
    const body = await request.json()
    console.log(`🔍 [${timestamp}] MINIMAL TEST: Body parsed:`, body)

    return NextResponse.json({
      success: true,
      message: "Minimal test successful",
      dealRoomId: params.id,
      receivedData: body,
      timestamp,
    })
  } catch (error) {
    console.error(`🔍 [${timestamp}] MINIMAL TEST: Error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
