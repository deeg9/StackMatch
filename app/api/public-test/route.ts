import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 PUBLIC TEST: GET request received")
  return NextResponse.json({
    message: "Public test endpoint works",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  console.log("🔍 PUBLIC TEST: POST request received")

  try {
    const body = await request.json()
    console.log("🔍 PUBLIC TEST: Body parsed:", body)

    return NextResponse.json({
      message: "Public POST test works",
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 PUBLIC TEST: Error:", error)
    return NextResponse.json({ error: "Failed to parse request body" }, { status: 400 })
  }
}
