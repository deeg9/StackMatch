import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 MESSAGES TEST: Route reached successfully!")
  console.log("🔍 MESSAGES TEST: Deal room ID:", params.id)

  return NextResponse.json({
    success: true,
    message: "Messages test route working",
    dealRoomId: params.id,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 MESSAGES TEST POST: Route reached successfully!")
  console.log("🔍 MESSAGES TEST POST: Deal room ID:", params.id)

  try {
    const body = await request.json()
    console.log("🔍 MESSAGES TEST POST: Request body:", body)

    return NextResponse.json({
      success: true,
      message: "Messages test POST route working",
      dealRoomId: params.id,
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 MESSAGES TEST POST: Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
