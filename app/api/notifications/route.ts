import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const unreadOnly = searchParams.get("unread_only") === "true"
    const type = searchParams.get("type")

    let query = supabase
      .from("notifications")
      .select(`
        *,
        deal_room:deal_rooms (
          id,
          room_name,
          listing:listings (
            title
          )
        )
      `)
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (unreadOnly) {
      query = query.eq("is_read", false)
    }

    if (type) {
      query = query.eq("type", type)
    }

    const { data: notifications, error } = await query

    if (error) {
      console.error("Error fetching notifications:", error)
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id)
      .eq("is_read", false)

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
      hasMore: (notifications?.length || 0) === limit,
    })
  } catch (error) {
    console.error("Notifications API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, notificationIds } = await request.json()

    if (action === "mark_all_read") {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", currentUser.id)
        .eq("is_read", false)

      if (error) {
        console.error("Error marking all notifications as read:", error)
        return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    if (action === "mark_read" && notificationIds) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", currentUser.id)
        .in("id", notificationIds)

      if (error) {
        console.error("Error marking notifications as read:", error)
        return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Notifications update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
