import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseClient) {
    console.log("🔍 SUPABASE CLIENT: Creating new browser client")
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  } else {
    console.log("🔍 SUPABASE CLIENT: Reusing existing browser client")
  }
  return supabaseClient
}
