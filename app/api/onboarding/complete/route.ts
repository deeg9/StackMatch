import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"
import { getCurrentUser, logUserActivity } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { userType } = await request.json()

    // Update user's onboarding status
    const { error: updateError } = await supabase
      .from("users")
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentUser.id)

    if (updateError) {
      console.error("Error updating onboarding status:", updateError)
      return NextResponse.json({ success: false, error: "Failed to update onboarding status" }, { status: 500 })
    }

    // Log the activity
    await logUserActivity(currentUser.id, "onboarding_completed", { userType }, request)

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
    })
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
