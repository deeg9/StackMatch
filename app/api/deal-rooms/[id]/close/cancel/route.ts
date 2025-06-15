import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"
import { notifyClosureCancelled } from "@/lib/notifications/deal-room-closure-notifications"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate the user
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // 2. Fetch the deal room to check permissions
    const { data: dealRoom, error: dealRoomError } = await supabase
      .from("deal_rooms")
      .select("id, buyer_id, seller_id, status, room_name")
      .eq("id", params.id)
      .single()

    if (dealRoomError || !dealRoom) {
      return NextResponse.json({ error: "Deal room not found" }, { status: 404 })
    }

    // 3. Fetch the closure request
    const { data: closure, error: closureError } = await supabase
      .from("deal_room_closures")
      .select("id, initiator_id")
      .eq("deal_room_id", params.id)
      .is("finalized_at", null)
      .order("requested_at", { ascending: false })
      .limit(1)
      .single()

    if (closureError || !closure) {
      return NextResponse.json({ error: "No pending closure request found" }, { status: 404 })
    }

    // 4. Check if the user is the initiator
    if (closure.initiator_id !== user.id) {
      return NextResponse.json({ error: "Only the initiator can cancel the closure request" }, { status: 403 })
    }

    // 5. Cancel the closure
    const { data: cancelledClosure, error: cancelError } = await supabase.rpc("cancel_deal_room_closure", {
      p_deal_room_id: params.id,
      p_closure_id: closure.id,
    })

    if (cancelError) {
      console.error("Error cancelling deal room closure:", cancelError)
      return NextResponse.json({ error: "Failed to cancel deal room closure" }, { status: 500 })
    }

    // 6. Get user profile for notification
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
    }

    // 7. Get all participants for notifications
    const { data: participants, error: participantsError } = await supabase
      .from("deal_room_participants")
      .select("user_id")
      .eq("deal_room_id", params.id)

    if (participantsError) {
      console.error("Error fetching participants:", participantsError)
    }

    // 8. Send notifications
    const participantIds = [dealRoom.buyer_id, dealRoom.seller_id, ...(participants?.map((p: any) => p.user_id) || [])]

    // Remove duplicates
    const uniqueParticipantIds = Array.from(new Set(participantIds))

    await notifyClosureCancelled(
      params.id,
      dealRoom.room_name || `Deal Room ${params.id}`,
      user.id,
      userProfile?.full_name || "A user",
      uniqueParticipantIds,
    )

    // 9. Return success response
    return NextResponse.json({
      success: true,
      message: "Deal room closure cancelled successfully",
      dealRoomId: params.id,
      closureId: closure.id,
    })
  } catch (error) {
    console.error("Unexpected error in deal room closure cancellation:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
