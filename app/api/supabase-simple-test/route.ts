export async function GET() {
  console.log("🔵 SUPABASE TEST: Starting Supabase connection test")

  try {
    // Check environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("🔵 SUPABASE TEST: URL exists:", !!supabaseUrl)
    console.log("🔵 SUPABASE TEST: Key exists:", !!supabaseKey)
    console.log("🔵 SUPABASE TEST: URL value:", supabaseUrl?.substring(0, 20) + "...")

    if (!supabaseUrl || !supabaseKey) {
      console.error("🔵 SUPABASE TEST: Missing environment variables")
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing Supabase environment variables",
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Try to create a simple Supabase client
    const { createClient } = await import("@supabase/supabase-js")
    console.log("🔵 SUPABASE TEST: Supabase import successful")

    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log("🔵 SUPABASE TEST: Client created")

    // Try a simple query
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    console.log("🔵 SUPABASE TEST: Query completed")
    console.log("🔵 SUPABASE TEST: Query error:", error)
    console.log("🔵 SUPABASE TEST: Query data:", data)

    return new Response(
      JSON.stringify({
        success: !error,
        hasConnection: !error,
        error: error?.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("🔵 SUPABASE TEST: Caught error:", error.message)
    console.error("🔵 SUPABASE TEST: Error stack:", error.stack)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
