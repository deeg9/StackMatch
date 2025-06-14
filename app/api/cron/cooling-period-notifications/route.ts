import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { notifyCoolingPeriodEnding } from "@/lib/notifications/deal-room-closure-notifications"

// This endpoint should be called by a cron job once a day
export async function GET(request: NextRequest) {
  try {
    // Check for API key or other authorization method
    const authHeader = request.headers.get("authorization")
    if (!process.env.CRON_API_KEY || authHeader !== `Bearer ${process.env.CRON_API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Get the date for tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStart = new Date(tomorrow)
    tomorrowStart.setHours(0, 0, 0, 0)
    const tomorrowEnd = new Date(tomorrow)
    tomorrowEnd.setHours(23, 59, 59, 999)

    // Find all closures with cooling periods ending tomorrow
    const { data: closures, error } = await supabase
      .from("deal_room_closures")
      .select(`
        id,
        deal_room_id,
        initiator_id,
        cooling_period_ends_at
      `)
      .is("finalized_at", null)
      .gte("cooling_period_ends_at", tomorrowStart.toISOString())
      .lte("cooling_period_ends_at", tomorrowEnd.toISOString())

    if (error) {
      console.error("Error fetching closures with cooling periods ending tomorrow:", error)
      return NextResponse.json({ error: "Failed to fetch closures" }, { status: 500 })
    }

    if (!closures || closures.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No cooling periods ending tomorrow",
        count: 0,
      })
    }

    // Get deal room details for notifications
    const dealRoomIds = closures.map((c) => c.deal_room_id)
    const { data: dealRooms, error: dealRoomsError } = await supabase
      .from("deal_rooms")
      .select("id, room_name")
      .in("id", dealRoomIds)

    if (dealRoomsError) {
      console.error("Error fetching deal rooms:", dealRoomsError)
      return NextResponse.json({ error: "Failed to fetch deal rooms" }, { status: 500 })
    }

    // Send notifications
    const notificationPromises = closures.map((closure) => {
      const dealRoom = dealRooms?.find((dr) => dr.id === closure.deal_room_id)
      if (!dealRoom) return Promise.resolve()

      return notifyCoolingPeriodEnding(
        closure.deal_room_id,
        dealRoom.room_name || `Deal Room ${closure.deal_room_id}`,
        closure.initiator_id,
        closure.cooling_period_ends_at,
      )
    })

    await Promise.all(notificationPromises)

    return NextResponse.json({
      success: true,
      message: "Cooling period notifications sent",
      count: closures.length,
    })
  } catch (error) {
    console.error("Unexpected error in cooling period notifications:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
