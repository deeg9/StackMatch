import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: savedListings, error } = await supabase
      .from("saved_listings")
      .select(`
        id,
        saved_at,
        listing:listings(
          id,
          title,
          description,
          budget_min,
          budget_max,
          bid_deadline,
          location_preference,
          tags,
          status,
          buyer:profiles!buyer_id(company_name, full_name)
        )
      `)
      .eq("seller_id", user.id)
      .order("saved_at", { ascending: false })

    if (error) {
      console.error("Error fetching saved listings:", error)
      return NextResponse.json({ error: "Failed to fetch saved listings" }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedListings = savedListings.map((saved: any) => ({
      id: saved.listing?.id,
      companyName: saved.listing?.buyer?.company_name || saved.listing?.buyer?.full_name || "Unknown Company",
      title: saved.listing?.title,
      budget:
        saved.listing?.budget_min && saved.listing?.budget_max
          ? `$${saved.listing.budget_min.toLocaleString()} - $${saved.listing.budget_max.toLocaleString()}`
          : "Budget not specified",
      deadline: saved.listing?.bid_deadline ? new Date(saved.listing.bid_deadline).toLocaleDateString() : "No deadline",
      location: saved.listing?.location_preference || "Remote",
      tags: saved.listing?.tags || [],
      savedAt: saved.saved_at,
    }))

    return NextResponse.json({ savedListings: transformedListings })
  } catch (error) {
    console.error("Error in saved listings GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { listing_id } = body

    if (!listing_id) {
      return NextResponse.json({ error: "listing_id is required" }, { status: 400 })
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from("saved_listings")
      .select("id")
      .eq("seller_id", user.id)
      .eq("listing_id", listing_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Listing already saved" }, { status: 409 })
    }

    // Save the listing
    const { data: savedListing, error } = await supabase
      .from("saved_listings")
      .insert({
        seller_id: user.id,
        listing_id: listing_id,
      })
      .select(`
        id,
        saved_at,
        listing:listings(
          id,
          title,
          description,
          budget_min,
          budget_max,
          bid_deadline,
          location_preference,
          tags,
          status,
          buyer:profiles!buyer_id(company_name, full_name)
        )
      `)
      .single()

    if (error) {
      console.error("Error saving listing:", error)
      return NextResponse.json({ error: "Failed to save listing" }, { status: 500 })
    }

    // Transform the data
    const transformedListing = {
      id: savedListing.listing?.id,
      companyName:
        savedListing.listing?.buyer?.company_name || savedListing.listing?.buyer?.full_name || "Unknown Company",
      title: savedListing.listing?.title,
      budget:
        savedListing.listing?.budget_min && savedListing.listing?.budget_max
          ? `$${savedListing.listing.budget_min.toLocaleString()} - $${savedListing.listing.budget_max.toLocaleString()}`
          : "Budget not specified",
      deadline: savedListing.listing?.bid_deadline
        ? new Date(savedListing.listing.bid_deadline).toLocaleDateString()
        : "No deadline",
      location: savedListing.listing?.location_preference || "Remote",
      tags: savedListing.listing?.tags || [],
      savedAt: savedListing.saved_at,
    }

    return NextResponse.json({ savedListing: transformedListing }, { status: 201 })
  } catch (error) {
    console.error("Error in saved listings POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
