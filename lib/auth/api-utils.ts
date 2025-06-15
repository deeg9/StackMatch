import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/client-wrapper"
import { cookies } from "next/headers"

export interface AuthResult {
  supabase?: any
  user?: any
  error?: string
  status?: number
}

export async function getAuthenticatedClient(request: NextRequest): Promise<AuthResult> {
  try {
    console.log("[SERVER] 🔍 API UTILS: Starting authentication...")

    // Extract token from header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("[SERVER] 🔍 API UTILS: Missing or invalid Authorization header")
      return {
        error: "Missing or invalid token",
        status: 401,
      }
    }

    const token = authHeader.split(" ")[1]
    console.log("[SERVER] 🔍 API UTILS: Token extracted from header")

    // Create client with service role key for server operations
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("[SERVER] 🔍 API UTILS: Supabase client created")

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      console.error("[SERVER] 🔍 API UTILS: Error getting user:", userError?.message)
      return {
        error: userError?.message || "Authentication failed",
        status: 401,
      }
    }

    console.log(`[SERVER] 🔍 API UTILS: User authenticated: ${user.id}`)

    return { supabase, user }
  } catch (error) {
    console.error("[SERVER] 🔍 API UTILS: Unexpected error:", error)
    return {
      error: String(error),
      status: 500,
    }
  }
}

// Legacy function for backward compatibility - returns authenticated client
export async function getAuthenticatedSupabaseClient(request: NextRequest): Promise<AuthResult> {
  return getAuthenticatedClient(request)
}

// Get authenticated user without request (for server components/actions)
export async function getAuthUser() {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting auth user:", error)
    return null
  }
}

// Authenticate user from request
export async function authenticateUser(request: NextRequest) {
  const result = await getAuthenticatedClient(request)
  
  if (result.error) {
    return { user: null, error: result.error, status: result.status }
  }
  
  return { user: result.user, error: null, status: 200 }
}

// Get current user with full profile (imported from auth.ts)
export async function getCurrentUser(supabase?: any) {
  try {
    // If supabase client is provided, use it; otherwise create a new one
    const client = supabase || createServerClient()

    const {
      data: { user },
      error,
    } = await client.auth.getUser()

    if (error || !user) {
      return null
    }

    const { data: profile, error: profileError } = await client
      .from("users")
      .select(`
        *,
        user_preferences (*),
        buyer_profiles (*),
        seller_profiles (*)
      `)
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      return null
    }

    return {
      ...profile,
      preferences: profile.user_preferences?.[0],
      buyer_profile: profile.buyer_profiles?.[0],
      seller_profile: profile.seller_profiles?.[0],
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
