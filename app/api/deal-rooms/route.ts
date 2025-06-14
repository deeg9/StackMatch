import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  console.log("🔍 DEAL ROOMS API: Starting...")

  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("Authorization")
    console.log("🔍 DEAL ROOMS API: Auth header present:", !!authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🔍 DEAL ROOMS API: Missing or invalid Authorization header")
      return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    // Validate token format
    const tokenParts = token.split(".")
    if (tokenParts.length !== 3) {
      console.log("🔍 DEAL ROOMS API: Invalid token format, parts:", tokenParts.length)
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
    }

    console.log("🔍 DEAL ROOMS API: Token format valid, creating Supabase client...")

    // Create Supabase client with the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    )

    // Get the user from the token
    console.log("🔍 DEAL ROOMS API: Getting user from token...")
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError) {
      console.log("🔍 DEAL ROOMS API: Error getting user from token:", userError.message)
      return NextResponse.json({ error: "Invalid token", details: userError.message }, { status: 401 })
    }

    if (!user) {
      console.log("🔍 DEAL ROOMS API: No user found for token")
      return NextResponse.json({ error: "No user found for token" }, { status: 401 })
    }

    console.log("🔍 DEAL ROOMS API: User authenticated:", user.id)

    // Get URL parameters
    const url = new URL(request.url)
    const status = url.searchParams.get("status") || "all"
    const sortBy = url.searchParams.get("sortBy") || "created_at"
    const sortOrder = url.searchParams.get("sortOrder") || "desc"

    // Build query
    let query = supabase.from("deal_rooms").select(`
        id,
        listing_id,
        proposal_id,
        buyer_id,
        seller_id,
        status,
        created_at,
        completed_at,
        room_name
      `)

    // Check if deal_rooms table exists and has the expected columns
    const { data: tableInfo, error: tableError } = await supabase.from("deal_rooms").select("id").limit(1)

    if (tableError) {
      console.error("🔍 DEAL ROOMS API: Error checking deal_rooms table:", tableError.message)
      return NextResponse.json({ error: "Database error", details: tableError.message }, { status: 500 })
    }

    console.log("🔍 DEAL ROOMS API: Deal rooms table exists and is accessible")

    // Apply user filter - user must be either buyer or seller
    query = query.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)

    // Apply status filter if not "all"
    if (status !== "all") {
      query = query.eq("status", status)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // Execute query
    console.log(`🔍 DEAL ROOMS API: Fetching deal rooms for user ${user.id}...`)
    const { data: dealRooms, error: dealRoomsError } = await query

    if (dealRoomsError) {
      console.error("🔍 DEAL ROOMS API: Error fetching deal rooms:", dealRoomsError.message)
      return NextResponse.json(
        { error: "Failed to fetch deal rooms", details: dealRoomsError.message },
        { status: 500 },
      )
    }

    console.log(`🔍 DEAL ROOMS API: Found ${dealRooms?.length || 0} deal rooms`)

    // Debug: Check if any deal rooms match the user ID
    if (dealRooms && dealRooms.length > 0) {
      console.log("🔍 DEAL ROOMS API: First deal room:", {
        id: dealRooms[0].id,
        buyer_id: dealRooms[0].buyer_id,
        seller_id: dealRooms[0].seller_id,
        matches_user: dealRooms[0].buyer_id === user.id || dealRooms[0].seller_id === user.id,
      })
    } else {
      console.log("🔍 DEAL ROOMS API: No deal rooms found for this user")

      // Debug: Check if there are any deal rooms at all
      const { data: allDealRooms, error: allError } = await supabase
        .from("deal_rooms")
        .select("id, buyer_id, seller_id")
        .limit(5)

      if (allError) {
        console.log("🔍 DEAL ROOMS API: Error checking all deal rooms:", allError.message)
      } else {
        console.log(`🔍 DEAL ROOMS API: Found ${allDealRooms?.length || 0} total deal rooms in system`)
        if (allDealRooms && allDealRooms.length > 0) {
          console.log("🔍 DEAL ROOMS API: Sample deal room:", allDealRooms[0])
        }
      }
    }

    return NextResponse.json(dealRooms || [])
  } catch (error) {
    console.error("🔍 DEAL ROOMS API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
