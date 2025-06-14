import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const timestamp = new Date().toISOString()
  console.log(`🔍 [${timestamp}] CONSTRAINT TEST: Starting test...`)

  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dealRoomId = params.id

    // Test each allowed value
    const testValues = ["text", "file", "system"]
    const results = []

    for (const testValue of testValues) {
      try {
        console.log(`🔍 [${timestamp}] CONSTRAINT TEST: Testing value: "${testValue}"`)

        const testData = {
          deal_room_id: dealRoomId,
          sender_id: user.id,
          content: `Test message for ${testValue}`,
          sender_type: testValue,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        console.log(`🔍 [${timestamp}] CONSTRAINT TEST: Test data:`, testData)

        const { data, error } = await supabase.from("deal_room_messages").insert(testData).select().single()

        if (error) {
          console.error(`🔍 [${timestamp}] CONSTRAINT TEST: Error with "${testValue}":`, error)
          results.push({
            value: testValue,
            success: false,
            error: error.message,
            errorCode: error.code,
          })
        } else {
          console.log(`🔍 [${timestamp}] CONSTRAINT TEST: Success with "${testValue}":`, data.id)
          results.push({
            value: testValue,
            success: true,
            messageId: data.id,
          })

          // Clean up - delete the test message
          await supabase.from("deal_room_messages").delete().eq("id", data.id)
        }
      } catch (err) {
        console.error(`🔍 [${timestamp}] CONSTRAINT TEST: Exception with "${testValue}":`, err)
        results.push({
          value: testValue,
          success: false,
          error: String(err),
        })
      }
    }

    return NextResponse.json({
      message: "Constraint test completed",
      results,
      timestamp,
    })
  } catch (error) {
    console.error(`🔍 [${timestamp}] CONSTRAINT TEST: Unexpected error:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
