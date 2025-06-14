import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const user = await getCurrentUser(supabase)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: response, error } = await supabase
      .from("proposal_responses")
      .select(`
        *,
        milestones:proposal_response_milestones(*),
        files:proposal_response_files(*),
        request:proposal_requests(
          *,
          buyer:profiles!buyer_id(id, full_name, email, avatar_url),
          seller:seller_profiles!seller_id(user_id, company_name, expertise)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching proposal response:", error)
      return NextResponse.json({ error: "Proposal response not found" }, { status: 404 })
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Get proposal response API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const user = await getCurrentUser(supabase)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updates = { ...body, updated_at: new Date().toISOString() }

    // Get the response to check permissions
    const { data: existingResponse, error: fetchError } = await supabase
      .from("proposal_responses")
      .select(`
        *,
        request:proposal_requests(buyer_id, seller_id)
      `)
      .eq("id", params.id)
      .single()

    if (fetchError || !existingResponse) {
      return NextResponse.json({ error: "Proposal response not found" }, { status: 404 })
    }

    // Check if user has permission to update
    const canUpdate =
      existingResponse.request.seller_id === user.id || // Seller can update their response
      existingResponse.request.buyer_id === user.id // Buyer can update status (accept/decline)

    if (!canUpdate) {
      return NextResponse.json({ error: "Unauthorized to update this response" }, { status: 403 })
    }

    const { data: response, error } = await supabase
      .from("proposal_responses")
      .update(updates)
      .eq("id", params.id)
      .select(`
        *,
        milestones:proposal_response_milestones(*),
        files:proposal_response_files(*)
      `)
      .single()

    if (error) {
      console.error("Error updating proposal response:", error)
      return NextResponse.json({ error: "Failed to update proposal response" }, { status: 500 })
    }

    // If status was updated to ACCEPTED, update the request status too
    if (updates.status === "ACCEPTED") {
      await supabase
        .from("proposal_requests")
        .update({ status: "ACCEPTED", updated_at: new Date().toISOString() })
        .eq("id", existingResponse.request_id)
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Update proposal response API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
