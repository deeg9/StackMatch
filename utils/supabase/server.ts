import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Use a Map with string keys instead of WeakMap
// This ensures we can have a true singleton per request
const clientCache = new Map<string, ReturnType<typeof createServerClient>>()

// Cache expiration (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

// Last cleanup timestamp
let lastCleanup = Date.now()

export async function createClient(cookieStore?: Awaited<ReturnType<typeof cookies>>) {
  // Generate a unique request ID for this server component render
  // This is more reliable than using the cookie store object as a WeakMap key
  const requestId = Math.random().toString(36).substring(2, 15)
  console.log(`🔍 SUPABASE SERVER [${requestId}]: Creating server client...`)

  const store = cookieStore || await cookies()

  // Get all cookies for debugging
  let allCookies: string[] = []
  try {
    // This might throw in some contexts
    allCookies = store.getAll().map((c: any) => c.name)
  } catch (e) {
    console.log(`🔍 SUPABASE SERVER [${requestId}]: Could not get all cookies`)
  }

  // Create a cache key based on the auth cookie
  let authCookie: string | undefined
  try {
    // Look specifically for the auth token cookie
    const authCookieObj = store.get("sb-lnxceojnwkrmxxsulorp-auth-token")
    authCookie = authCookieObj?.value
  } catch (e) {
    console.log(`🔍 SUPABASE SERVER [${requestId}]: Error getting auth cookie`)
  }

  // If we have an auth cookie, use it as the cache key
  const cacheKey = authCookie ? `auth-${authCookie.substring(0, 32)}` : `anon-${requestId}`

  // Check if client already exists for this cache key
  if (clientCache.has(cacheKey)) {
    console.log(`🔍 SUPABASE SERVER [${requestId}]: Returning cached client for key ${cacheKey.substring(0, 10)}...`)
    return clientCache.get(cacheKey)!
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(`🔍 SUPABASE SERVER [${requestId}]: Missing environment variables`)
    throw new Error("Missing Supabase environment variables")
  }

  // Periodically clean up old clients
  if (Date.now() - lastCleanup > CACHE_EXPIRATION) {
    console.log(`🔍 SUPABASE SERVER [${requestId}]: Cleaning up old clients`)
    clientCache.clear()
    lastCleanup = Date.now()
  }

  try {
    console.log(`🔍 SUPABASE SERVER [${requestId}]: Creating new server client...`)
    console.log(`🔍 SUPABASE SERVER [${requestId}]: Available cookies: ${allCookies.join(", ")}`)

    const client = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get: (name: string) => {
          try {
            const cookie = store.get(name)
            const exists = !!cookie?.value
            const valueLength = cookie?.value?.length || 0
            console.log(
              `🔍 SUPABASE SERVER [${requestId}]: Getting cookie ${name}: exists=${exists}, length=${valueLength}`,
            )
            return cookie?.value
          } catch (error) {
            console.error(`🔍 SUPABASE SERVER [${requestId}]: Error getting cookie ${name}:`, error)
            return undefined
          }
        },
        set: (name: string, value: string, options: any) => {
          try {
            console.log(`🔍 SUPABASE SERVER [${requestId}]: Setting cookie ${name}`)
            store.set({ name, value, ...options })
          } catch (error) {
            console.error(`🔍 SUPABASE SERVER [${requestId}]: Error setting cookie ${name}:`, error)
          }
        },
        remove: (name: string, options: any) => {
          try {
            console.log(`🔍 SUPABASE SERVER [${requestId}]: Removing cookie ${name}`)
            store.set({ name, value: "", ...options })
          } catch (error) {
            console.error(`🔍 SUPABASE SERVER [${requestId}]: Error removing cookie ${name}:`, error)
          }
        },
      },
    })

    // Cache the client
    clientCache.set(cacheKey, client)
    console.log(`🔍 SUPABASE SERVER [${requestId}]: Client created and cached with key ${cacheKey.substring(0, 10)}`)
    return client
  } catch (error) {
    console.error(`🔍 SUPABASE SERVER [${requestId}]: Error creating client:`, error)
    throw error
  }
}
