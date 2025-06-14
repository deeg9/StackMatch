import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  console.log("🔍 API DEBUG: Test endpoint reached")

  try {
    const supabase = createClient()

    // Test authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication failed", details: authError?.message }, { status: 401 })
    }

    console.log("🔍 TEST API: User authenticated:", user.email)

    // Test if deal_rooms table exists and check its structure
    const { data: tableInfo, error: tableError } = await supabase.from("deal_rooms").select("*").limit(1)

    if (tableError) {
      console.error("🔍 TEST API: Error accessing deal_rooms table:", tableError)
      return NextResponse.json(
        {
          error: "Cannot access deal_rooms table",
          details: tableError.message,
          code: tableError.code,
        },
        { status: 500 },
      )
    }

    console.log("🔍 TEST API: deal_rooms table accessible")

    // Test if we can create a simple deal room record
    const testDealRoom = {
      listing_id: "test-listing-id",
      proposal_id: "test-proposal-id",
      buyer_id: user.id,
      seller_id: "test-seller-id",
      status: "ACTIVE",
      room_name: "Test Deal Room",
      created_at: new Date().toISOString(),
    }

    console.log("🔍 TEST API: Attempting to create test deal room:", testDealRoom)

    const { data: newDealRoom, error: createError } = await supabase
      .from("deal_rooms")
      .insert(testDealRoom)
      .select("id")
      .single()

    if (createError) {
      console.error("🔍 TEST API: Error creating test deal room:", createError)
      return NextResponse.json(
        {
          error: "Failed to create test deal room",
          details: createError.message,
          code: createError.code,
          hint: createError.hint,
        },
        { status: 500 },
      )
    }

    console.log("🔍 TEST API: Test deal room created:", newDealRoom)

    // Clean up - delete the test record
    const { error: deleteError } = await supabase.from("deal_rooms").delete().eq("id", newDealRoom.id)

    if (deleteError) {
      console.error("🔍 TEST API: Error deleting test deal room:", deleteError)
    }

    return NextResponse.json({
      success: true,
      message: "Deal room creation test passed",
      user: user.email,
      testDealRoomId: newDealRoom.id,
    })
  } catch (error: any) {
    console.error("🔍 TEST API: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Unexpected error in test",
        details: getErrorMessage(error),
        stack: getErrorStack(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  console.log("🔍 API DEBUG: Test POST endpoint reached")
  return NextResponse.json({ message: "Deal rooms POST API is working", timestamp: new Date().toISOString() })
}
