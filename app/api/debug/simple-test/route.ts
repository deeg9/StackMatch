import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      message: "Simple test endpoint working",
      timestamp: new Date().toISOString(),
      success: true,
    })
  } catch (error: any) {
    console.error("Simple test error:", error)
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}
