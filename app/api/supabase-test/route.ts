import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🔍 SUPABASE TEST: Starting Supabase test endpoint")

  try {
    // Test 1: Can we import the createClient function?
    console.log("🔍 SUPABASE TEST: Test 1 - Importing createClient")

    let createClient
    try {
      const supabaseModule = await import("@/lib/supabase/server")
      createClient = supabaseModule.createServerClient
      console.log("🔍 SUPABASE TEST: createClient imported successfully")
    } catch (importError: any) {
      console.error("🔍 SUPABASE TEST: Import error:", importError)
      return NextResponse.json(
        {
          error: "Failed to import createClient",
          details: importError.message,
          step: "import",
        },
        { status: 500 },
      )
    }

    // Test 2: Can we create a Supabase client?
    console.log("🔍 SUPABASE TEST: Test 2 - Creating Supabase client")

    let supabase
    try {
      supabase = createClient()
      console.log("🔍 SUPABASE TEST: Supabase client created successfully")
    } catch (clientError: any) {
      console.error("🔍 SUPABASE TEST: Client creation error:", clientError)
      return NextResponse.json(
        {
          error: "Failed to create Supabase client",
          details: clientError.message,
          step: "client_creation",
        },
        { status: 500 },
      )
    }

    // Test 3: Can we call getUser()?
    console.log("🔍 SUPABASE TEST: Test 3 - Getting user")

    let userData
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("🔍 SUPABASE TEST: Auth error:", error)
        return NextResponse.json(
          {
            error: "Auth error",
            details: error.message,
            step: "authentication",
          },
          { status: 401 },
        )
      }
      userData = data
      console.log("🔍 SUPABASE TEST: User data retrieved:", userData?.user?.email || "No user")
    } catch (authError: any) {
      console.error("🔍 SUPABASE TEST: Auth call error:", authError)
      return NextResponse.json(
        {
          error: "Failed to call getUser",
          details: authError.message,
          step: "auth_call",
        },
        { status: 500 },
      )
    }

    // Test 4: Can we make a simple database query?
    console.log("🔍 SUPABASE TEST: Test 4 - Simple database query")

    try {
      const { data, error } = await supabase.from("profiles").select("id").limit(1)

      if (error) {
        console.error("🔍 SUPABASE TEST: Database query error:", error)
        return NextResponse.json(
          {
            error: "Database query failed",
            details: error.message,
            step: "database_query",
          },
          { status: 500 },
        )
      }

      console.log("🔍 SUPABASE TEST: Database query successful, found records:", data?.length || 0)
    } catch (queryError: any) {
      console.error("🔍 SUPABASE TEST: Query call error:", queryError)
      return NextResponse.json(
        {
          error: "Failed to execute query",
          details: queryError.message,
          step: "query_execution",
        },
        { status: 500 },
      )
    }

    // All tests passed
    return NextResponse.json({
      success: true,
      message: "All Supabase tests passed",
      user: userData?.user?.email || "No user",
      step: "complete",
    })
  } catch (error: any) {
    console.error("🔍 SUPABASE TEST: Unexpected error:", error)
    console.error("🔍 SUPABASE TEST: Error stack:", error.stack)

    return NextResponse.json(
      {
        error: "Supabase test failed",
        details: error.message,
        stack: error.stack,
        step: "unexpected_error",
      },
      { status: 500 },
    )
  }
}
