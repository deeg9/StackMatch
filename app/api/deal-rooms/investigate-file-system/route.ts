import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  console.log("🔍 FILE SYSTEM INVESTIGATION: Starting comprehensive investigation...")

  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`🔍 FILE SYSTEM INVESTIGATION: User authenticated: ${user.id}`)

    const investigation = {
      timestamp: new Date().toISOString(),
      userId: user.id,
      findings: {} as any,
    }

    // 1. Check for file-related tables
    console.log("🔍 FILE SYSTEM INVESTIGATION: Checking file-related tables...")
    const { data: fileTables, error: fileTablesError } = await supabase.rpc("execute_sql", {
      query: `
        SELECT table_name, table_schema
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND (
          table_name LIKE '%file%' OR 
          table_name LIKE '%attachment%' OR 
          table_name LIKE '%document%' OR
          table_name LIKE '%upload%'
        )
        ORDER BY table_name;
      `,
    })

    if (fileTablesError) {
      console.log("🔍 FILE SYSTEM INVESTIGATION: Using direct table check...")
      // Fallback: Check specific tables directly
      const tableChecks = await Promise.allSettled([
        supabase.from("deal_room_files").select("count", { count: "exact", head: true }),
        supabase.from("listing_files").select("count", { count: "exact", head: true }),
        supabase.from("file_attachments").select("count", { count: "exact", head: true }),
      ])

      investigation.findings.availableTables = {
        deal_room_files: tableChecks[0].status === "fulfilled",
        listing_files: tableChecks[1].status === "fulfilled",
        file_attachments: tableChecks[2].status === "fulfilled",
      }
    } else {
      investigation.findings.fileTables = fileTables
    }

    // 2. Check deal_room_files table structure
    console.log("🔍 FILE SYSTEM INVESTIGATION: Checking deal_room_files structure...")
    try {
      const { data: dealRoomFilesStructure, error: structureError } = await supabase
        .from("deal_room_files")
        .select("*")
        .limit(1)

      if (!structureError) {
        investigation.findings.dealRoomFilesExists = true
        investigation.findings.dealRoomFilesStructure = "Table exists and accessible"
      }
    } catch (error) {
      investigation.findings.dealRoomFilesExists = false
      investigation.findings.dealRoomFilesError = error
    }

    // 3. Check specific listing
    console.log("🔍 FILE SYSTEM INVESTIGATION: Checking specific listing...")
    const listingId = "02af5e91-c15f-4f52-8bc4-f71488c6efab"
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, title, description, created_at, buyer_id")
      .eq("id", listingId)
      .single()

    if (listingError) {
      investigation.findings.listingError = listingError
    } else {
      investigation.findings.listing = listing
    }

    // 4. Check for listing files (try different possible table names)
    console.log("🔍 FILE SYSTEM INVESTIGATION: Checking for listing files...")
    const possibleListingFileTables = ["listing_files", "listing_attachments", "project_files"]

    for (const tableName of possibleListingFileTables) {
      try {
        const { data: files, error } = await supabase.from(tableName).select("*").eq("listing_id", listingId)

        if (!error) {
          investigation.findings[`${tableName}_found`] = true
          investigation.findings[`${tableName}_count`] = files?.length || 0
          investigation.findings[`${tableName}_sample`] = files?.slice(0, 2) || []
        }
      } catch (error) {
        investigation.findings[`${tableName}_error`] = `Table does not exist or not accessible`
      }
    }

    // 5. Check current deal room files
    console.log("🔍 FILE SYSTEM INVESTIGATION: Checking current deal room files...")
    const dealRoomId = "15dcb8b3-2a2d-435b-b559-1f199e653034"
    try {
      const { data: dealRoomFiles, error: dealRoomFilesError } = await supabase
        .from("deal_room_files")
        .select("*")
        .eq("deal_room_id", dealRoomId)

      if (!dealRoomFilesError) {
        investigation.findings.currentDealRoomFiles = {
          count: dealRoomFiles?.length || 0,
          files: dealRoomFiles || [],
        }
      } else {
        investigation.findings.dealRoomFilesQueryError = dealRoomFilesError
      }
    } catch (error) {
      investigation.findings.dealRoomFilesException = error
    }

    // 6. Check listings table for file-related columns
    console.log("🔍 FILE SYSTEM INVESTIGATION: Checking listings table for file columns...")
    try {
      const { data: listingWithAllColumns, error: listingAllError } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .single()

      if (!listingAllError && listingWithAllColumns) {
        const fileRelatedColumns = Object.keys(listingWithAllColumns).filter(
          (key: any) =>
            key.toLowerCase().includes("file") ||
            key.toLowerCase().includes("attachment") ||
            key.toLowerCase().includes("document"),
        )

        investigation.findings.listingFileColumns = fileRelatedColumns
        investigation.findings.listingFileData = fileRelatedColumns.reduce((acc: any, col: any) => {
          acc[col] = listingWithAllColumns[col]
          return acc
        }, {} as any)
      }
    } catch (error) {
      investigation.findings.listingColumnsError = error
    }

    // 7. Check if files might be stored in a JSON column
    console.log("🔍 FILE SYSTEM INVESTIGATION: Checking for JSON file storage...")
    try {
      const { data: listingFull, error } = await supabase.from("listings").select("*").eq("id", listingId).single()

      if (!error && listingFull) {
        // Look for JSON columns that might contain file data
        const jsonColumns = Object.entries(listingFull).filter(([key, value]: any) => {
          if (typeof value === "object" && value !== null) {
            const jsonStr = JSON.stringify(value).toLowerCase()
            return jsonStr.includes("file") || jsonStr.includes("upload") || jsonStr.includes("attachment")
          }
          return false
        })

        investigation.findings.jsonFileColumns = jsonColumns
      }
    } catch (error) {
      investigation.findings.jsonCheckError = error
    }

    console.log("🔍 FILE SYSTEM INVESTIGATION: Investigation complete")
    console.log("🔍 FILE SYSTEM INVESTIGATION: Findings:", JSON.stringify(investigation.findings, null, 2))

    return NextResponse.json({
      success: true,
      investigation,
    })
  } catch (error) {
    console.error("🔍 FILE SYSTEM INVESTIGATION: Error:", error)
    return NextResponse.json(
      {
        error: "Investigation failed",
        details: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      },
      { status: 500 },
    )
  }
}
