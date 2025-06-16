/**
 * Extracts the JWT from a Supabase auth cookie
 * Supabase stores the token in a JSON structure
 */
export function extractJwtFromSupabaseCookie(cookieValue: string): string | null {
  try {
    // The cookie value is a JSON string
    const parsed = JSON.parse(cookieValue)

    // The access token is in the session.access_token field
    if (parsed?.session?.access_token) {
      return parsed.session.access_token
    }

    return null
  } catch (error) {
    console.error("Failed to parse Supabase cookie:", error)
    return null
  }
}

/**
 * Decodes a JWT token without verification
 * This is safe for extracting non-sensitive data like user ID and email
 */
export function decodeJwt(token: string): any {
  try {
    // JWT tokens have 3 parts: header.payload.signature
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format")
    }

    // Base64 decode the payload (middle part)
    const payload = parts[1]
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c: any) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Failed to decode JWT:", error)
    return null
  }
}

/**
 * Extracts user information from a Supabase JWT token
 */
export function extractUserFromJwt(token: string): any {
  const decoded = decodeJwt(token)
  if (!decoded) return null

  // Extract user data from the JWT claims
  return {
    id: decoded.sub,
    email: decoded.email,
    aud: decoded.aud,
    role: decoded.role,
    app_metadata: decoded.app_metadata,
    user_metadata: decoded.user_metadata,
    iat: decoded.iat,
    exp: decoded.exp,
  }
}
