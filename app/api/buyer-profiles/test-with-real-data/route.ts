import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Create a direct Supabase client for testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export async function GET() {
  try {
    console.log("🔍 TESTING WITH REAL DATA...")

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test with Christopher's actual user ID
    const christopherUserId = "1cae22cb-1311-48ca-9caa-47d474c0a20e"

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", christopherUserId)
      .single()

    console.log("Profile data:", profileData)
    console.log("Profile error:", profileError)

    // Check buyer_profiles table
    const { data: buyerProfileData, error: buyerProfileError } = await supabase
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", christopherUserId)
      .single()

    console.log("Buyer profile data:", buyerProfileData)
    console.log("Buyer profile error:", buyerProfileError)

    // Check auth.users table
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(christopherUserId)

    console.log("Auth data:", authData)
    console.log("Auth error:", authError)

    return NextResponse.json({
      profile: profileData,
      buyerProfile: buyerProfileData,
      authUser: authData,
      errors: {
        profile: profileError,
        buyerProfile: buyerProfileError,
        auth: authError,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
