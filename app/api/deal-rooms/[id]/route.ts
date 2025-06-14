import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"

// Helper function to create standardized error responses
function errorResponse(statusCode: number, message: string, details?: string) {
  console.error(`🔍 DEAL ROOM [ID] API: Error ${statusCode}: ${message}`, details ? `Details: ${details}` : "")
  return NextResponse.json({ error: message, details }, { status: statusCode })
}

// Helper function to fetch basic deal room data
async function fetchDealRoom(supabase: any, id: string) {
  console.log("🔍 DEAL ROOM [ID] API: Fetching basic deal room data...")
  const { data, error } = await supabase
    .from("deal_rooms")
    .select(`
      id,
      listing_id,
      proposal_id,
      buyer_id,
      seller_id,
      status,
      room_name,
      created_at,
      completed_at,
      last_activity_at
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("🔍 DEAL ROOM [ID] API: Error fetching deal room:", error.message)
    return { data: null, error }
  }

  console.log("🔍 DEAL ROOM [ID] API: Deal room fetched successfully")
  return { data, error: null }
}

// Helper function to check user access
async function checkUserAccess(supabase: any, dealRoom: any, userId: string) {
  console.log("🔍 DEAL ROOM [ID] API: Checking user access...")

  // Check if user is buyer or seller
  if (dealRoom.buyer_id === userId || dealRoom.seller_id === userId) {
    console.log("🔍 DEAL ROOM [ID] API: User has access as buyer/seller")
    return true
  }

  // Check if user is a participant
  const { data: participant } = await supabase
    .from("deal_room_participants")
    .select("id")
    .eq("deal_room_id", dealRoom.id)
    .eq("user_id", userId)
    .single()

  const hasAccess = !!participant
  console.log("🔍 DEAL ROOM [ID] API: User access check result:", hasAccess)
  return hasAccess
}

// Helper function to fetch listing data
async function fetchListing(supabase: any, listingId: string | null) {
  if (!listingId) {
    console.log("🔍 DEAL ROOM [ID] API: No listing ID provided")
    return null
  }

  console.log("🔍 DEAL ROOM [ID] API: Fetching listing data...")
  const { data, error } = await supabase
    .from("listings")
    .select(`
      id,
      title,
      description,
      budget_min,
      budget_max,
      timeline,
      buyer_id
    `)
    .eq("id", listingId)
    .single()

  if (error) {
    console.warn("🔍 DEAL ROOM [ID] API: Error fetching listing:", error.message)
    return null
  }

  console.log("🔍 DEAL ROOM [ID] API: Listing fetched successfully")
  return data
}

// Helper function to fetch proposal data
async function fetchProposal(supabase: any, proposalId: string | null) {
  if (!proposalId) {
    console.log("🔍 DEAL ROOM [ID] API: No proposal ID provided")
    return null
  }

  console.log("🔍 DEAL ROOM [ID] API: Fetching proposal data...")
  const { data, error } = await supabase
    .from("proposals")
    .select(`
      id,
      cover_letter,
      technical_approach,
      proposed_budget,
      proposed_timeline,
      seller_id
    `)
    .eq("id", proposalId)
    .single()

  if (error) {
    console.warn("🔍 DEAL ROOM [ID] API: Error fetching proposal:", error.message)
    return null
  }

  console.log("🔍 DEAL ROOM [ID] API: Proposal fetched successfully")
  return data
}

// Helper function to fetch user profile
async function fetchProfile(supabase: any, userId: string | null) {
  if (!userId) {
    console.log("🔍 DEAL ROOM [ID] API: No user ID provided for profile")
    return null
  }

  console.log("🔍 DEAL ROOM [ID] API: Fetching profile for user:", userId)
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      company_name,
      avatar_url,
      email
    `)
    .eq("id", userId)
    .single()

  if (error) {
    console.warn("🔍 DEAL ROOM [ID] API: Error fetching profile:", error.message)
    return {
      id: userId,
      full_name: "Unknown User",
      company_name: "Unknown Company",
      avatar_url: null,
      email: "unknown@example.com",
    }
  }

  console.log("🔍 DEAL ROOM [ID] API: Profile fetched successfully")
  return data
}

// Helper function to fetch participants
async function fetchParticipants(supabase: any, dealRoomId: string) {
  console.log("🔍 DEAL ROOM [ID] API: Fetching participants...")
  const { data, error } = await supabase
    .from("deal_room_participants")
    .select(`
      id,
      user_id,
      role,
      joined_at
    `)
    .eq("deal_room_id", dealRoomId)

  if (error) {
    console.warn("🔍 DEAL ROOM [ID] API: Error fetching participants:", error.message)
    return []
  }

  // Fetch user data for each participant
  if (data && data.length > 0) {
    const userIds = data.map((p: any) => p.user_id)
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        avatar_url
      `)
      .in("id", userIds)

    if (usersError) {
      console.warn("🔍 DEAL ROOM [ID] API: Error fetching participant users:", usersError.message)
    }

    // Combine participant data with user data
    const participantsWithUsers = data.map((participant: any) => {
      const user = users?.find((u: any) => u.id === participant.user_id)
      const fullName = user?.full_name || "Unknown User"
      const nameParts = fullName.split(" ")

      return {
        ...participant,
        user: {
          first_name: nameParts[0] || "Unknown",
          last_name: nameParts.slice(1).join(" ") || "User",
          email: user?.email || "unknown@example.com",
          avatar_url: user?.avatar_url || null,
          full_name: fullName,
        },
      }
    })

    console.log("🔍 DEAL ROOM [ID] API: Participants fetched successfully, count:", participantsWithUsers.length)
    return participantsWithUsers
  }

  console.log("🔍 DEAL ROOM [ID] API: No participants found")
  return []
}

// Helper function to fetch messages
async function fetchMessages(supabase: any, dealRoomId: string) {
  console.log("🔍 DEAL ROOM [ID] API: Fetching messages...")
  const { data, error } = await supabase
    .from("deal_room_messages")
    .select(`
      id,
      content,
      created_at,
      sender_id,
      sender_type
    `)
    .eq("deal_room_id", dealRoomId)
    .order("created_at", { ascending: true })

  if (error) {
    console.warn("🔍 DEAL ROOM [ID] API: Error fetching messages:", error.message)
    return []
  }

  // Fetch sender data for messages
  if (data && data.length > 0) {
    const senderIds = [...new Set(data.map((m: any) => m.sender_id))]
    const { data: senders, error: sendersError } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        avatar_url
      `)
      .in("id", senderIds)

    if (sendersError) {
      console.warn("🔍 DEAL ROOM [ID] API: Error fetching message senders:", sendersError.message)
    }

    // Combine message data with sender data
    const messagesWithSenders = data.map((message: any) => {
      const sender = senders?.find((s: any) => s.id === message.sender_id)
      const fullName = sender?.full_name || "Unknown User"
      const nameParts = fullName.split(" ")

      return {
        ...message,
        message_type: "text",
        sender: {
          first_name: nameParts[0] || "Unknown",
          last_name: nameParts.slice(1).join(" ") || "User",
          avatar_url: sender?.avatar_url || null,
          full_name: fullName,
        },
      }
    })

    console.log("🔍 DEAL ROOM [ID] API: Messages fetched successfully, count:", messagesWithSenders.length)
    return messagesWithSenders
  }

  console.log("🔍 DEAL ROOM [ID] API: No messages found")
  return []
}

// Helper function to fetch files
async function fetchFiles(supabase: any, dealRoomId: string) {
  console.log("🔍 DEAL ROOM [ID] API: Fetching files...")
  const { data, error } = await supabase
    .from("deal_room_files")
    .select(`
      id,
      file_name,
      file_path,
      file_size_bytes,
      mime_type,
      type,
      description,
      version,
      is_latest,
      created_at,
      uploader_id
    `)
    .eq("deal_room_id", dealRoomId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("🔍 DEAL ROOM [ID] API: Error fetching files:", error.message)
    return []
  }

  console.log("🔍 DEAL ROOM [ID] API: Files fetched successfully, count:", data?.length || 0)
  return data || []
}

// Helper function to fetch milestones
async function fetchMilestones(supabase: any, dealRoomId: string) {
  console.log("🔍 DEAL ROOM [ID] API: Fetching milestones...")

  // First get contracts for this deal room
  const { data: contracts, error: contractsError } = await supabase
    .from("contracts")
    .select("id")
    .eq("deal_room_id", dealRoomId)

  if (contractsError) {
    console.warn("🔍 DEAL ROOM [ID] API: Error fetching contracts:", contractsError.message)
    return []
  }

  if (!contracts || contracts.length === 0) {
    console.log("🔍 DEAL ROOM [ID] API: No contracts found, no milestones to fetch")
    return []
  }

  const contractIds = contracts.map((c: any) => c.id)

  const { data, error } = await supabase
    .from("milestones")
    .select(`
      id,
      contract_id,
      title,
      description,
      due_date,
      status,
      amount,
      is_payment_milestone,
      created_at
    `)
    .in("contract_id", contractIds)
    .order("created_at", { ascending: true })

  if (error) {
    console.warn("🔍 DEAL ROOM [ID] API: Error fetching milestones:", error.message)
    return []
  }

  console.log("🔍 DEAL ROOM [ID] API: Milestones fetched successfully, count:", data?.length || 0)
  return data || []
}

// Helper function to fetch activities
async function fetchActivities(supabase: any, dealRoomId: string) {
  console.log("🔍 DEAL ROOM [ID] API: Fetching activities...")

  // For now, return empty array as activities table might not exist
  // This can be implemented later when the activities table is properly set up
  console.log("🔍 DEAL ROOM [ID] API: Activities feature not yet implemented")
  return []
}

// Helper function to determine user role
function determineUserRole(dealRoom: any, userId: string) {
  if (dealRoom.buyer_id === userId) {
    return "BUYER"
  } else if (dealRoom.seller_id === userId) {
    return "SELLER"
  } else {
    return "PARTICIPANT"
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🔍 DEAL ROOM [ID] API: Starting GET request for deal room:", params.id)

  try {
    // 1. Authentication
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      return errorResponse(401, "Authentication required", authError)
    }

    console.log("🔍 DEAL ROOM [ID] API: User authenticated:", user.id)

    // 2. Fetch basic deal room data
    const { data: dealRoom, error: dealRoomError } = await fetchDealRoom(supabase, params.id)
    if (dealRoomError || !dealRoom) {
      return errorResponse(404, "Deal room not found", dealRoomError?.message)
    }

    // 3. Check user access
    const hasAccess = await checkUserAccess(supabase, dealRoom, user.id)
    if (!hasAccess) {
      return errorResponse(403, "Access denied")
    }

    // 4. Fetch related data in parallel for efficiency
    const [listingData, proposalData, participantsData, messagesData, filesData, milestonesData, activitiesData] =
      await Promise.all([
        fetchListing(supabase, dealRoom.listing_id),
        fetchProposal(supabase, dealRoom.proposal_id),
        fetchParticipants(supabase, params.id),
        fetchMessages(supabase, params.id),
        fetchFiles(supabase, params.id),
        fetchMilestones(supabase, params.id),
        fetchActivities(supabase, params.id),
      ])

    // 5. Fetch profiles for buyer and seller
    const [buyerProfile, sellerProfile] = await Promise.all([
      fetchProfile(supabase, dealRoom.buyer_id),
      fetchProfile(supabase, dealRoom.seller_id),
    ])

    // Fetch closure information if the deal room is in a closure state
    let closureInfo = null
    if (["PENDING_CLOSURE", "CLOSED_SUCCESSFULLY", "CLOSED_UNSUCCESSFULLY"].includes(dealRoom.status)) {
      const { data: closure, error: closureError } = await supabase
        .from("deal_room_closures")
        .select(`
          id,
          initiator_id,
          initiator_type,
          reason_category,
          reason_description,
          outcome_type,
          requested_at,
          finalized_at,
          cooling_period_ends_at,
          feedback_buyer_rating,
          feedback_buyer_comment,
          feedback_seller_rating,
          feedback_seller_comment
        `)
        .eq("deal_room_id", params.id)
        .order("requested_at", { ascending: false })
        .limit(1)
        .single()

      if (!closureError && closure) {
        closureInfo = closure
      }
    }

    // 6. Determine user role
    const userRole = determineUserRole(dealRoom, user.id)

    // 7. Assemble and return complete response
    const fullDealRoom = {
      ...dealRoom,
      listing: listingData
        ? {
            ...listingData,
            buyer_profile: {
              company_name: buyerProfile?.company_name || buyerProfile?.full_name || "Unknown Company",
              company_logo_url: buyerProfile?.avatar_url || null,
            },
          }
        : null,
      proposal: proposalData
        ? {
            ...proposalData,
            proposal_text: proposalData.cover_letter,
            seller_profile: {
              company_name: sellerProfile?.company_name || sellerProfile?.full_name || "Unknown Company",
              logo_url: sellerProfile?.avatar_url || null,
            },
          }
        : null,
      deal_room_participants: participantsData,
      deal_room_messages: messagesData,
      deal_room_files: filesData,
      deal_room_milestones: milestonesData,
      deal_room_activities: activitiesData,
      pendingClosure: closureInfo
        ? {
            requestedAt: closureInfo.requested_at,
            initiatorType: closureInfo.initiator_type,
            reasonCategory: closureInfo.reason_category,
            reasonDescription: closureInfo.reason_description,
            coolingPeriodEndsAt: closureInfo.cooling_period_ends_at,
            finalizedAt: closureInfo.finalized_at,
            outcomeType: closureInfo.outcome_type,
            feedback: {
              buyer: closureInfo.feedback_buyer_rating
                ? {
                    rating: closureInfo.feedback_buyer_rating,
                    comment: closureInfo.feedback_buyer_comment,
                  }
                : null,
              seller: closureInfo.feedback_seller_rating
                ? {
                    rating: closureInfo.feedback_seller_rating,
                    comment: closureInfo.feedback_seller_comment,
                  }
                : null,
            },
          }
        : null,
    }

    console.log("🔍 DEAL ROOM [ID] API: Successfully assembled deal room data")
    console.log("🔍 DEAL ROOM [ID] API: Final data summary:", {
      hasListing: !!fullDealRoom.listing,
      hasProposal: !!fullDealRoom.proposal,
      participantCount: fullDealRoom.deal_room_participants.length,
      messageCount: fullDealRoom.deal_room_messages.length,
      fileCount: fullDealRoom.deal_room_files.length,
      milestoneCount: fullDealRoom.deal_room_milestones.length,
      userRole,
    })

    return NextResponse.json({
      dealRoom: fullDealRoom,
      userRole,
    })
  } catch (error) {
    console.error("🔍 DEAL ROOM [ID] API: Unexpected error:", error)
    return errorResponse(500, "Internal server error", String(error))
  }
}
