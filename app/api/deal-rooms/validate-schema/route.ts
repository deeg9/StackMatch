import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
export async function GET() {
  console.log("🔍 SCHEMA VALIDATION: Starting schema validation")

  try {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const { createClient } = await import("@supabase/supabase-js")
    const supabase = await createClient(supabaseUrl, supabaseKey)

    console.log("🔍 SCHEMA VALIDATION: Supabase client created")

    const results = {
      listings: { exists: false, columns: [] as string[], error: null as string | null },
      proposals: { exists: false, columns: [] as string[], error: null as string | null },
      deal_room_files: { exists: false, columns: [] as string[], error: null as string | null },
      summary: { allTablesExist: false, allColumnsExist: false, issues: [] as string[] },
    }

    // Test listings table
    console.log("🔍 SCHEMA VALIDATION: Testing listings table")
    try {
      const { data: listingsTest, error: listingsError } = await supabase
        .from("listings")
        .select("id, title, description, timeline, attachments")
        .limit(1)

      if (listingsError) {
        console.log("🔍 SCHEMA VALIDATION: Listings error:", listingsError.message)
        results.listings.error = listingsError.message
        if (listingsError.message.includes("timeline")) {
          results.summary.issues.push("Missing timeline column in listings table")
        }
        if (listingsError.message.includes("attachments")) {
          results.summary.issues.push("Missing attachments column in listings table")
        }
      } else {
        results.listings.exists = true
        results.listings.columns = ["id", "title", "description", "timeline", "attachments"]
        console.log("🔍 SCHEMA VALIDATION: Listings table OK")
      }
    } catch (error: any) {
      results.listings.error = getErrorMessage(error)
      console.log("🔍 SCHEMA VALIDATION: Listings exception:", getErrorMessage(error))
    }

    // Test proposals table
    console.log("🔍 SCHEMA VALIDATION: Testing proposals table")
    try {
      const { data: proposalsTest, error: proposalsError } = await supabase
        .from("proposals")
        .select("id, cover_letter, attachments")
        .limit(1)

      if (proposalsError) {
        console.log("🔍 SCHEMA VALIDATION: Proposals error:", proposalsError.message)
        results.proposals.error = proposalsError.message
        if (proposalsError.message.includes("attachments")) {
          results.summary.issues.push("Missing attachments column in proposals table")
        }
      } else {
        results.proposals.exists = true
        results.proposals.columns = ["id", "cover_letter", "attachments"]
        console.log("🔍 SCHEMA VALIDATION: Proposals table OK")
      }
    } catch (error: any) {
      results.proposals.error = getErrorMessage(error)
      console.log("🔍 SCHEMA VALIDATION: Proposals exception:", getErrorMessage(error))
    }

    // Test deal_room_files table
    console.log("🔍 SCHEMA VALIDATION: Testing deal_room_files table")
    try {
      const { data: filesTest, error: filesError } = await supabase
        .from("deal_room_files")
        .select("id, deal_room_id, file_name, version, parent_file_id, is_latest")
        .limit(1)

      if (filesError) {
        console.log("🔍 SCHEMA VALIDATION: Files error:", filesError.message)
        results.deal_room_files.error = filesError.message
        if (filesError.message.includes("relation") && filesError.message.includes("does not exist")) {
          results.summary.issues.push("deal_room_files table does not exist")
        }
      } else {
        results.deal_room_files.exists = true
        results.deal_room_files.columns = ["id", "deal_room_id", "file_name", "version", "parent_file_id", "is_latest"]
        console.log("🔍 SCHEMA VALIDATION: deal_room_files table OK")
      }
    } catch (error: any) {
      results.deal_room_files.error = getErrorMessage(error)
      console.log("🔍 SCHEMA VALIDATION: Files exception:", getErrorMessage(error))
    }

    // Calculate summary
    results.summary.allTablesExist =
      results.listings.exists && results.proposals.exists && results.deal_room_files.exists
    results.summary.allColumnsExist = results.summary.issues.length === 0

    console.log("🔍 SCHEMA VALIDATION: Validation complete")
    console.log("🔍 SCHEMA VALIDATION: Summary:", {
      allTablesExist: results.summary.allTablesExist,
      allColumnsExist: results.summary.allColumnsExist,
      issueCount: results.summary.issues.length,
    })

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("🔍 SCHEMA VALIDATION: Unexpected error:", getErrorMessage(error))

    return new Response(
      JSON.stringify({
        success: false,
        error: "Schema validation failed",
        details: getErrorMessage(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
