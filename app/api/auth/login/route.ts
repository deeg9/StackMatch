import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  console.log("🔍 LOGIN DEBUG: Starting login process...")

  try {
    // Parse request body
    let email, password
    try {
      const requestData = await request.json()
      email = requestData.email
      password = requestData.password
      console.log(`🔍 LOGIN DEBUG: Received login request for email: ${email}`)
    } catch (parseError) {
      console.error("🔍 LOGIN DEBUG: Error parsing request body:", parseError)
      return NextResponse.json({ success: false, message: "Invalid request format" }, { status: 400 })
    }

    if (!email || !password) {
      console.error("🔍 LOGIN DEBUG: Missing email or password")
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Create a simple Supabase client for validation only
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    console.log("🔍 LOGIN DEBUG: Supabase client CREATED.")

    console.log("🔍 LOGIN DEBUG: About to call signInWithPassword...")
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log("🔍 LOGIN DEBUG: signInWithPassword completed")

    if (authError) {
      console.error("🔍 LOGIN DEBUG: Authentication error:", authError.message)
      return NextResponse.json(
        { success: false, message: "Invalid credentials", error: authError.message },
        { status: 401 },
      )
    }

    if (!authData?.user || !authData?.session) {
      console.error("🔍 LOGIN DEBUG: No user data or session returned from auth")
      return NextResponse.json(
        { success: false, message: "Authentication failed, no user data returned" },
        { status: 401 },
      )
    }

    const user = authData.user
    const session = authData.session
    console.log(`🔍 LOGIN DEBUG: Authentication successful for user ID: ${user.id}`)
    console.log(`🔍 LOGIN DEBUG: User email from auth: ${user.email}`)

    // Fetch the user's profile to determine their type (buyer or seller)
    console.log(`🔍 LOGIN DEBUG: Fetching profile for user ID: ${user.id}`)
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    console.log("🔍 LOGIN DEBUG: Profile query completed")

    if (profileError) {
      console.error("🔍 LOGIN DEBUG: Profile fetch error:", profileError.message)
      return NextResponse.json(
        { success: false, message: "Error fetching user profile", error: profileError.message },
        { status: 500 },
      )
    }

    if (!userProfile) {
      console.error("🔍 LOGIN DEBUG: No user profile found")
      return NextResponse.json({ success: false, message: "User profile not found" }, { status: 404 })
    }

    console.log(`🔍 LOGIN DEBUG: User profile fetched successfully: ${JSON.stringify(userProfile)}`)

    // Check user type to determine redirect
    const userType = userProfile.user_type?.toLowerCase()
    console.log(`🔍 LOGIN DEBUG: User type from profile: ${userType}`)

    let redirectTo = "/"

    if (userType === "buyer") {
      console.log("🔍 LOGIN DEBUG: User is a buyer, redirecting to /buyer-dashboard")
      redirectTo = "/buyer-dashboard"
    } else if (userType === "seller") {
      console.log("🔍 LOGIN DEBUG: User is a seller, redirecting to /seller-dashboard")
      redirectTo = "/seller-dashboard"

      // Check if seller profile exists
      console.log("🔍 LOGIN DEBUG: Checking for seller_profile...")
      const { data: sellerProfile, error: sellerProfileError } = await supabase
        .from("seller_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (sellerProfileError) {
        console.error("🔍 LOGIN DEBUG: Seller profile check failed:", sellerProfileError.message)
        if (sellerProfileError.code !== "PGRST116") {
          console.error("🔍 LOGIN DEBUG: Serious seller profile error:", sellerProfileError)
        }
      }

      if (!sellerProfile) {
        console.log("🔍 LOGIN DEBUG: No seller profile found, redirecting to onboarding")
        redirectTo = "/onboarding/seller"
      } else {
        console.log(`🔍 LOGIN DEBUG: Seller profile found with ID: ${sellerProfile.id}`)
      }
    } else {
      console.log("🔍 LOGIN DEBUG: Unknown user type, redirecting to root")
    }

    const responseData = {
      success: true,
      message: "Login successful",
      user: {
        id: userProfile.id,
        email: userProfile.email,
        user_type: userProfile.user_type,
        company_name: userProfile.company_name,
        full_name: userProfile.full_name,
        avatar_url: userProfile.avatar_url,
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        expires_in: session.expires_in,
      },
      redirectTo,
    }

    console.log(`🔍 LOGIN DEBUG: Final response data: ${JSON.stringify({ ...responseData, session: "REDACTED" })}`)
    console.log(`🔍 LOGIN DEBUG: Response created, redirecting to: ${redirectTo}`)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("🔍 LOGIN DEBUG: Unexpected error:", error)
    console.error("🔍 LOGIN DEBUG: Error stack:", error instanceof Error ? getErrorStack(error) : "No stack trace")
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred", error: String(error) },
      { status: 500 },
    )
  }
}
