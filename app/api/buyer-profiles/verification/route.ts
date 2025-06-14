import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 VERIFICATION API: Starting GET request...")

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("🔍 VERIFICATION API: Fetching verification for user:", userId)

    // Get user profile and buyer profile
    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (profileError || !profile) {
      console.log("🔍 VERIFICATION API: Profile not found:", profileError)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get buyer profile for additional verification data
    const { data: buyerProfile, error: buyerError } = await supabase
      .from("buyer_profiles")
      .select("verification_documents_url")
      .eq("user_id", userId)
      .single()

    // Create verification status based on available data
    const verificationStatus = {
      email_verified: profile.email_verified || false,
      phone_verified: !!profile.phone,
      identity_verified: profile.is_verified || false,
      company_verified: !!profile.company_name,
      documents_uploaded: !!buyerProfile?.verification_documents_url,
      overall_status: profile.is_verified ? "verified" : "pending",
      verification_level: profile.is_verified ? "premium" : "basic",
      last_verification_date: profile.updated_at,
      verification_documents: buyerProfile?.verification_documents_url || null,
    }

    console.log("🔍 VERIFICATION API: Verification status created:", verificationStatus.overall_status)

    return NextResponse.json({
      success: true,
      verification: verificationStatus,
    })
  } catch (error) {
    console.error("🔍 VERIFICATION API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
