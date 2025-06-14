import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { put } from "@vercel/blob"
import type { ContractFileVersion } from "@/types"

export async function POST(request: Request, { params }: { params: { fileId: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { fileId: contract_file_id } = params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!contract_file_id) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const change_description = formData.get("change_description") as string | null

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // 1. Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public", // Or 'private' if you handle signed URLs
      // You might want to add a unique prefix, like `deal-rooms/${dealRoomId}/${contract_file_id}/${file.name}`
      // For simplicity, using file.name directly here. Ensure it's unique enough or handle naming.
    })

    // 2. Determine new version number
    const { data: maxVersionData, error: maxVersionError } = await supabase
      .from("contract_file_versions")
      .select("version_number")
      .eq("contract_file_id", contract_file_id)
      .order("version_number", { ascending: false })
      .limit(1)
      .single()

    if (maxVersionError && maxVersionError.code !== "PGRST116") {
      // PGRST116: no rows found
      console.error("Error fetching max version:", maxVersionError)
      return NextResponse.json({ error: "Could not determine version number." }, { status: 500 })
    }
    const newVersionNumber = (maxVersionData?.version_number || 0) + 1

    // 3. Create new contract_file_versions record
    const newVersionData = {
      contract_file_id,
      version_number: newVersionNumber,
      blob_url: blob.url,
      file_type: blob.contentType,
      file_size_bytes: file.size,
      change_description,
      uploaded_by: user.id,
    }

    const { data: newVersion, error: insertError } = await supabase
      .from("contract_file_versions")
      .insert(newVersionData)
      .select(`
        *,
        uploader:users!contract_file_versions_uploaded_by_fkey (id, full_name, email)
      `)
      .single()

    if (insertError) {
      console.error("Error inserting file version:", insertError)
      // Potentially delete blob if DB insert fails
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // 4. Update contract_files.current_version_id
    const { error: updateError } = await supabase
      .from("contract_files")
      .update({ current_version_id: newVersion.id, updated_at: new Date().toISOString() })
      .eq("id", contract_file_id)

    if (updateError) {
      console.error("Error updating current_version_id:", updateError)
      // This is problematic as blob and version record exist. Manual fix or more robust transaction needed.
      return NextResponse.json({ error: "File version uploaded, but failed to set as current." }, { status: 500 })
    }

    return NextResponse.json(newVersion as ContractFileVersion, { status: 201 })
  } catch (e: any) {
    console.error("Unexpected error uploading file version:", e)
    return NextResponse.json({ error: e.message || "An unexpected error occurred" }, { status: 500 })
  }
}
