import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { authenticateUser } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const dealRoomId = params.id
  const url = new URL(request.url)
  const debugMode = url.searchParams.get("debug") === "true"

  console.log(`🔍 FILES DEBUG: Starting debug analysis for deal room: ${dealRoomId}`)

  const debugResults = {
    dealRoomId,
    timestamp: new Date().toISOString(),
    debugMode,
    steps: {} as Record<string, any>,
    files: [] as any[],
    success: false,
    errors: [] as string[],
  }

  try {
    // Step 1: Authentication
    console.log(`🔍 FILES DEBUG: Step 1 - Authentication`)
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { user, error: authError } = await authenticateUser(supabase)

    if (authError || !user) {
      debugResults.steps.authentication = {
        success: false,
        error: authError || "No user found",
        timestamp: new Date().toISOString(),
      }
      debugResults.errors.push(`Authentication failed: ${authError || "No user"}`)
      return NextResponse.json(debugResults, { status: 401 })
    }

    debugResults.steps.authentication = {
      success: true,
      userId: user.id,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
    }

    // Step 2: Deal room verification
    console.log(`🔍 FILES DEBUG: Step 2 - Deal room verification`)
    try {
      const { data: dealRoom, error: dealRoomError } = await supabase
        .from("deal_rooms")
        .select("*, listing_id, proposal_id")
        .eq("id", dealRoomId)
        .single()

      if (dealRoomError || !dealRoom) {
        debugResults.steps.dealRoomVerification = {
          success: false,
          error: dealRoomError?.message || "Deal room not found",
          timestamp: new Date().toISOString(),
        }
        debugResults.errors.push(`Deal room error: ${dealRoomError?.message || "Not found"}`)
        return NextResponse.json(debugResults, { status: 404 })
      }

      debugResults.steps.dealRoomVerification = {
        success: true,
        dealRoom: dealRoom,
        listingId: dealRoom.listing_id,
        proposalId: dealRoom.proposal_id,
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      debugResults.steps.dealRoomVerification = {
        success: false,
        error: getErrorMessage(error),
        timestamp: new Date().toISOString(),
      }
      debugResults.errors.push(`Deal room verification error: ${getErrorMessage(error)}`)
      return NextResponse.json(debugResults, { status: 500 })
    }

    // Step 3: Participant verification
    console.log(`🔍 FILES DEBUG: Step 3 - Participant verification`)
    try {
      const { data: participant, error: participantError } = await supabase
        .from("deal_room_participants")
        .select("*")
        .eq("deal_room_id", dealRoomId)
        .eq("user_id", user.id)
        .single()

      if (participantError || !participant) {
        debugResults.steps.participantVerification = {
          success: false,
          error: participantError?.message || "User is not a participant",
          timestamp: new Date().toISOString(),
        }
        debugResults.errors.push(`Participant error: ${participantError?.message || "Not a participant"}`)
        return NextResponse.json(debugResults, { status: 403 })
      }

      debugResults.steps.participantVerification = {
        success: true,
        participant: participant,
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      debugResults.steps.participantVerification = {
        success: false,
        error: getErrorMessage(error),
        timestamp: new Date().toISOString(),
      }
      debugResults.errors.push(`Participant verification error: ${getErrorMessage(error)}`)
      return NextResponse.json(debugResults, { status: 500 })
    }

    // Step 4: Query native deal room files
    console.log(`🔍 FILES DEBUG: Step 4 - Query native deal room files`)
    try {
      const { data: dealRoomFiles, error: filesError } = await supabase
        .from("deal_room_files")
        .select("*, uploader:uploader_id(id, full_name, email, avatar_url)")
        .eq("deal_room_id", dealRoomId)
        .eq("is_latest", true)
        .order("created_at", { ascending: false })

      debugResults.steps.nativeFiles = {
        success: !filesError,
        error: filesError?.message,
        count: dealRoomFiles?.length || 0,
        files: dealRoomFiles || [],
        timestamp: new Date().toISOString(),
      }

      if (filesError) {
        debugResults.errors.push(`Native files error: ${filesError.message}`)
      }
    } catch (error: any) {
      debugResults.steps.nativeFiles = {
        success: false,
        error: getErrorMessage(error),
        timestamp: new Date().toISOString(),
      }
      debugResults.errors.push(`Native files query error: ${getErrorMessage(error)}`)
    }

    // Step 5: Query listing files (if listing_id exists)
    const listingId = debugResults.steps.dealRoomVerification?.listingId
    if (listingId) {
      console.log(`🔍 FILES DEBUG: Step 5 - Query listing files for listing: ${listingId}`)
      try {
        // First, try to get just basic listing info
        const { data: listing, error: listingError } = await supabase
          .from("listings")
          .select("id, title, created_at, buyer_id")
          .eq("id", listingId)
          .single()

        if (listingError) {
          debugResults.steps.listingBasic = {
            success: false,
            error: listingError.message,
            timestamp: new Date().toISOString(),
          }
          debugResults.errors.push(`Listing basic query error: ${listingError.message}`)
        } else {
          debugResults.steps.listingBasic = {
            success: true,
            listing: listing,
            timestamp: new Date().toISOString(),
          }

          // Now try to get attachments column specifically
          try {
            const { data: listingWithAttachments, error: attachmentsError } = await supabase
              .from("listings")
              .select("attachments")
              .eq("id", listingId)
              .single()

            debugResults.steps.listingAttachments = {
              success: !attachmentsError,
              error: attachmentsError?.message,
              attachments: listingWithAttachments?.attachments,
              attachmentsType: typeof listingWithAttachments?.attachments,
              timestamp: new Date().toISOString(),
            }

            if (attachmentsError) {
              debugResults.errors.push(`Listing attachments error: ${attachmentsError.message}`)
            }
          } catch (error: any) {
            debugResults.steps.listingAttachments = {
              success: false,
              error: getErrorMessage(error),
              timestamp: new Date().toISOString(),
            }
            debugResults.errors.push(`Listing attachments query error: ${getErrorMessage(error)}`)
          }
        }
      } catch (error: any) {
        debugResults.steps.listingBasic = {
          success: false,
          error: getErrorMessage(error),
          timestamp: new Date().toISOString(),
        }
        debugResults.errors.push(`Listing basic query error: ${getErrorMessage(error)}`)
      }
    } else {
      debugResults.steps.listingFiles = {
        success: true,
        message: "No listing ID associated with deal room",
        timestamp: new Date().toISOString(),
      }
    }

    // Step 6: Query proposal files (if proposal_id exists)
    const proposalId = debugResults.steps.dealRoomVerification?.proposalId
    if (proposalId) {
      console.log(`🔍 FILES DEBUG: Step 6 - Query proposal files for proposal: ${proposalId}`)
      try {
        const { data: proposal, error: proposalError } = await supabase
          .from("proposals")
          .select("id, created_at, seller_id, attachments")
          .eq("id", proposalId)
          .single()

        debugResults.steps.proposalFiles = {
          success: !proposalError,
          error: proposalError?.message,
          proposal: proposal,
          attachments: proposal?.attachments,
          attachmentsType: typeof proposal?.attachments,
          timestamp: new Date().toISOString(),
        }

        if (proposalError) {
          debugResults.errors.push(`Proposal files error: ${proposalError.message}`)
        }
      } catch (error: any) {
        debugResults.steps.proposalFiles = {
          success: false,
          error: getErrorMessage(error),
          timestamp: new Date().toISOString(),
        }
        debugResults.errors.push(`Proposal files query error: ${getErrorMessage(error)}`)
      }
    } else {
      debugResults.steps.proposalFiles = {
        success: true,
        message: "No proposal ID associated with deal room",
        timestamp: new Date().toISOString(),
      }
    }

    debugResults.success = debugResults.errors.length === 0

    console.log(`🔍 FILES DEBUG: Debug analysis completed. Success: ${debugResults.success}`)
    console.log(`🔍 FILES DEBUG: Errors: ${debugResults.errors.length}`)

    return NextResponse.json(debugResults)
  } catch (error: any) {
    console.error(`🔍 FILES DEBUG: Unhandled error:`, error)
    debugResults.errors.push(`Unhandled error: ${getErrorMessage(error)}`)
    debugResults.steps.unhandledError = {
      success: false,
      error: getErrorMessage(error),
      stack: getErrorStack(error),
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(debugResults, { status: 500 })
  }
}
