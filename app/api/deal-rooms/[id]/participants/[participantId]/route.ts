import { NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"
import type { NextRequest } from "next/server"

// Remove a participant from a deal room
export async function DELETE(request: NextRequest, { params }: { params: { id: string; participantId: string } }) {
  console.log("[SERVER] 🔍 REMOVE PARTICIPANT API: Starting DELETE request")

  try {
    const { supabase, user, error: authError, status } = await getAuthenticatedClient(request)

    if (authError || !supabase || !user) {
      console.error("[SERVER] 🔍 REMOVE PARTICIPANT API: Authentication failed:", authError)
      return NextResponse.json({ error: "Authentication failed" }, { status: status || 401 })
    }

    const dealRoomId = params.id
    const participantId = params.participantId

    console.log(
      "[SERVER] 🔍 REMOVE PARTICIPANT API: Removing participant:",
      participantId,
      "from deal room:",
      dealRoomId,
    )

    // Get the participant to remove
    const { data: participantToRemove, error: participantError } = await supabase
      .from("deal_room_participants")
      .select(`
        id,
        user_id,
        role,
        added_by,
        profiles!deal_room_participants_user_id_fkey (
          email,
          full_name
        )
      `)
      .eq("id", participantId)
      .eq("deal_room_id", dealRoomId)
      .single()

    if (participantError || !participantToRemove) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 })
    }

    // Check if current user has permission to remove this participant
    const { data: currentParticipant } = await supabase
      .from("deal_room_participants")
      .select("role, user_id")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)
      .single()

    if (!currentParticipant) {
      return NextResponse.json({ error: "You don't have access to this deal room" }, { status: 403 })
    }

    // Get deal room info to check if this is an original buyer/seller
    const { data: dealRoom } = await supabase
      .from("deal_rooms")
      .select("buyer_id, seller_id")
      .eq("id", dealRoomId)
      .single()

    // Permission logic:
    // 1. Original buyer/seller can remove anyone except other original buyer/seller
    // 2. Users can remove themselves
    // 3. Users who added someone can remove them
    const isOriginalBuyerOrSeller = dealRoom && (user.id === dealRoom.buyer_id || user.id === dealRoom.seller_id)
    const isRemovingSelf = participantToRemove.user_id === user.id
    const isRemoverWhoAdded = participantToRemove.added_by === user.id
    const isTargetOriginalBuyerOrSeller =
      dealRoom &&
      (participantToRemove.user_id === dealRoom.buyer_id || participantToRemove.user_id === dealRoom.seller_id)

    if (!isOriginalBuyerOrSeller && !isRemovingSelf && !isRemoverWhoAdded) {
      return NextResponse.json({ error: "You don't have permission to remove this participant" }, { status: 403 })
    }

    // Prevent removing original buyer/seller
    if (isTargetOriginalBuyerOrSeller && !isRemovingSelf) {
      return NextResponse.json({ error: "Cannot remove original buyer or seller from deal room" }, { status: 400 })
    }

    // Remove the participant
    const { error: deleteError } = await supabase.from("deal_room_participants").delete().eq("id", participantId)

    if (deleteError) {
      console.error("[SERVER] 🔍 REMOVE PARTICIPANT API: Error removing participant:", deleteError)
      return NextResponse.json({ error: "Failed to remove participant" }, { status: 500 })
    }

    // Log activity
    await supabase.from("deal_room_activities").insert({
      deal_room_id: dealRoomId,
      user_id: user.id,
      activity_type: "PARTICIPANT_REMOVED",
      description: `Removed ${participantToRemove.profiles?.full_name || participantToRemove.profiles?.email || "participant"} from the deal room`,
      metadata: {
        removed_user_id: participantToRemove.user_id,
        removed_user_email: participantToRemove.profiles?.email,
        was_self_removal: isRemovingSelf,
      },
    })

    console.log("[SERVER] 🔍 REMOVE PARTICIPANT API: Participant removed successfully")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[SERVER] 🔍 REMOVE PARTICIPANT API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
