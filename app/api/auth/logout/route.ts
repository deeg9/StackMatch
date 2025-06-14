import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { logUserActivity } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Log user activity before logout
      await logUserActivity(user.id, "USER_LOGOUT", {}, request)

      // Sign out user
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
