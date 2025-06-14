import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 MESSAGES TEST: Route reached successfully!")
  console.log("🔍 MESSAGES TEST: Deal room ID:", params.id)

  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      console.error("🔍 MESSAGES TEST: Authentication failed:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return a successful JSON response
    return NextResponse.json({
      message: "Messages test route working",
      dealRoomId: params.id,
      userId: user.id,
    })
  } catch (error) {
    console.error("🔍 MESSAGES TEST: Error:", error)
    return NextResponse.json({ error: "Test endpoint error: " + String(error) }, { status: 500 })
  }
}
