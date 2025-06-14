import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 TEST API: GET /api/proposals/:id/test - Request received")
  console.log("🔍 TEST API: Params:", params)

  return NextResponse.json({
    success: true,
    message: "Test endpoint working",
    proposalId: params.id,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 TEST API: POST /api/proposals/:id/test - Request received")
  console.log("🔍 TEST API: Params:", params)

  try {
    const body = await request.json()
    console.log("🔍 TEST API: Body:", body)

    return NextResponse.json({
      success: true,
      message: "Test POST endpoint working",
      proposalId: params.id,
      receivedBody: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 TEST API: Error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to parse body",
      proposalId: params.id,
    })
  }
}
