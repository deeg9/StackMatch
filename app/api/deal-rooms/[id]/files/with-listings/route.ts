import { type NextRequest, NextResponse } from "next/server"
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
  source: "deal_room" | "listing_json"
  isInherited: boolean
  canDelete: boolean
  canEdit: boolean
  description?: string
  parentFileId?: string
  originalColumn?: string
}

// Helper to parse file size string to bytes
function parseFileSize(sizeStr: string): number {
  if (!sizeStr) return 0

  try {
    const match = sizeStr.match(/^([\d.]+)\s*([KMGTPkmgtp]?[Bb]?)$/)
    if (!match) return 0

    const size = Number.parseFloat(match[1])
    const unit = match[2].toUpperCase()

    if (unit.includes("K")) return size * 1024
    if (unit.includes("M")) return size * 1024 * 1024
    if (unit.includes("G")) return size * 1024 * 1024 * 1024
    if (unit.includes("T")) return size * 1024 * 1024 * 1024 * 1024
    if (unit.includes("P")) return size * 1024 * 1024 * 1024 * 1024 * 1024

    return size
  } catch (e) {
    console.error("Error parsing file size:", e)
    return 0
  }
}

// Helper to guess mime type from file name
function guessMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() || ""

  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    csv: "text/csv",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    zip: "application/zip",
  }

  return mimeTypes[extension] || "application/octet-stream"
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const dealRoomId = params.id
  console.log(`🔍 WITH LISTINGS: Starting implementation with listings for deal room: ${dealRoomId}`)

  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Authenticate user
    const { user, error: authError } = await authenticateUser(supabase)
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify deal room access and get listing/proposal IDs
    const { data: dealRoom, error: dealRoomError } = await supabase
      .from("deal_rooms")
      .select("id, room_name, listing_id, proposal_id")
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

    console.log(
      `🔍 WITH LISTINGS: Deal room found with listing_id: ${dealRoom.listing_id}, proposal_id: ${dealRoom.proposal_id}`,
    )

    let allFiles: DealRoomFile[] = []

    // Step 1: Get native deal room files
    console.log(`🔍 WITH LISTINGS: Step 1 - Getting native files`)
    try {
      let nativeFilesQuery = supabase
        .from("deal_room_files")
        .select("*, uploader:uploader_id(id, full_name, email, avatar_url)")
        .eq("deal_room_id", dealRoomId)

      if (!includeVersions) {
        nativeFilesQuery = nativeFilesQuery.eq("is_latest", true)
      }

      const { data: dealRoomFiles, error: filesError } = await nativeFilesQuery.order("created_at", {
        ascending: false,
      })

      if (filesError) {
        console.log(`🔍 WITH LISTINGS: Native files error: ${filesError.message}`)
      } else if (dealRoomFiles && dealRoomFiles.length > 0) {
        console.log(`🔍 WITH LISTINGS: Found ${dealRoomFiles.length} native files`)

        const formattedNativeFiles = dealRoomFiles.map((file) => {
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
            source: "deal_room" as const,
            isInherited: false,
            canDelete: file.uploader_id === user.id,
            canEdit: file.uploader_id === user.id,
            description: file.description,
            parentFileId: file.parent_file_id,
          }
        })

        allFiles = [...allFiles, ...formattedNativeFiles]
      }
    } catch (error: any) {
      console.log(`🔍 WITH LISTINGS: Native files exception: ${error.message}`)
    }

    // Step 2: Get listing files (if listing_id exists)
    if (dealRoom.listing_id) {
      console.log(`🔍 WITH LISTINGS: Step 2 - Getting listing files for listing: ${dealRoom.listing_id}`)

      try {
        // Use a safe query that only selects known columns
        const { data: listing, error: listingError } = await supabase
          .from("listings")
          .select("id, title, created_at, buyer_id, buyer:buyer_id(id, full_name, email, avatar_url)")
          .eq("id", dealRoom.listing_id)
          .single()

        if (listingError) {
          console.log(`🔍 WITH LISTINGS: Listing basic query error: ${listingError.message}`)
        } else {
          console.log(`🔍 WITH LISTINGS: Found listing: ${listing.id}`)

          // Try to get attachments separately to handle potential column issues
          try {
            const { data: listingAttachments, error: attachmentsError } = await supabase
              .from("listings")
              .select("attachments")
              .eq("id", dealRoom.listing_id)
              .single()

            if (attachmentsError) {
              console.log(`🔍 WITH LISTINGS: Attachments column error: ${attachmentsError.message}`)
              // This is expected if the column doesn't exist - continue without error
            } else if (listingAttachments?.attachments) {
              console.log(`🔍 WITH LISTINGS: Found attachments in listing`)

              try {
                // Handle different possible formats of attachments
                let attachments = []

                if (Array.isArray(listingAttachments.attachments)) {
                  attachments = listingAttachments.attachments
                } else if (typeof listingAttachments.attachments === "object") {
                  attachments = [listingAttachments.attachments]
                } else if (typeof listingAttachments.attachments === "string") {
                  try {
                    const parsed = JSON.parse(listingAttachments.attachments)
                    attachments = Array.isArray(parsed) ? parsed : [parsed]
                  } catch (parseError) {
                    attachments = [{ name: "Document", url: listingAttachments.attachments }]
                  }
                }

                console.log(`🔍 WITH LISTINGS: Processing ${attachments.length} attachments`)

                const jsonFiles = attachments
                  .filter((item) => item && (item.name || item.id))
                  .map((item, index) => {
                    const fileName = item.name || `File ${index + 1}`
                    const fileId = item.id || `attachment-${index}`
                    const fileUrl = item.url || `/api/listings/${dealRoom.listing_id}/files/${fileId}`

                    let fileSize = 0
                    if (typeof item.size === "number") {
                      fileSize = item.size
                    } else if (typeof item.size === "string") {
                      fileSize = parseFileSize(item.size)
                    }

                    return {
                      id: `listing-json-${fileId}`,
                      name: fileName,
                      size: fileSize,
                      type: item.type || guessMimeType(fileName),
                      url: fileUrl,
                      category: "DOCUMENT",
                      uploadedBy: listing.buyer_id || "",
                      uploadedByName: listing.buyer?.full_name || listing.buyer?.email || "Listing Owner",
                      uploadedByAvatar: listing.buyer?.avatar_url,
                      uploadedAt: listing.created_at || new Date().toISOString(),
                      version: 1,
                      isLatest: true,
                      source: "listing_json" as const,
                      isInherited: true,
                      canDelete: false,
                      canEdit: false,
                      description: `Attachment from listing: ${listing.title || listing.id}`,
                      originalColumn: "attachments",
                    }
                  })

                console.log(`🔍 WITH LISTINGS: Successfully processed ${jsonFiles.length} listing attachments`)
                allFiles = [...allFiles, ...jsonFiles]
              } catch (error: any) {
                console.log(`🔍 WITH LISTINGS: Error processing listing attachments: ${error.message}`)
              }
            }
          } catch (error: any) {
            console.log(`🔍 WITH LISTINGS: Attachments query exception: ${error.message}`)
          }
        }
      } catch (error: any) {
        console.log(`🔍 WITH LISTINGS: Listing query exception: ${error.message}`)
      }
    }

    console.log(`🔍 WITH LISTINGS: Returning ${allFiles.length} total files`)

    return NextResponse.json({
      success: true,
      files: allFiles,
      totalCount: allFiles.length,
      dealRoomId,
      listingId: dealRoom.listing_id,
      proposalId: dealRoom.proposal_id,
      source: "with_listings",
    })
  } catch (error) {
    console.error("🔍 WITH LISTINGS: Error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
