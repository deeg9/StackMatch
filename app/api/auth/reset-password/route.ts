import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { logUserActivity } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Update password using the token
    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error("Password reset error:", error)
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Log activity
    await logUserActivity(data.user.id, "PASSWORD_RESET_COMPLETED", {}, request)

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
