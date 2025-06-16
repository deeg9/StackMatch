import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 DEBUG API: Starting debug endpoint")

  try {
    const proposalId = params.id
    console.log("🔍 DEBUG API: Proposal ID:", proposalId)

    console.log("🔍 DEBUG API: Creating Supabase client with cookies...")
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    console.log("🔍 DEBUG API: Supabase client created successfully")

    // Test auth
    console.log("🔍 DEBUG API: Getting user...")
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    console.log("🔍 DEBUG API: Auth result:", { userId: user?.id, error: userError?.message })

    if (!user) {
      return NextResponse.json({
        debug: "No authenticated user",
        proposalId,
        timestamp: new Date().toISOString(),
      })
    }

    // Test seller profile fetch
    console.log("🔍 DEBUG API: Fetching seller profile...")
    const { data: sellerProfile, error: sellerError } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    console.log("🔍 DEBUG API: Seller profile result:", { profile: sellerProfile?.id, error: sellerError?.message })

    // Test proposal fetch
    console.log("🔍 DEBUG API: Fetching proposal...")
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .select("id, status, seller_id")
      .eq("id", proposalId)
      .single()

    console.log("🔍 DEBUG API: Proposal result:", {
      proposal: proposal?.id,
      status: proposal?.status,
      sellerId: proposal?.seller_id,
      error: proposalError?.message,
    })

    const canAccess = proposal?.seller_id === sellerProfile?.id
    console.log("🔍 DEBUG API: Access check:", {
      proposalSellerId: proposal?.seller_id,
      userSellerProfileId: sellerProfile?.id,
      canAccess,
    })

    return NextResponse.json({
      debug: "Debug endpoint working",
      proposalId,
      userId: user.id,
      sellerProfileId: sellerProfile?.id,
      proposalStatus: proposal?.status,
      proposalSellerId: proposal?.seller_id,
      canAccess,
      timestamp: new Date().toISOString(),
      errors: {
        userError: userError?.message,
        sellerError: sellerError?.message,
        proposalError: proposalError?.message,
      },
    })
  } catch (error: any) {
    console.error("🔍 DEBUG API: Error:", error)
    return NextResponse.json(
      {
        debug: "Error in debug endpoint",
        error: getErrorMessage(error),
        stack: getErrorStack(error),
      },
      { status: 500 },
    )
  }
}
