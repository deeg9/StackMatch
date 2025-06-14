import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 TEST API: GET /api/test-proposal called")
  return NextResponse.json({ message: "Test API working", timestamp: new Date().toISOString() })
}

export async function POST() {
  console.log("🔍 TEST API: POST /api/test-proposal called")
  return NextResponse.json({ message: "Test POST API working", timestamp: new Date().toISOString() })
}
