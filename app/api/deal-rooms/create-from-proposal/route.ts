import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("🔍 DEAL ROOM API: Starting request processing")

  try {
    // Parse request body
    const body = await request.json()
    console.log("🔍 DEAL ROOM API: Request body parsed:", body)

    const { listingId, proposalId } = body

    if (!listingId || !proposalId) {
      console.error("🔍 DEAL ROOM API: Missing required fields")
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["listingId", "proposalId"],
        },
        { status: 400 },
      )
    }

    // For now, just return a mock success response
    console.log("🔍 DEAL ROOM API: Returning mock success")
    return NextResponse.json({
      success: true,
      dealRoomId: `mock-${Date.now()}`,
      message: "Mock deal room created successfully",
    })

    // Create Supabase client
    let supabase
    try {
      supabase = createClient()
      console.log("🔍 DEAL ROOM API: Supabase client created")
    } catch (supabaseError) {
      console.error("🔍 DEAL ROOM API: Failed to create Supabase client:", supabaseError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get authenticated user
    let user
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error("🔍 DEAL ROOM API: Auth error:", authError)
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
      }

      if (!userData?.user) {
        console.error("🔍 DEAL ROOM API: No user found")
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
      }

      user = userData.user
      console.log("🔍 DEAL ROOM API: User authenticated:", user.email)
    } catch (authError) {
      console.error("🔍 DEAL ROOM API: Exception during auth:", authError)
      return NextResponse.json({ error: "Authentication error" }, { status: 401 })
    }

    // Fetch and validate listing
    let listing
    try {
      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .select("id, title, buyer_id")
        .eq("id", listingId)
        .single()

      if (listingError) {
        console.error("🔍 DEAL ROOM API: Listing query error:", listingError)
        return NextResponse.json(
          {
            error: "Failed to fetch listing",
            details: listingError.message,
          },
          { status: 500 },
        )
      }

      if (!listingData) {
        console.error("🔍 DEAL ROOM API: Listing not found")
        return NextResponse.json({ error: "Listing not found" }, { status: 404 })
      }

      listing = listingData
      console.log("🔍 DEAL ROOM API: Listing found:", listing.title)
    } catch (listingError) {
      console.error("🔍 DEAL ROOM API: Exception fetching listing:", listingError)
      return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
    }

    // Verify user is the buyer
    if (listing.buyer_id !== user.id) {
      console.error("🔍 DEAL ROOM API: User not authorized for this listing")
      return NextResponse.json(
        {
          error: "Not authorized to create deal room for this listing",
        },
        { status: 403 },
      )
    }

    // Fetch and validate proposal
    let proposal
    try {
      const { data: proposalData, error: proposalError } = await supabase
        .from("proposals")
        .select("id, seller_id, status")
        .eq("id", proposalId)
        .eq("listing_id", listingId)
        .single()

      if (proposalError) {
        console.error("🔍 DEAL ROOM API: Proposal query error:", proposalError)
        return NextResponse.json(
          {
            error: "Failed to fetch proposal",
            details: proposalError.message,
          },
          { status: 500 },
        )
      }

      if (!proposalData) {
        console.error("🔍 DEAL ROOM API: Proposal not found")
        return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
      }

      proposal = proposalData
      console.log("🔍 DEAL ROOM API: Proposal found with status:", proposal.status)
    } catch (proposalError) {
      console.error("🔍 DEAL ROOM API: Exception fetching proposal:", proposalError)
      return NextResponse.json({ error: "Failed to fetch proposal" }, { status: 500 })
    }

    // Validate proposal status
    if (proposal.status !== "SUBMITTED") {
      console.error("🔍 DEAL ROOM API: Invalid proposal status:", proposal.status)
      return NextResponse.json(
        {
          error: `Cannot create deal room for proposal with status: ${proposal.status}`,
        },
        { status: 400 },
      )
    }

    // Check for existing deal room
    try {
      const { data: existingRoom, error: checkError } = await supabase
        .from("deal_rooms")
        .select("id")
        .eq("listing_id", listingId)
        .eq("buyer_id", user.id)
        .eq("seller_id", proposal.seller_id)
        .maybeSingle()

      if (checkError) {
        console.error("🔍 DEAL ROOM API: Error checking existing rooms:", checkError)
        // Continue anyway - this is not critical
      }

      if (existingRoom) {
        console.log("🔍 DEAL ROOM API: Deal room already exists:", existingRoom.id)
        return NextResponse.json({
          success: true,
          dealRoomId: existingRoom.id,
          message: "Deal room already exists",
        })
      }
    } catch (checkError) {
      console.error("🔍 DEAL ROOM API: Exception checking existing rooms:", checkError)
      // Continue anyway
    }

    // Get seller name for room title
    let sellerName = "Seller"
    try {
      const { data: sellerData } = await supabase
        .from("profiles")
        .select("full_name, company_name")
        .eq("id", proposal.seller_id)
        .single()

      if (sellerData) {
        sellerName = sellerData.company_name || sellerData.full_name || "Seller"
      }
    } catch (sellerError) {
      console.error("🔍 DEAL ROOM API: Could not fetch seller name:", sellerError)
      // Use default name
    }

    const roomName = `${listing.title} - ${sellerName} Deal Room`
    console.log("🔍 DEAL ROOM API: Generated room name:", roomName)

    // Create deal room
    try {
      const dealRoomData = {
        listing_id: listingId,
        proposal_id: proposalId,
        buyer_id: user.id,
        seller_id: proposal.seller_id,
        room_name: roomName,
        status: "ACTIVE",
      }

      console.log("🔍 DEAL ROOM API: Creating deal room with data:", dealRoomData)

      const { data: newRoom, error: createError } = await supabase
        .from("deal_rooms")
        .insert(dealRoomData)
        .select("id")
        .single()

      if (createError) {
        console.error("🔍 DEAL ROOM API: Create error:", {
          message: createError.message,
          details: createError.details,
          hint: createError.hint,
          code: createError.code,
        })
        return NextResponse.json(
          {
            error: "Failed to create deal room",
            details: createError.message,
            code: createError.code,
          },
          { status: 500 },
        )
      }

      if (!newRoom) {
        console.error("🔍 DEAL ROOM API: No room data returned")
        return NextResponse.json({ error: "Deal room creation failed" }, { status: 500 })
      }

      console.log("🔍 DEAL ROOM API: Deal room created successfully:", newRoom.id)

      // Update proposal status (non-critical)
      try {
        await supabase.from("proposals").update({ status: "UNDER_REVIEW" }).eq("id", proposalId)
        console.log("🔍 DEAL ROOM API: Proposal status updated")
      } catch (updateError) {
        console.error("🔍 DEAL ROOM API: Failed to update proposal status:", updateError)
        // Don't fail the request
      }

      return NextResponse.json({
        success: true,
        dealRoomId: newRoom.id,
        message: "Deal room created successfully",
      })
    } catch (createError) {
      console.error("🔍 DEAL ROOM API: Exception creating deal room:", createError)
      return NextResponse.json(
        {
          error: "Failed to create deal room",
          details: createError instanceof Error ? createError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("🔍 DEAL ROOM API: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
