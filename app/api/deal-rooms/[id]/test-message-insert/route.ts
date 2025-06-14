import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const timestamp = new Date().toISOString()

  try {
    console.log(`🔍 [${timestamp}] TEST MESSAGE INSERT: Starting test...`)

    const { supabase, user, error: authError } = await getAuthenticatedClient(request)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dealRoomId = params.id

    // Test different sender_type values to see which one works
    const testValues = ["text", "TEXT", "file", "FILE", "system", "SYSTEM"]
    const results = []

    for (const testValue of testValues) {
      console.log(`🔍 [${timestamp}] TEST MESSAGE INSERT: Testing sender_type: "${testValue}"`)

      const testData = {
        deal_room_id: dealRoomId,
        sender_id: user.id,
        content: `Test message with sender_type: ${testValue}`,
        sender_type: testValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("deal_room_messages").insert(testData).select().single()

      results.push({
        sender_type: testValue,
        success: !error,
        error: error?.message || null,
        data: data?.id || null,
      })

      console.log(`🔍 [${timestamp}] TEST MESSAGE INSERT: Result for "${testValue}":`, {
        success: !error,
        error: error?.message || null,
      })

      // If successful, delete the test message
      if (data?.id) {
        await supabase.from("deal_room_messages").delete().eq("id", data.id)
      }
    }

    return NextResponse.json({
      message: "Test completed",
      results,
      dealRoomId,
    })
  } catch (error) {
    console.error(`🔍 [${timestamp}] TEST MESSAGE INSERT: Error:`, error)
    return NextResponse.json({ error: "Test failed" }, { status: 500 })
  }
}
