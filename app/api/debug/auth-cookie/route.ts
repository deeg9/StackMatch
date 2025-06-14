import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { cookies } from "next/headers"

export async function GET() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    step: "starting",
    error: null,
  }

  try {
    debugInfo.step = "getting_cookies"
    const cookieStore = cookies()

    debugInfo.step = "checking_auth_cookie"
    const authTokenCookie = cookieStore.get("sb-lnxceojnwkrmxxsulorp-auth-token")

    if (!authTokenCookie?.value) {
      debugInfo.step = "no_auth_cookie"
      debugInfo.allCookies = Array.from(cookieStore.getAll()).map((c) => ({
        name: c.name,
        hasValue: !!c.value,
        valueLength: c.value?.length || 0,
      }))

      return NextResponse.json(
        {
          ...debugInfo,
          error: "Auth cookie not found",
          success: false,
        },
        { status: 404 },
      )
    }

    debugInfo.step = "cookie_found"
    debugInfo.cookieLength = authTokenCookie.value.length
    debugInfo.cookieStart = authTokenCookie.value.substring(0, 50) + "..."

    // Try to parse the cookie as JSON
    debugInfo.step = "parsing_json"
    let parsedCookie = null

    try {
      parsedCookie = JSON.parse(authTokenCookie.value)
      debugInfo.step = "json_parsed_successfully"
    } catch (parseError: any) {
      debugInfo.step = "json_parse_failed"
      debugInfo.parseError = parseError.message

      return NextResponse.json(
        {
          ...debugInfo,
          error: "Failed to parse cookie as JSON",
          success: false,
        },
        { status: 400 },
      )
    }

    // Analyze the structure safely
    debugInfo.step = "analyzing_structure"
    const cookieStructure = {
      topLevelKeys: parsedCookie ? Object.keys(parsedCookie) : [],
      hasSession: !!parsedCookie?.session,
      sessionKeys: parsedCookie?.session ? Object.keys(parsedCookie.session) : [],
      hasAccessToken: !!parsedCookie?.session?.access_token,
      accessTokenLength: parsedCookie?.session?.access_token?.length || 0,
      hasRefreshToken: !!parsedCookie?.session?.refresh_token,
      refreshTokenLength: parsedCookie?.session?.refresh_token?.length || 0,
      hasUser: !!parsedCookie?.session?.user,
      userKeys: parsedCookie?.session?.user ? Object.keys(parsedCookie.session.user) : [],
      expiresAt: parsedCookie?.session?.expires_at || null,
    }

    debugInfo.step = "checking_jwt"
    let jwtInfo = null

    if (parsedCookie?.session?.access_token) {
      try {
        const jwt = parsedCookie.session.access_token
        debugInfo.jwtLength = jwt.length
        debugInfo.jwtStart = jwt.substring(0, 50) + "..."

        // Check if it looks like a JWT (has 3 parts separated by dots)
        const jwtParts = jwt.split(".")
        debugInfo.jwtParts = jwtParts.length

        if (jwtParts.length === 3) {
          // Try to decode the payload (middle part)
          try {
            const payload = jwtParts[1]
            const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join(""),
            )

            const decoded = JSON.parse(jsonPayload)

            jwtInfo = {
              sub: decoded.sub,
              email: decoded.email ? "***@***" : null, // Redacted
              aud: decoded.aud,
              role: decoded.role,
              exp: decoded.exp,
              iat: decoded.iat,
              hasAppMetadata: !!decoded.app_metadata,
              hasUserMetadata: !!decoded.user_metadata,
            }

            debugInfo.step = "jwt_decoded_successfully"
          } catch (jwtError: any) {
            debugInfo.step = "jwt_decode_failed"
            debugInfo.jwtError = jwtError.message
          }
        } else {
          debugInfo.step = "invalid_jwt_format"
        }
      } catch (jwtProcessError: any) {
        debugInfo.step = "jwt_processing_failed"
        debugInfo.jwtProcessError = jwtProcessError.message
      }
    }

    debugInfo.step = "completed_successfully"

    return NextResponse.json({
      ...debugInfo,
      cookieStructure,
      jwtInfo,
      success: true,
    })
  } catch (error: any) {
    console.error("Debug endpoint error:", error)

    return NextResponse.json(
      {
        ...debugInfo,
        error: getErrorMessage(error) || "Unknown error",
        errorStack: getErrorStack(error),
        success: false,
      },
      { status: 500 },
    )
  }
}
