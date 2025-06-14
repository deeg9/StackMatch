import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100)
    const status = searchParams.get("status")
    const listing_id = searchParams.get("listing_id")
    const provider_id = searchParams.get("provider_id")
    const pricing_model = searchParams.get("pricing_model")
    const budget_min = searchParams.get("budget_min")
    const budget_max = searchParams.get("budget_max")
    const search = searchParams.get("search")
    const sort_by = searchParams.get("sort_by") || "created_at"
    const sort_order = searchParams.get("sort_order") || "desc"

    // Build query
    let query = supabase.from("proposals").select(`
        *,
        proposal_milestones(*),
        proposal_attachments(*),
        proposal_evaluations(*)
      `)

    // Apply filters
    if (status && status !== "ALL") {
      query = query.eq("status", status)
    }

    if (listing_id) {
      query = query.eq("listing_id", listing_id)
    }

    if (provider_id) {
      query = query.eq("provider_id", provider_id)
    }

    if (pricing_model && pricing_model !== "ALL") {
      query = query.eq("pricing_model", pricing_model)
    }

    if (budget_min) {
      query = query.gte("total_budget", Number.parseFloat(budget_min))
    }

    if (budget_max) {
      query = query.lte("total_budget", Number.parseFloat(budget_max))
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,executive_summary.ilike.%${search}%,technical_approach.ilike.%${search}%`,
      )
    }

    // Apply sorting
    const ascending = sort_order === "asc"
    query = query.order(sort_by, { ascending })

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("proposals")
      .select("*", { count: "exact", head: true })
      // Re-apply filters for accurate count
      .if(status && status !== "ALL", (q) => q.eq("status", status))
      .if(listing_id, (q) => q.eq("listing_id", listing_id))
      .if(provider_id, (q) => q.eq("provider_id", provider_id))
      .if(pricing_model && pricing_model !== "ALL", (q) => q.eq("pricing_model", pricing_model))
      .if(budget_min, (q) => q.gte("total_budget", Number.parseFloat(budget_min)))
      .if(budget_max, (q) => q.lte("total_budget", Number.parseFloat(budget_max)))
      .if(search, (q) =>
        q.or(`title.ilike.%${search}%,executive_summary.ilike.%${search}%,technical_approach.ilike.%${search}%`),
      )

    if (countError) {
      console.error("Error fetching proposal count:", countError)
      // Proceed without count if it fails, or handle as critical error
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: proposals, error } = await query

    if (error) {
      console.error("Error fetching proposals:", error)
      return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      proposals: proposals || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      appliedFilters: {
        status,
        listing_id,
        provider_id,
        pricing_model,
        budget_min,
        budget_max,
        search,
        sort_by,
        sort_order,
      },
    })
  } catch (error) {
    console.error("Error in proposals API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const proposalData = await request.json()

    // Validate required fields
    const requiredFields = [
      "listing_id",
      "provider_id",
      "title",
      "executive_summary",
      "technical_approach",
      "total_budget",
      "estimated_duration_weeks",
    ]
    for (const field of requiredFields) {
      if (!proposalData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Insert proposal
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .insert([
        {
          ...proposalData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (proposalError) {
      console.error("Error creating proposal:", proposalError)
      return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
    }

    // Insert milestones if provided
    if (proposalData.milestones && proposalData.milestones.length > 0) {
      const milestones = proposalData.milestones.map((milestone: any, index: number) => ({
        ...milestone,
        proposal_id: proposal.id,
        milestone_number: index + 1,
        created_at: new Date().toISOString(),
      }))

      const { error: milestonesError } = await supabase.from("proposal_milestones").insert(milestones)

      if (milestonesError) {
        console.error("Error creating milestones:", milestonesError)
        // Don't fail the entire request, just log the error
      }
    }

    // Insert attachments if provided
    if (proposalData.attachments && proposalData.attachments.length > 0) {
      const attachments = proposalData.attachments.map((attachment: any) => ({
        ...attachment,
        proposal_id: proposal.id,
        uploaded_by: proposalData.provider_id, // Assuming provider uploads their own attachments
        created_at: new Date().toISOString(),
      }))
      const { error: attachmentsError } = await supabase.from("proposal_attachments").insert(attachments)
      if (attachmentsError) {
        console.error("Error creating attachments:", attachmentsError)
      }
    }

    // Track analytics event
    await supabase.from("proposal_analytics_events").insert([
      {
        proposal_id: proposal.id,
        listing_id: proposalData.listing_id,
        user_id: proposalData.provider_id,
        event_type: "PROPOSAL_CREATED",
        event_category: "CREATION",
        event_data: { proposal_amount: proposalData.total_budget },
        created_at: new Date().toISOString(),
      },
    ])

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error("Error in proposal creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
