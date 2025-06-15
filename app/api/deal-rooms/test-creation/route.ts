import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function POST(request: NextRequest) {
  console.log("🔍 TEST CREATION: Starting step-by-step test")

  try {
    // Step 1: Parse request body
    console.log("🔍 TEST CREATION: Step 1 - Parsing request body")
    let body
    try {
      body = await request.json()
      console.log("🔍 TEST CREATION: Request body:", body)
    } catch (parseError: any) {
      console.error("🔍 TEST CREATION: Body parse error:", parseError)
      return NextResponse.json(
        {
          success: false,
          step: "1 - Request parsing",
          details: parseError.message,
        },
        { status: 400 },
      )
    }

    // Step 2: Create Supabase client
    console.log("🔍 TEST CREATION: Step 2 - Creating Supabase client")
    let supabase
    try {
      supabase = createClient()
      console.log("🔍 TEST CREATION: Supabase client created successfully")
    } catch (supabaseError: any) {
      console.error("🔍 TEST CREATION: Supabase client creation error:", supabaseError)
      return NextResponse.json(
        {
          success: false,
          step: "2 - Supabase client creation",
          details: supabaseError.message,
        },
        { status: 500 },
      )
    }

    // Step 3: Test authentication
    console.log("🔍 TEST CREATION: Step 3 - Testing authentication")
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error("🔍 TEST CREATION: Auth error:", authError)
        return NextResponse.json(
          {
            success: false,
            step: "3 - Authentication",
            details: authError.message,
          },
          { status: 401 },
        )
      }

      if (!userData?.user) {
        return NextResponse.json(
          {
            success: false,
            step: "3 - Authentication",
            details: "No authenticated user found",
          },
          { status: 401 },
        )
      }

      console.log("🔍 TEST CREATION: User authenticated:", userData.user.email)
    } catch (authException: any) {
      console.error("🔍 TEST CREATION: Auth exception:", authException)
      return NextResponse.json(
        {
          success: false,
          step: "3 - Authentication exception",
          details: authException.message,
        },
        { status: 500 },
      )
    }

    // Step 4: Test a simple query that should work with RLS
    console.log("🔍 TEST CREATION: Step 4 - Testing simple query")
    try {
      // Try to query listings instead of profiles, as the user should have access to their own listings
      const { data, error } = await supabase.from("listings").select("id, title").limit(1)

      if (error) {
        console.error("🔍 TEST CREATION: Query error:", error)
        return NextResponse.json(
          {
            success: false,
            step: "4 - Simple query",
            details: getErrorMessage(error),
            code: error.code,
            hint: error.hint,
          },
          { status: 500 },
        )
      }

      console.log("🔍 TEST CREATION: Query successful, found", data?.length || 0, "listings")
    } catch (queryError: any) {
      console.error("🔍 TEST CREATION: Query exception:", queryError)
      return NextResponse.json(
        {
          success: false,
          step: "4 - Simple query exception",
          details: queryError.message,
        },
        { status: 500 },
      )
    }

    // All steps passed
    return NextResponse.json({
      success: true,
      step: "All steps passed",
      message: "Test completed successfully - authentication and database access working",
    })
  } catch (error: any) {
    console.error("🔍 TEST CREATION: Unexpected error:", error)
    console.error("🔍 TEST CREATION: Error stack:", getErrorStack(error))

    return NextResponse.json(
      {
        success: false,
        step: "Unexpected error",
        details: getErrorMessage(error),
        stack: getErrorStack(error),
      },
      { status: 500 },
    )
  }
}
