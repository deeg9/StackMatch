import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔥 METHOD TEST: GET request received")
  return NextResponse.json({ method: "GET", success: true, timestamp: new Date().toISOString() })
}

export async function POST() {
  console.log("🔥 METHOD TEST: POST request received")
  return NextResponse.json({ method: "POST", success: true, timestamp: new Date().toISOString() })
}
