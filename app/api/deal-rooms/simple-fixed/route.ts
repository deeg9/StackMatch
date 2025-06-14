import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
  try {
    console.log("🔍 SIMPLE FIXED API: Starting...")

    const cookieStore = cookies()

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("🔍 SIMPLE FIXED API: Missing Supabase environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error("🔍 SIMPLE FIXED API: Error setting cookie:", error)
          }
        },
        remove: (name, options) => {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.error("🔍 SIMPLE FIXED API: Error removing cookie:", error)
          }
        },
      },
    })

    console.log("🔍 SIMPLE FIXED API: Supabase client created")

    // Get user using the same pattern as your working login
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("🔍 SIMPLE FIXED API: No authenticated user:", authError?.message)
      return NextResponse.json(
        {
          error: "Please log in first",
          dealRooms: [],
          redirectTo: "/login",
        },
        { status: 401 },
      )
    }

    console.log("🔍 SIMPLE FIXED API: User authenticated:", user.id)

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, user_type, full_name, company_name")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("🔍 SIMPLE FIXED API: Error fetching profile:", profileError.message)
      return NextResponse.json(
        {
          error: "Profile not found",
          dealRooms: [],
          userId: user.id,
        },
        { status: 200 },
      )
    }

    console.log("🔍 SIMPLE FIXED API: Profile found:", profile.user_type)

    // Fetch deal rooms for this user
    const { data: dealRooms, error: dealRoomsError } = await supabase
      .from("deal_rooms")
      .select(`
        *,
        deal_room_participants!inner(user_id)
      `)
      .eq("deal_room_participants.user_id", user.id)

    if (dealRoomsError) {
      console.error("🔍 SIMPLE FIXED API: Error fetching deal rooms:", dealRoomsError.message)
      // Return empty array instead of error for now
      return NextResponse.json({
        dealRooms: [],
        userType: profile.user_type,
        userId: user.id,
        message: "No deal rooms found or database error",
        error: dealRoomsError.message,
      })
    }

    console.log("🔍 SIMPLE FIXED API: Deal rooms fetched:", dealRooms?.length || 0)

    return NextResponse.json({
      dealRooms: dealRooms || [],
      userType: profile.user_type,
      userId: user.id,
      total: dealRooms?.length || 0,
      message: dealRooms?.length ? "Deal rooms loaded successfully" : "No deal rooms found",
    })
  } catch (error) {
    console.error("🔍 SIMPLE FIXED API: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        dealRooms: [],
      },
      { status: 500 },
    )
  }
}
