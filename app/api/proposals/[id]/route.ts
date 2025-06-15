import { NextResponse, type NextRequest } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 PROPOSALS [ID] API: Starting GET request for proposal:", params.id)

  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      console.error("🔍 PROPOSALS [ID] API: Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔍 PROPOSALS [ID] API: User authenticated:", user.id)

    // First, fetch the proposal
    console.log("🔍 PROPOSALS [ID] API: Fetching proposal...")
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", params.id)
      .single()

    if (proposalError) {
      console.error("🔍 PROPOSALS [ID] API: Proposal fetch error:", proposalError)
      return NextResponse.json({ error: "Failed to fetch proposal" }, { status: 500 })
    }

    if (!proposal) {
      console.log("🔍 PROPOSALS [ID] API: Proposal not found")
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    console.log("🔍 PROPOSALS [ID] API: Proposal found:", proposal.id)
    console.log("🔍 PROPOSALS [ID] API: Proposal seller_id:", proposal.seller_id)

    // Then fetch the seller profile
    console.log("🔍 PROPOSALS [ID] API: Fetching seller profile...")
    const { data: sellerProfile, error: sellerError } = await supabase
      .from("seller_profiles")
      .select("*")
      .eq("id", proposal.seller_id)
      .single()

    if (sellerError) {
      console.error("🔍 PROPOSALS [ID] API: Seller profile fetch error:", sellerError)
    }

    console.log("🔍 PROPOSALS [ID] API: Seller profile found:", !!sellerProfile)
    if (sellerProfile) {
      console.log("🔍 PROPOSALS [ID] API: Seller profile user_id:", sellerProfile.user_id)
    }

    // Then fetch the user profile for company name
    let userProfile = null
    if (sellerProfile?.user_id) {
      console.log("🔍 PROPOSALS [ID] API: Fetching user profile...")
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("company_name, full_name, avatar_url")
        .eq("id", sellerProfile.user_id)
        .single()

      if (profileError) {
        console.error("🔍 PROPOSALS [ID] API: User profile fetch error:", profileError)
      } else {
        userProfile = profile
        console.log("🔍 PROPOSALS [ID] API: User profile found:", !!userProfile)
      }
    }

    // Build the response
    const response = {
      id: proposal.id,
      proposal_text: proposal.cover_letter || proposal.proposal_text,
      technical_approach: proposal.technical_approach,
      proposed_budget: proposal.proposed_budget,
      proposed_timeline: proposal.proposed_timeline,
      status: proposal.status,
      deliverables: proposal.deliverables || [],
      seller_profile: {
        company_name: userProfile?.company_name || "Unknown Company",
        full_name: userProfile?.full_name || "Unknown Provider",
        avatar_url: userProfile?.avatar_url,
        business_type: sellerProfile?.business_type || "Unknown",
      },
      created_at: proposal.created_at,
      updated_at: proposal.updated_at,
    }

    console.log("🔍 PROPOSALS [ID] API: Response built successfully")
    console.log("🔍 PROPOSALS [ID] API: Company name:", response.seller_profile.company_name)

    return NextResponse.json(response)
  } catch (error) {
    console.error("🔍 PROPOSALS [ID] API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 API DEBUG: PUT /api/proposals/:id - Request received")

  try {
    const proposalId = params.id
    if (!proposalId) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      console.error("🔍 API DEBUG: Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the seller profile ID for the current user
    const { data: sellerProfiles, error: sellerProfileError } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (sellerProfileError || !sellerProfiles) {
      console.error("🔍 API DEBUG: Error fetching seller profile:", sellerProfileError)
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 })
    }

    const sellerId = sellerProfiles.id

    // Check if the proposal belongs to this seller
    const { data: existingProposal, error: proposalError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .eq("seller_id", sellerId)
      .single()

    if (proposalError || !existingProposal) {
      console.error("🔍 API DEBUG: Error fetching proposal:", proposalError)
      return NextResponse.json({ error: "Proposal not found or access denied" }, { status: 404 })
    }

    // Only allow editing draft or submitted proposals
    if (!["DRAFT", "SUBMITTED"].includes(existingProposal.status)) {
      return NextResponse.json(
        { error: `Cannot edit proposal with status: ${existingProposal.status}` },
        { status: 403 },
      )
    }

    // Get the update data from the request
    const updateData = await request.json()
    console.log("🔍 API DEBUG: Update data:", updateData)

    // Validate required fields
    if (!updateData.cover_letter || updateData.proposed_budget === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Prepare the update object
    const proposalUpdate = {
      cover_letter: updateData.cover_letter,
      proposed_budget: updateData.proposed_budget,
      proposed_timeline: updateData.proposed_timeline,
      technical_approach: updateData.technical_approach,
      relevant_experience: updateData.relevant_experience,
      status: updateData.status || existingProposal.status,
      updated_at: new Date().toISOString(),
      // Only set submitted_at if status is changing to SUBMITTED
      ...(updateData.status === "SUBMITTED" && !existingProposal.submitted_at
        ? { submitted_at: new Date().toISOString() }
        : {}),
    }

    // Update the proposal
    const { data: updatedProposal, error: updateError } = await supabase
      .from("proposals")
      .update(proposalUpdate)
      .eq("id", proposalId)
      .select("*")
      .single()

    if (updateError) {
      console.error("🔍 API DEBUG: Error updating proposal:", updateError)
      return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 })
    }

    // Handle milestones if provided
    if (updateData.milestones && Array.isArray(updateData.milestones)) {
      // First, get existing milestones
      const { data: existingMilestones } = await supabase
        .from("proposal_milestones")
        .select("id")
        .eq("proposal_id", proposalId)

      const existingMilestoneIds = existingMilestones?.map((m: any) => m.id) || []
      const updatedMilestoneIds = updateData.milestones.filter((m: any) => m.id).map((m: any) => m.id)

      // Find milestones to delete (exist in DB but not in update)
      const milestonesToDelete = existingMilestoneIds.filter((id) => !updatedMilestoneIds.includes(id))

      if (milestonesToDelete.length > 0) {
        const { error: deleteError } = await supabase.from("proposal_milestones").delete().in("id", milestonesToDelete)

        if (deleteError) {
          console.error("🔍 API DEBUG: Error deleting milestones:", deleteError)
        }
      }

      // Update or insert milestones
      for (const milestone of updateData.milestones) {
        if (milestone.id) {
          // Update existing milestone
          const { error: milestoneUpdateError } = await supabase
            .from("proposal_milestones")
            .update({
              title: milestone.title,
              description: milestone.description,
              deliverables: milestone.deliverables,
              amount: milestone.amount,
              duration_days: milestone.duration_days,
              order_index: milestone.order_index,
            })
            .eq("id", milestone.id)
            .eq("proposal_id", proposalId)

          if (milestoneUpdateError) {
            console.error("🔍 API DEBUG: Error updating milestone:", milestoneUpdateError)
          }
        } else {
          // Insert new milestone
          const { error: milestoneInsertError } = await supabase.from("proposal_milestones").insert({
            proposal_id: proposalId,
            title: milestone.title,
            description: milestone.description,
            deliverables: milestone.deliverables,
            amount: milestone.amount,
            duration_days: milestone.duration_days,
            order_index: milestone.order_index,
          })

          if (milestoneInsertError) {
            console.error("🔍 API DEBUG: Error inserting milestone:", milestoneInsertError)
          }
        }
      }
    }

    // Get the complete updated proposal with all related data
    const { data: completeProposal, error: fetchError } = await supabase
      .from("proposals")
      .select(`
        *,
        milestones:proposal_milestones(*),
        listing:listings!listing_id(
          id, 
          title,
          buyer_id
        )
      `)
      .eq("id", proposalId)
      .single()

    if (fetchError) {
      console.error("🔍 API DEBUG: Error fetching complete proposal:", fetchError)
      return NextResponse.json({ error: "Failed to fetch updated proposal" }, { status: 500 })
    }

    // Get seller profile and user profile separately
    const { data: sellerProfile } = await supabase
      .from("seller_profiles")
      .select("*")
      .eq("id", completeProposal.seller_id)
      .single()

    let userProfile = null
    if (sellerProfile?.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_name, full_name, avatar_url")
        .eq("id", sellerProfile.user_id)
        .single()
      userProfile = profile
    }

    // Transform the data for the client
    const transformedProposal = {
      ...completeProposal,
      seller_name: userProfile?.full_name || "Unknown",
      seller_company: userProfile?.company_name || "Unknown Company",
      seller_avatar: userProfile?.avatar_url,
      listing_title: completeProposal.listing?.title,
      buyer_id: completeProposal.listing?.buyer_id,
    }

    return NextResponse.json({ success: true, proposal: transformedProposal })
  } catch (error: any) {
    console.error("🔍 API DEBUG: Unexpected error in PUT /api/proposals/:id:", error)
    return NextResponse.json({ error: "An unexpected error occurred", details: getErrorMessage(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("proposals").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting proposal:", error)
      return NextResponse.json({ error: "Failed to delete proposal" }, { status: 500 })
    }

    return NextResponse.json({ message: "Proposal deleted successfully" })
  } catch (error) {
    console.error("Error in proposal DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
