import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log("🟡 CAREFUL TEST: Starting careful files test")
  console.log("🟡 CAREFUL TEST: Deal room ID:", params.id)

  try {
    // Step 1: Check environment
    console.log("🟡 CAREFUL TEST: Step 1 - Checking environment")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("🟡 CAREFUL TEST: Missing environment variables")
      return new Response(
        JSON.stringify({
          success: false,
          step: "environment_check",
          error: "Missing Supabase credentials",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("🟡 CAREFUL TEST: Environment check passed")

    // Step 2: Create Supabase client
    console.log("🟡 CAREFUL TEST: Step 2 - Creating Supabase client")
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = await createClient(supabaseUrl, supabaseKey)
    console.log("🟡 CAREFUL TEST: Supabase client created")

    // Step 3: Test basic query
    console.log("🟡 CAREFUL TEST: Step 3 - Testing basic query")
    const { data: testData, error: testError } = await supabase
      .from("deal_rooms")
      .select("id")
      .eq("id", params.id)
      .limit(1)

    console.log("🟡 CAREFUL TEST: Basic query completed")
    console.log("🟡 CAREFUL TEST: Test error:", testError)
    console.log("🟡 CAREFUL TEST: Test data:", testData)

    if (testError) {
      console.error("🟡 CAREFUL TEST: Database query failed:", testError.message)
      return new Response(
        JSON.stringify({
          success: false,
          step: "database_query",
          error: testError.message,
          dealRoomId: params.id,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Step 4: Return success
    console.log("🟡 CAREFUL TEST: All steps completed successfully")
    return new Response(
      JSON.stringify({
        success: true,
        step: "completed",
        dealRoomId: params.id,
        dealRoomExists: testData && testData.length > 0,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("🟡 CAREFUL TEST: Unexpected error:", getErrorMessage(error))
    console.error("🟡 CAREFUL TEST: Error stack:", getErrorStack(error))

    return new Response(
      JSON.stringify({
        success: false,
        step: "unexpected_error",
        error: getErrorMessage(error),
        stack: getErrorStack(error),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
