import { createClientWithCookies } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getURL } from "@/lib/utils"
import { ProposalNotificationService } from "@/lib/notifications/proposal-notification-service"

const pricingSchema = z.object({
  priceId: z.string(),
})

const dealRoomSchema = z.object({
  proposalResponseId: z.string(),
  proposalRequestId: z.string(),
  buyerId: z.string(),
  title: z.string(),
})

const origin = getURL()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClientWithCookies()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const proposalResponseId = params.id

    if (!proposalResponseId) {
      return new NextResponse("Missing proposal response ID", { status: 400 })
    }

    const values = await req.json()
    const { proposalRequestId, buyerId, title } = dealRoomSchema.parse(values)

    // Check if the user has already created a deal room for this proposal response
    const { data: existingDealRoom } = await supabase
      .from("deal_rooms")
      .select("*")
      .eq("proposal_response_id", proposalResponseId)
      .single()

    if (existingDealRoom) {
      return new NextResponse("Deal room already exists for this proposal response", { status: 400 })
    }

    // Create the deal room
    const { data: dealRoom, error } = await supabase
      .from("deal_rooms")
      .insert([
        {
          proposal_response_id: proposalResponseId,
          proposal_request_id: proposalRequestId,
          buyer_id: buyerId,
          seller_id: user.id,
          room_name: title,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating deal room:", error)
      return new NextResponse("Failed to create deal room", { status: 500 })
    }

    if (!dealRoom) {
      return new NextResponse("Failed to create deal room", { status: 500 })
    }

    // Fetch proposal request and response data for notifications
    const { data: proposalRequest } = await supabase
      .from("proposal_requests")
      .select("*")
      .eq("id", proposalRequestId)
      .single()

    const { data: proposalResponse } = await supabase
      .from("proposal_responses")
      .select("*")
      .eq("id", proposalResponseId)
      .single()

    if (!proposalRequest || !proposalResponse) {
      console.error("Failed to fetch proposal request or response")
      return new NextResponse("Failed to fetch proposal request or response", { status: 500 })
    }

    // After deal room creation, before returning the response
    try {
      // Get user profiles for notifications
      const { data: sellerProfile } = await supabase
        .from("seller_profiles")
        .select("company_name")
        .eq("user_id", user.id)
        .single()

      const { data: buyerProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", proposalRequest.buyer_id)
        .single()

      // Notify buyer that deal room was created
      await ProposalNotificationService.notifyOfDealRoomCreation(
        proposalRequest.buyer_id,
        dealRoom.room_name,
        dealRoom.id,
        sellerProfile?.company_name || "Seller",
        proposalRequest.title,
      )

      // Also notify seller of acceptance
      await ProposalNotificationService.notifySellerOfAcceptance(
        proposalRequest,
        proposalResponse,
        buyerProfile?.full_name || "Buyer",
        dealRoom.id,
      )
    } catch (notificationError) {
      console.error("Failed to send notifications:", notificationError)
      // Don't fail the deal room creation if notifications fail
    }

    return NextResponse.json(dealRoom)
  } catch (error: any) {
    console.error("[DEAL_ROOM_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
