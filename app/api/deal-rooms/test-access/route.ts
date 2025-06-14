import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedSupabaseClient } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest) {
  try {
    console.log("[TEST] 🧪 TESTING DEAL ROOM ACCESS...")

    // 1. Get authenticated user
    const authResult = await getAuthenticatedSupabaseClient(request)
    if (authResult.error) {
      return NextResponse.json({ error: "Authentication failed", details: authResult.error }, { status: 401 })
    }

    const { supabase, user } = authResult
    const dealRoomId = "15dcb8b3-2a2d-435b-b559-1f199e653034" // Your test deal room

    console.log(`[TEST] 🧪 Testing access for user ${user.id} to deal room ${dealRoomId}`)

    // 2. Test the NEW participant-based access check
    const { data: participations, error: participationError } = await supabase
      .from("deal_room_participants")
      .select("role, joined_at")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)

    console.log("[TEST] 🧪 Participation check result:", { participations, participationError })

    // 3. Test the OLD buyer/seller direct check (for comparison)
    const { data: dealRoom, error: dealRoomError } = await supabase
      .from("deal_rooms")
      .select("buyer_id, seller_id, room_name, status")
      .eq("id", dealRoomId)
      .single()

    console.log("[TEST] 🧪 Deal room direct check:", { dealRoom, dealRoomError })

    // 4. Determine access methods
    const hasParticipantAccess = participations && participations.length > 0
    const isBuyerDirect = dealRoom?.buyer_id === user.id
    const isSellerDirect = dealRoom?.seller_id === user.id
    const hasDirectAccess = isBuyerDirect || isSellerDirect

    // 5. Test results
    const testResults = {
      user: {
        id: user.id,
        email: user.email,
      },
      dealRoom: {
        id: dealRoomId,
        name: dealRoom?.room_name,
        status: dealRoom?.status,
        buyerId: dealRoom?.buyer_id,
        sellerId: dealRoom?.seller_id,
      },
      accessChecks: {
        participantBased: {
          hasAccess: hasParticipantAccess,
          records: participations,
          error: participationError?.message,
        },
        directBuyerSeller: {
          hasAccess: hasDirectAccess,
          isBuyer: isBuyerDirect,
          isSeller: isSellerDirect,
        },
      },
      recommendation: hasParticipantAccess
        ? "✅ USE PARTICIPANT-BASED ACCESS - Working correctly!"
        : hasDirectAccess
          ? "⚠️ FALLBACK TO DIRECT ACCESS - Participant record missing"
          : "❌ NO ACCESS - User not authorized",
    }

    console.log("[TEST] 🧪 Test completed:", testResults)

    return NextResponse.json({
      success: true,
      testResults,
      nextStep: hasParticipantAccess
        ? "Try accessing the deal room page - it should work now!"
        : "Need to create participant record for this user",
    })
  } catch (error) {
    console.error("[TEST] 🧪 Test failed:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
