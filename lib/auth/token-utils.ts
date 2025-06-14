import { createClient } from "@/utils/supabase/client"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function getCurrentToken(): Promise<{ token: string | null; success: boolean }> {
  try {
    console.log("🔑 TOKEN UTILS: Getting current token...")

    const supabase = createClient()

    // Get the current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("🔑 TOKEN UTILS: Error getting session:", getErrorMessage(error))
      return { token: null, success: false }
    }

    if (!session || !session.access_token) {
      console.log("🔑 TOKEN UTILS: No session or access token found")
      return { token: null, success: false }
    }

    console.log("🔑 TOKEN UTILS: Token retrieved successfully")
    console.log("🔑 TOKEN UTILS: Token preview:", session.access_token.substring(0, 50) + "...")

    return { token: session.access_token, success: true }
  } catch (error) {
    console.error("🔑 TOKEN UTILS: Error getting token:", error)
    return { token: null, success: false }
  }
}

export async function refreshToken(): Promise<string | null> {
  try {
    console.log("🔑 TOKEN UTILS: Refreshing token...")

    const supabase = createClient()

    // Refresh the session
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession()

    if (error) {
      console.error("🔑 TOKEN UTILS: Error refreshing session:", getErrorMessage(error))
      return null
    }

    if (!session || !session.access_token) {
      console.log("🔑 TOKEN UTILS: No session or access token after refresh")
      return null
    }

    console.log("🔑 TOKEN UTILS: Token refreshed successfully")
    return session.access_token
  } catch (error) {
    console.error("🔑 TOKEN UTILS: Error refreshing token:", error)
    return null
  }
}

export async function getValidToken(): Promise<string | null> {
  try {
    // First try to get the current token
    const { token, success } = await getCurrentToken()

    if (!success || !token) {
      console.log("🔑 TOKEN UTILS: No current token, attempting refresh...")
      const token = await refreshToken()
      return token
    }

    return token
  } catch (error) {
    console.error("🔑 TOKEN UTILS: Error getting valid token:", error)
    return null
  }
}
