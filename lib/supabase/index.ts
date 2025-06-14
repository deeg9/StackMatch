// Re-export everything from the main supabase module
export * from "../supabase"

// Re-export server-specific functions
export { createClient as createServerClient } from "./server"
export { createServiceRoleClient } from "./server"

// Re-export client-specific functions
export { createClient as createBrowserClient } from "./client"

// Re-export singleton functions
export { getSupabaseClient, resetSupabaseClient } from "./singleton"
export { getGlobalSupabaseClient, resetGlobalSupabaseClient } from "./global-singleton"