import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("🔍 DETAILED TEST: Starting detailed test endpoint")

  const results = {
    timestamp: new Date().toISOString(),
    success: false,
    steps: [] as any[],
    environment: {},
    errors: [] as string[],
  }

  try {
    // Step 1: Check environment variables
    console.log("🔍 DETAILED TEST: Step 1 - Checking environment variables")
    results.environment = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "defined" : "missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "defined" : "missing",
      supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? "defined" : "missing",
    }

    results.steps.push({
      step: 1,
      name: "Environment Variables",
      success: true,
      data: results.environment,
    })

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing required Supabase environment variables")
    }

    // Step 2: Try to import Supabase
    console.log("🔍 DETAILED TEST: Step 2 - Importing Supabase")
    let supabase
    try {
      const { createClient } = await import("@supabase/supabase-js")
      supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      results.steps.push({
        step: 2,
        name: "Supabase Import & Client Creation",
        success: true,
        message: "Supabase client created successfully",
      })
    } catch (error: any) {
      results.steps.push({
        step: 2,
        name: "Supabase Import & Client Creation",
        success: false,
        error: error.message,
      })
      throw error
    }

    // Step 3: Test basic database query
    console.log("🔍 DETAILED TEST: Step 3 - Testing database connection")
    try {
      const { data, error } = await supabase.from("profiles").select("count").limit(1)

      if (error) {
        results.steps.push({
          step: 3,
          name: "Database Connection Test",
          success: false,
          error: error.message,
          errorCode: error.code,
          errorDetails: error.details,
        })
        results.errors.push(`Database error: ${error.message}`)
      } else {
        results.steps.push({
          step: 3,
          name: "Database Connection Test",
          success: true,
          message: "Database connection successful",
          data: data,
        })
      }
    } catch (error: any) {
      results.steps.push({
        step: 3,
        name: "Database Connection Test",
        success: false,
        error: error.message,
        stack: error.stack,
      })
      results.errors.push(`Database connection error: ${error.message}`)
    }

    // Overall success
    results.success = results.errors.length === 0

    console.log(`🔍 DETAILED TEST: Test completed. Success: ${results.success}`)
    console.log(`🔍 DETAILED TEST: Errors: ${results.errors}`)

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("🔍 DETAILED TEST: Unhandled error:", error)
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
