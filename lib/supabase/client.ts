import { createBrowserClient } from "@supabase/ssr"

let browserSupabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!browserSupabaseClient) {
    console.log("🔍 SUPABASE CLIENT: Creating new browser client")
    browserSupabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return browserSupabaseClient
}

// Export the singleton instance
export const createClient = getSupabaseClient
