import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { proposalResponseSchema } from "@/lib/validations/proposal-response"
import { ProposalNotificationService } from "@/lib/notifications/proposal-notification-service"

const proposalResponseCreateSchema = proposalResponseSchema

const bodySchema = z.object({
  requestId: z.string(),
  response: proposalResponseCreateSchema,
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { requestId, response } = bodySchema.parse(body)
    const supabase = createRouteHandlerClient({ cookies: await cookies() })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify the request exists and belongs to the user
    const { data: proposalRequest, error: proposalRequestError } = await supabase
      .from("proposal_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (proposalRequestError) {
      console.error("Error fetching proposal request:", proposalRequestError)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    if (!proposalRequest) {
      return new NextResponse("Proposal request not found", { status: 404 })
    }

    // Create the proposal response
    const { data, error } = await supabase
      .from("proposal_responses")
      .insert({
        ...response,
        request_id: requestId,
        seller_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating proposal response:", error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    // After the successful creation, before returning the response
    try {
      // Get seller name for notification
      const { data: sellerProfile } = await supabase
        .from("seller_profiles")
        .select("company_name")
        .eq("user_id", user.id)
        .single()

      // Get the original request for buyer notification
      const { data: originalRequest } = await supabase
        .from("proposal_requests")
        .select("*")
        .eq("id", requestId)
        .single()

      if (originalRequest) {
        await ProposalNotificationService.notifyBuyerOfResponse(
          originalRequest,
          data,
          sellerProfile?.company_name || "A seller",
        )
      }
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError)
      // Don't fail the response creation if notification fails
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
