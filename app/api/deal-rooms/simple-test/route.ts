import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("🔍 SIMPLE TEST: GET endpoint reached")
  return NextResponse.json({ message: "Simple test working", timestamp: new Date().toISOString() })
}

export async function POST(request: NextRequest) {
  console.log("🔍 SIMPLE TEST: POST endpoint reached")
  return NextResponse.json({ message: "Simple POST test working", timestamp: new Date().toISOString() })
}
