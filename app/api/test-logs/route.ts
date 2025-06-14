import { NextResponse } from "next/server"

export async function GET() {
  console.log("TEST_API: This is a test log message")
  console.log("TEST_API: Current timestamp:", new Date().toISOString())

  return NextResponse.json({
    message: "Test endpoint working",
    timestamp: new Date().toISOString(),
  })
}
