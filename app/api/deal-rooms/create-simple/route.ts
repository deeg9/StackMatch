import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 CREATE SIMPLE: Starting simple deal room creation")

    // Test 1: Parse request body
    console.log("🔍 CREATE SIMPLE: Test 1 - Parsing request body")
    const body = await request.json()
    console.log("🔍 CREATE SIMPLE: Request body:", body)

    const { listingId, proposalId } = body

    if (!listingId || !proposalId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "listingId and proposalId are required",
        },
        { status: 400 },
      )
    }

    // Test 2: Create Supabase client
    console.log("🔍 CREATE SIMPLE: Test 2 - Creating Supabase client")
    const supabase = createClient()

    // Test 3: Get authenticated user
    console.log("🔍 CREATE SIMPLE: Test 3 - Getting authenticated user")
    const { data: userData, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error("🔍 CREATE SIMPLE: Auth error:", authError)
      return NextResponse.json(
        {
          error: "Authentication failed",
          details: authError.message,
        },
        { status: 401 },
      )
    }

    if (!userData?.user) {
      return NextResponse.json(
        {
          error: "No authenticated user",
        },
        { status: 401 },
      )
    }

    console.log("🔍 CREATE SIMPLE: User authenticated:", userData.user.email)

    // Test 4: Check if deal room already exists for this listing
    console.log("🔍 CREATE SIMPLE: Test 4 - Checking for existing deal room")
    const { data: existingDealRoom, error: dealRoomSearchError } = await supabase
      .from("deal_rooms")
      .select("id, room_name")
      .eq("listing_id", listingId)
      .limit(1)

    if (dealRoomSearchError) {
      console.error("🔍 CREATE SIMPLE: Deal room search error:", dealRoomSearchError)
    }

    if (existingDealRoom && existingDealRoom.length > 0) {
      console.log("🔍 CREATE SIMPLE: Found existing deal room:", existingDealRoom[0].id)
      return NextResponse.json({
        success: true,
        message: "Using existing deal room",
        dealRoomId: existingDealRoom[0].id,
        dealRoom: existingDealRoom[0],
      })
    }

    // Test 5: Find or create a proposal with valid seller_id
    console.log("🔍 CREATE SIMPLE: Test 5 - Finding/creating proposal")

    // First, let's try to find an existing proposal for this listing with a valid seller
    const { data: existingProposals, error: proposalSearchError } = await supabase
      .from("proposals")
      .select("id, listing_id, seller_id")
      .eq("listing_id", listingId)
      .limit(1)

    if (proposalSearchError) {
      console.error("🔍 CREATE SIMPLE: Proposal search error:", proposalSearchError)
    }

    let proposal
    if (existingProposals && existingProposals.length > 0) {
      proposal = existingProposals[0]
      console.log("🔍 CREATE SIMPLE: Found existing proposal:", proposal.id)

      // Check if the seller_id exists in profiles
      const { data: sellerProfile, error: sellerError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", proposal.seller_id)
        .single()

      if (sellerError || !sellerProfile) {
        console.log("🔍 CREATE SIMPLE: Seller profile not found, using current user as seller")
        // Update the proposal to use current user as seller
        const { data: updatedProposal, error: updateError } = await supabase
          .from("proposals")
          .update({ seller_id: userData.user.id })
          .eq("id", proposal.id)
          .select()
          .single()

        if (updateError) {
          console.error("🔍 CREATE SIMPLE: Failed to update proposal seller:", updateError)
        } else {
          proposal = updatedProposal
          console.log("🔍 CREATE SIMPLE: Updated proposal seller to current user")
        }
      }
    } else {
      // Create a test proposal for demonstration
      console.log("🔍 CREATE SIMPLE: Creating test proposal")
      const { data: newProposal, error: createProposalError } = await supabase
        .from("proposals")
        .insert({
          listing_id: listingId,
          seller_id: userData.user.id, // Using current user as seller for testing
          proposal_text: "Test proposal for deal room creation",
          budget_amount: 5000,
          timeline_weeks: 4,
          status: "submitted",
        })
        .select()
        .single()

      if (createProposalError) {
        console.error("🔍 CREATE SIMPLE: Create proposal error:", createProposalError)
        return NextResponse.json(
          {
            error: "Failed to create test proposal",
            details: createProposalError.message,
          },
          { status: 500 },
        )
      }

      proposal = newProposal
      console.log("🔍 CREATE SIMPLE: Created test proposal:", proposal.id)
    }

    // Test 6: Create a simple deal room record
    console.log("🔍 CREATE SIMPLE: Test 6 - Creating deal room")
    const dealRoomData = {
      listing_id: listingId,
      proposal_id: proposal.id,
      buyer_id: userData.user.id,
      seller_id: userData.user.id, // Using current user as both buyer and seller for testing
      room_name: `Deal Room for Proposal ${proposal.id.substring(0, 8)}`,
      status: "ACTIVE",
    }

    console.log("🔍 CREATE SIMPLE: Deal room data:", dealRoomData)

    const { data: dealRoom, error: dealRoomError } = await supabase
      .from("deal_rooms")
      .insert(dealRoomData)
      .select()
      .single()

    if (dealRoomError) {
      console.error("🔍 CREATE SIMPLE: Deal room creation error:", dealRoomError)
      return NextResponse.json(
        {
          error: "Failed to create deal room",
          details: dealRoomError.message,
        },
        { status: 500 },
      )
    }

    console.log("🔍 CREATE SIMPLE: Deal room created successfully:", dealRoom)

    return NextResponse.json({
      success: true,
      message: "Deal room created successfully",
      dealRoomId: dealRoom.id,
      proposalId: proposal.id,
      dealRoom: dealRoom,
    })
  } catch (error: any) {
    console.error("🔍 CREATE SIMPLE: Unexpected error:", error)
    console.error("🔍 CREATE SIMPLE: Error stack:", getErrorStack(error))

    return NextResponse.json(
      {
        error: "Deal room creation failed",
        details: getErrorMessage(error),
        stack: getErrorStack(error),
      },
      { status: 500 },
    )
  }
}
