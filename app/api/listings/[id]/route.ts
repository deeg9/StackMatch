import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 LISTINGS [ID] API: Starting GET request for listing:", params.id)

  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      console.error("🔍 LISTINGS [ID] API: Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔍 LISTINGS [ID] API: User authenticated:", user.id)

    // First fetch the listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select(`
    id,
    title,
    description,
    budget_min,
    budget_max,
    project_duration,
    status,
    required_skills,
    buyer_id,
    created_at,
    updated_at,
    category_id,
    bid_deadline,
    project_start_date,
    location_preference,
    remote_preference,
    about_company,
    about_business,
    success_metrics,
    current_challenges,
    timeline_phases
  `)
      .eq("id", params.id)
      .single()

    if (listingError) {
      console.error("🔍 LISTINGS [ID] API: Database error:", listingError)
      return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
    }

    if (!listing) {
      console.log("🔍 LISTINGS [ID] API: Listing not found")
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    console.log("🔍 LISTINGS [ID] API: Listing found:", listing.id)

    // Now fetch the buyer profile separately
    let buyerProfile = null
    if (listing.buyer_id) {
      console.log("🔍 LISTINGS [ID] API: Fetching buyer profile for:", listing.buyer_id)

      // First get the profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", listing.buyer_id)
        .single()

      if (profile && !profileError) {
        // Then get the buyer_profile
        const { data: buyerProfileData, error: buyerProfileError } = await supabase
          .from("buyer_profiles")
          .select("*")
          .eq("user_id", listing.buyer_id)
          .single()

        if (buyerProfileData && !buyerProfileError) {
          buyerProfile = {
            company_name: profile.company_name || buyerProfileData.company_name,
            company_logo_url: buyerProfileData.company_logo_url,
            industry: buyerProfileData.industry,
            company_size: buyerProfileData.company_size,
            full_name: profile.full_name,
            email: profile.email,
          }
        }
      }
    }

    console.log("🔍 LISTINGS [ID] API: Buyer profile:", buyerProfile ? "found" : "not found")

    return NextResponse.json({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      budget_min: listing.budget_min,
      budget_max: listing.budget_max,
      timeline: listing.project_duration, // Map project_duration to timeline for frontend compatibility
      status: listing.status,
      skills: listing.required_skills || [],
      buyer_profile: buyerProfile,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
      // Add other fields that might be needed
      category_id: listing.category_id,
      bid_deadline: listing.bid_deadline,
      project_start_date: listing.project_start_date,
      project_duration: listing.project_duration,
      location_preference: listing.location_preference,
      remote_preference: listing.remote_preference,
      about_company: listing.about_company,
      about_business: listing.about_business,
      success_metrics: listing.success_metrics,
      current_challenges: listing.current_challenges,
      timeline_phases: listing.timeline_phases,
    })
  } catch (error) {
    console.error("🔍 LISTINGS [ID] API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      console.error("Error updating listing:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listingId = params.id

    const { data: existingListing, error: fetchError } = await supabase
      .from("listings")
      .select("buyer_id, published_at")
      .eq("id", listingId)
      .single()

    if (fetchError || !existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }
    if (existingListing.buyer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      categoryId,
      status,
      budgetMin,
      budgetMax,
      bidDeadline,
      projectStartDate,
      projectDuration,
      requiredSkills,
      locationPreference,
      remotePreference,
      aboutCompany,
      aboutBusiness,
      attachments,
      successMetrics,
      currentChallenges,
      timelinePhases,
      detailedNeeds = [], // Renamed from requirements for consistency with POST
    } = body

    const { error: updateError } = await supabase
      .from("listings")
      .update({
        title,
        description,
        category_id: categoryId,
        status,
        budget_min: budgetMin,
        budget_max: budgetMax,
        bid_deadline: bidDeadline,
        project_start_date: projectStartDate,
        project_duration: projectDuration,
        required_skills: requiredSkills,
        location_preference: locationPreference,
        remote_preference: remotePreference,
        about_company: aboutCompany,
        about_business: aboutBusiness,
        attachments,
        success_metrics: successMetrics,
        current_challenges: currentChallenges,
        timeline_phases: timelinePhases,
        updated_at: new Date().toISOString(),
        published_at:
          status === "ACTIVE" && !existingListing.published_at
            ? new Date().toISOString()
            : existingListing.published_at,
      })
      .eq("id", listingId)

    if (updateError) {
      console.error("Error updating listing:", updateError)
      return NextResponse.json({ error: "Failed to update listing", details: getErrorMessage(updateError) }, { status: 500 })
    }

    // Handle detailedNeeds (listing_requirements)
    // Simple approach: delete existing and insert new ones.
    // For more complex scenarios, you might want to diff and update/insert/delete.
    await supabase.from("listing_requirements").delete().eq("listing_id", listingId)
    if (detailedNeeds.length > 0) {
      const requirementsToInsert = detailedNeeds.map((req: any, index: number) => ({
        listing_id: listingId,
        requirement: req.requirement || req.description || req.title,
        priority: req.priority || "medium",
        order_index: index,
      }))
      const { error: reqError } = await supabase.from("listing_requirements").insert(requirementsToInsert)
      if (reqError) {
        console.error("Error updating listing requirements:", reqError)
        // Decide if this is a fatal error for the PUT request
      }
    }

    // Fetch the fully updated listing to return
    const { data: updatedListingData } = await supabase
      .from("listings")
      .select(`*, project_categories (name, slug), listing_requirements (*)`)
      .eq("id", listingId)
      .single()

    return NextResponse.json({ listing: updatedListingData, message: "Listing updated successfully" })
  } catch (error: any) {
    console.error("Error updating listing:", error)
    return NextResponse.json({ error: "Failed to update listing", details: getErrorMessage(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      console.error("Error deleting listing:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listingId = params.id

    const { data: existingListing, error: fetchError } = await supabase
      .from("listings")
      .select("buyer_id")
      .eq("id", listingId)
      .single()

    if (fetchError || !existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }
    if (existingListing.buyer_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // First delete related listing_requirements
    const { error: reqDeleteError } = await supabase.from("listing_requirements").delete().eq("listing_id", listingId)

    if (reqDeleteError) {
      console.error("Error deleting listing requirements:", reqDeleteError)
      // Potentially return error if this is critical
    }

    const { error: deleteError } = await supabase.from("listings").delete().eq("id", listingId)

    if (deleteError) {
      console.error("Error deleting listing:", deleteError)
      return NextResponse.json({ error: "Failed to delete listing", details: getErrorMessage(deleteError) }, { status: 500 })
    }

    return NextResponse.json({ message: "Listing deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting listing:", error)
    return NextResponse.json({ error: "Failed to delete listing", details: getErrorMessage(error) }, { status: 500 })
  }
}
