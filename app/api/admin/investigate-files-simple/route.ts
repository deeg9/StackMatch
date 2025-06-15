import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  console.log(`🔍 SIMPLE FILE INVESTIGATION: Starting...`)
  console.log(`🔍 SIMPLE FILE INVESTIGATION: Timestamp: ${new Date().toISOString()}`)

  try {
    console.log(`🔍 SIMPLE FILE INVESTIGATION: Creating Supabase client...`)

    // Create a direct Supabase client using environment variables
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    console.log(`🔍 SIMPLE FILE INVESTIGATION: Supabase client created`)

    // Check deal_room_files table
    console.log(`🔍 SIMPLE FILE INVESTIGATION: Checking deal_room_files table...`)
    const { count: dealRoomFilesCount, error: dealRoomFilesError } = await supabase
      .from("deal_room_files")
      .select("*", { count: "exact", head: true })

    console.log(`🔍 SIMPLE FILE INVESTIGATION: deal_room_files result:`, { count: dealRoomFilesCount })

    // Get a sample of files if they exist
    let sampleFiles: any[] = []
    if (dealRoomFilesCount && dealRoomFilesCount > 0) {
      const { data: files } = await supabase.from("deal_room_files").select("*").limit(5)

      sampleFiles = files || []
    }

    console.log(`🔍 SIMPLE FILE INVESTIGATION: Sample files:`, { count: sampleFiles.length })

    // Check a specific listing to see how files are stored
    console.log(`🔍 SIMPLE FILE INVESTIGATION: Checking specific listing...`)
    const { data: listing, error: listingError } = await supabase.from("listings").select("*").limit(1).single()

    let listingResult: { found: boolean; listingId?: string; title?: string } = { found: false }
    const fileColumns: string[] = []
    const jsonFileColumns: any[] = []
    let listingRecord: { [key: string]: any } | null = null

    if (listing && !listingError) {
      listingResult = {
        found: true,
        listingId: listing.id,
        title: listing.title,
      }

      // Look for file-related columns
      listingRecord = listing as { [key: string]: any }
      const fileRelatedColumns = Object.keys(listingRecord).filter(
        (key) =>
          key.includes("file") || key.includes("attachment") || key.includes("document") || key.includes("upload"),
      )

      console.log(`🔍 SIMPLE FILE INVESTIGATION: File-related columns found:`, fileRelatedColumns)

      // Check if any columns contain JSON file data
      for (const column of Object.keys(listingRecord)) {
        const value = listingRecord[column]
        if (value && typeof value === "object") {
          try {
            // Check if it's an array of file objects
            if (Array.isArray(value) && value.length > 0) {
              const firstItem = value[0]
              if (firstItem && (firstItem.name || firstItem.url || firstItem.file_name || firstItem.file_url)) {
                jsonFileColumns.push({
                  column,
                  value,
                  hasData: true,
                  type: "object",
                })
              }
            }
            // Check if it's a single file object
            else if (value.name || value.url || value.file_name || value.file_url) {
              jsonFileColumns.push({
                column,
                value,
                hasData: true,
                type: "object",
              })
            }
          } catch (e) {
            // Not a valid JSON object
          }
        }
      }

      console.log(`🔍 SIMPLE FILE INVESTIGATION: JSON file columns found:`, jsonFileColumns.length)
    }

    // Check a specific proposal
    console.log(`🔍 SIMPLE FILE INVESTIGATION: Checking specific proposal...`)
    const { data: proposal, error: proposalError } = await supabase.from("proposals").select("*").limit(1).single()

    let proposalResult: { found: boolean; proposalId?: string } = { found: false }
    let proposalFileColumns: string[] = []
    let proposalRecord: { [key: string]: any } | null = null

    if (proposal && !proposalError) {
      proposalResult = {
        found: true,
        proposalId: proposal.id,
      }

      // Look for file-related columns
      proposalRecord = proposal as { [key: string]: any }
      proposalFileColumns = Object.keys(proposalRecord).filter(
        (key) =>
          key.includes("file") || key.includes("attachment") || key.includes("document") || key.includes("upload"),
      )

      console.log(`🔍 SIMPLE FILE INVESTIGATION: Proposal file columns:`, proposalFileColumns)
    }

    // Check alternative file tables
    console.log(`🔍 SIMPLE FILE INVESTIGATION: Checking alternative file tables...`)
    const alternativeTables = [
      "listing_files",
      "listing_attachments",
      "project_files",
      "file_attachments",
      "documents",
      "uploads",
      "proposal_files",
      "proposal_attachments",
      "user_files",
      "media_files",
    ]

    const tableResults: { [key: string]: { exists: boolean; count?: number; error?: string } } = {}

    for (const tableName of alternativeTables) {
      console.log(`🔍 SIMPLE FILE INVESTIGATION: Checking table: ${tableName}`)
      try {
        const { count, error } = await supabase.from(tableName).select("*", { count: "exact", head: true })

        tableResults[tableName] = {
          exists: !error,
          count: count || 0,
        }

        console.log(`🔍 SIMPLE FILE INVESTIGATION: Table ${tableName} result:`, tableResults[tableName])
      } catch (e) {
        tableResults[tableName] = {
          exists: false,
          error: "Table does not exist",
        }
      }
    }

    // Check current deal room
    console.log(`🔍 SIMPLE FILE INVESTIGATION: Checking current deal room...`)
    const { data: dealRoom, error: dealRoomError } = await supabase.from("deal_rooms").select("*").limit(1).single()

    let dealRoomResult: { found: boolean; dealRoomId?: string; data?: any } = { found: false }

    if (dealRoom && !dealRoomError) {
      dealRoomResult = {
        found: true,
        dealRoomId: dealRoom.id,
        data: dealRoom,
      }

      console.log(`🔍 SIMPLE FILE INVESTIGATION: Deal room query result:`, {
        found: true,
        dealRoomId: dealRoom.id,
      })
    }

    console.log(`🔍 SIMPLE FILE INVESTIGATION: Investigation complete!`)

    // Prepare findings summary
    const summary = {
      dealRoomFilesCount: dealRoomFilesCount || 0,
      targetListingFound: listingResult.found,
      targetProposalFound: proposalResult.found,
      alternativeTablesFound: Object.keys(tableResults).filter((t) => tableResults[t].exists).length,
    }

    console.log(`🔍 SIMPLE FILE INVESTIGATION: Summary:`, summary)

    // Prepare detailed findings
    const findings = {
      dealRoomFiles: {
        exists: !dealRoomFilesError,
        count: dealRoomFilesCount || 0,
        sample: sampleFiles,
      },
      targetListing: listingResult.found && listingRecord
        ? {
            found: true,
            id: listingRecord.id,
            title: listingRecord.title,
            createdAt: listingRecord.created_at,
            buyerId: listingRecord.buyer_id,
            allColumns: Object.keys(listingRecord),
            fileColumns: Object.keys(listingRecord)
              .filter((key) => key.includes("file") || key.includes("attachment") || key.includes("document"))
              .map((column) => ({
                column,
                value: listingRecord[column],
                hasData: !!listingRecord[column],
                type: typeof listingRecord[column],
              })),
            jsonFileColumns,
            potentialFileData: Object.keys(listingRecord)
              .filter((key) => listingRecord[key] && typeof listingRecord[key] === "object")
              .map((column) => ({
                column,
                value: listingRecord[column],
                type: typeof listingRecord[column],
                length: JSON.stringify(listingRecord[column]).length,
              })),
          }
        : { found: false },
      targetProposal: proposalResult.found && proposalRecord
        ? {
            found: true,
            id: proposalRecord.id,
            listingId: proposalRecord.listing_id,
            sellerId: proposalRecord.seller_id,
            createdAt: proposalRecord.created_at,
            allColumns: Object.keys(proposalRecord),
            fileColumns: proposalFileColumns.map((column) => ({
              column,
              value: proposalRecord[column],
              hasData: !!proposalRecord[column],
              type: typeof proposalRecord[column],
            })),
            potentialFileData: Object.keys(proposalRecord)
              .filter(
                (key) =>
                  proposalRecord[key] &&
                  (typeof proposalRecord[key] === "object" ||
                    (typeof proposalRecord[key] === "string" && proposalRecord[key].length > 5)),
              )
              .map((column) => ({
                column,
                value: proposalRecord[column],
                type: typeof proposalRecord[column],
                length:
                  typeof proposalRecord[column] === "string"
                    ? proposalRecord[column].length
                    : JSON.stringify(proposalRecord[column]).length,
              })),
          }
        : { found: false },
      alternativeTables: tableResults,
      currentDealRoom: dealRoomResult,
    }

    return NextResponse.json({
      success: true,
      investigation: {
        timestamp: new Date().toISOString(),
        findings,
      },
    })
  } catch (error) {
    console.error("🔍 SIMPLE FILE INVESTIGATION: Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
