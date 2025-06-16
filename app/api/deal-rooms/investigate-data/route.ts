import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { getAuthenticatedSupabaseClient } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest) {
  try {
    console.log("[DEBUG] 🔍 INVESTIGATE DATA: Starting investigation...")

    // 1. Get authenticated Supabase client and user
    const authResult = await getAuthenticatedSupabaseClient(request)

    if (authResult.error) {
      console.error("[DEBUG] 🔍 INVESTIGATE DATA: Authentication failed:", authResult.error)
      return NextResponse.json(
        { error: "Authentication error", details: authResult.error },
        { status: authResult.status || 401 },
      )
    }

    const { supabase, user } = authResult

    console.log(`[DEBUG] 🔍 INVESTIGATE DATA: Investigating for user ${user.id} (${user.email})`)

    // 2. Check deal_rooms table structure and data
    console.log("[DEBUG] 🔍 INVESTIGATE DATA: Checking deal_rooms table...")
    const { data: dealRooms, error: dealRoomsError } = await supabase.from("deal_rooms").select("*").limit(10)

    if (dealRoomsError) {
      console.error("[DEBUG] 🔍 INVESTIGATE DATA: Error fetching deal rooms:", dealRoomsError)
    }

    // 3. Check deal_room_participants table structure and data
    console.log("[DEBUG] 🔍 INVESTIGATE DATA: Checking deal_room_participants table...")
    const { data: participants, error: participantsError } = await supabase
      .from("deal_room_participants")
      .select("*")
      .limit(10)

    if (participantsError) {
      console.error("[DEBUG] 🔍 INVESTIGATE DATA: Error fetching participants:", participantsError)
    }

    // 4. Check for specific deal room if provided
    const dealRoomId = request.nextUrl.searchParams.get("dealRoomId")
    let specificDealRoom = null
    let specificParticipants = null

    if (dealRoomId) {
      console.log(`[DEBUG] 🔍 INVESTIGATE DATA: Checking specific deal room ${dealRoomId}...`)

      const { data: specificRoom, error: specificRoomError } = await supabase
        .from("deal_rooms")
        .select("*")
        .eq("id", dealRoomId)
        .single()

      if (specificRoomError) {
        console.error("[DEBUG] 🔍 INVESTIGATE DATA: Error fetching specific deal room:", specificRoomError)
      } else {
        specificDealRoom = specificRoom
      }

      const { data: roomParticipants, error: roomParticipantsError } = await supabase
        .from("deal_room_participants")
        .select("*")
        .eq("deal_room_id", dealRoomId)

      if (roomParticipantsError) {
        console.error("[DEBUG] 🔍 INVESTIGATE DATA: Error fetching room participants:", roomParticipantsError)
      } else {
        specificParticipants = roomParticipants
      }
    }

    // 5. Check user's access patterns
    console.log("[DEBUG] 🔍 INVESTIGATE DATA: Checking user's access patterns...")
    const { data: userParticipations, error: userParticipationsError } = await supabase
      .from("deal_room_participants")
      .select("*")
      .eq("user_id", user.id)

    if (userParticipationsError) {
      console.error("[DEBUG] 🔍 INVESTIGATE DATA: Error fetching user participations:", userParticipationsError)
    }

    // 6. Check for orphaned deal rooms (rooms without participants)
    console.log("[DEBUG] 🔍 INVESTIGATE DATA: Checking for orphaned deal rooms...")
    const { data: orphanedRooms, error: orphanedError } = await supabase.from("deal_rooms").select(`
        id,
        room_name,
        buyer_id,
        seller_id,
        status,
        created_at,
        deal_room_participants!left (id)
      `)

    if (orphanedError) {
      console.error("[DEBUG] 🔍 INVESTIGATE DATA: Error checking orphaned rooms:", orphanedError)
    }

    // 7. Compile investigation results
    const investigation = {
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_metadata?.user_type,
      },
      dealRooms: {
        total: dealRooms?.length || 0,
        data: dealRooms,
        error: dealRoomsError?.message,
      },
      participants: {
        total: participants?.length || 0,
        data: participants,
        error: participantsError?.message,
      },
      userParticipations: {
        total: userParticipations?.length || 0,
        data: userParticipations,
        error: userParticipationsError?.message,
      },
      specificDealRoom: dealRoomId
        ? {
            id: dealRoomId,
            room: specificDealRoom,
            participants: specificParticipants,
            userHasAccess: specificParticipants?.some((p: any) => p.user_id === user.id) || false,
          }
        : null,
      orphanedRooms: {
        data: orphanedRooms?.filter((room: any) => !room.deal_room_participants || room.deal_room_participants.length === 0),
        error: orphanedError?.message,
      },
    }

    console.log("[DEBUG] 🔍 INVESTIGATE DATA: Investigation complete")

    return NextResponse.json({
      success: true,
      investigation,
      summary: {
        totalDealRooms: dealRooms?.length || 0,
        totalParticipants: participants?.length || 0,
        userParticipations: userParticipations?.length || 0,
        hasSpecificAccess: investigation.specificDealRoom?.userHasAccess || false,
        orphanedRoomsCount: investigation.orphanedRooms.data?.length || 0,
      },
    })
  } catch (error) {
    console.error("[DEBUG] 🔍 INVESTIGATE DATA: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Investigation failed",
        details: String(error),
        stack: error instanceof Error ? getErrorStack(error) : undefined,
      },
      { status: 500 },
    )
  }
}
