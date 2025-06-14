import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { bio, phone, website, linkedin, skills, experience } = body

    // Update user profile
    const { error: userError } = await supabase
      .from("users")
      .update({
        phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (userError) {
      console.error("User update error:", userError)
      return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
    }

    // Get user type to determine which profile table to update
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single()

    if (userDataError || !userData) {
      return NextResponse.json({ success: false, error: "Failed to get user data" }, { status: 500 })
    }

    // Update type-specific profile
    if (userData.user_type === "BUYER") {
      const { error: buyerError } = await supabase
        .from("buyer_profiles")
        .update({
          company_description: bio,
          website_url: website,
        })
        .eq("user_id", user.id)

      if (buyerError) {
        console.error("Buyer profile update error:", buyerError)
        return NextResponse.json({ success: false, error: "Failed to update buyer profile" }, { status: 500 })
      }
    } else if (userData.user_type === "SELLER") {
      const { error: sellerError } = await supabase
        .from("seller_profiles")
        .update({
          description: bio,
          website_url: website,
        })
        .eq("user_id", user.id)

      if (sellerError) {
        console.error("Seller profile update error:", sellerError)
        return NextResponse.json({ success: false, error: "Failed to update seller profile" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
