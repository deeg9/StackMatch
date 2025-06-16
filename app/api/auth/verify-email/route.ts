import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"
import { logUserActivity } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the email using the token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    })

    if (error) {
      console.error("Email verification error:", error)
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user verification status
    await supabase
      .from("users")
      .update({
        is_verified: true,
        verification_status: "VERIFIED",
      })
      .eq("id", data.user.id)

    // Log activity
    await logUserActivity(data.user.id, "EMAIL_VERIFIED", {}, request)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
