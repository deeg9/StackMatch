import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 SIMPLE TEST: Starting super simple test")

  try {
    const result = {
      timestamp: new Date().toISOString(),
      message: "Simple test endpoint working",
      environment: {
        nodeEnv: process.env.NODE_ENV,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "defined" : "missing",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "defined" : "missing",
        supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? "defined" : "missing",
      },
      success: true,
    }

    console.log("🔍 SIMPLE TEST: Result:", JSON.stringify(result, null, 2))

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("🔍 SIMPLE TEST: Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
