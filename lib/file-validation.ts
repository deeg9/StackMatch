export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface FileValidationConfig {
  maxSizeBytes: number
  allowedMimeTypes: string[]
  allowedExtensions: string[]
}

export const DEFAULT_FILE_CONFIG: FileValidationConfig = {
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
  allowedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/zip",
    "application/x-zip-compressed",
  ],
  allowedExtensions: [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "csv",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "zip",
  ],
}

/**
 * Validate file type against allowed MIME types
 */
export function validateFileType(file: File, config: FileValidationConfig = DEFAULT_FILE_CONFIG): ValidationResult {
  console.log("🔒 VALIDATION: Checking file type:", file.type)

  if (!config.allowedMimeTypes.includes(file.type)) {
    const error = `File type '${file.type}' is not allowed. Allowed types: ${config.allowedMimeTypes.join(", ")}`
    console.log("🔒 VALIDATION: File type rejected:", error)
    return { isValid: false, error }
  }

  console.log("🔒 VALIDATION: File type accepted")
  return { isValid: true }
}

/**
 * Validate file size against maximum allowed size
 */
export function validateFileSize(file: File, config: FileValidationConfig = DEFAULT_FILE_CONFIG): ValidationResult {
  console.log("🔒 VALIDATION: Checking file size:", file.size, "bytes")

  if (file.size > config.maxSizeBytes) {
    const maxSizeMB = Math.round(config.maxSizeBytes / (1024 * 1024))
    const fileSizeMB = Math.round(file.size / (1024 * 1024))
    const error = `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`
    console.log("🔒 VALIDATION: File size rejected:", error)
    return { isValid: false, error }
  }

  console.log("🔒 VALIDATION: File size accepted")
  return { isValid: true }
}

/**
 * Validate file extension
 */
export function validateFileExtension(
  fileName: string,
  config: FileValidationConfig = DEFAULT_FILE_CONFIG,
): ValidationResult {
  const extension = fileName.split(".").pop()?.toLowerCase()
  console.log("🔒 VALIDATION: Checking file extension:", extension)

  if (!extension || !config.allowedExtensions.includes(extension)) {
    const error = `File extension '${extension}' is not allowed. Allowed extensions: ${config.allowedExtensions.join(", ")}`
    console.log("🔒 VALIDATION: File extension rejected:", error)
    return { isValid: false, error }
  }

  console.log("🔒 VALIDATION: File extension accepted")
  return { isValid: true }
}

/**
 * Sanitize file name by removing dangerous characters
 */
export function sanitizeFileName(fileName: string): string {
  console.log("🔒 VALIDATION: Sanitizing file name:", fileName)

  // Remove or replace dangerous characters
  const sanitized = fileName
    .replace(/[<>:"/\\|?*]/g, "_") // Replace dangerous characters with underscore
    .replace(/\s+/g, "_") // Replace spaces with underscore
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single
    .replace(/^_+|_+$/g, "") // Remove leading/trailing underscores
    .substring(0, 255) // Limit length

  console.log("🔒 VALIDATION: Sanitized file name:", sanitized)
  return sanitized
}

/**
 * Generate secure file path for storage
 */
export function generateSecurePath(dealRoomId: string, fileName: string): string {
  const sanitizedFileName = sanitizeFileName(fileName)
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)

  const securePath = `deal-rooms/${dealRoomId}/${timestamp}_${randomString}_${sanitizedFileName}`
  console.log("🔒 VALIDATION: Generated secure path:", securePath)

  return securePath
}

/**
 * Comprehensive file validation
 */
export function validateFile(file: File, config: FileValidationConfig = DEFAULT_FILE_CONFIG): ValidationResult {
  console.log("🔒 VALIDATION: Starting comprehensive file validation for:", file.name)

  // Check file size
  const sizeValidation = validateFileSize(file, config)
  if (!sizeValidation.isValid) {
    return sizeValidation
  }

  // Check file type
  const typeValidation = validateFileType(file, config)
  if (!typeValidation.isValid) {
    return typeValidation
  }

  // Check file extension
  const extensionValidation = validateFileExtension(file.name, config)
  if (!extensionValidation.isValid) {
    return extensionValidation
  }

  console.log("🔒 VALIDATION: All validations passed")
  return { isValid: true }
}

/**
 * Validate file category
 */
export function validateCategory(category: string): ValidationResult {
  const allowedCategories = ["CONTRACT", "SCOPE_DOCUMENT", "DELIVERABLE", "INVOICE", "OTHER"]

  if (!allowedCategories.includes(category)) {
    return {
      isValid: false,
      error: `Invalid category '${category}'. Allowed categories: ${allowedCategories.join(", ")}`,
    }
  }

  return { isValid: true }
}
