import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  console.log("🔍 SCHEMA CHECK: Starting database schema check")

  const results = {
    timestamp: new Date().toISOString(),
    success: false,
    tables: {} as Record<string, any>,
    errors: [] as string[],
  }

  try {
    // Create Supabase client with service role for schema inspection
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required Supabase environment variables")
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Check listings table structure
    console.log("🔍 SCHEMA CHECK: Checking listings table structure")
    try {
      // Use PostgreSQL information_schema to get column information
      const { data: listingsColumns, error: listingsError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable")
        .eq("table_name", "listings")

      if (listingsError) {
        throw listingsError
      }

      results.tables.listings = {
        success: true,
        columns: listingsColumns,
        hasTimelineColumn: listingsColumns.some((col: any) => col.column_name === "timeline"),
        hasAttachmentsColumn: listingsColumns.some((col: any) => col.column_name === "attachments"),
      }
    } catch (error: any) {
      results.tables.listings = {
        success: false,
        error: getErrorMessage(error),
      }
      results.errors.push(`Listings table error: ${getErrorMessage(error)}`)
    }

    // Check deal_rooms table structure
    console.log("🔍 SCHEMA CHECK: Checking deal_rooms table structure")
    try {
      const { data: dealRoomsColumns, error: dealRoomsError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable")
        .eq("table_name", "deal_rooms")

      if (dealRoomsError) {
        throw dealRoomsError
      }

      results.tables.deal_rooms = {
        success: true,
        columns: dealRoomsColumns,
      }
    } catch (error: any) {
      results.tables.deal_rooms = {
        success: false,
        error: getErrorMessage(error),
      }
      results.errors.push(`Deal rooms table error: ${getErrorMessage(error)}`)
    }

    // Check deal_room_files table structure
    console.log("🔍 SCHEMA CHECK: Checking deal_room_files table structure")
    try {
      const { data: filesColumns, error: filesError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable")
        .eq("table_name", "deal_room_files")

      if (filesError) {
        throw filesError
      }

      results.tables.deal_room_files = {
        success: true,
        columns: filesColumns,
      }
    } catch (error: any) {
      results.tables.deal_room_files = {
        success: false,
        error: getErrorMessage(error),
      }
      results.errors.push(`Deal room files table error: ${getErrorMessage(error)}`)
    }

    // Check proposals table structure
    console.log("🔍 SCHEMA CHECK: Checking proposals table structure")
    try {
      const { data: proposalsColumns, error: proposalsError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable")
        .eq("table_name", "proposals")

      if (proposalsError) {
        throw proposalsError
      }

      results.tables.proposals = {
        success: true,
        columns: proposalsColumns,
        hasAttachmentsColumn: proposalsColumns.some((col: any) => col.column_name === "attachments"),
      }
    } catch (error: any) {
      results.tables.proposals = {
        success: false,
        error: getErrorMessage(error),
      }
      results.errors.push(`Proposals table error: ${getErrorMessage(error)}`)
    }

    // Overall success
    results.success = results.errors.length === 0

    console.log(`🔍 SCHEMA CHECK: Check completed. Success: ${results.success}`)
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("🔍 SCHEMA CHECK: Unhandled error:", error)
    results.errors.push(`Unhandled error: ${getErrorMessage(error)}`)

    return NextResponse.json(
      {
        ...results,
        error: {
          message: getErrorMessage(error),
          stack: getErrorStack(error),
          name: error.name,
        },
      },
      { status: 500 },
    )
  }
}
