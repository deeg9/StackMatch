import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  // Log the environment variables (without revealing secrets)
  console.log(
    "🔍 SUPABASE SERVER: Creating client with URL:",
    process.env.SUPABASE_URL ? "URL defined" : "URL missing",
    "and ANON KEY:",
    process.env.SUPABASE_ANON_KEY ? "KEY defined" : "KEY missing",
  )

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("🔍 SUPABASE SERVER: Missing required environment variables!")
    throw new Error("Missing required Supabase environment variables")
  }

  try {
    return createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookies: {
        get: (name) => {
          return cookieStore.get(name)?.value
        },
        set: (name, value, options) => {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error("🔍 SUPABASE SERVER: Error setting cookie:", error)
          }
        },
        remove: (name, options) => {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.error("🔍 SUPABASE SERVER: Error removing cookie:", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("🔍 SUPABASE SERVER: Error creating client:", error)
    throw error
  }
}
