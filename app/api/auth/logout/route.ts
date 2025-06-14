import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/server"
import { logUserActivity } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

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
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
