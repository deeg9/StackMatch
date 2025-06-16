import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    console.log("🔍 Testing core deal room queries...")

    // Get current user for testing
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required for query testing",
        },
        { status: 401 },
      )
    }

    const testResults = {
      success: true,
      timestamp: new Date().toISOString(),
      userId: user.id,
      tests: {} as any,
      summary: {} as any,
    }

    // Test 1: Basic deal rooms query
    try {
      const { data: basicDealRooms, error: basicError } = await supabase
        .from("deal_rooms")
        .select("*")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .limit(10)

      testResults.tests.basicQuery = {
        success: !basicError,
        count: basicDealRooms?.length || 0,
        error: basicError?.message,
      }
    } catch (error) {
      testResults.tests.basicQuery = {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      }
    }

    // Test 2: Complex join query (the main one we'll use)
    try {
      const { data: complexDealRooms, error: complexError } = await supabase
        .from("deal_rooms")
        .select(`
          id,
          status,
          room_name,
          last_activity_at,
          created_at,
          listings:listing_id (
            id,
            title,
            description,
            budget_min,
            budget_max
          ),
          proposals:proposal_id (
            id,
            proposal_text,
            technical_approach,
            proposed_budget,
            proposed_timeline,
            status
          ),
          buyer_profiles:buyer_id (
            id,
            company_name,
            first_name,
            last_name
          ),
          seller_profiles:seller_id (
            id,
            company_name,
            first_name,
            last_name
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("last_activity_at", { ascending: false })
        .limit(5)

      testResults.tests.complexQuery = {
        success: !complexError,
        count: complexDealRooms?.length || 0,
        error: complexError?.message,
        sampleData: complexDealRooms?.[0] || null,
      }
    } catch (error) {
      testResults.tests.complexQuery = {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      }
    }

    // Test 3: Notification query
    try {
      const { data: notifications, error: notificationError } = await supabase
        .from("deal_room_notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_read", false)
        .limit(10)

      testResults.tests.notificationQuery = {
        success: !notificationError,
        count: notifications?.length || 0,
        error: notificationError?.message,
      }
    } catch (error) {
      testResults.tests.notificationQuery = {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      }
    }

    // Test 4: Activity log query
    try {
      const { data: activities, error: activityError } = await supabase
        .from("deal_room_activities")
        .select(`
          id,
          activity_type,
          description,
          created_at,
          deal_rooms:deal_room_id (
            id,
            room_name
          )
        `)
        .limit(10)

      testResults.tests.activityQuery = {
        success: !activityError,
        count: activities?.length || 0,
        error: activityError?.message,
      }
    } catch (error) {
      testResults.tests.activityQuery = {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      }
    }

    // Test 5: Grouping query (for buyers)
    try {
      const { data: groupedData, error: groupError } = await supabase
        .from("listings")
        .select(`
          id,
          title,
          deal_rooms:deal_rooms!listing_id (
            id,
            status,
            last_activity_at,
            proposals:proposal_id (
              proposed_budget,
              seller_profiles:seller_id (
                company_name
              )
            )
          )
        `)
        .eq("user_id", user.id)
        .not("deal_rooms", "is", null)
        .limit(5)

      testResults.tests.groupingQuery = {
        success: !groupError,
        count: groupedData?.length || 0,
        error: groupError?.message,
      }
    } catch (error) {
      testResults.tests.groupingQuery = {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      }
    }

    // Calculate overall success
    const allTests = Object.values(testResults.tests)
    const successfulTests = allTests.filter((test: any) => test.success).length
    testResults.success = successfulTests === allTests.length
    testResults.summary = {
      total: allTests.length,
      successful: successfulTests,
      failed: allTests.length - successfulTests,
    }

    console.log("✅ Query testing completed:", testResults.summary)

    return NextResponse.json(testResults)
  } catch (error) {
    console.error("❌ Query testing failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Query testing failed",
        details: error instanceof Error ? getErrorMessage(error) : "Unknown error",
      },
      { status: 500 },
    )
  }
}
