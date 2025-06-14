import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    const { data: proposal, error } = await supabase
      .from("proposals")
      .select(
        `
        *,
        proposal_milestones(*),
        proposal_attachments(*),
        proposal_evaluations(*),
        proposal_questions(*, proposal_answers(*))
      `,
      )
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching proposal:", error)
      if (error.code === "PGRST116") {
        // Not found
        return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Failed to fetch proposal" }, { status: 500 })
    }

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    return NextResponse.json(proposal)
  } catch (error) {
    console.error("Error in proposal API (GET by ID):", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params
    const proposalUpdates = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    // Separate milestones and attachments for individual handling
    const { milestones: milestoneUpdates, attachments: attachmentUpdates, ...coreProposalUpdates } = proposalUpdates

    // Update core proposal data
    const { data: updatedProposal, error: proposalError } = await supabase
      .from("proposals")
      .update({
        ...coreProposalUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (proposalError) {
      console.error("Error updating proposal:", proposalError)
      return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 })
    }

    // Handle milestones: delete existing and insert new ones (simplistic approach)
    // A more robust approach would be to diff and update/insert/delete selectively.
    if (milestoneUpdates) {
      await supabase.from("proposal_milestones").delete().eq("proposal_id", id)
      if (milestoneUpdates.length > 0) {
        const newMilestones = milestoneUpdates.map((milestone: any, index: number) => ({
          ...milestone,
          proposal_id: id,
          milestone_number: index + 1,
          created_at: new Date().toISOString(), // Or preserve original if available
        }))
        const { error: milestonesError } = await supabase.from("proposal_milestones").insert(newMilestones)
        if (milestonesError) console.error("Error updating milestones:", milestonesError)
      }
    }

    // Handle attachments (similar simplistic approach)
    if (attachmentUpdates) {
      await supabase.from("proposal_attachments").delete().eq("proposal_id", id)
      if (attachmentUpdates.length > 0) {
        const newAttachments = attachmentUpdates.map((attachment: any) => ({
          ...attachment,
          proposal_id: id,
          uploaded_by: updatedProposal.provider_id, // or from auth context
          created_at: new Date().toISOString(),
        }))
        const { error: attachmentsError } = await supabase.from("proposal_attachments").insert(newAttachments)
        if (attachmentsError) console.error("Error updating attachments:", attachmentsError)
      }
    }

    // Track analytics event
    await supabase.from("proposal_analytics_events").insert([
      {
        proposal_id: id,
        listing_id: updatedProposal.listing_id,
        user_id: updatedProposal.provider_id, // Or from auth context
        event_type: "PROPOSAL_UPDATED",
        event_category: "ENGAGEMENT",
        created_at: new Date().toISOString(),
      },
    ])

    return NextResponse.json(updatedProposal)
  } catch (error) {
    console.error("Error in proposal update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    // Note: RLS policies should ensure only authorized users can delete.
    // Cascading deletes should handle related data like milestones, attachments.
    const { error } = await supabase.from("proposals").delete().eq("id", id)

    if (error) {
      console.error("Error deleting proposal:", error)
      return NextResponse.json({ error: "Failed to delete proposal" }, { status: 500 })
    }

    return NextResponse.json({ message: "Proposal deleted successfully" })
  } catch (error) {
    console.error("Error in proposal deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
