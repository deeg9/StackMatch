import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 WITHDRAW API: Starting withdrawal endpoint")
  console.log("🔍 WITHDRAW API: Params received:", params)

  try {
    const proposalId = params.id
    console.log("🔍 WITHDRAW API: Proposal ID:", proposalId)

    if (!proposalId) {
      console.log("🔍 WITHDRAW API: No proposal ID provided")
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    console.log("🔍 WITHDRAW API: Creating Supabase client with cookies...")
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    console.log("🔍 WITHDRAW API: Supabase client created successfully")

    // Get user
    console.log("🔍 WITHDRAW API: Getting authenticated user...")
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    console.log("🔍 WITHDRAW API: User fetch result:", { user: user?.id, error: userError })

    if (userError || !user) {
      console.log("🔍 WITHDRAW API: Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get seller profile
    console.log("🔍 WITHDRAW API: Fetching seller profile for user:", user.id)
    const { data: sellerProfile, error: sellerError } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    console.log("🔍 WITHDRAW API: Seller profile result:", { profile: sellerProfile, error: sellerError })

    if (sellerError || !sellerProfile) {
      console.log("🔍 WITHDRAW API: Seller profile not found")
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 })
    }

    // Get proposal first to verify access
    console.log("🔍 WITHDRAW API: Fetching proposal:", proposalId)
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .eq("seller_id", sellerProfile.id)
      .single()

    console.log("🔍 WITHDRAW API: Proposal result:", {
      proposal: proposal?.id,
      status: proposal?.status,
      error: proposalError,
    })

    if (proposalError || !proposal) {
      console.log("🔍 WITHDRAW API: Proposal not found or access denied")
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    // Check if proposal can be withdrawn
    const allowedStatuses = ["DRAFT", "SUBMITTED", "UNDER_REVIEW"]
    if (!allowedStatuses.includes(proposal.status)) {
      console.log("🔍 WITHDRAW API: Invalid status for withdrawal:", proposal.status)
      return NextResponse.json(
        {
          error: `Cannot withdraw proposal with status: ${proposal.status}`,
        },
        { status: 403 },
      )
    }

    // Parse request body
    let withdrawalReason = null
    try {
      const body = await request.json()
      withdrawalReason = body.withdrawal_reason || null
      console.log("🔍 WITHDRAW API: Withdrawal reason:", withdrawalReason)
    } catch (bodyError) {
      console.log("🔍 WITHDRAW API: No body provided, continuing without reason")
    }

    // Try the update with more specific conditions
    console.log("🔍 WITHDRAW API: Updating proposal with withdrawal data...")
    const updateData = {
      status: "WITHDRAWN",
      withdrawn_at: new Date().toISOString(),
      withdrawal_reason: withdrawalReason,
      updated_at: new Date().toISOString(),
    }

    console.log("🔍 WITHDRAW API: Update data:", updateData)

    // Use a more specific update query
    const { data: updatedProposal, error: updateError } = await supabase
      .from("proposals")
      .update(updateData)
      .eq("id", proposalId)
      .eq("seller_id", sellerProfile.id) // Add this condition to match RLS
      .select("*")
      .single()

    console.log("🔍 WITHDRAW API: Update result:", {
      proposal: updatedProposal?.id,
      status: updatedProposal?.status,
      error: updateError,
    })

    if (updateError) {
      console.error("🔍 WITHDRAW API: Update failed:", updateError)

      // Try a simpler update without the withdrawal columns first
      console.log("🔍 WITHDRAW API: Trying simpler update...")
      const { data: simpleUpdate, error: simpleError } = await supabase
        .from("proposals")
        .update({ status: "WITHDRAWN", updated_at: new Date().toISOString() })
        .eq("id", proposalId)
        .eq("seller_id", sellerProfile.id)
        .select("*")
        .single()

      if (simpleError) {
        console.error("🔍 WITHDRAW API: Simple update also failed:", simpleError)
        return NextResponse.json(
          {
            error: "Failed to withdraw proposal",
            details: updateError.message,
            simpleError: simpleError.message,
          },
          { status: 500 },
        )
      }

      console.log("🔍 WITHDRAW API: Simple update succeeded, now adding withdrawal fields...")
      // If simple update worked, try to add withdrawal fields
      const { data: finalUpdate, error: finalError } = await supabase
        .from("proposals")
        .update({
          withdrawn_at: new Date().toISOString(),
          withdrawal_reason: withdrawalReason,
        })
        .eq("id", proposalId)
        .eq("seller_id", sellerProfile.id)
        .select("*")
        .single()

      if (finalError) {
        console.log("🔍 WITHDRAW API: Withdrawal fields update failed, but status was updated")
      }

      return NextResponse.json({
        success: true,
        proposal: finalUpdate || simpleUpdate,
        message: "Proposal withdrawn successfully",
        note: finalError ? "Status updated but withdrawal fields may not be saved" : undefined,
      })
    }

    console.log("🔍 WITHDRAW API: Withdrawal successful!")
    return NextResponse.json({
      success: true,
      proposal: updatedProposal,
      message: "Proposal withdrawn successfully",
    })
  } catch (error: any) {
    console.error("🔍 WITHDRAW API: Unexpected error:", error)
    console.error("🔍 WITHDRAW API: Error stack:", error.stack)

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
