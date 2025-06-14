import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { authenticateUser } from "@/lib/auth/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const dealRoomId = params.id
  console.log(`🔍 SIMPLE TEST: Starting simple test for deal room: ${dealRoomId}`)

  const testResults = {
    dealRoomId,
    timestamp: new Date().toISOString(),
    tests: {} as Record<string, any>,
    success: false,
    errors: [] as string[],
  }

  try {
    // Test 1: Basic route access
    console.log(`🔍 SIMPLE TEST: Test 1 - Route access`)
    testResults.tests.routeAccess = { success: true, message: "Route is accessible" }

    // Test 2: Cookie store access
    console.log(`🔍 SIMPLE TEST: Test 2 - Cookie store`)
    try {
      const cookieStore = cookies()
      testResults.tests.cookieStore = { success: true, message: "Cookie store accessible" }
    } catch (error: any) {
      testResults.tests.cookieStore = { success: false, error: getErrorMessage(error) }
      testResults.errors.push(`Cookie store error: ${getErrorMessage(error)}`)
    }

    // Test 3: Supabase client creation
    console.log(`🔍 SIMPLE TEST: Test 3 - Supabase client`)
    try {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      testResults.tests.supabaseClient = { success: true, message: "Supabase client created" }

      // Test 4: Authentication
      console.log(`🔍 SIMPLE TEST: Test 4 - Authentication`)
      try {
        const { user, error: authError } = await authenticateUser(supabase)

        if (authError || !user) {
          testResults.tests.authentication = {
            success: false,
            error: authError || "No user found",
            message: "Authentication failed",
          }
          testResults.errors.push(`Authentication error: ${authError || "No user"}`)
        } else {
          testResults.tests.authentication = {
            success: true,
            userId: user.id,
            userEmail: user.email,
            message: "User authenticated successfully",
          }

          // Test 5: Basic database connectivity
          console.log(`🔍 SIMPLE TEST: Test 5 - Database connectivity`)
          try {
            const { data, error } = await supabase.from("deal_rooms").select("id").limit(1)

            if (error) {
              testResults.tests.databaseConnectivity = {
                success: false,
                error: getErrorMessage(error),
                message: "Database query failed",
              }
              testResults.errors.push(`Database error: ${getErrorMessage(error)}`)
            } else {
              testResults.tests.databaseConnectivity = {
                success: true,
                message: "Database is accessible",
                sampleData: data,
              }

              // Test 6: Deal room existence
              console.log(`🔍 SIMPLE TEST: Test 6 - Deal room existence`)
              try {
                const { data: dealRoom, error: dealRoomError } = await supabase
                  .from("deal_rooms")
                  .select("id, room_name, created_at")
                  .eq("id", dealRoomId)
                  .single()

                if (dealRoomError || !dealRoom) {
                  testResults.tests.dealRoomExistence = {
                    success: false,
                    error: dealRoomError?.message || "Deal room not found",
                    message: "Deal room does not exist",
                  }
                  testResults.errors.push(`Deal room error: ${dealRoomError?.message || "Not found"}`)
                } else {
                  testResults.tests.dealRoomExistence = {
                    success: true,
                    dealRoom: dealRoom,
                    message: "Deal room exists and is accessible",
                  }

                  // Test 7: User participation
                  console.log(`🔍 SIMPLE TEST: Test 7 - User participation`)
                  try {
                    const { data: participant, error: participantError } = await supabase
                      .from("deal_room_participants")
                      .select("id, role, joined_at")
                      .eq("deal_room_id", dealRoomId)
                      .eq("user_id", user.id)
                      .single()

                    if (participantError || !participant) {
                      testResults.tests.userParticipation = {
                        success: false,
                        error: participantError?.message || "User is not a participant",
                        message: "User access denied",
                      }
                      testResults.errors.push(
                        `Participation error: ${participantError?.message || "Not a participant"}`,
                      )
                    } else {
                      testResults.tests.userParticipation = {
                        success: true,
                        participant: participant,
                        message: "User is a valid participant",
                      }
                    }
                  } catch (error: any) {
                    testResults.tests.userParticipation = {
                      success: false,
                      error: getErrorMessage(error),
                      message: "Participation check failed",
                    }
                    testResults.errors.push(`Participation check error: ${getErrorMessage(error)}`)
                  }
                }
              } catch (error: any) {
                testResults.tests.dealRoomExistence = {
                  success: false,
                  error: getErrorMessage(error),
                  message: "Deal room query failed",
                }
                testResults.errors.push(`Deal room query error: ${getErrorMessage(error)}`)
              }
            }
          } catch (error: any) {
            testResults.tests.databaseConnectivity = {
              success: false,
              error: getErrorMessage(error),
              message: "Database connection failed",
            }
            testResults.errors.push(`Database connection error: ${getErrorMessage(error)}`)
          }
        }
      } catch (error: any) {
        testResults.tests.authentication = {
          success: false,
          error: getErrorMessage(error),
          message: "Authentication process failed",
        }
        testResults.errors.push(`Authentication process error: ${getErrorMessage(error)}`)
      }
    } catch (error: any) {
      testResults.tests.supabaseClient = {
        success: false,
        error: getErrorMessage(error),
        message: "Supabase client creation failed",
      }
      testResults.errors.push(`Supabase client error: ${getErrorMessage(error)}`)
    }

    // Determine overall success
    testResults.success = testResults.errors.length === 0

    console.log(`🔍 SIMPLE TEST: Test completed. Success: ${testResults.success}`)
    console.log(`🔍 SIMPLE TEST: Errors: ${testResults.errors.length}`)

    return NextResponse.json(testResults)
  } catch (error: any) {
    console.error(`🔍 SIMPLE TEST: Unhandled error:`, error)
    testResults.errors.push(`Unhandled error: ${getErrorMessage(error)}`)
    testResults.tests.unhandledError = {
      success: false,
      error: getErrorMessage(error),
      stack: getErrorStack(error),
    }

    return NextResponse.json(testResults, { status: 500 })
  }
}
