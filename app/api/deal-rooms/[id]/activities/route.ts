import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const dealRoomId = params.id

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user has access to this deal room
    const { data: participant } = await supabase
      .from("deal_room_participants")
      .select("role")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Fetch activities with user information
    const { data: activities, error } = await supabase
      .from("deal_room_activities")
      .select(`
        *,
        user:profiles!deal_room_activities_user_id_fkey (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("deal_room_id", dealRoomId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching activities:", error)
      return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
    }

    return NextResponse.json({ activities })
  } catch (error: any) {
    console.error("Activities endpoint error:", error)
    return NextResponse.json({ error: getErrorMessage(error) || "Internal server error" }, { status: 500 })
  }
}
