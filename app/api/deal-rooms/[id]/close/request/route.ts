import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"
import { DealRoomStatus, type ClosureReasonCategory } from "@/types/deal-room-types"
import { notifyClosureRequested } from "@/lib/notifications/deal-room-closure-notifications"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate the user
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // 2. Parse the request body
    const body = await request.json()
    const { reasonCategory, reasonDescription } = body

    if (!reasonCategory) {
      return NextResponse.json({ error: "Reason category is required" }, { status: 400 })
    }

    // 3. Fetch the deal room to check permissions
    const { data: dealRoom, error: dealRoomError } = await supabase
      .from("deal_rooms")
      .select("id, buyer_id, seller_id, status, room_name")
      .eq("id", params.id)
      .single()

    if (dealRoomError || !dealRoom) {
      return NextResponse.json({ error: "Deal room not found" }, { status: 404 })
    }

    // 4. Check if the user is the buyer or seller
    if (dealRoom.buyer_id !== user.id && dealRoom.seller_id !== user.id) {
      return NextResponse.json({ error: "Only the buyer or seller can request to close a deal room" }, { status: 403 })
    }

    // 5. Check if the deal room is already in a closing state
    if (
      dealRoom.status === DealRoomStatus.PENDING_CLOSURE ||
      dealRoom.status === DealRoomStatus.CLOSED_SUCCESSFULLY ||
      dealRoom.status === DealRoomStatus.CLOSED_UNSUCCESSFULLY
    ) {
      return NextResponse.json({ error: `Deal room is already in ${dealRoom.status} state` }, { status: 400 })
    }

    // 6. Determine the initiator type
    const initiatorType = dealRoom.buyer_id === user.id ? "BUYER" : "SELLER"

    // 7. Calculate the cooling period end date (3 days from now)
    const coolingPeriodEndsAt = new Date()
    coolingPeriodEndsAt.setDate(coolingPeriodEndsAt.getDate() + 3)

    // 8. Begin a transaction
    const { data: closure, error: closureError } = await supabase.rpc("create_deal_room_closure", {
      p_deal_room_id: params.id,
      p_initiator_id: user.id,
      p_initiator_type: initiatorType,
      p_reason_category: reasonCategory,
      p_reason_description: reasonDescription || null,
      p_cooling_period_ends_at: coolingPeriodEndsAt.toISOString(),
    })

    if (closureError) {
      console.error("Error creating deal room closure:", closureError)
      return NextResponse.json({ error: "Failed to create deal room closure" }, { status: 500 })
    }

    // 9. Get all participants for notifications
    const { data: participants, error: participantsError } = await supabase
      .from("deal_room_participants")
      .select("user_id")
      .eq("deal_room_id", params.id)

    if (participantsError) {
      console.error("Error fetching participants:", participantsError)
    }

    // 10. Get user profile for notification
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
    }

    // 11. Send notifications
    const participantIds = [dealRoom.buyer_id, dealRoom.seller_id, ...(participants?.map((p) => p.user_id) || [])]

    // Remove duplicates
    const uniqueParticipantIds = [...new Set(participantIds)]

    await notifyClosureRequested(
      params.id,
      dealRoom.room_name || `Deal Room ${params.id}`,
      user.id,
      userProfile?.full_name || "A user",
      initiatorType,
      reasonCategory as ClosureReasonCategory,
      uniqueParticipantIds,
    )

    // 12. Return success response
    return NextResponse.json({
      success: true,
      message: "Deal room closure requested successfully",
      dealRoomId: params.id,
      closureId: closure.id,
      coolingPeriodEndsAt: coolingPeriodEndsAt.toISOString(),
    })
  } catch (error) {
    console.error("Unexpected error in deal room closure request:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
