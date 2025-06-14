import { createClient as createClientBrowser } from "@/utils/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"

// Global singleton instance (will be shared across all imports)
let globalInstance: SupabaseClient | null = null

// Last reset timestamp to handle race conditions
let lastResetTime = 0

// Instance creation counter for debugging
let instanceCount = 0

/**
 * Gets a truly global Supabase client instance
 * This works across all contexts and prevents multiple instances
 */
export function getGlobalSupabaseClient(): SupabaseClient {
  if (!globalInstance) {
    instanceCount++
    console.log(`🔍 GLOBAL SINGLETON: Creating new global Supabase client (instance #${instanceCount})`)
    globalInstance = createClientBrowser()
  } else {
    console.log(`🔍 GLOBAL SINGLETON: Reusing existing global Supabase client (instance #${instanceCount})`)
  }
  return globalInstance
}

/**
 * Resets the global Supabase client instance with debouncing
 * to prevent multiple resets in quick succession
 */
export function resetGlobalSupabaseClient(): void {
  const now = Date.now()
  // Prevent multiple resets within 1 second
  if (now - lastResetTime < 1000) {
    console.log("🔍 GLOBAL SINGLETON: Reset debounced, skipping")
    return
  }

  console.log(`🔍 GLOBAL SINGLETON: Resetting global Supabase client (was instance #${instanceCount})`)
  globalInstance = null
  lastResetTime = now
}

/**
 * Get debug information about the global singleton
 */
export function getGlobalSingletonInfo() {
  return {
    hasInstance: !!globalInstance,
    instanceCount,
    lastResetTime,
  }
}
