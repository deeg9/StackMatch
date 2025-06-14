import { put, del, head } from "@vercel/blob"

export interface UploadResult {
  success: boolean
  filePath?: string
  publicUrl?: string
  error?: string
}

/**
 * Generate a unique file name for storage
 */
export function generateUniqueFileName(originalName: string, dealRoomId: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split("
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler".").pop() || "bin"
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_")

  return `deal-rooms/${dealRoomId}/${timestamp}_${randomString}_${sanitizedName}`
}

/**
 * Upload file to Vercel Blob Storage
 */
export async function uploadFile(file: File, dealRoomId: string, category: string): Promise<UploadResult> {
  try {
    console.log("📁 VERCEL BLOB: Starting file upload", {
      fileName: file.name,
      size: file.size,
      type: file.type,
      dealRoomId,
      category,
    })

    // Generate unique file path
    const fileName = generateUniqueFileName(file.name, dealRoomId)
    console.log("📁 VERCEL BLOB: Generated file name:", fileName)

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      contentType: file.type,
    })

    console.log("📁 VERCEL BLOB: Upload successful:", blob.url)

    return {
      success: true,
      filePath: fileName,
      publicUrl: blob.url,
    }
  } catch (error: any) {
    console.error("📁 VERCEL BLOB: Upload error:", getErrorMessage(error))
    return {
      success: false,
      error: getErrorMessage(error),
    }
  }
}

/**
 * Delete file from Vercel Blob Storage
 */
export async function deleteFile(fileUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📁 VERCEL BLOB: Deleting file:", fileUrl)

    await del(fileUrl)

    console.log("📁 VERCEL BLOB: File deleted successfully")
    return { success: true }
  } catch (error: any) {
    console.error("📁 VERCEL BLOB: Delete error:", getErrorMessage(error))
    return {
      success: false,
      error: getErrorMessage(error),
    }
  }
}

/**
 * Get file metadata from Vercel Blob
 */
export async function getFileMetadata(fileUrl: string): Promise<{ success: boolean; metadata?: any; error?: string }> {
  try {
    console.log("📁 VERCEL BLOB: Getting file metadata:", fileUrl)

    const metadata = await head(fileUrl)

    console.log("📁 VERCEL BLOB: Metadata retrieved successfully")
    return {
      success: true,
      metadata,
    }
  } catch (error: any) {
    console.error("📁 VERCEL BLOB: Metadata error:", getErrorMessage(error))
    return {
      success: false,
      error: getErrorMessage(error),
    }
  }
}

/**
 * Check if file exists in Vercel Blob
 */
export async function fileExists(fileUrl: string): Promise<boolean> {
  try {
    await head(fileUrl)
    return true
  } catch {
    return false
  }
}
