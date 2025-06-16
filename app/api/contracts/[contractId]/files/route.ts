import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { ContractFile } from "@/types"

export async function GET(request: Request, { params }: { params: { contractId: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { contractId } = params

  if (!contractId) {
    return NextResponse.json({ error: "Contract ID is required" }, { status: 400 })
  }

  try {
    const { data: files, error } = await supabase
      .from("contract_files")
      .select(`
        *,
        uploader:users!contract_files_uploaded_by_fkey (id, full_name, email),
        versions:contract_file_versions (
          *,
          uploader:users!contract_file_versions_uploaded_by_fkey (id, full_name, email)
        ),
        current_version:contract_file_versions!contract_files_current_version_id_fkey (
          *,
          uploader:users!contract_file_versions_uploaded_by_fkey (id, full_name, email)
        )
      `)
      .eq("contract_id", contractId)
      .order("created_at", { ascending: false })
      .order("version_number", { referencedTable: "versions", ascending: false })

    if (error) {
      console.error("Error fetching contract files:", error)
      return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
    }

    // Ensure versions is always an array
    const processedFiles =
      files?.map((file: any) => ({
        ...file,
        versions: Array.isArray(file.versions) ? file.versions : [],
      })) || []

    return NextResponse.json(processedFiles as ContractFile[])
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { contractId: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { contractId } = params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!contractId) {
    return NextResponse.json({ error: "Contract ID is required" }, { status: 400 })
  }

  try {
    const { file_name, description, category, deal_room_id } = await request.json()

    if (!file_name || !category || !deal_room_id) {
      return NextResponse.json({ error: "Missing required fields: file_name, category, deal_room_id" }, { status: 400 })
    }

    const { data: newFile, error } = await supabase
      .from("contract_files")
      .insert({
        contract_id: contractId,
        deal_room_id: deal_room_id, // Make sure this is passed from client, or fetch contract to get it
        file_name,
        description,
        category,
        uploaded_by: user.id,
      })
      .select(`
        *,
        uploader:users!contract_files_uploaded_by_fkey (id, full_name, email),
        versions:contract_file_versions (*),
        current_version:contract_file_versions!contract_files_current_version_id_fkey (*)
      `)
      .single()

    if (error) {
      console.error("Error creating contract file record:", error)
      return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
    }

    // Ensure versions is always an array
    const processedFile = {
      ...newFile,
      versions: Array.isArray(newFile.versions) ? newFile.versions : [],
    }

    return NextResponse.json(processedFile as ContractFile, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "An unexpected error occurred" }, { status: 500 })
  }
}
