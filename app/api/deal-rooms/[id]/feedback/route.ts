import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"
import { notifyFeedbackSubmitted } from "@/lib/notifications/deal-room-closure-notifications"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate the user
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // 2. Parse the request body
    const body = await request.json()
    const { rating, comment } = body

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 })
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
      return NextResponse.json({ error: "Only the buyer or seller can submit feedback" }, { status: 403 })
    }

    // 5. Determine if the user is the buyer or seller
    const isBuyer = dealRoom.buyer_id === user.id

    // 6. Submit the feedback
    const { data: feedback, error: feedbackError } = await supabase.rpc("submit_deal_room_feedback", {
      p_deal_room_id: params.id,
      p_is_buyer: isBuyer,
      p_rating: rating,
      p_comment: comment || null,
    })

    if (feedbackError) {
      console.error("Error submitting deal room feedback:", feedbackError)
      return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
    }

    // 7. Get user profile for notification
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
    }

    // 8. Send notification to the other party
    const recipientId = isBuyer ? dealRoom.seller_id : dealRoom.buyer_id

    await notifyFeedbackSubmitted(
      params.id,
      dealRoom.room_name || `Deal Room ${params.id}`,
      user.id,
      userProfile?.full_name || "A user",
      recipientId,
      rating,
    )

    // 9. Return success response
    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      dealRoomId: params.id,
    })
  } catch (error) {
    console.error("Unexpected error in deal room feedback submission:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
