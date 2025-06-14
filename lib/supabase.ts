import { createClient } from "@supabase/supabase-js"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not found, using fallback values")
}

// Fallback for development/demo purposes
const fallbackUrl = "https://demo.supabase.co"
const fallbackKey = "demo-key"

export const supabase = createClient(supabaseUrl || fallbackUrl, supabaseAnonKey || fallbackKey)

export function createRouteHandlerClient({ cookies: cookieStore }: { cookies: () => any }) {
  try {
    return createServerClient(supabaseUrl || fallbackUrl, supabaseAnonKey || fallbackKey, {
      cookies: {
        get(name: string) {
          return cookieStore().get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore().set({ name, value, ...options })
          } catch (error) {
            console.warn("Could not set cookie:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore().set({ name, value: "", ...options })
          } catch (error) {
            console.warn("Could not remove cookie:", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    // Return a basic client as fallback
    return createClient(supabaseUrl || fallbackUrl, supabaseAnonKey || fallbackKey)
  }
}

// Export createServerClient for compatibility with existing imports
export { createServerClient } from "@supabase/ssr"
