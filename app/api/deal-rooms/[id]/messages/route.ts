import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const timestamp = new Date().toISOString()
  console.log(`🔍 [${timestamp}] MESSAGES API GET: Starting request for deal room:`, params.id)

  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      console.error(`🔍 [${timestamp}] MESSAGES API GET: Authentication failed:`, authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`🔍 [${timestamp}] MESSAGES API GET: User authenticated:`, user.id)

    const dealRoomId = params.id

    // Verify user has access to this deal room
    const { data: participation, error: participationError } = await supabase
      .from("deal_room_participants")
      .select("role")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)
      .single()

    if (participationError || !participation) {
      console.error(`🔍 [${timestamp}] MESSAGES API GET: Access denied:`, participationError)
      return NextResponse.json({ error: "Deal room not found or access denied" }, { status: 404 })
    }

    console.log(`🔍 [${timestamp}] MESSAGES API GET: User has access, fetching messages...`)

    // Fetch messages with sender profiles using the foreign key relationship
    const { data: messages, error } = await supabase
      .from("deal_room_messages")
      .select(`
        *,
        sender:profiles!sender_id (
          id,
          full_name,
          avatar_url,
          email
        )
      `)
      .eq("deal_room_id", dealRoomId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error(`🔍 [${timestamp}] MESSAGES API GET: Error fetching messages:`, error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    console.log(`🔍 [${timestamp}] MESSAGES API GET: Successfully fetched`, messages?.length || 0, "messages")
    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error(`🔍 [${timestamp}] MESSAGES API GET: Unexpected error:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const timestamp = new Date().toISOString()

  try {
    console.log(`🔍 [${timestamp}] MESSAGES API POST: ===== STARTING REQUEST =====`)
    console.log(`🔍 [${timestamp}] MESSAGES API POST: Deal room ID:`, params.id)

    // Step 1: Authentication
    console.log(`🔍 [${timestamp}] MESSAGES API POST: STEP 1 - Getting authenticated client...`)
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      console.error(`🔍 [${timestamp}] MESSAGES API POST: Authentication failed:`, authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`🔍 [${timestamp}] MESSAGES API POST: User authenticated:`, user.id)

    // Step 2: Parse request body
    console.log(`🔍 [${timestamp}] MESSAGES API POST: STEP 2 - Parsing request body...`)
    const requestBody = await request.json()
    const { content, messageType = "text", fileUrl } = requestBody
    const dealRoomId = params.id

    console.log(`🔍 [${timestamp}] MESSAGES API POST: Extracted data:`, {
      dealRoomId,
      content,
      messageType,
      fileUrl,
      userId: user.id,
    })

    if (!content && !fileUrl) {
      return NextResponse.json({ error: "Message content or file URL is required" }, { status: 400 })
    }

    // Step 3: Verify access
    console.log(`🔍 [${timestamp}] MESSAGES API POST: STEP 3 - Verifying user access...`)
    const { data: participation, error: participationError } = await supabase
      .from("deal_room_participants")
      .select("role")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)
      .single()

    if (participationError || !participation) {
      console.error(`🔍 [${timestamp}] MESSAGES API POST: Access denied:`, participationError)
      return NextResponse.json({ error: "Deal room not found or access denied" }, { status: 404 })
    }

    console.log(`🔍 [${timestamp}] MESSAGES API POST: User has access with role:`, participation.role)

    // Step 4: Determine message type (use lowercase to match enum values)
    let senderType = "text" // Default for text messages (lowercase!)
    if (fileUrl) {
      senderType = "file" // If there's a file URL, it's a file message (lowercase!)
    }
    // "system" type would be used for automated messages (lowercase!)

    console.log(`🔍 [${timestamp}] MESSAGES API POST: Determined sender_type:`, senderType)

    // Step 5: Insert message
    console.log(`🔍 [${timestamp}] MESSAGES API POST: STEP 5 - Inserting message...`)
    const now = new Date().toISOString()
    const messageData = {
      deal_room_id: dealRoomId,
      sender_id: user.id,
      content,
      sender_type: senderType, // Make sure this matches the database column name
      created_at: now,
      updated_at: now,
    }

    console.log(`🔍 [${timestamp}] MESSAGES API POST: About to insert with sender_type:`, senderType)
    console.log(`🔍 [${timestamp}] MESSAGES API POST: Message data keys:`, Object.keys(messageData))

    console.log(`🔍 [${timestamp}] MESSAGES API POST: Message data to insert:`, messageData)

    const { data: newMessage, error: insertError } = await supabase
      .from("deal_room_messages")
      .insert(messageData)
      .select(`
        *,
        sender:profiles!sender_id (
          id,
          full_name,
          avatar_url,
          email
        )
      `)
      .single()

    if (insertError) {
      console.error(`🔍 [${timestamp}] MESSAGES API POST: Error creating message:`, insertError)
      console.error(`🔍 [${timestamp}] MESSAGES API POST: Error details:`, {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      })
      return NextResponse.json({ error: "Failed to send message: " + insertError.message }, { status: 500 })
    }

    console.log(`🔍 [${timestamp}] MESSAGES API POST: Message created successfully:`, newMessage.id)

    // Step 6: Update deal room activity
    console.log(`🔍 [${timestamp}] MESSAGES API POST: STEP 6 - Updating deal room activity...`)
    await supabase.from("deal_rooms").update({ last_activity_at: new Date().toISOString() }).eq("id", dealRoomId)

    console.log(`🔍 [${timestamp}] MESSAGES API POST: ===== REQUEST COMPLETED SUCCESSFULLY =====`)
    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error(`🔍 [${timestamp}] MESSAGES API POST: ===== UNHANDLED ERROR =====`)
    console.error(`🔍 [${timestamp}] MESSAGES API POST: Error:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
