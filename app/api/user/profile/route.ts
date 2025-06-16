import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

// Simple cache for profile data
const profileCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 seconds

// Generate a unique request ID
function generateRequestId() {
  return Math.random().toString(36).substring(2, 10)
}

export async function GET(request: NextRequest) {
  console.log("🔍 USER PROFILE API: DISABLED - Using client-side auth only")

  return NextResponse.json(
    {
      error: "This endpoint is disabled. Use client-side authentication instead.",
      message: "Please use the useClientAuth hook for authentication.",
    },
    { status: 410 }, // Gone - indicates this endpoint is no longer available
  )
}

// The rest of the code is intentionally commented out as the endpoint is disabled
/*
export async function GET() {
  const requestId = generateRequestId()
  console.log(`🔍 [${requestId}] USER PROFILE API: Starting profile fetch`)

  try {
    console.log(`🔍 [${requestId}] USER PROFILE API: Getting cookies...`)
    const cookieStore = await cookies()

    // Debug cookies
    let allCookies: Array<{ name: string; hasValue: boolean; valueLength: number }> = []
    try {
      allCookies = cookieStore.getAll().map((c: any) => ({
        name: c.name,
        hasValue: !!c.value,
        valueLength: c.value?.length || 0,
      }))
      console.log(`🔍 [${requestId}] USER PROFILE API: Total cookies found: ${allCookies.length}`)

      // Filter for Supabase-related cookies
      const supabaseCookies = allCookies.filter((c: any) => c.name.includes("supabase") || c.name.includes("sb-"))
      console.log(`🔍 [${requestId}] USER PROFILE API: Supabase-related cookies:`, supabaseCookies)
    } catch (e) {
      console.log(`🔍 [${requestId}] USER PROFILE API: Could not get all cookies:`, e)
    }

    // Try to get the auth token directly
    let jwtUser = null
    const authTokenCookie = cookieStore.get("sb-lnxceojnwkrmxxsulorp-auth-token")

    if (authTokenCookie?.value) {
      console.log(`🔍 [${requestId}] USER PROFILE API: Found auth token cookie, attempting to extract JWT`)

      // Extract the JWT from the cookie value
      const jwt = extractJwtFromSupabaseCookie(authTokenCookie.value)

      if (jwt) {
        console.log(`🔍 [${requestId}] USER PROFILE API: Successfully extracted JWT from cookie`)
        jwtUser = extractUserFromJwt(jwt)

        if (jwtUser) {
          console.log(`🔍 [${requestId}] USER PROFILE API: Successfully extracted user from JWT:`, {
            id: jwtUser.id,
            email: jwtUser.email,
          })
        } else {
          console.log(`🔍 [${requestId}] USER PROFILE API: Failed to extract user from JWT`)
        }
      } else {
        console.log(`🔍 [${requestId}] USER PROFILE API: Failed to extract JWT from cookie`)
      }
    }

    console.log(`🔍 [${requestId}] USER PROFILE API: Creating Supabase client...`)
    const supabase = await createClient(cookieStore)
    console.log(`🔍 [${requestId}] USER PROFILE API: Supabase client created successfully`)

    // Try to get user with timeout
    console.log(`🔍 [${requestId}] USER PROFILE API: About to call supabase.auth.getUser()...`)

    let user = null
    let authError = null

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`supabase.auth.getUser() timed out after 5000ms`))
        }, 5000) // Reduced timeout to 5 seconds
      })

      // Create the auth promise
      const authPromise = supabase.auth.getUser()

      // Race between auth and timeout
      const { data, error } = (await Promise.race([
        authPromise,
        timeoutPromise.then(() => {
          throw new Error(`supabase.auth.getUser() timed out after 5000ms`)
        }),
      ])) as any

      if (error) {
        console.log(`🔍 [${requestId}] USER PROFILE API: supabase.auth.getUser() failed:`, getErrorMessage(error))
        authError = error
      } else if (data?.user) {
        user = data.user
        console.log(`🔍 [${requestId}] USER PROFILE API: User found via getUser():`, {
          id: user.id,
          email: user.email,
        })
      }
    } catch (error) {
      console.log(`🔍 [${requestId}] USER PROFILE API: supabase.auth.getUser() error:`, error)
      authError = error
    }

    // Fallback to JWT if getUser() failed
    if (!user && jwtUser) {
      console.log(`🔍 [${requestId}] USER PROFILE API: Falling back to JWT user`)
      user = jwtUser
    }

    if (!user) {
      console.log(`🔍 [${requestId}] USER PROFILE API: No user found in session or JWT`)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log(`🔍 [${requestId}] USER PROFILE API: User authenticated:`, {
      id: user.id,
      email: user.email,
      source: jwtUser && !user.role ? "jwt" : "supabase",
    })

    // Check cache for profile data
    const cacheKey = `profile-${user.id}`
    const cached = profileCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`🔍 [${requestId}] USER PROFILE API: Returning cached profile data`)
      return NextResponse.json({ user: cached.data })
    }

    // Fetch profile with timeout
    console.log(`🔍 [${requestId}] USER PROFILE API: Fetching profile for user ID: ${user.id}`)

    try {
      const profilePromise = supabase.from("profiles").select("*").eq("id", user.id).single()

      const profileTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Profile fetch timed out after 5000ms`))
        }, 5000)
      })

      const { data: profile, error: profileError } = (await Promise.race([
        profilePromise,
        profileTimeoutPromise.then(() => {
          throw new Error(`Profile fetch timed out after 5000ms`)
        }),
      ])) as any

      if (profileError) {
        console.log(`🔍 [${requestId}] USER PROFILE API: Profile fetch failed:`, getErrorMessage(profileError))
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
      }

      console.log(`🔍 [${requestId}] USER PROFILE API: Profile fetched successfully:`, {
        id: profile.id,
        email: profile.email,
        user_type: profile.user_type,
      })

      // Fetch buyer profile if needed
      let buyerProfile = null
      if (profile.user_type === "buyer") {
        console.log(`🔍 [${requestId}] USER PROFILE API: Fetching buyer profile`)

        try {
          const buyerPromise = supabase.from("buyer_profiles").select("*").eq("user_id", user.id).single()

          const buyerTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error(`Buyer profile fetch timed out after 5000ms`))
            }, 5000)
          })

          const { data: buyerData } = (await Promise.race([
            buyerPromise,
            buyerTimeoutPromise.then(() => {
              throw new Error(`Buyer profile fetch timed out after 5000ms`)
            }),
          ])) as any

          buyerProfile = buyerData
          console.log(`🔍 [${requestId}] USER PROFILE API: Buyer profile fetched:`, !!buyerData)
        } catch (error) {
          console.log(`🔍 [${requestId}] USER PROFILE API: Buyer profile fetch failed:`, error)
          // Continue even if buyer profile fetch fails
        }
      }

      // Prepare response data
      const userData = {
        id: profile.id,
        email: profile.email,
        user_type: profile.user_type,
        company_name: profile.company_name,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        is_verified: profile.is_verified,
        email_verified: profile.email_verified,
        onboarding_completed: profile.onboarding_completed,
        buyer_profile: buyerProfile,
      }

      // Cache the result
      profileCache.set(cacheKey, { data: userData, timestamp: Date.now() })

      console.log(`🔍 [${requestId}] USER PROFILE API: Returning profile data`)
      return NextResponse.json({ user: userData })
    } catch (error) {
      console.log(`🔍 [${requestId}] USER PROFILE API: Error fetching profile:`, error)

      if (error instanceof Error && getErrorMessage(error).includes("timed out")) {
        return NextResponse.json({ error: "Database request timed out" }, { status: 408 })
      }

      return NextResponse.json({ error: "Error fetching profile" }, { status: 500 })
    }
  } catch (error) {
    console.log(`🔍 [${requestId}] USER PROFILE API: Unexpected error:`, error)

    // Special handling for timeout errors
    if (error instanceof Error && getErrorMessage(error).includes("timed out")) {
      return NextResponse.json({ error: "Request timed out" }, { status: 408 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
*/
