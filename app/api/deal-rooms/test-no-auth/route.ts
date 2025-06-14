import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    console.log("🔍 NO AUTH TEST: Starting...")

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("🔍 NO AUTH TEST: Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Use service role key to bypass RLS for testing
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    console.log("🔍 NO AUTH TEST: Supabase client created with service role")

    // Test basic connection
    const { data: dealRooms, error: dealRoomsError } = await supabase.from("deal_rooms").select("*").limit(5)

    if (dealRoomsError) {
      console.error("🔍 NO AUTH TEST: Error fetching deal rooms:", dealRoomsError.message)
      return NextResponse.json({
        error: "Database error",
        details: dealRoomsError.message,
        dealRooms: [],
      })
    }

    console.log("🔍 NO AUTH TEST: Deal rooms fetched:", dealRooms?.length)

    // Test participants table
    const { data: participants, error: participantsError } = await supabase
      .from("deal_room_participants")
      .select("*")
      .limit(5)

    if (participantsError) {
      console.error("🔍 NO AUTH TEST: Error fetching participants:", participantsError.message)
    }

    // Test activities table
    const { data: activities, error: activitiesError } = await supabase
      .from("deal_room_activities")
      .select("*")
      .limit(5)

    if (activitiesError) {
      console.error("🔍 NO AUTH TEST: Error fetching activities:", activitiesError.message)
    }

    return NextResponse.json({
      success: true,
      dealRooms: dealRooms || [],
      participants: participants || [],
      activities: activities || [],
      counts: {
        dealRooms: dealRooms?.length || 0,
        participants: participants?.length || 0,
        activities: activities?.length || 0,
      },
    })
  } catch (error) {
    console.error("🔍 NO AUTH TEST: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
