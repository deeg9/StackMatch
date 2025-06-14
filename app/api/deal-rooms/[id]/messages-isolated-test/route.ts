import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const timestamp = new Date().toISOString()

  try {
    console.log(`🔍 [${timestamp}] ISOLATED TEST: ===== STARTING =====`)
    console.log(`🔍 [${timestamp}] ISOLATED TEST: Deal room ID:`, params.id)
    console.log(`🔍 [${timestamp}] ISOLATED TEST: Request method:`, request.method)
    console.log(`🔍 [${timestamp}] ISOLATED TEST: Request URL:`, request.url)

    // Test 1: Basic request parsing
    console.log(`🔍 [${timestamp}] ISOLATED TEST: TEST 1 - Parsing request body...`)
    let requestBody
    try {
      requestBody = await request.json()
      console.log(`🔍 [${timestamp}] ISOLATED TEST: Request body parsed successfully:`, requestBody)
    } catch (parseError) {
      console.error(`🔍 [${timestamp}] ISOLATED TEST: Parse error:`, parseError)
      return NextResponse.json({ error: "Parse failed", details: String(parseError) }, { status: 400 })
    }

    // Test 2: Check if we can import the auth utils
    console.log(`🔍 [${timestamp}] ISOLATED TEST: TEST 2 - Testing auth utils import...`)
    try {
      const { getAuthenticatedClient } = await import("@/lib/auth/api-utils")
      console.log(`🔍 [${timestamp}] ISOLATED TEST: Auth utils imported successfully`)

      // Test 3: Try to call the auth function
      console.log(`🔍 [${timestamp}] ISOLATED TEST: TEST 3 - Calling getAuthenticatedClient...`)
      const authResult = await getAuthenticatedClient(request)
      console.log(`🔍 [${timestamp}] ISOLATED TEST: Auth result:`, {
        hasSupabase: !!authResult.supabase,
        hasUser: !!authResult.user,
        hasError: !!authResult.error,
        userId: authResult.user?.id,
        errorMessage: authResult.error?.message,
      })

      if (authResult.error) {
        console.log(`🔍 [${timestamp}] ISOLATED TEST: Auth error detected:`, authResult.error)
        return NextResponse.json({
          success: true,
          step: "auth_error",
          error: authResult.error.message,
          details: "Authentication failed but function completed",
        })
      }

      if (!authResult.user) {
        console.log(`🔍 [${timestamp}] ISOLATED TEST: No user found`)
        return NextResponse.json({
          success: true,
          step: "no_user",
          details: "No user found but function completed",
        })
      }

      // Test 4: Try a simple Supabase query
      console.log(`🔍 [${timestamp}] ISOLATED TEST: TEST 4 - Testing simple Supabase query...`)
      try {
        const { data, error } = await authResult.supabase
          .from("deal_room_participants")
          .select("id")
          .eq("deal_room_id", params.id)
          .eq("user_id", authResult.user.id)
          .limit(1)

        console.log(`🔍 [${timestamp}] ISOLATED TEST: Supabase query result:`, {
          hasData: !!data,
          dataLength: data?.length,
          hasError: !!error,
          errorMessage: error?.message,
        })

        return NextResponse.json({
          success: true,
          step: "supabase_query_complete",
          details: "All tests passed",
          queryResult: {
            hasData: !!data,
            dataLength: data?.length,
            hasError: !!error,
          },
        })
      } catch (supabaseError) {
        console.error(`🔍 [${timestamp}] ISOLATED TEST: Supabase query error:`, supabaseError)
        return NextResponse.json({
          success: true,
          step: "supabase_error",
          error: String(supabaseError),
          details: "Supabase query failed but function completed",
        })
      }
    } catch (authImportError) {
      console.error(`🔍 [${timestamp}] ISOLATED TEST: Auth import/call error:`, authImportError)
      return NextResponse.json({
        success: true,
        step: "auth_import_error",
        error: String(authImportError),
        details: "Auth function failed but endpoint completed",
      })
    }
  } catch (error) {
    console.error(`🔍 [${timestamp}] ISOLATED TEST: ===== UNHANDLED ERROR =====`)
    console.error(`🔍 [${timestamp}] ISOLATED TEST: Error:`, error)
    console.error(`🔍 [${timestamp}] ISOLATED TEST: Error type:`, typeof error)
    console.error(`🔍 [${timestamp}] ISOLATED TEST: Error name:`, error instanceof Error ? error.name : "Unknown")
    console.error(
      `🔍 [${timestamp}] ISOLATED TEST: Error message:`,
      error instanceof Error ? error.message : String(error),
    )
    console.error(`🔍 [${timestamp}] ISOLATED TEST: Error stack:`, error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        success: false,
        error: "Unhandled error in isolated test",
        details: error instanceof Error ? error.message : String(error),
        errorType: typeof error,
        errorName: error instanceof Error ? error.name : "Unknown",
      },
      { status: 500 },
    )
  }
}
