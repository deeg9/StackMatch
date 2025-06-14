import { NextResponse } from "next/server"

export async function GET() {
  console.log("[SERVER] 🔍 DEBUG IMPORTS: Starting import debugging...")

  const results = {
    imports: {},
    errors: {},
    timestamp: new Date().toISOString(),
  }

  // Test 1: Basic Next.js imports
  try {
    console.log("[SERVER] 🔍 DEBUG IMPORTS: Testing Next.js imports...")
    const { NextRequest } = await import("next/server")
    results.imports.nextjs = {
      success: true,
      NextRequest: typeof NextRequest,
    }
  } catch (error) {
    console.error("[SERVER] ❌ DEBUG IMPORTS: Next.js import error:", error)
    results.errors.nextjs = error instanceof Error ? error.message : "Next.js import failed"
  }

  // Test 2: Supabase imports
  try {
    console.log("[SERVER] 🔍 DEBUG IMPORTS: Testing Supabase imports...")
    const supabaseModule = await import("@/lib/supabase/server")
    results.imports.supabase = {
      success: true,
      createClient: typeof supabaseModule.createClient,
      moduleKeys: Object.keys(supabaseModule),
    }
  } catch (error) {
    console.error("[SERVER] ❌ DEBUG IMPORTS: Supabase import error:", error)
    results.errors.supabase = error instanceof Error ? error.message : "Supabase import failed"
  }

  // Test 3: AI SDK imports
  try {
    console.log("[SERVER] 🔍 DEBUG IMPORTS: Testing AI SDK imports...")
    const aiModule = await import("ai")
    const deepinfraModule = await // import("@ai-sdk/deepinfra")
    results.imports.aiSdk = {
      success: true,
      generateText: typeof aiModule.generateText,
      deepinfra: typeof deepinfraModule.deepinfra,
      aiModuleKeys: Object.keys(aiModule),
      deepinfraModuleKeys: Object.keys(deepinfraModule),
    }
  } catch (error) {
    console.error("[SERVER] ❌ DEBUG IMPORTS: AI SDK import error:", error)
    results.errors.aiSdk = error instanceof Error ? error.message : "AI SDK import failed"
  }

  // Test 4: Server AI utils imports
  try {
    console.log("[SERVER] 🔍 DEBUG IMPORTS: Testing server AI utils imports...")
    const serverUtilsModule = await import("@/lib/ai-listing/server-ai-utils")
    results.imports.serverUtils = {
      success: true,
      generateAIResponseServer: typeof serverUtilsModule.generateAIResponseServer,
      moduleKeys: Object.keys(serverUtilsModule),
    }
  } catch (error) {
    console.error("[SERVER] ❌ DEBUG IMPORTS: Server AI utils import error:", error)
    results.errors.serverUtils = error instanceof Error ? error.message : "Server AI utils import failed"
  }

  console.log("[SERVER] ✅ DEBUG IMPORTS: All import tests completed")
  console.log("[SERVER] 🔍 DEBUG IMPORTS: Results:", JSON.stringify(results, null, 2))

  return NextResponse.json(results)
}
