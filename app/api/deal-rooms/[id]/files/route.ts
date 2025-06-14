import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log("🔧 FILES API: Starting files endpoint for deal room:", params.id)

  try {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("🔧 FILES API: Supabase client created")

    // Import file processors
    const { processListingAttachments } = await import("@/lib/file-inheritance/listing-processor")
    const { processProposalAttachments } = await import("@/lib/file-inheritance/proposal-processor")

    // Get deal room info to find related listing and proposal
    console.log("🔧 FILES API: Fetching deal room info...")
    const { data: dealRoom, error: dealRoomError } = await supabase
      .from("deal_rooms")
      .select("id, listing_id, proposal_id")
      .eq("id", params.id)
      .single()

    if (dealRoomError) {
      console.error("🔧 FILES API: Deal room query error:", dealRoomError.message)
    } else {
      console.log("🔧 FILES API: Deal room found:", dealRoom)
    }

    // Get native deal room files
    console.log("🔧 FILES API: Fetching native deal room files...")
    const { data: files, error: filesError } = await supabase
      .from("deal_room_files")
      .select("*")
      .eq("deal_room_id", params.id)

    console.log("🔧 FILES API: Native files query completed, count:", files?.length || 0)

    if (filesError) {
      console.error("🔧 FILES API: Files query error:", filesError.message)
    }

    // Format native files
    const nativeFiles = (files || []).map((file: any) => ({
      id: file.id,
      name: file.file_name || "Unnamed File",
      size: file.file_size_bytes || 0,
      type: file.mime_type || "application/octet-stream",
      url: file.file_path || "", // This will be the Vercel Blob URL
      category: file.type || "OTHER",
      uploadedBy: file.uploader_id || "",
      uploadedByName: "Unknown User",
      uploadedAt: file.created_at || new Date().toISOString(),
      version: file.version || 1,
      isLatest: file.is_latest !== false,
      source: "deal_room",
      isInherited: false,
      canDelete: true,
      canEdit: true,
    }))

    console.log("🔧 FILES API: Formatted", nativeFiles.length, "native files")

    // Get inherited files from listing
    let listingFiles: any[] = []
    if (dealRoom?.listing_id) {
      console.log("🔧 FILES API: Fetching listing attachments for listing:", dealRoom.listing_id)
      try {
        const { data: listing, error: listingError } = await supabase
          .from("listings")
          .select("id, attachments, buyer_id, created_at")
          .eq("id", dealRoom.listing_id)
          .single()

        if (listingError) {
          console.log("🔧 FILES API: Listing query error:", listingError.message)
        } else if (listing) {
          console.log("🔧 FILES API: Processing listing attachments...")
          listingFiles = processListingAttachments(listing)
          console.log("🔧 FILES API: Processed", listingFiles.length, "listing files")
        }
      } catch (error: any) {
        console.error("🔧 FILES API: Error processing listing files:", getErrorMessage(error))
      }
    }

    // Get inherited files from proposal
    let proposalFiles: any[] = []
    if (dealRoom?.proposal_id) {
      console.log("🔧 FILES API: Fetching proposal attachments for proposal:", dealRoom.proposal_id)
      try {
        const { data: proposal, error: proposalError } = await supabase
          .from("proposals")
          .select("id, attachments, seller_id, created_at")
          .eq("id", dealRoom.proposal_id)
          .single()

        if (proposalError) {
          console.log("🔧 FILES API: Proposal query error:", proposalError.message)
        } else if (proposal) {
          console.log("🔧 FILES API: Processing proposal attachments...")
          proposalFiles = processProposalAttachments(proposal)
          console.log("🔧 FILES API: Processed", proposalFiles.length, "proposal files")
        }
      } catch (error: any) {
        console.error("🔧 FILES API: Error processing proposal files:", getErrorMessage(error))
      }
    }

    // Combine all files
    const allFiles = [...nativeFiles, ...listingFiles, ...proposalFiles]

    // Sort by upload date (native files first, then by date)
    allFiles.sort((a, b) => {
      // Native files first
      if (a.source === "deal_room" && b.source !== "deal_room") return -1
      if (b.source === "deal_room" && a.source !== "deal_room") return 1

      // Then by date (newest first)
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })

    console.log("🔧 FILES API: Returning", allFiles.length, "total files")
    console.log("🔧 FILES API: File breakdown:", {
      native: nativeFiles.length,
      listing: listingFiles.length,
      proposal: proposalFiles.length,
      total: allFiles.length,
    })

    return new Response(
      JSON.stringify({
        success: true,
        files: allFiles,
        totalCount: allFiles.length,
        breakdown: {
          native: nativeFiles.length,
          listing: listingFiles.length,
          proposal: proposalFiles.length,
        },
        dealRoomId: params.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("🔧 FILES API: Error:", getErrorMessage(error))

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: getErrorMessage(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  console.log("📤 FILES API: Starting file upload for deal room:", params.id)

  try {
    // Import required modules
    const { createClient } = await import("@supabase/supabase-js")
    const { uploadFile } = await import("@/lib/storage/vercel-blob-storage")
    const { validateFile, validateCategory } = await import("@/lib/file-validation")

    // Create Supabase client for database operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("📤 FILES API: Supabase client created")

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = (formData.get("category") as string) || "OTHER"
    const description = (formData.get("description") as string) || null

    console.log("📤 FILES API: Form data parsed:", {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      category,
      hasDescription: !!description,
    })

    // Validate inputs
    if (!file) {
      return new Response(JSON.stringify({ success: false, error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.isValid) {
      console.log("📤 FILES API: File validation failed:", fileValidation.error)
      return new Response(JSON.stringify({ success: false, error: fileValidation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Validate category
    const categoryValidation = validateCategory(category)
    if (!categoryValidation.isValid) {
      console.log("📤 FILES API: Category validation failed:", categoryValidation.error)
      return new Response(JSON.stringify({ success: false, error: categoryValidation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("📤 FILES API: All validations passed")

    // Upload file to Vercel Blob
    console.log("📤 FILES API: Starting file upload to Vercel Blob...")
    const uploadResult = await uploadFile(file, params.id, category)

    if (!uploadResult.success) {
      console.error("📤 FILES API: File upload failed:", uploadResult.error)
      return new Response(JSON.stringify({ success: false, error: uploadResult.error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("📤 FILES API: File uploaded to Vercel Blob successfully")

    // For now, we'll use a mock user ID since we don't have authentication
    // In production, this would come from the authenticated user
    const mockUserId = "1cae22cb-1311-48ca-9caa-47d474c0a20e" // Replace with actual auth

    // Insert file record into database
    console.log("📤 FILES API: Inserting file record into database...")
    const { data: fileRecord, error: insertError } = await supabase
      .from("deal_room_files")
      .insert({
        deal_room_id: params.id,
        uploader_id: mockUserId,
        file_name: file.name,
        file_path: uploadResult.publicUrl, // Store the Vercel Blob URL
        file_size_bytes: file.size,
        mime_type: file.type,
        type: category,
        description,
        version: 1,
        is_latest: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error("📤 FILES API: Database insert failed:", insertError.message)

      // Try to clean up uploaded file
      try {
        const { deleteFile } = await import("@/lib/storage/vercel-blob-storage")
        await deleteFile(uploadResult.publicUrl!)
        console.log("📤 FILES API: Cleaned up uploaded file after database error")
      } catch (cleanupError) {
        console.error("📤 FILES API: Failed to cleanup file:", cleanupError)
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to save file record",
          details: insertError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    console.log("📤 FILES API: File record saved successfully:", fileRecord.id)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "File uploaded successfully",
        file: {
          id: fileRecord.id,
          name: fileRecord.file_name,
          size: fileRecord.file_size_bytes,
          type: fileRecord.mime_type,
          category: fileRecord.type,
          url: uploadResult.publicUrl,
          uploadedAt: fileRecord.created_at,
          version: fileRecord.version,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error: any) {
    console.error("📤 FILES API: Unexpected error:", getErrorMessage(error))
    return new Response(
      JSON.stringify({
        success: false,
        error: "File upload failed",
        details: getErrorMessage(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  console.log("🗑️ FILES API: Starting file deletion for deal room:", params.id)

  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("fileId")

    if (!fileId) {
      return new Response(JSON.stringify({ success: false, error: "File ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Import required modules
    const { createClient } = await import("@supabase/supabase-js")
    const { deleteFile } = await import("@/lib/storage/vercel-blob-storage")

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get file record
    const { data: fileRecord, error: fetchError } = await supabase
      .from("deal_room_files")
      .select("*")
      .eq("id", fileId)
      .eq("deal_room_id", params.id)
      .single()

    if (fetchError || !fileRecord) {
      return new Response(JSON.stringify({ success: false, error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Delete from Vercel Blob
    const deleteResult = await deleteFile(fileRecord.file_path)
    if (!deleteResult.success) {
      console.error("🗑️ FILES API: Failed to delete from Vercel Blob:", deleteResult.error)
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabase.from("deal_room_files").delete().eq("id", fileId)

    if (deleteError) {
      console.error("🗑️ FILES API: Database deletion failed:", deleteError.message)
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to delete file record",
          details: deleteError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    console.log("🗑️ FILES API: File deleted successfully:", fileId)

    return new Response(
      JSON.stringify({
        success: true,
        message: "File deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error: any) {
    console.error("🗑️ FILES API: Unexpected error:", getErrorMessage(error))
    return new Response(
      JSON.stringify({
        success: false,
        error: "File deletion failed",
        details: getErrorMessage(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
