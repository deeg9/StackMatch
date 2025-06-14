import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("🔍 SERVER UTILS TEST: Starting server utilities test")

  const results = {
    timestamp: new Date().toISOString(),
    success: false,
    steps: [] as any[],
    errors: [] as string[],
  }

  try {
    // Step 1: Test cookies import
    console.log("🔍 SERVER UTILS TEST: Step 1 - Testing cookies import")
    try {
      const { cookies } = await import("next/headers")
      const cookieStore = cookies()

      results.steps.push({
        step: 1,
        name: "Cookies Import",
        success: true,
        message: "Cookies imported successfully",
      })
    } catch (error: any) {
      results.steps.push({
        step: 1,
        name: "Cookies Import",
        success: false,
        error: error.message,
      })
      throw error
    }

    // Step 2: Test our server Supabase client
    console.log("🔍 SERVER UTILS TEST: Step 2 - Testing server Supabase client")
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const { cookies } = await import("next/headers")
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)

      results.steps.push({
        step: 2,
        name: "Server Supabase Client",
        success: true,
        message: "Server Supabase client created successfully",
      })

      // Step 3: Test database query with server client
      console.log("🔍 SERVER UTILS TEST: Step 3 - Testing database query with server client")
      const { data, error } = await supabase.from("profiles").select("count").limit(1)

      if (error) {
        results.steps.push({
          step: 3,
          name: "Database Query with Server Client",
          success: false,
          error: error.message,
          errorCode: error.code,
          errorDetails: error.details,
        })
        results.errors.push(`Database error: ${error.message}`)
      } else {
        results.steps.push({
          step: 3,
          name: "Database Query with Server Client",
          success: true,
          message: "Database query successful",
          data: data,
        })
      }
    } catch (error: any) {
      results.steps.push({
        step: 2,
        name: "Server Supabase Client",
        success: false,
        error: error.message,
        stack: error.stack,
      })
      results.errors.push(`Server client error: ${error.message}`)
    }

    // Overall success
    results.success = results.errors.length === 0

    console.log(`🔍 SERVER UTILS TEST: Test completed. Success: ${results.success}`)

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("🔍 SERVER UTILS TEST: Unhandled error:", error)
    results.errors.push(`Unhandled error: ${error.message}`)

    return NextResponse.json(
      {
        ...results,
        unhandledError: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      },
      { status: 500 },
    )
  }
}
