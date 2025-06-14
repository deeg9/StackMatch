import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const dealRoomId = params.id
  console.log(`🔍 MINIMAL FILES: Starting minimal files endpoint for deal room: ${dealRoomId}`)

  try {
    // Step 1: Check environment variables
    console.log("🔍 MINIMAL FILES: Checking environment variables")
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing required Supabase environment variables")
    }

    // Step 2: Extract authorization token
    console.log("🔍 MINIMAL FILES: Extracting authorization token")
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization token" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Step 3: Create Supabase client
    console.log("🔍 MINIMAL FILES: Creating Supabase client")
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    // Step 4: Verify user authentication
    console.log("🔍 MINIMAL FILES: Verifying user authentication")
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("🔍 MINIMAL FILES: Authentication error:", userError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    console.log(`🔍 MINIMAL FILES: User authenticated: ${user.id}`)

    // Step 5: Check if user is a participant in the deal room
    console.log("🔍 MINIMAL FILES: Checking user participation")
    const { data: participant, error: participantError } = await supabase
      .from("deal_room_participants")
      .select("id, role")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)
      .single()

    if (participantError || !participant) {
      console.error("🔍 MINIMAL FILES: Participation error:", participantError)
      return NextResponse.json({ error: "Access denied: Not a participant in this deal room" }, { status: 403 })
    }

    console.log(`🔍 MINIMAL FILES: User is a participant with role: ${participant.role}`)

    // Step 6: Fetch only native deal room files (no listing or proposal attachments)
    console.log("🔍 MINIMAL FILES: Fetching native deal room files")
    const { data: files, error: filesError } = await supabase
      .from("deal_room_files")
      .select("*")
      .eq("deal_room_id", dealRoomId)

    if (filesError) {
      console.error("🔍 MINIMAL FILES: Files error:", filesError)
      return NextResponse.json({ error: "Error fetching files" }, { status: 500 })
    }

    console.log(`🔍 MINIMAL FILES: Found ${files.length} native files`)

    // Return only the native files
    return NextResponse.json({
      success: true,
      files: files || [],
      nativeFilesCount: files.length,
      message: "Successfully retrieved native deal room files",
    })
  } catch (error: any) {
    console.error("🔍 MINIMAL FILES: Unhandled error:", error)

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      },
      { status: 500 },
    )
  }
}
