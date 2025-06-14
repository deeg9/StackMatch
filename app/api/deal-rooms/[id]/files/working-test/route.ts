export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log("🟢 WORKING TEST: Starting working files test")
  console.log("🟢 WORKING TEST: Deal room ID:", params.id)

  try {
    // Step 1: Environment (we know this works)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    console.log("🟢 WORKING TEST: Environment variables loaded")

    // Step 2: Create client (we know this works)
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log("🟢 WORKING TEST: Supabase client created")

    // Step 3: Check if deal room exists
    console.log("🟢 WORKING TEST: Checking if deal room exists")
    const { data: dealRoom, error: dealRoomError } = await supabase
      .from("deal_rooms")
      .select("id, listing_id, proposal_id")
      .eq("id", params.id)
      .single()

    console.log("🟢 WORKING TEST: Deal room query completed")
    console.log("🟢 WORKING TEST: Deal room error:", dealRoomError)
    console.log("🟢 WORKING TEST: Deal room data:", dealRoom)

    if (dealRoomError) {
      console.log("🟢 WORKING TEST: Deal room not found or error occurred")
      return new Response(
        JSON.stringify({
          success: false,
          error: "Deal room not found",
          details: dealRoomError.message,
          dealRoomId: params.id,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Step 4: Try to get deal room files
    console.log("🟢 WORKING TEST: Querying deal room files")
    const { data: files, error: filesError } = await supabase
      .from("deal_room_files")
      .select("*")
      .eq("deal_room_id", params.id)

    console.log("🟢 WORKING TEST: Files query completed")
    console.log("🟢 WORKING TEST: Files error:", filesError)
    console.log("🟢 WORKING TEST: Files count:", files?.length || 0)

    // Step 5: Try to get listing if it exists
    let listingFiles = []
    if (dealRoom.listing_id) {
      console.log("🟢 WORKING TEST: Querying listing for attachments")
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .select("attachments, title")
        .eq("id", dealRoom.listing_id)
        .single()

      console.log("🟢 WORKING TEST: Listing query completed")
      console.log("🟢 WORKING TEST: Listing error:", listingError)
      console.log("🟢 WORKING TEST: Listing attachments:", listing?.attachments)

      if (!listingError && listing?.attachments) {
        console.log("🟢 WORKING TEST: Processing listing attachments")
        try {
          const attachments = Array.isArray(listing.attachments) ? listing.attachments : [listing.attachments]
          listingFiles = attachments.map((att: any, index: number) => ({
            id: `listing-${index}`,
            name: att.name || `Attachment ${index + 1}`,
            source: "listing",
            inherited: true,
          }))
          console.log("🟢 WORKING TEST: Processed listing files:", listingFiles.length)
        } catch (error: any) {
          console.log("🟢 WORKING TEST: Error processing listing attachments:", getErrorMessage(error))
        }
      }
    }

    // Step 6: Return results
    const allFiles = [
      ...(files || []).map((f: any) => ({
        id: f.id,
        name: f.file_name,
        source: "deal_room",
        inherited: false,
      })),
      ...listingFiles,
    ]

    console.log("🟢 WORKING TEST: Returning", allFiles.length, "total files")

    return new Response(
      JSON.stringify({
        success: true,
        dealRoomId: params.id,
        dealRoom: {
          id: dealRoom.id,
          listing_id: dealRoom.listing_id,
          proposal_id: dealRoom.proposal_id,
        },
        files: allFiles,
        summary: {
          totalFiles: allFiles.length,
          dealRoomFiles: files?.length || 0,
          listingFiles: listingFiles.length,
        },
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("🟢 WORKING TEST: Unexpected error:", getErrorMessage(error))
    console.error("🟢 WORKING TEST: Error stack:", getErrorStack(error))

    return new Response(
      JSON.stringify({
        success: false,
        error: getErrorMessage(error),
        stack: getErrorStack(error),
        dealRoomId: params.id,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
