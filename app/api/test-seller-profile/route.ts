import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  console.log("🔍 TEST SELLER PROFILE: GET /api/test-seller-profile called")

  try {
    const supabase = createServerClient()
    console.log("🔍 TEST SELLER PROFILE: Supabase client created")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("🔍 TEST SELLER PROFILE: Auth result:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError?.message,
    })

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check seller profile
    const { data: sellerProfile, error: sellerProfileError } = await supabase
      .from("seller_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    console.log("🔍 TEST SELLER PROFILE: Seller profile result:", {
      sellerProfile,
      errorCode: sellerProfileError?.code,
      errorMessage: sellerProfileError?.message,
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      sellerProfile,
      sellerProfileError,
    })
  } catch (error: any) {
    console.error("🔍 TEST SELLER PROFILE: Exception:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
