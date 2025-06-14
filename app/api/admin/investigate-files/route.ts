import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  console.log("🔍 ADMIN FILE INVESTIGATION: Starting...")
  console.log("🔍 ADMIN FILE INVESTIGATION: Timestamp:", new Date().toISOString())

  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    console.log("🔍 ADMIN FILE INVESTIGATION: Supabase client created")

    // Get authenticated user with better error handling
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("🔍 ADMIN FILE INVESTIGATION: Auth check result:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError?.message,
    })

    if (!user) {
      console.log("🔍 ADMIN FILE INVESTIGATION: No authenticated user found")
      return NextResponse.json(
        {
          error: "Unauthorized",
          details: "No authenticated user found",
          authError: authError?.message,
        },
        { status: 401 },
      )
    }

    console.log(`🔍 ADMIN FILE INVESTIGATION: User authenticated: ${user.id} (${user.email})`)

    const investigation = {
      timestamp: new Date().toISOString(),
      userId: user.id,
      userEmail: user.email,
      findings: {} as any,
    }

    // 1. Check deal_room_files table
    console.log("🔍 ADMIN FILE INVESTIGATION: Checking deal_room_files table...")
    try {
      const { count: dealRoomFilesCount, error: countError } = await supabase
        .from("deal_room_files")
        .select("*", { count: "exact", head: true })

      console.log("🔍 ADMIN FILE INVESTIGATION: deal_room_files result:", {
        count: dealRoomFilesCount,
        error: countError?.message,
      })

      investigation.findings.dealRoomFiles = {
        exists: !countError,
        count: dealRoomFilesCount || 0,
        error: countError?.message,
      }

      if (!countError) {
        // Get sample files
        const { data: sampleFiles, error: sampleError } = await supabase.from("deal_room_files").select("*").limit(5)

        console.log("🔍 ADMIN FILE INVESTIGATION: Sample files:", {
          count: sampleFiles?.length || 0,
          error: sampleError?.message,
        })

        investigation.findings.dealRoomFiles.sample = sampleFiles
        investigation.findings.dealRoomFiles.sampleError = sampleError?.message
      }
    } catch (error) {
      console.log("🔍 ADMIN FILE INVESTIGATION: deal_room_files error:", error)
      investigation.findings.dealRoomFiles = {
        exists: false,
        error: error instanceof Error ? getErrorMessage(error) : "Table not accessible",
      }
    }

    // 2. Check our specific listing
    console.log("🔍 ADMIN FILE INVESTIGATION: Checking specific listing...")
    const listingId = "02af5e91-c15f-4f52-8bc4-f71488c6efab"
    try {
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .single()

      console.log("🔍 ADMIN FILE INVESTIGATION: Listing query result:", {
        found: !!listing,
        error: listingError?.message,
        listingId: listing?.id,
        title: listing?.title,
      })

      if (!listingError && listing) {
        investigation.findings.targetListing = {
          found: true,
          id: listing.id,
          title: listing.title,
          createdAt: listing.created_at,
          buyerId: listing.buyer_id,
          allColumns: Object.keys(listing),
        }

        // Check for file-related columns in the listing
        const fileColumns = Object.keys(listing).filter(
          (key) =>
            key.toLowerCase().includes("file") ||
            key.toLowerCase().includes("attachment") ||
            key.toLowerCase().includes("document") ||
            key.toLowerCase().includes("upload") ||
            key.toLowerCase().includes("requirement") ||
            key.toLowerCase().includes("specification"),
        )

        console.log("🔍 ADMIN FILE INVESTIGATION: File-related columns found:", fileColumns)

        investigation.findings.targetListing.fileColumns = fileColumns.map((col) => ({
          column: col,
          value: listing[col],
          hasData: listing[col] !== null && listing[col] !== undefined && listing[col] !== "",
          type: typeof listing[col],
        }))

        // Check for JSON columns that might contain file data
        const jsonColumns = Object.entries(listing)
          .filter(([key, value]) => {
            if (typeof value === "object" && value !== null) {
              const jsonStr = JSON.stringify(value).toLowerCase()
              return (
                jsonStr.includes("file") ||
                jsonStr.includes("upload") ||
                jsonStr.includes("attachment") ||
                jsonStr.includes("document")
              )
            }
            return false
          })
          .map(([key, value]) => ({ column: key, value }))

        console.log("🔍 ADMIN FILE INVESTIGATION: JSON file columns found:", jsonColumns.length)

        investigation.findings.targetListing.jsonFileColumns = jsonColumns

        // Check specific columns that might contain file data
        const potentialFileColumns = [
          "requirements",
          "specifications",
          "attachments",
          "files",
          "project_requirements",
          "additional_info",
          "details",
        ]

        investigation.findings.targetListing.potentialFileData = potentialFileColumns
          .filter((col) => listing[col] !== null && listing[col] !== undefined)
          .map((col) => ({
            column: col,
            value: listing[col],
            type: typeof listing[col],
            length:
              typeof listing[col] === "string"
                ? listing[col].length
                : typeof listing[col] === "object"
                  ? JSON.stringify(listing[col]).length
                  : 0,
          }))
      } else {
        investigation.findings.targetListing = {
          found: false,
          error: listingError?.message,
          searchedId: listingId,
        }
      }
    } catch (error) {
      console.log("🔍 ADMIN FILE INVESTIGATION: Listing query error:", error)
      investigation.findings.targetListing = {
        found: false,
        error: error instanceof Error ? getErrorMessage(error) : "Query failed",
      }
    }

    // 3. Check our specific proposal
    console.log("🔍 ADMIN FILE INVESTIGATION: Checking specific proposal...")
    const proposalId = "1a75e713-3f56-4603-9067-b997d05d8d07"
    try {
      const { data: proposal, error: proposalError } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", proposalId)
        .single()

      console.log("🔍 ADMIN FILE INVESTIGATION: Proposal query result:", {
        found: !!proposal,
        error: proposalError?.message,
        proposalId: proposal?.id,
      })

      if (!proposalError && proposal) {
        investigation.findings.targetProposal = {
          found: true,
          id: proposal.id,
          listingId: proposal.listing_id,
          sellerId: proposal.seller_id,
          createdAt: proposal.created_at,
          allColumns: Object.keys(proposal),
        }

        // Check for file-related columns in the proposal
        const fileColumns = Object.keys(proposal).filter(
          (key) =>
            key.toLowerCase().includes("file") ||
            key.toLowerCase().includes("attachment") ||
            key.toLowerCase().includes("document") ||
            key.toLowerCase().includes("portfolio") ||
            key.toLowerCase().includes("sample"),
        )

        console.log("🔍 ADMIN FILE INVESTIGATION: Proposal file columns:", fileColumns)

        investigation.findings.targetProposal.fileColumns = fileColumns.map((col) => ({
          column: col,
          value: proposal[col],
          hasData: proposal[col] !== null && proposal[col] !== undefined && proposal[col] !== "",
          type: typeof proposal[col],
        }))

        // Check for potential file data in proposal
        const potentialFileColumns = [
          "portfolio_samples",
          "attachments",
          "files",
          "work_samples",
          "additional_info",
          "proposal_details",
          "cover_letter",
        ]

        investigation.findings.targetProposal.potentialFileData = potentialFileColumns
          .filter((col) => proposal[col] !== null && proposal[col] !== undefined)
          .map((col) => ({
            column: col,
            value: proposal[col],
            type: typeof proposal[col],
            length:
              typeof proposal[col] === "string"
                ? proposal[col].length
                : typeof proposal[col] === "object"
                  ? JSON.stringify(proposal[col]).length
                  : 0,
          }))
      } else {
        investigation.findings.targetProposal = {
          found: false,
          error: proposalError?.message,
          searchedId: proposalId,
        }
      }
    } catch (error) {
      console.log("🔍 ADMIN FILE INVESTIGATION: Proposal query error:", error)
      investigation.findings.targetProposal = {
        found: false,
        error: error instanceof Error ? getErrorMessage(error) : "Query failed",
      }
    }

    // 4. Check for alternative file storage tables
    console.log("🔍 ADMIN FILE INVESTIGATION: Checking alternative file tables...")
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

    investigation.findings.alternativeTables = {}

    for (const tableName of alternativeTables) {
      try {
        console.log(`🔍 ADMIN FILE INVESTIGATION: Checking table: ${tableName}`)

        const { count, error } = await supabase.from(tableName).select("*", { count: "exact", head: true })

        console.log(`🔍 ADMIN FILE INVESTIGATION: Table ${tableName} result:`, {
          exists: !error,
          count: count || 0,
          error: error?.message,
        })

        investigation.findings.alternativeTables[tableName] = {
          exists: !error,
          count: count || 0,
          error: error?.message,
        }

        // If table exists and has records, get sample
        if (!error && count && count > 0) {
          const { data: sample, error: sampleError } = await supabase.from(tableName).select("*").limit(3)

          investigation.findings.alternativeTables[tableName].sample = sample
          investigation.findings.alternativeTables[tableName].sampleError = sampleError?.message

          console.log(`🔍 ADMIN FILE INVESTIGATION: Table ${tableName} sample:`, {
            sampleCount: sample?.length || 0,
            sampleError: sampleError?.message,
          })
        }
      } catch (error) {
        console.log(`🔍 ADMIN FILE INVESTIGATION: Table ${tableName} error:`, error)
        investigation.findings.alternativeTables[tableName] = {
          exists: false,
          error: error instanceof Error ? getErrorMessage(error) : "Table not accessible",
        }
      }
    }

    // 5. Check current deal room
    console.log("🔍 ADMIN FILE INVESTIGATION: Checking current deal room...")
    const dealRoomId = "15dcb8b3-2a2d-435b-b559-1f199e653034"
    try {
      const { data: dealRoom, error: dealRoomError } = await supabase
        .from("deal_rooms")
        .select("*")
        .eq("id", dealRoomId)
        .single()

      console.log("🔍 ADMIN FILE INVESTIGATION: Deal room query result:", {
        found: !!dealRoom,
        error: dealRoomError?.message,
        dealRoomId: dealRoom?.id,
      })

      investigation.findings.currentDealRoom = {
        found: !dealRoomError,
        data: dealRoom,
        error: dealRoomError?.message,
      }
    } catch (error) {
      console.log("🔍 ADMIN FILE INVESTIGATION: Deal room query error:", error)
      investigation.findings.currentDealRoom = {
        found: false,
        error: error instanceof Error ? getErrorMessage(error) : "Query failed",
      }
    }

    console.log("🔍 ADMIN FILE INVESTIGATION: Investigation complete!")
    console.log("🔍 ADMIN FILE INVESTIGATION: Summary:", {
      dealRoomFilesCount: investigation.findings.dealRoomFiles?.count || 0,
      targetListingFound: investigation.findings.targetListing?.found || false,
      targetProposalFound: investigation.findings.targetProposal?.found || false,
      alternativeTablesFound: Object.values(investigation.findings.alternativeTables || {}).filter(
        (table: any) => table.exists,
      ).length,
    })

    return NextResponse.json({
      success: true,
      investigation,
    })
  } catch (error) {
    console.error("🔍 ADMIN FILE INVESTIGATION: Fatal error:", error)
    return NextResponse.json(
      {
        error: "Investigation failed",
        details: error instanceof Error ? getErrorMessage(error) : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
