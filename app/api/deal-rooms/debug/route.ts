import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function POST(request: NextRequest) {
  console.log("🔍 DEBUG API: Starting debug endpoint")

  try {
    // Test 1: Can we parse the request body?
    console.log("🔍 DEBUG API: Test 1 - Parsing request body")
    const body = await request.json()
    console.log("🔍 DEBUG API: Request body parsed successfully:", body)

    // Test 2: Can we create a Supabase client?
    console.log("🔍 DEBUG API: Test 2 - Creating Supabase client")
    const supabase = await createClient()
    console.log("🔍 DEBUG API: Supabase client created successfully")

    // Test 3: Can we get the authenticated user?
    console.log("🔍 DEBUG API: Test 3 - Getting authenticated user")
    const { data: userData, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error("🔍 DEBUG API: Auth error:", authError)
      return NextResponse.json(
        {
          error: "Auth error",
          details: authError.message,
          step: "authentication",
        },
        { status: 401 },
      )
    }

    if (!userData?.user) {
      console.error("🔍 DEBUG API: No user found")
      return NextResponse.json(
        {
          error: "No user found",
          step: "authentication",
        },
        { status: 401 },
      )
    }

    console.log("🔍 DEBUG API: User authenticated:", userData.user.email)

    // Test 4: Can we query the database?
    console.log("🔍 DEBUG API: Test 4 - Testing database query")
    const { data: testData, error: testError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", userData.user.id)
      .single()

    if (testError) {
      console.error("🔍 DEBUG API: Database query error:", testError)
      return NextResponse.json(
        {
          error: "Database query failed",
          details: testError.message,
          step: "database_query",
        },
        { status: 500 },
      )
    }

    console.log("🔍 DEBUG API: Database query successful:", testData)

    // Test 5: Can we check if deal_rooms table exists?
    console.log("🔍 DEBUG API: Test 5 - Checking deal_rooms table")
    const { data: dealRoomsTest, error: dealRoomsError } = await supabase.from("deal_rooms").select("id").limit(1)

    if (dealRoomsError) {
      console.error("🔍 DEBUG API: Deal rooms table error:", dealRoomsError)
      return NextResponse.json(
        {
          error: "Deal rooms table issue",
          details: dealRoomsError.message,
          step: "deal_rooms_table",
        },
        { status: 500 },
      )
    }

    console.log("🔍 DEBUG API: Deal rooms table accessible, found records:", dealRoomsTest?.length || 0)

    // All tests passed
    return NextResponse.json({
      success: true,
      message: "All debug tests passed",
      user: userData.user.email,
      profileData: testData,
      dealRoomsCount: dealRoomsTest?.length || 0,
    })
  } catch (error: any) {
    console.error("🔍 DEBUG API: Unexpected error:", error)
    console.error("🔍 DEBUG API: Error stack:", getErrorStack(error))

    return NextResponse.json(
      {
        error: "Debug test failed",
        details: getErrorMessage(error),
        stack: getErrorStack(error),
        step: "unexpected_error",
      },
      { status: 500 },
    )
  }
}
