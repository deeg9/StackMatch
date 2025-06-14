import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { cookies } from "next/headers"
// Import both client creation functions
import { createClient as createUserContextClient } from "@/utils/supabase/server" // For user context operations
import { createServiceRoleClient } from "@/lib/supabase/server" // For service role operations

// Helper function for a short delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(request: NextRequest) {
  console.log("SIGNUP_API: === ROUTE ENTRY ===")
  console.log("SIGNUP_API: Timestamp:", new Date().toISOString())

  const cookieStore = cookies()
  // Client for user authentication (uses anon key initially, then user session)
  const userAuthClient = createUserContextClient(cookieStore)
  // Client for administrative database operations (uses service_role key)
  const serviceRoleClient = createServiceRoleClient()

  try {
    console.log("SIGNUP_API: Attempting to parse request JSON")
    const body = await request.json()
    console.log("SIGNUP_API: Request body parsed:", JSON.stringify(body))

    const { email, password, fullName, userType } = body

    if (!email || !password || !fullName || !userType) {
      console.error("SIGNUP_API: Missing required fields", { email, fullName, userType, hasPassword: !!password })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    console.log(`SIGNUP_API: Fields validated for email: ${email}, userType: ${userType}`)

    if (userType !== "buyer" && userType !== "seller") {
      console.error("SIGNUP_API: Invalid user type:", userType)
      return NextResponse.json({ error: 'Invalid user type. Must be "buyer" or "seller"' }, { status: 400 })
    }

    console.log(`SIGNUP_API: Attempting Supabase auth.signUp with userAuthClient for email: ${email}`)
    const { data: authData, error: authError } = await userAuthClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.headers.get("origin")}/auth/callback`, // Ensure this callback route exists
      },
    })

    if (authError) {
      console.error("SIGNUP_API: Supabase auth.signUp error:", authError.message, "Status:", authError.status)
      return NextResponse.json({ error: authError.message }, { status: authError.status || 400 })
    }

    if (!authData.user) {
      console.error("SIGNUP_API: No user data returned from auth after signUp.")
      return NextResponse.json({ error: "Signup successful but no user data returned from auth" }, { status: 500 })
    }
    console.log("SIGNUP_API: Supabase auth.signUp successful, user ID:", authData.user.id)

    // Diagnostic: Add a significant delay
    console.log("SIGNUP_API: Starting 2-second diagnostic delay...")
    await delay(2000) // Wait for 2 seconds
    console.log("SIGNUP_API: Diagnostic delay finished.")

    console.log(
      `SIGNUP_API: Attempting to insert into 'profiles' table with serviceRoleClient for user ID: ${authData.user.id}`,
    )
    const { error: profileError } = await serviceRoleClient.from("profiles").insert({
      id: authData.user.id,
      email: email, // Use the original email from the form
      user_type: userType,
      full_name: fullName,
      onboarding_completed: false,
      email_verified: authData.user.email_confirmed_at ? true : false, // Use confirmed status from authData.user
    })

    if (profileError) {
      console.error("SIGNUP_API: Profile creation error (serviceRoleClient):", JSON.stringify(profileError))
      return NextResponse.json({ error: `Failed to create user profile: ${profileError.message}` }, { status: 500 })
    }
    console.log(`SIGNUP_API: Successfully inserted into 'profiles' table with serviceRoleClient`)

    // Create buyer or seller specific profile
    const profileData = { user_id: authData.user.id }
    let specificProfileError = null
    let specificProfileType = ""

    if (userType === "buyer") {
      specificProfileType = "buyer"
      console.log(`SIGNUP_API: Creating buyer profile with serviceRoleClient`)
      const { error } = await serviceRoleClient.from("buyer_profiles").insert(profileData)
      specificProfileError = error
    } else if (userType === "seller") {
      specificProfileType = "seller"
      console.log(`SIGNUP_API: Creating seller profile with serviceRoleClient`)
      const { error } = await serviceRoleClient.from("seller_profiles").insert(profileData)
      specificProfileError = error
    }

    if (specificProfileError) {
      console.error(
        `SIGNUP_API: ${specificProfileType} profile error (serviceRoleClient):`,
        JSON.stringify(specificProfileError),
      )
      // Potentially clean up: delete from 'profiles' and delete auth user if this step is critical
      // await serviceRoleClient.from('profiles').delete().eq('id', authData.user.id);
      // await serviceRoleClient.auth.admin.deleteUser(authData.user.id); // Be careful with this
      return NextResponse.json(
        { error: `Failed to create ${specificProfileType} profile: ${specificProfileError.message}` },
        { status: 500 },
      )
    }
    console.log(`SIGNUP_API: Successfully created ${specificProfileType} profile with serviceRoleClient`)

    console.log("SIGNUP_API: === SUCCESS - RETURNING RESPONSE ===")
    return NextResponse.json({
      message: "Signup successful! Please check your email to verify your account.",
      userId: authData.user.id,
    })
  } catch (error: any) {
    console.error("SIGNUP_API: === UNHANDLED ERROR ===")
    console.error("SIGNUP_API: Error message:", getErrorMessage(error))
    console.error("SIGNUP_API: Error stack:", getErrorStack(error))
    console.error("SIGNUP_API: Full error object:", JSON.stringify(error, null, 2))

    return NextResponse.json(
      {
        error: "An unexpected internal server error occurred.",
        details: getErrorMessage(error),
      },
      { status: 500 },
    )
  }
}
