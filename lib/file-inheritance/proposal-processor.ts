import type { InheritedFile } from "./listing-processor"

/**
 * Process proposal attachments and convert to standard file format
 */
export function processProposalAttachments(proposal: any): InheritedFile[] {
  console.log("📎 PROPOSAL PROCESSOR: Processing proposal attachments for proposal:", proposal?.id)

  if (!proposal) {
    console.log("📎 PROPOSAL PROCESSOR: No proposal provided")
    return []
  }

  const attachments = proposal.attachments
  console.log("📎 PROPOSAL PROCESSOR: Raw attachments data:", attachments)

  if (!attachments) {
    console.log("📎 PROPOSAL PROCESSOR: No attachments found")
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

    console.log("📎 PROPOSAL PROCESSOR: Parsed attachment array:", attachmentArray)
  } catch (error) {
    console.error("📎 PROPOSAL PROCESSOR: Error parsing attachments:", error)
    return []
  }

  if (!Array.isArray(attachmentArray)) {
    console.log("📎 PROPOSAL PROCESSOR: Attachments is not an array after processing")
    return []
  }

  const inheritedFiles = attachmentArray
    .map((attachment, index: any) => {
      try {
        return formatProposalInheritedFile(attachment, proposal, index)
      } catch (error) {
        console.error("📎 PROPOSAL PROCESSOR: Error formatting attachment:", error, attachment)
        return null
      }
    })
    .filter((file): file is InheritedFile => file !== null)

  console.log("📎 PROPOSAL PROCESSOR: Processed", inheritedFiles.length, "inherited files from proposal")
  return inheritedFiles
}

/**
 * Format proposal attachment data into standard inherited file format
 */
function formatProposalInheritedFile(attachment: any, proposal: any, index: number): InheritedFile {
  console.log("📎 PROPOSAL PROCESSOR: Formatting proposal attachment:", attachment)

  // Generate fallback values
  const fallbackId = `proposal_${proposal.id}_${index}`
  const fallbackName =
    attachment.name || attachment.filename || attachment.file_name || `Proposal Attachment ${index + 1}`
  const fallbackUrl = attachment.url || attachment.file_url || attachment.path || ""
  const fallbackSize = attachment.size || attachment.file_size || attachment.file_size_bytes || 0
  const fallbackType = attachment.type || attachment.mime_type || attachment.content_type || "application/octet-stream"

  // Determine category based on file type or explicit category
  let category = "DELIVERABLE"
  if (attachment.category) {
    category = attachment.category.toUpperCase()
  } else if (fallbackType.includes("pdf")) {
    category = "CONTRACT"
  } else if (fallbackType.includes("image")) {
    category = "OTHER"
  } else if (fallbackType.includes("document") || fallbackType.includes("word")) {
    category = "DELIVERABLE"
  }

  const inheritedFile: InheritedFile = {
    id: attachment.id || fallbackId,
    name: fallbackName,
    size: typeof fallbackSize === "number" ? fallbackSize : Number.parseInt(fallbackSize) || 0,
    type: fallbackType,
    url: fallbackUrl,
    category,
    uploadedBy: proposal.seller_id || "unknown",
    uploadedByName: proposal.seller_name || "Unknown Seller",
    uploadedAt: attachment.created_at || proposal.created_at || new Date().toISOString(),
    version: 1,
    isLatest: true,
    source: "proposal",
    isInherited: true,
    canDelete: false,
    canEdit: false,
    originalId: attachment.id,
  }

  console.log("📎 PROPOSAL PROCESSOR: Formatted inherited file:", inheritedFile)
  return inheritedFile
}
