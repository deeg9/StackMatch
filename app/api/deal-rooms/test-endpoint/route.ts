import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  console.log("🔍 BASIC TEST: Starting basic test endpoint")

  const results = {
    timestamp: new Date().toISOString(),
    success: false,
    environment: {},
    tests: {} as Record<string, any>,
    errors: [] as string[],
  }

  try {
    // Test 1: Environment variables
    console.log("🔍 BASIC TEST: Checking environment variables")
    results.environment = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "defined" : "missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "defined" : "missing",
      supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? "defined" : "missing",
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing required Supabase environment variables")
    }

    results.tests.environment = { success: true, message: "Environment variables available" }

    // Test 2: Create Supabase client
    console.log("🔍 BASIC TEST: Creating Supabase client")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    results.tests.supabaseClient = { success: true, message: "Supabase client created" }

    // Test 3: Basic database query
    console.log("🔍 BASIC TEST: Testing database connection")
    try {
      const { data, error } = await supabase.from("profiles").select("count(*)").limit(1).single()

      if (error) {
        throw error
      }

      results.tests.databaseConnection = {
        success: true,
        message: "Database connection successful",
        data,
      }
    } catch (error: any) {
      results.tests.databaseConnection = {
        success: false,
        message: "Database connection failed",
        error: getErrorMessage(error),
      }
      results.errors.push(`Database error: ${getErrorMessage(error)}`)
    }

    // Overall success
    results.success = results.errors.length === 0

    console.log(`🔍 BASIC TEST: Test completed. Success: ${results.success}`)
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("🔍 BASIC TEST: Unhandled error:", error)
    results.errors.push(`Unhandled error: ${getErrorMessage(error)}`)

    return NextResponse.json(
      {
        ...results,
        error: {
          message: getErrorMessage(error),
          stack: getErrorStack(error),
          name: error.name,
        },
      },
      { status: 500 },
    )
  }
}
