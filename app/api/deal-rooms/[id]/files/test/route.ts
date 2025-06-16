import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const dealRoomId = params.id
  console.log(`🔍 FILES TEST API: Starting test operations for deal room: ${dealRoomId}`)

  const results: Record<string, any> = {
    operations: {},
    errors: {},
    success: false,
  }

  try {
    // Setup
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Test 1: GET (empty or current state)
    console.log(`🔍 FILES TEST API: Test 1 - GET files`)
    try {
      const { data: files, error } = await supabase.from("deal_room_files").select("*").eq("deal_room_id", dealRoomId)

      if (error) throw error

      results.operations.get = {
        success: true,
        count: files.length,
        message: `Found ${files.length} files`,
      }
    } catch (error: any) {
      results.errors.get = getErrorMessage(error)
      results.operations.get = { success: false, message: getErrorMessage(error) }
    }

    // Test 2: POST (file upload)
    console.log(`🔍 FILES TEST API: Test 2 - POST file upload`)
    try {
      const testFile = {
        deal_room_id: dealRoomId,
        uploader_id: user.id,
        contract_id: null,
        milestone_id: null,
        file_name: `test-file-${Date.now()}.txt`,
        file_path: "https://example.com/test-file.txt",
        file_size_bytes: 1024,
        mime_type: "text/plain",
        type: "OTHER",
        description: "Test file for API testing",
        version: 1,
        parent_file_id: null,
        is_latest: true,
      }

      const { data: uploadedFile, error } = await supabase.from("deal_room_files").insert(testFile).select().single()

      if (error) throw error

      results.operations.post = {
        success: true,
        fileId: uploadedFile.id,
        message: `File uploaded with ID: ${uploadedFile.id}`,
      }

      // Store for later tests
      results.testFileId = uploadedFile.id
    } catch (error: any) {
      results.errors.post = getErrorMessage(error)
      results.operations.post = { success: false, message: getErrorMessage(error) }
    }

    // Test 3: GET (with files)
    if (results.operations.post?.success) {
      console.log(`🔍 FILES TEST API: Test 3 - GET files after upload`)
      try {
        const { data: files, error } = await supabase.from("deal_room_files").select("*").eq("deal_room_id", dealRoomId)

        if (error) throw error

        results.operations.getAfterUpload = {
          success: true,
          count: files.length,
          message: `Found ${files.length} files after upload`,
        }
      } catch (error: any) {
        results.errors.getAfterUpload = getErrorMessage(error)
        results.operations.getAfterUpload = { success: false, message: getErrorMessage(error) }
      }
    }

    // Test 4: Version upload
    if (results.testFileId) {
      console.log(`🔍 FILES TEST API: Test 4 - Version upload`)
      try {
        const versionFile = {
          deal_room_id: dealRoomId,
          uploader_id: user.id,
          contract_id: null,
          milestone_id: null,
          file_name: `test-file-${Date.now()}-v2.txt`,
          file_path: "https://example.com/test-file-v2.txt",
          file_size_bytes: 2048,
          mime_type: "text/plain",
          type: "OTHER",
          description: "Test file version 2",
          version: 2,
          parent_file_id: results.testFileId,
          is_latest: true,
        }

        // First mark previous version as not latest
        await supabase.from("deal_room_files").update({ is_latest: false }).eq("id", results.testFileId)

        const { data: versionedFile, error } = await supabase
          .from("deal_room_files")
          .insert(versionFile)
          .select()
          .single()

        if (error) throw error

        results.operations.version = {
          success: true,
          fileId: versionedFile.id,
          message: `Version 2 uploaded with ID: ${versionedFile.id}`,
        }

        // Store for later cleanup
        results.versionFileId = versionedFile.id
      } catch (error: any) {
        results.errors.version = getErrorMessage(error)
        results.operations.version = { success: false, message: getErrorMessage(error) }
      }
    }

    // Test 5: DELETE
    if (results.testFileId) {
      console.log(`🔍 FILES TEST API: Test 5 - DELETE file`)
      try {
        // Delete the original file and its versions
        const { error } = await supabase
          .from("deal_room_files")
          .delete()
          .or(`id.eq.${results.testFileId},parent_file_id.eq.${results.testFileId}`)

        if (error) throw error

        results.operations.delete = {
          success: true,
          message: `File and versions deleted successfully`,
        }
      } catch (error: any) {
        results.errors.delete = getErrorMessage(error)
        results.operations.delete = { success: false, message: getErrorMessage(error) }
      }
    }

    // Final check
    console.log(`🔍 FILES TEST API: Final verification`)
    try {
      const { data: files, error } = await supabase.from("deal_room_files").select("*").eq("deal_room_id", dealRoomId)

      if (error) throw error

      results.operations.finalCheck = {
        success: true,
        count: files.length,
        message: `Found ${files.length} files after all operations`,
      }
    } catch (error: any) {
      results.errors.finalCheck = getErrorMessage(error)
      results.operations.finalCheck = { success: false, message: getErrorMessage(error) }
    }

    // All tests completed
    results.success = Object.keys(results.errors).length === 0
    console.log(`🔍 FILES TEST API: Tests completed with ${results.success ? "SUCCESS" : "ERRORS"}`)

    return NextResponse.json(results)
  } catch (error: any) {
    console.error(`🔍 FILES TEST API: Unhandled error:`, error)
    results.errors.unhandled = getErrorMessage(error)
    return NextResponse.json(results, { status: 500 })
  }
}
