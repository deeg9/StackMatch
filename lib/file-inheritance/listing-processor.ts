export interface InheritedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  category: string
  uploadedBy: string
  uploadedByName: string
  uploadedAt: string
  version: number
  isLatest: boolean
  source: "listing" | "proposal" | "deal_room"
  isInherited: boolean
  canDelete: boolean
  canEdit: boolean
  originalId?: string
}

/**
 * Process listing attachments and convert to standard file format
 */
export function processListingAttachments(listing: any): InheritedFile[] {
  console.log("📎 LISTING PROCESSOR: Processing listing attachments for listing:", listing?.id)

  if (!listing) {
    console.log("📎 LISTING PROCESSOR: No listing provided")
    return []
  }

  const attachments = listing.attachments
  console.log("📎 LISTING PROCESSOR: Raw attachments data:", attachments)

  if (!attachments) {
    console.log("📎 LISTING PROCESSOR: No attachments found")
    return []
  }

  let attachmentArray: any[] = []

  try {
    // Handle different attachment formats
    if (typeof attachments === "string") {
      // Parse JSON string
      attachmentArray = JSON.parse(attachments)
    } else if (Array.isArray(attachments)) {
      // Already an array
      attachmentArray = attachments
    } else if (typeof attachments === "object") {
      // Single object, convert to array
      attachmentArray = [attachments]
    }

    console.log("📎 LISTING PROCESSOR: Parsed attachment array:", attachmentArray)
  } catch (error) {
    console.error("📎 LISTING PROCESSOR: Error parsing attachments:", error)
    return []
  }

  if (!Array.isArray(attachmentArray)) {
    console.log("📎 LISTING PROCESSOR: Attachments is not an array after processing")
    return []
  }

  const inheritedFiles = attachmentArray
    .map((attachment, index) => {
      try {
        return formatInheritedFile(attachment, "listing", listing, index)
      } catch (error) {
        console.error("📎 LISTING PROCESSOR: Error formatting attachment:", error, attachment)
        return null
      }
    })
    .filter((file): file is InheritedFile => file !== null)

  console.log("📎 LISTING PROCESSOR: Processed", inheritedFiles.length, "inherited files from listing")
  return inheritedFiles
}

/**
 * Format attachment data into standard inherited file format
 */
function formatInheritedFile(
  attachment: any,
  source: "listing" | "proposal",
  parent: any,
  index: number,
): InheritedFile {
  console.log("📎 LISTING PROCESSOR: Formatting attachment:", attachment)

  // Generate fallback values
  const fallbackId = `${source}_${parent.id}_${index}`
  const fallbackName = attachment.name || attachment.filename || attachment.file_name || `Attachment ${index + 1}`
  const fallbackUrl = attachment.url || attachment.file_url || attachment.path || ""
  const fallbackSize = attachment.size || attachment.file_size || attachment.file_size_bytes || 0
  const fallbackType = attachment.type || attachment.mime_type || attachment.content_type || "application/octet-stream"

  // Determine category based on file type or explicit category
  let category = "OTHER"
  if (attachment.category) {
    category = attachment.category.toUpperCase()
  } else if (fallbackType.includes("pdf")) {
    category = "CONTRACT"
  } else if (fallbackType.includes("image")) {
    category = "OTHER"
  } else if (fallbackType.includes("document") || fallbackType.includes("word")) {
    category = "SCOPE_DOCUMENT"
  }

  const inheritedFile: InheritedFile = {
    id: attachment.id || fallbackId,
    name: fallbackName,
    size: typeof fallbackSize === "number" ? fallbackSize : Number.parseInt(fallbackSize) || 0,
    type: fallbackType,
    url: fallbackUrl,
    category,
    uploadedBy: parent.buyer_id || parent.seller_id || "unknown",
    uploadedByName: parent.buyer_name || parent.seller_name || "Unknown User",
    uploadedAt: attachment.created_at || parent.created_at || new Date().toISOString(),
    version: 1,
    isLatest: true,
    source,
    isInherited: true,
    canDelete: false,
    canEdit: false,
    originalId: attachment.id,
  }

  console.log("📎 LISTING PROCESSOR: Formatted inherited file:", inheritedFile)
  return inheritedFile
}

/**
 * Validate attachment data structure
 */
export function validateAttachmentData(attachment: any): boolean {
  if (!attachment || typeof attachment !== "object") {
    return false
  }

  // Must have at least a name or filename
  const hasName = attachment.name || attachment.filename || attachment.file_name
  if (!hasName) {
    return false
  }

  return true
}
