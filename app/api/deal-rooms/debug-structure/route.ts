import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    console.log("🔍 DEBUG STRUCTURE: Starting...")

    const supabase = createServerClient()
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔍 DEBUG STRUCTURE: User:", currentUser.id, currentUser.user_type)

    // Check each table individually
    const results: any = {
      user: currentUser,
      tables: {},
    }

    // Check deal_rooms table
    try {
      const { data: dealRooms, error: dealRoomsError } = await supabase.from("deal_rooms").select("*").limit(5)

      results.tables.deal_rooms = {
        exists: !dealRoomsError,
        error: dealRoomsError?.message,
        count: dealRooms?.length || 0,
        sample: dealRooms?.[0] || null,
      }
    } catch (e) {
      results.tables.deal_rooms = { exists: false, error: e instanceof Error ? e.message : "Unknown error" }
    }

    // Check deal_room_participants table
    try {
      const { data: participants, error: participantsError } = await supabase
        .from("deal_room_participants")
        .select("*")
        .eq("user_id", currentUser.id)
        .limit(5)

      results.tables.deal_room_participants = {
        exists: !participantsError,
        error: participantsError?.message,
        count: participants?.length || 0,
        userParticipations: participants || [],
      }
    } catch (e) {
      results.tables.deal_room_participants = { exists: false, error: e instanceof Error ? e.message : "Unknown error" }
    }

    // Check listings table
    try {
      const { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select("id, title, buyer_id")
        .limit(3)

      results.tables.listings = {
        exists: !listingsError,
        error: listingsError?.message,
        count: listings?.length || 0,
        sample: listings?.[0] || null,
      }
    } catch (e) {
      results.tables.listings = { exists: false, error: e instanceof Error ? e.message : "Unknown error" }
    }

    // Check proposals table
    try {
      const { data: proposals, error: proposalsError } = await supabase
        .from("proposals")
        .select("id, listing_id, seller_id, status")
        .limit(3)

      results.tables.proposals = {
        exists: !proposalsError,
        error: proposalsError?.message,
        count: proposals?.length || 0,
        sample: proposals?.[0] || null,
      }
    } catch (e) {
      results.tables.proposals = { exists: false, error: e instanceof Error ? e.message : "Unknown error" }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("🔍 DEBUG STRUCTURE: Error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
