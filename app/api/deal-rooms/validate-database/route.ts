import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    console.log("🔍 Starting database validation...")

    // Test 1: Verify core tables exist
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .in("table_name", ["profiles", "listings", "proposals", "deal_rooms"])
      .eq("table_schema", "public")

    if (tablesError) {
      console.error("❌ Error checking tables:", tablesError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to check table structure",
          details: tablesError,
        },
        { status: 500 },
      )
    }

    const requiredTables = ["profiles", "listings", "proposals", "deal_rooms"]
    const existingTables = tables?.map((t: any) => t.table_name) || []
    const missingTables = requiredTables.filter((table: any) => !existingTables.includes(table))

    if (missingTables.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required tables",
          missingTables,
        },
        { status: 400 },
      )
    }

    // Test 2: Check deal_rooms table structure
    const { data: dealRoomColumns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_name", "deal_rooms")
      .eq("table_schema", "public")

    if (columnsError) {
      console.error("❌ Error checking deal_rooms columns:", columnsError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to check deal_rooms structure",
          details: columnsError,
        },
        { status: 500 },
      )
    }

    const requiredColumns = ["id", "buyer_id", "seller_id", "listing_id", "proposal_id", "status", "last_activity_at"]
    const existingColumns = dealRoomColumns?.map((c: any) => c.column_name) || []
    const missingColumns = requiredColumns.filter((col: any) => !existingColumns.includes(col))

    // Test 3: Test a simple deal rooms query
    const { data: dealRoomsTest, error: dealRoomsError } = await supabase
      .from("deal_rooms")
      .select(`
        id,
        status,
        last_activity_at,
        listings:listing_id (
          id,
          title
        ),
        proposals:proposal_id (
          id,
          proposed_budget
        )
      `)
      .limit(5)

    if (dealRoomsError) {
      console.error("❌ Error testing deal rooms query:", dealRoomsError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to test deal rooms query",
          details: dealRoomsError,
        },
        { status: 500 },
      )
    }

    // Test 4: Check if notification table exists
    const { data: notificationTable, error: notificationError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "deal_room_notifications")
      .eq("table_schema", "public")
      .single()

    const notificationTableExists = !notificationError && notificationTable

    // Test 5: Check indexes exist
    const { data: indexes, error: indexError } = await supabase
      .from("pg_indexes")
      .select("indexname")
      .eq("tablename", "deal_rooms")

    const indexNames = indexes?.map((i: any) => i.indexname) || []
    const hasPerformanceIndexes = indexNames.some(
      (name: any) => name.includes("buyer_id") || name.includes("seller_id") || name.includes("last_activity"),
    )

    const validationResults = {
      success: true,
      timestamp: new Date().toISOString(),
      checks: {
        coreTablesExist: missingTables.length === 0,
        dealRoomsStructure: missingColumns.length === 0,
        queryTest: !dealRoomsError,
        notificationTable: !!notificationTableExists,
        performanceIndexes: hasPerformanceIndexes,
      },
      details: {
        existingTables,
        missingTables,
        dealRoomColumns: existingColumns,
        missingColumns,
        dealRoomsCount: dealRoomsTest?.length || 0,
        indexCount: indexes?.length || 0,
      },
      recommendations: [] as string[],
    }

    // Add recommendations based on results
    if (missingColumns.length > 0) {
      validationResults.recommendations.push("Run the database migration script to add missing columns")
    }

    if (!notificationTableExists) {
      validationResults.recommendations.push("Create deal_room_notifications table for notification system")
    }

    if (!hasPerformanceIndexes) {
      validationResults.recommendations.push("Add performance indexes for better query speed")
    }

    console.log("✅ Database validation completed:", validationResults)

    return NextResponse.json(validationResults)
  } catch (error) {
    console.error("❌ Database validation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database validation failed",
        details: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      },
      { status: 500 },
    )
  }
}
