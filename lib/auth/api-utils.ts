import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

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
