import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { authenticateUser } from "@/lib/auth/api-utils"

interface DealRoomFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  category: string
  uploadedBy: string
  uploadedByName: string
  uploadedByAvatar?: string
  uploadedAt: string
  version: number
  isLatest: boolean
  source: "deal_room"
  isInherited: boolean
  canDelete: boolean
  canEdit: boolean
  description?: string
  parentFileId?: string
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const dealRoomId = params.id
  console.log(`🔍 NATIVE FILES: Starting native files implementation for deal room: ${dealRoomId}`)

  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Authenticate user
    const { user, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify deal room access
    const { data: dealRoom, error: dealRoomError } = await supabase
      .from("deal_rooms")
      .select("id, room_name")
      .eq("id", dealRoomId)
      .single()

    if (dealRoomError || !dealRoom) {
      return NextResponse.json({ error: "Deal room not found" }, { status: 404 })
    }

    // Check user access
    const { data: participant, error: participantError } = await supabase
      .from("deal_room_participants")
      .select("id")
      .eq("deal_room_id", dealRoomId)
      .eq("user_id", user.id)
      .single()

    if (participantError || !participant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const includeVersions = url.searchParams.get("includeVersions") === "true"

    console.log(`🔍 NATIVE FILES: Querying native deal room files (includeVersions: ${includeVersions})`)

    // Query native deal room files only
    let nativeFilesQuery = supabase
      .from("deal_room_files")
      .select("*, uploader:uploader_id(id, full_name, email, avatar_url)")
      .eq("deal_room_id", dealRoomId)

    if (!includeVersions) {
      nativeFilesQuery = nativeFilesQuery.eq("is_latest", true)
    }

    const { data: dealRoomFiles, error: filesError } = await nativeFilesQuery.order("created_at", { ascending: false })

    if (filesError) {
      console.error(`🔍 NATIVE FILES: Error fetching files:`, filesError)
      return NextResponse.json({ error: "Failed to fetch files", details: filesError.message }, { status: 500 })
    }

    console.log(`🔍 NATIVE FILES: Found ${dealRoomFiles?.length || 0} native files`)

    // Format native files
    const formattedFiles: DealRoomFile[] = (dealRoomFiles || []).map((file: any) => {
      const uploader = file.uploader || {}
      return {
        id: file.id,
        name: file.file_name || "Unnamed File",
        size: file.file_size_bytes || 0,
        type: file.mime_type || "application/octet-stream",
        url: file.file_path || "",
        category: file.type || "OTHER",
        uploadedBy: file.uploader_id || "",
        uploadedByName: uploader.full_name || uploader.email || "Unknown User",
        uploadedByAvatar: uploader.avatar_url,
        uploadedAt: file.created_at || new Date().toISOString(),
        version: file.version || 1,
        isLatest: file.is_latest !== false,
        source: "deal_room",
        isInherited: false,
        canDelete: file.uploader_id === user.id,
        canEdit: file.uploader_id === user.id,
        description: file.description,
        parentFileId: file.parent_file_id,
      }
    })

    console.log(`🔍 NATIVE FILES: Returning ${formattedFiles.length} formatted files`)

    return NextResponse.json({
      success: true,
      files: formattedFiles,
      totalCount: formattedFiles.length,
      dealRoomId,
      source: "native_only",
    })
  } catch (error) {
    console.error("🔍 NATIVE FILES: Error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? getErrorMessage(error) : "Unknown error" },
      { status: 500 },
    )
  }
}
