import { NextResponse } from "next/server"

export async function GET() {
  console.log("[SERVER] 🔍 AI TEST CONNECTION: Starting test...")

  try {
    const results = {
      success: true,
      tests: {},
      timestamp: new Date().toISOString(),
    }

    // Test 1: Environment variables
    console.log("[SERVER] 🔍 AI TEST CONNECTION: Testing environment variables...")
    try {
      const hasDeepInfraKey = !!process.env.DEEPINFRA_API_KEY
      const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      results.tests.environment = {
        success: hasDeepInfraKey && hasSupabaseUrl && hasSupabaseKey,
        details: {
          DEEPINFRA_API_KEY: hasDeepInfraKey ? "Available" : "Missing",
          SUPABASE_URL: hasSupabaseUrl ? "Available" : "Missing",
          SUPABASE_ANON_KEY: hasSupabaseKey ? "Available" : "Missing",
        },
      }
      console.log("[SERVER] ✅ AI TEST CONNECTION: Environment check complete")
    } catch (error) {
      console.error("[SERVER] ❌ AI TEST CONNECTION: Environment test error:", error)
      results.tests.environment = {
        success: false,
        error: error instanceof Error ? error.message : "Environment test failed",
      }
    }

    // Test 2: Database connection
    console.log("[SERVER] 🔍 AI TEST CONNECTION: Testing database connection...")
    try {
      // Use dynamic import to avoid potential issues
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = createClient()

      const { data, error } = await supabase.from("listing_conversations").select("id").limit(1)

      results.tests.database = {
        success: !error,
        error: error?.message || null,
        recordCount: data?.length || 0,
      }
      console.log("[SERVER] ✅ AI TEST CONNECTION: Database test complete")
    } catch (error) {
      console.error("[SERVER] ❌ AI TEST CONNECTION: Database test error:", error)
      results.tests.database = {
        success: false,
        error: error instanceof Error ? error.message : "Database connection failed",
      }
    }

    // Test 3: Authentication
    console.log("[SERVER] 🔍 AI TEST CONNECTION: Testing authentication...")
    try {
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = createClient()

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      results.tests.authentication = {
        success: !!session && !sessionError,
        userId: session?.user?.id || null,
        error: sessionError?.message || null,
      }
      console.log("[SERVER] ✅ AI TEST CONNECTION: Auth test complete")
    } catch (error) {
      console.error("[SERVER] ❌ AI TEST CONNECTION: Auth test error:", error)
      results.tests.authentication = {
        success: false,
        error: error instanceof Error ? error.message : "Authentication test failed",
      }
    }

    // Test 4: AI SDK dynamic import
    console.log("[SERVER] 🔍 AI TEST CONNECTION: Testing AI SDK import...")
    try {
      const { generateText } = await import("ai")
      const { deepinfra } = await import("@ai-sdk/deepinfra")

      results.tests.aiSdk = {
        success: true,
        modules: {
          generateText: typeof generateText === "function",
          deepinfra: typeof deepinfra === "function",
        },
      }
      console.log("[SERVER] ✅ AI TEST CONNECTION: AI SDK imported successfully")
    } catch (error) {
      console.error("[SERVER] ❌ AI TEST CONNECTION: AI SDK import error:", error)
      results.tests.aiSdk = {
        success: false,
        error: error instanceof Error ? error.message : "AI SDK import failed",
      }
    }

    // Test 5: Server AI utils
    console.log("[SERVER] 🔍 AI TEST CONNECTION: Testing server AI utils...")
    try {
      const { generateAIResponseServer } = await import("@/lib/ai-listing/server-ai-utils")

      results.tests.serverUtils = {
        success: true,
        functions: {
          generateAIResponseServer: typeof generateAIResponseServer === "function",
        },
      }
      console.log("[SERVER] ✅ AI TEST CONNECTION: Server AI utils imported successfully")
    } catch (error) {
      console.error("[SERVER] ❌ AI TEST CONNECTION: Server AI utils error:", error)
      results.tests.serverUtils = {
        success: false,
        error: error instanceof Error ? error.message : "Server AI utils import failed",
      }
    }

    console.log("[SERVER] ✅ AI TEST CONNECTION: All tests completed")
    console.log("[SERVER] 🔍 AI TEST CONNECTION: Results:", JSON.stringify(results, null, 2))

    return NextResponse.json(results, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("[SERVER] ❌ AI TEST CONNECTION: Unexpected error:", error)
    console.error("[SERVER] ❌ AI TEST CONNECTION: Error stack:", error instanceof Error ? error.stack : "No stack")

    const errorResponse = {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
        type: error instanceof Error ? error.constructor.name : "UnknownError",
        stack: error instanceof Error ? error.stack : undefined,
      },
      timestamp: new Date().toISOString(),
    }

    console.log("[SERVER] ❌ AI TEST CONNECTION: Error response:", JSON.stringify(errorResponse, null, 2))

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
