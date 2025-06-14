import { NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"
import type { NextRequest } from "next/server"

// Add a participant to a deal room
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("[SERVER] 🔍 ADD PARTICIPANT API: Starting POST request for deal room:", params.id)

  try {
    const { supabase, user, error: authError, status } = await getAuthenticatedClient(request)

    if (authError || !supabase || !user) {
      console.error("[SERVER] 🔍 ADD PARTICIPANT API: Authentication failed:", authError)
      return NextResponse.json({ error: "Authentication failed" }, { status: status || 401 })
    }

    const dealRoomId = params.id
    const body = await request.json()
    const { userEmail, role = "PARTICIPANT" } = body

    console.log("[SERVER] 🔍 ADD PARTICIPANT API: Adding user:", userEmail, "with role:", role)

    // Check if current user has permission to add participants
    const { data: currentParticipant } = await supabase
      .from("deal_room_participants")
      .select("role")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)
      .single()

    if (!currentParticipant) {
      return NextResponse.json({ error: "You don't have access to this deal room" }, { status: 403 })
    }

    // Find the user to add by email
    const { data: userToAdd, error: userError } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("email", userEmail)
      .single()

    if (userError || !userToAdd) {
      return NextResponse.json({ error: "User not found on the platform" }, { status: 404 })
    }

    // Check if user is already a participant
    const { data: existingParticipant } = await supabase
      .from("deal_room_participants")
      .select("id")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", userToAdd.id)
      .single()

    if (existingParticipant) {
      return NextResponse.json({ error: "User is already a participant in this deal room" }, { status: 400 })
    }

    // Add the participant
    const { data: newParticipant, error: insertError } = await supabase
      .from("deal_room_participants")
      .insert({
        deal_room_id: dealRoomId,
        user_id: userToAdd.id,
        role: role,
        added_by: user.id,
        joined_at: new Date().toISOString(),
      })
      .select(`
        id,
        user_id,
        role,
        joined_at,
        added_by
      `)
      .single()

    if (insertError) {
      console.error("[SERVER] 🔍 ADD PARTICIPANT API: Error adding participant:", insertError)
      return NextResponse.json({ error: "Failed to add participant" }, { status: 500 })
    }

    // Log activity
    await supabase.from("deal_room_activities").insert({
      deal_room_id: dealRoomId,
      user_id: user.id,
      activity_type: "PARTICIPANT_ADDED",
      description: `Added ${userToAdd.full_name || userToAdd.email} as a ${role.toLowerCase()}`,
      metadata: {
        added_user_id: userToAdd.id,
        added_user_email: userToAdd.email,
        role: role,
      },
    })

    // Return the new participant with user data
    const participantWithUser = {
      ...newParticipant,
      user: {
        first_name: userToAdd.full_name?.split(" ")[0] || "Unknown",
        last_name: userToAdd.full_name?.split(" ").slice(1).join(" ") || "User",
        email: userToAdd.email,
        avatar_url: null,
      },
    }

    console.log("[SERVER] 🔍 ADD PARTICIPANT API: Participant added successfully")
    return NextResponse.json({ participant: participantWithUser })
  } catch (error: any) {
    console.error("[SERVER] 🔍 ADD PARTICIPANT API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get all participants for a deal room (already handled in main deal room endpoint)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { supabase, user, error: authError, status } = await getAuthenticatedClient(request)

    if (authError || !supabase || !user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: status || 401 })
    }

    const dealRoomId = params.id

    // Check if user has access to this deal room
    const { data: participant } = await supabase
      .from("deal_room_participants")
      .select("role")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get all participants with user data
    const { data: participants, error } = await supabase
      .from("deal_room_participants")
      .select(`
        id,
        user_id,
        role,
        joined_at,
        added_by,
        profiles!deal_room_participants_user_id_fkey (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq("deal_room_id", dealRoomId)

    if (error) {
      console.error("Error fetching participants:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ participants })
  } catch (error: any) {
    console.error("Participants endpoint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
