import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"
import { ClosureOutcomeType } from "@/types/deal-room-types"
import { notifyClosureConfirmed } from "@/lib/notifications/deal-room-closure-notifications"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate the user
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // 2. Parse the request body
    const body = await request.json()
    const { outcomeType } = body

    if (!outcomeType || !Object.values(ClosureOutcomeType).includes(outcomeType as ClosureOutcomeType)) {
      return NextResponse.json({ error: "Valid outcome type is required" }, { status: 400 })
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

    // 4. Fetch the closure request
    const { data: closure, error: closureError } = await supabase
      .from("deal_room_closures")
      .select("id, initiator_id, cooling_period_ends_at")
      .eq("deal_room_id", params.id)
      .is("finalized_at", null)
      .order("requested_at", { ascending: false })
      .limit(1)
      .single()

    if (closureError || !closure) {
      return NextResponse.json({ error: "No pending closure request found" }, { status: 404 })
    }

    // 5. Check if the user is the initiator
    if (closure.initiator_id !== user.id) {
      return NextResponse.json({ error: "Only the initiator can confirm the closure" }, { status: 403 })
    }

    // 6. Check if the cooling period has ended
    const coolingPeriodEndsAt = new Date(closure.cooling_period_ends_at)
    const now = new Date()

    if (now < coolingPeriodEndsAt) {
      return NextResponse.json(
        {
          error: "Cooling period has not ended yet",
          coolingPeriodEndsAt: coolingPeriodEndsAt.toISOString(),
          remainingTime: coolingPeriodEndsAt.getTime() - now.getTime(),
        },
        { status: 400 },
      )
    }

    // 7. Confirm the closure
    const { data: updatedClosure, error: updateError } = await supabase.rpc("confirm_deal_room_closure", {
      p_deal_room_id: params.id,
      p_closure_id: closure.id,
      p_outcome_type: outcomeType,
    })

    if (updateError) {
      console.error("Error confirming deal room closure:", updateError)
      return NextResponse.json({ error: "Failed to confirm deal room closure" }, { status: 500 })
    }

    // 8. Get all participants for notifications
    const { data: participants, error: participantsError } = await supabase
      .from("deal_room_participants")
      .select("user_id")
      .eq("deal_room_id", params.id)

    if (participantsError) {
      console.error("Error fetching participants:", participantsError)
    }

    // 9. Send notifications
    const participantIds = [dealRoom.buyer_id, dealRoom.seller_id, ...(participants?.map((p: any) => p.user_id) || [])]

    // Remove duplicates
    const uniqueParticipantIds = [...new Set(participantIds)]

    await notifyClosureConfirmed(
      params.id,
      dealRoom.room_name || `Deal Room ${params.id}`,
      outcomeType as ClosureOutcomeType,
      uniqueParticipantIds,
    )

    // 10. Return success response
    return NextResponse.json({
      success: true,
      message: "Deal room closure confirmed successfully",
      dealRoomId: params.id,
      closureId: closure.id,
      outcomeType,
    })
  } catch (error) {
    console.error("Unexpected error in deal room closure confirmation:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
