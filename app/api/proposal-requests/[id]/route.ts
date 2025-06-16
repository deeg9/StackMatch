import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"
import { getCurrentUser } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const user = await getCurrentUser(supabase)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: proposalRequest, error } = await supabase
      .from("proposal_requests")
      .select(`
        *,
        buyer:profiles!buyer_id(id, full_name, email, avatar_url),
        seller:seller_profiles!seller_id(user_id, company_name, expertise),
        responses:proposal_responses(
          *,
          milestones:proposal_response_milestones(*),
          files:proposal_response_files(*)
        ),
        files:proposal_request_files(*)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching proposal request:", error)
      return NextResponse.json({ error: "Proposal request not found" }, { status: 404 })
    }

    return NextResponse.json({ request: proposalRequest })
  } catch (error) {
    console.error("Get proposal request API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const user = await getCurrentUser(supabase)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updates = { ...body, updated_at: new Date().toISOString() }

    const { data: proposalRequest, error } = await supabase
      .from("proposal_requests")
      .update(updates)
      .eq("id", params.id)
      .eq("buyer_id", user.id) // Only allow buyer to update their own requests
      .select(`
        *,
        buyer:profiles!buyer_id(id, full_name, email, avatar_url),
        seller:seller_profiles!seller_id(user_id, company_name, expertise)
      `)
      .single()

    if (error) {
      console.error("Error updating proposal request:", error)
      return NextResponse.json({ error: "Failed to update proposal request" }, { status: 500 })
    }

    return NextResponse.json({ request: proposalRequest })
  } catch (error) {
    console.error("Update proposal request API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const user = await getCurrentUser(supabase)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("proposal_requests").delete().eq("id", params.id).eq("buyer_id", user.id) // Only allow buyer to delete their own requests

    if (error) {
      console.error("Error deleting proposal request:", error)
      return NextResponse.json({ error: "Failed to delete proposal request" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete proposal request API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
