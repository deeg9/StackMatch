import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ProposalRequestSchema } from "@/lib/validation"
import { ProposalNotificationService } from "@/lib/notifications/proposal-notification-service"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const req = await request.json()
    const validated = ProposalRequestSchema.safeParse(req)

    if (!validated.success) {
      console.log(validated.error)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { data: proposalRequest, error } = await supabase
      .from("proposal_requests")
      .insert({
        ...validated.data,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating proposal request:", error)
      return NextResponse.json({ error: "Failed to create proposal request" }, { status: 500 })
    }

    // After the successful creation, before returning the response
    try {
      // Get buyer name for notification
      const { data: buyerProfile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

      // Send notification to seller
      await ProposalNotificationService.notifySellerOfNewRequest(proposalRequest, buyerProfile?.full_name || "A buyer")
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError)
      // Don't fail the request creation if notification fails
    }

    return NextResponse.json(proposalRequest)
  } catch (e: any) {
    console.error("Error during POST request:", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
