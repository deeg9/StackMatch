import { createClient } from "@/utils/supabase/client"
import { getGlobalSupabaseClient, resetGlobalSupabaseClient } from "./global-singleton"

// Single instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

/**
 * Returns a singleton instance of the Supabase client
 */
export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = await createClient()
  }
  return supabaseInstance
}

/**
 * Resets the Supabase client instance
 * Useful for testing or when auth state changes
 */
export function resetSupabaseClient() {
  supabaseInstance = null
}

// Re-export the global singleton functions
export { getGlobalSupabaseClient, resetGlobalSupabaseClient }
