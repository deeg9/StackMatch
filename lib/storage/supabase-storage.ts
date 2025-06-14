import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create admin client for storage operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export interface UploadResult {
  success: boolean
  filePath?: string
  publicUrl?: string
  error?: string
}

export interface FileMetadata {
  originalName: string
  size: number
  mimeType: string
  dealRoomId: string
  category: string
}

/**
 * Generate a unique file name for storage
 */
export function generateUniqueFileName(originalName: string, dealRoomId: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split(".").pop() || "bin"
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_")

  return `deal-rooms/${dealRoomId}/${timestamp}_${randomString}_${sanitizedName}`
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(file: File, dealRoomId: string, category: string): Promise<UploadResult> {
  try {
    console.log("📁 STORAGE: Starting file upload", {
      fileName: file.name,
      size: file.size,
      type: file.type,
      dealRoomId,
      category,
    })

    // Generate unique file path
    const filePath = generateUniqueFileName(file.name, dealRoomId)
    console.log("📁 STORAGE: Generated file path:", filePath)

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage.from("deal-room-files").upload(filePath, uint8Array, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("📁 STORAGE: Upload error:", error.message)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log("📁 STORAGE: Upload successful:", data.path)

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage.from("deal-room-files").getPublicUrl(filePath)

    console.log("📁 STORAGE: Public URL generated:", urlData.publicUrl)

    return {
      success: true,
      filePath: data.path,
      publicUrl: urlData.publicUrl,
    }
  } catch (error: any) {
    console.error("📁 STORAGE: Unexpected error:", error.message)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📁 STORAGE: Deleting file:", filePath)

    const { error } = await supabaseAdmin.storage.from("deal-room-files").remove([filePath])

    if (error) {
      console.error("📁 STORAGE: Delete error:", error.message)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log("📁 STORAGE: File deleted successfully")
    return { success: true }
  } catch (error: any) {
    console.error("📁 STORAGE: Delete exception:", error.message)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Get public URL for a file
 */
export function getFileUrl(filePath: string): string {
  const { data } = supabaseAdmin.storage.from("deal-room-files").getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * Create storage bucket if it doesn't exist
 */
export async function ensureBucketExists(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📁 STORAGE: Checking if bucket exists...")

    // Try to get bucket info
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

    if (listError) {
      console.error("📁 STORAGE: Error listing buckets:", listError.message)
      return { success: false, error: listError.message }
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === "deal-room-files")

    if (!bucketExists) {
      console.log("📁 STORAGE: Creating deal-room-files bucket...")

      const { error: createError } = await supabaseAdmin.storage.createBucket("deal-room-files", {
        public: true,
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
        ],
        fileSizeLimit: 52428800, // 50MB
      })

      if (createError) {
        console.error("📁 STORAGE: Error creating bucket:", createError.message)
        return { success: false, error: createError.message }
      }

      console.log("📁 STORAGE: Bucket created successfully")
    } else {
      console.log("📁 STORAGE: Bucket already exists")
    }

    return { success: true }
  } catch (error: any) {
    console.error("📁 STORAGE: Unexpected error:", error.message)
    return { success: false, error: error.message }
  }
}
