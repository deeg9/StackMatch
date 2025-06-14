import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { getSimpleCurrentUser } from "@/lib/auth-simple"

export async function GET() {
  try {
    console.log("🔍 SIMPLE DEAL ROOMS API: Starting...")

    // Get current user
    const currentUser = await getSimpleCurrentUser()

    if (!currentUser) {
      console.log("🔍 SIMPLE DEAL ROOMS API: No authenticated user")
      return NextResponse.json({ error: "Unauthorized", dealRooms: [] }, { status: 401 })
    }

    console.log("🔍 SIMPLE DEAL ROOMS API: User authenticated:", currentUser.id, currentUser.user_type)

    // Create Supabase client
    const cookieStore = cookies()

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("🔍 SIMPLE DEAL ROOMS API: Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error", dealRooms: [] }, { status: 500 })
    }

    const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error("🔍 SIMPLE DEAL ROOMS API: Error setting cookie:", error)
          }
        },
        remove: (name, options) => {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.error("🔍 SIMPLE DEAL ROOMS API: Error removing cookie:", error)
          }
        },
      },
    })

    console.log("🔍 SIMPLE DEAL ROOMS API: Supabase client created")

    // Check if deal_rooms table exists
    try {
      const { error: tableCheckError } = await supabase.from("deal_rooms").select("id").limit(1)

      if (tableCheckError) {
        console.error("🔍 SIMPLE DEAL ROOMS API: deal_rooms table error:", getErrorMessage(tableCheckError))
        return NextResponse.json(
          {
            error: "Database structure issue",
            details: getErrorMessage(tableCheckError),
            dealRooms: [],
            userType: currentUser.user_type,
          },
          { status: 200 },
        )
      }

      console.log("🔍 SIMPLE DEAL ROOMS API: deal_rooms table exists")
    } catch (error) {
      console.error("🔍 SIMPLE DEAL ROOMS API: Error checking deal_rooms table:", error)
      return NextResponse.json(
        {
          error: "Error checking database structure",
          details: error instanceof Error ? getErrorMessage(error) : "Unknown error",
          dealRooms: [],
          userType: currentUser.user_type,
        },
        { status: 200 },
      )
    }

    // Return mock data for now
    console.log("🔍 SIMPLE DEAL ROOMS API: Returning mock data")
    return NextResponse.json({
      dealRooms: [],
      userType: currentUser.user_type,
      total: 0,
      message: "No deal rooms found (mock data)",
    })
  } catch (error) {
    console.error("🔍 SIMPLE DEAL ROOMS API: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? getErrorMessage(error) : "Unknown error",
        dealRooms: [],
        userType: "UNKNOWN",
      },
      { status: 200 }, // Return 200 even for errors to ensure JSON is returned
    )
  }
}
