import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const listingId = searchParams.get("listing_id")
    const sellerId = searchParams.get("seller_id")
    const status = searchParams.get("status") // Add status filter
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    console.log("🔍 API DEBUG: GET /api/proposals - Query params:", {
      listingId,
      sellerId,
      status,
      page,
      limit,
    })

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔍 API DEBUG: User authenticated:", user.email)

    // Build the query
    let query = supabase.from("proposals").select(`
        *,
        milestones:proposal_milestones(*),
        listing:listings!listing_id(
          id, 
          title,
          budget_min,
          budget_max,
          buyer_id
        ),
        seller_profile:seller_profiles!seller_id(
          id, 
          user_id,
          business_type,
          profiles:profiles!user_id(company_name, full_name, avatar_url)
        )
      `)

    // Apply filters
    if (listingId) {
      query = query.eq("listing_id", listingId)
      console.log("🔍 API DEBUG: Filtering by listing_id:", listingId)
    }
    if (sellerId) {
      query = query.eq("seller_id", sellerId)
      console.log("🔍 API DEBUG: Filtering by seller_id:", sellerId)
    }
    if (status) {
      query = query.eq("status", status.toUpperCase())
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    // Order by created_at for general queries, or withdrawn_at for withdrawn proposals
    if (status === "WITHDRAWN") {
      query = query.order("withdrawn_at", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    console.log("🔍 API DEBUG: Executing proposals query")
    const { data: proposals, error } = await query

    if (error) {
      console.error("🔍 API DEBUG: Error fetching proposals:", error)
      return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
    }

    console.log("🔍 API DEBUG: Fetched proposals count:", proposals?.length || 0)

    // Transform the data for the client
    const transformedProposals =
      proposals?.map((proposal) => ({
        ...proposal,
        seller_name: proposal.seller_profile?.profiles?.full_name || "Unknown",
        seller_company: proposal.seller_profile?.profiles?.company_name || "Unknown Company",
        seller_avatar: proposal.seller_profile?.profiles?.avatar_url,
        listing_title: proposal.listing?.title,
        buyer_id: proposal.listing?.buyer_id,
      })) || []

    return NextResponse.json({
      proposals: transformedProposals,
      total: transformedProposals.length,
      page,
      limit,
    })
  } catch (error: any) {
    console.error("🔍 API DEBUG: Unexpected error in GET /api/proposals:", error)
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("🔍 API DEBUG: POST /api/proposals - Request received at", new Date().toISOString())

  try {
    console.log("🔍 API DEBUG: About to create Supabase client")
    const supabase = createClient()
    console.log("🔍 API DEBUG: Supabase client created successfully")

    console.log("🔍 API DEBUG: Getting user authentication")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("🔍 API DEBUG: Auth check result:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError?.message,
    })

    if (authError || !user) {
      console.log("🔍 API DEBUG: Authentication failed, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    console.log("🔍 API DEBUG: About to parse request body")
    let body
    try {
      body = await request.json()
      console.log("🔍 API DEBUG: Request body parsed successfully, keys:", Object.keys(body))
      console.log("🔍 API DEBUG: Request body content:", JSON.stringify(body, null, 2))
    } catch (e) {
      console.error("🔍 API DEBUG: Failed to parse request body:", e)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const {
      listing_id,
      cover_letter,
      proposed_budget,
      proposed_timeline,
      technical_approach,
      relevant_experience,
      milestones = [],
      status = "DRAFT",
      is_sealed = false,
      attachments,
    } = body

    console.log("🔍 API DEBUG: Extracted fields:", {
      listing_id,
      has_cover_letter: !!cover_letter,
      proposed_budget,
      status,
      milestones_count: milestones.length,
    })

    // Validate required fields
    if (!listing_id || !cover_letter || proposed_budget === undefined) {
      console.log("🔍 API DEBUG: Missing required fields validation failed")
      return NextResponse.json(
        {
          error: "Missing required fields: listing_id, cover_letter, proposed_budget",
        },
        { status: 400 },
      )
    }

    // Get seller profile ID
    console.log("🔍 API DEBUG: Fetching seller profile for user:", user.id)
    const { data: sellerProfile, error: sellerProfileError } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    console.log("🔍 API DEBUG: Seller profile result:", {
      sellerProfile,
      errorCode: sellerProfileError?.code,
      errorMessage: sellerProfileError?.message,
    })

    if (sellerProfileError || !sellerProfile) {
      console.error("🔍 API DEBUG: Error fetching seller profile:", sellerProfileError)
      return NextResponse.json(
        {
          error: "Seller profile not found. Please complete your seller profile first.",
          details: sellerProfileError?.message,
        },
        { status: 400 },
      )
    }

    const sellerProfileId = sellerProfile.id
    console.log("🔍 API DEBUG: Using seller profile ID:", sellerProfileId)

    // Check for existing NON-WITHDRAWN proposals
    if (status !== "DRAFT") {
      console.log(
        "🔍 API DEBUG: Checking for existing active proposals for seller profile:",
        sellerProfileId,
        "listing:",
        listing_id,
      )

      try {
        const { data: existingProposal, error: existingProposalError } = await supabase
          .from("proposals")
          .select("id")
          .eq("listing_id", listing_id)
          .eq("seller_id", sellerProfileId)
          .neq("status", "WITHDRAWN") // Allow new proposals if previous ones were withdrawn
          .single()

        console.log("🔍 API DEBUG: Existing proposal check result:", {
          existingProposal,
          errorCode: existingProposalError?.code,
          errorMessage: existingProposalError?.message,
        })

        if (existingProposalError && existingProposalError.code !== "PGRST116") {
          console.error("🔍 API DEBUG: Error checking existing proposal:", existingProposalError)
        }
        if (existingProposal) {
          console.log("🔍 API DEBUG: Active proposal already exists, returning 409")
          return NextResponse.json(
            {
              error:
                "You have already submitted an active proposal for this listing. You can edit your existing proposal.",
            },
            { status: 409 },
          )
        }
      } catch (existingCheckError) {
        console.error("🔍 API DEBUG: Exception during existing proposal check:", existingCheckError)
      }
    }

    // Create the proposal
    const proposalData = {
      listing_id,
      seller_id: sellerProfileId,
      cover_letter,
      proposed_budget: Number(proposed_budget),
      proposed_timeline,
      technical_approach,
      relevant_experience,
      status,
      is_sealed,
      attachments: attachments || [],
      submitted_at: status === "SUBMITTED" ? new Date().toISOString() : null,
    }

    console.log("🔍 API DEBUG: About to insert proposal with data:", JSON.stringify(proposalData, null, 2))

    // Insert the proposal with the correct foreign key relationship
    const { data: newProposal, error: proposalError } = await supabase
      .from("proposals")
      .insert(proposalData)
      .select(`
        *,
        listing:listings!inner(id, title, budget_min, budget_max, buyer_id, bid_deadline),
        seller_profile:seller_profiles!seller_id(
          id, 
          user_id,
          profiles!user_id(company_name, full_name, avatar_url)
        )
      `)
      .single()

    console.log("🔍 API DEBUG: Proposal insert result:", {
      success: !!newProposal && !proposalError,
      proposalId: newProposal?.id,
      errorCode: proposalError?.code,
      errorMessage: proposalError?.message,
      errorDetails: proposalError?.details,
      errorHint: proposalError?.hint,
    })

    if (proposalError) {
      console.error("🔍 API DEBUG: Error creating proposal:", proposalError)
      return NextResponse.json(
        {
          error: "Failed to create proposal",
          details: proposalError.message,
          code: proposalError.code,
          hint: proposalError.hint,
        },
        { status: 500 },
      )
    }

    // Create milestones
    if (newProposal && milestones.length > 0) {
      console.log("🔍 API DEBUG: Creating milestones for proposal:", newProposal.id)

      const milestonesData = milestones.map((milestone: any, index: number) => ({
        proposal_id: newProposal.id,
        title: milestone.title,
        description: milestone.description,
        deliverables: milestone.deliverables || [],
        amount: Number(milestone.amount),
        duration_days: milestone.duration_days ? Number(milestone.duration_days) : null,
        order_index: milestone.order_index !== undefined ? milestone.order_index : index,
      }))

      console.log("🔍 API DEBUG: Milestone data prepared:", JSON.stringify(milestonesData, null, 2))

      const { error: milestonesError } = await supabase.from("proposal_milestones").insert(milestonesData)

      console.log("🔍 API DEBUG: Milestones insert result:", {
        success: !milestonesError,
        errorMessage: milestonesError?.message,
      })

      if (milestonesError) {
        console.error("🔍 API DEBUG: Error creating milestones:", milestonesError)
      }
    }

    // Fetch milestones for the response
    const { data: milestonesData } = await supabase
      .from("proposal_milestones")
      .select("id, title, description, deliverables, amount, duration_days, order_index")
      .eq("proposal_id", newProposal.id)
      .order("order_index")

    // Transform the response to flatten the nested profile structure
    const transformedProposal = {
      ...newProposal,
      seller_profile: {
        id: newProposal.seller_profile?.id,
        user_id: newProposal.seller_profile?.user_id,
        company_name: newProposal.seller_profile?.profiles?.company_name,
        full_name: newProposal.seller_profile?.profiles?.full_name,
        avatar_url: newProposal.seller_profile?.profiles?.avatar_url,
      },
      milestones: milestonesData || [],
    }

    console.log("🔍 API DEBUG: Successfully created proposal with ID:", newProposal.id)
    return NextResponse.json({ proposal: transformedProposal }, { status: 201 })
  } catch (error: any) {
    console.error("🔍 API DEBUG: Top-level exception in proposals POST:", error)
    console.error("🔍 API DEBUG: Error stack:", error.stack)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
