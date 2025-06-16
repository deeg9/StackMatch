import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

// Create a direct Supabase client for debugging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 BUYER PROFILE API: Starting GET request...")

    // Step 1: Validate environment
    const envCheck = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
      anonKeyValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
      serviceKeyValue: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING",
    }
    console.log("🔍 BUYER PROFILE API: ENV CHECK:", envCheck)

    // Step 2: Create direct client with service role for debugging
    let supabase
    try {
      console.log("🔍 BUYER PROFILE API: Creating direct Supabase client with service role...")
      supabase = await createClient(supabaseUrl, supabaseServiceKey)

      const clientCheck = {
        hasClient: !!supabase,
        hasAuth: !!supabase?.auth,
        hasFrom: !!supabase?.from,
        clientType: typeof supabase,
        authType: typeof supabase?.auth,
        fromType: typeof supabase?.from,
      }
      console.log("🔍 BUYER PROFILE API: CLIENT CHECK:", clientCheck)
    } catch (clientError) {
      console.error("🔍 BUYER PROFILE API: Client creation failed:", clientError)
      return NextResponse.json(
        {
          error: "Failed to create Supabase client",
          details: getErrorMessage(clientError),
        },
        { status: 500 },
      )
    }

    // Step 3: Get user from query parameter for testing
    const userId = request.nextUrl.searchParams.get("userId") || "1cae22cb-1311-48ca-9caa-47d474c0a20e"
    console.log(`🔍 BUYER PROFILE API: Using user ID: ${userId}`)

    // Step 4: Check if profiles table exists and has data
    try {
      console.log("🔍 BUYER PROFILE API: Checking profiles table...")
      const { data: profilesData, error: profilesError } = await supabase.from("profiles").select("count").limit(1)

      console.log("🔍 BUYER PROFILE API: Profiles check result:", {
        data: profilesData,
        error: profilesError?.message,
      })
    } catch (error) {
      console.error("🔍 BUYER PROFILE API: Profiles check failed:", error)
    }

    // Step 5: Check if buyer_profiles table exists and has data
    try {
      console.log("🔍 BUYER PROFILE API: Checking buyer_profiles table...")
      const { data: buyerProfilesData, error: buyerProfilesError } = await supabase
        .from("buyer_profiles")
        .select("count")
        .limit(1)

      console.log("🔍 BUYER PROFILE API: Buyer profiles check result:", {
        data: buyerProfilesData,
        error: buyerProfilesError?.message,
      })
    } catch (error) {
      console.error("🔍 BUYER PROFILE API: Buyer profiles check failed:", error)
    }

    // Step 6: Try to get the user's profile
    let profile = null
    try {
      console.log(`🔍 BUYER PROFILE API: Fetching profile for user: ${userId}`)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      console.log("🔍 BUYER PROFILE API: Profile result:", {
        hasData: !!profileData,
        error: profileError?.message,
      })

      if (profileData) {
        profile = profileData
      }
    } catch (error) {
      console.error("🔍 BUYER PROFILE API: Profile fetch failed:", error)
    }

    // Step 7: Try to get the user's buyer profile
    let buyerProfile = null
    try {
      console.log(`🔍 BUYER PROFILE API: Fetching buyer profile for user: ${userId}`)
      const { data: buyerProfileData, error: buyerProfileError } = await supabase
        .from("buyer_profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      console.log("🔍 BUYER PROFILE API: Buyer profile result:", {
        hasData: !!buyerProfileData,
        error: buyerProfileError?.message,
      })

      if (buyerProfileData) {
        buyerProfile = buyerProfileData
      }
    } catch (error) {
      console.error("🔍 BUYER PROFILE API: Buyer profile fetch failed:", error)
    }

    // Return whatever data we found
    return NextResponse.json({
      profile,
      buyerProfile,
      message: "Diagnostic information returned",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 BUYER PROFILE API: Unexpected error:", error)
    console.error("🔍 BUYER PROFILE API: Error stack:", getErrorStack(error))
    return NextResponse.json(
      {
        error: "Internal server error",
        details: getErrorMessage(error),
        stack: getErrorStack(error),
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("🔍 BUYER PROFILE API: Starting PUT request...")

    // Create Supabase client
    const supabase = await createClient(supabaseUrl, supabaseServiceKey)
    console.log("🔍 BUYER PROFILE API: PUT - Supabase client created")

    // Get the request body
    const body = await request.json()
    console.log("🔍 BUYER PROFILE API: PUT - Request body received:", Object.keys(body))

    // Extract user ID (should be in the body or we can use the default for testing)
    const userId = body.user_id || "1cae22cb-1311-48ca-9caa-47d474c0a20e"
    console.log(`🔍 BUYER PROFILE API: PUT - Using user ID: ${userId}`)

    // Remove user_id from body to prevent tampering
    const { user_id, ...updateData } = body

    // Update buyer profile for the user
    console.log("🔍 BUYER PROFILE API: PUT - About to update buyer_profiles table...")
    const { data: profile, error } = await supabase
      .from("buyer_profiles")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("🔍 BUYER PROFILE API: PUT - Update error:", error)
      return NextResponse.json(
        {
          error: "Failed to update buyer profile",
          details: getErrorMessage(error),
          code: (error as any)?.code,
        },
        { status: 500 },
      )
    }

    console.log("🔍 BUYER PROFILE API: PUT - Profile updated successfully")
    return NextResponse.json({
      profile,
      message: "Profile updated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 BUYER PROFILE API: PUT - Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: getErrorMessage(error),
        stack: getErrorStack(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 BUYER PROFILE API: Starting POST request...")

    // Create Supabase client
    const supabase = await createClient(supabaseUrl, supabaseServiceKey)
    console.log("🔍 BUYER PROFILE API: POST - Supabase client created")

    // Get the request body
    const body = await request.json()
    console.log("🔍 BUYER PROFILE API: POST - Request body received:", Object.keys(body))

    // Extract user ID
    const userId = body.user_id || "1cae22cb-1311-48ca-9caa-47d474c0a20e"
    console.log(`🔍 BUYER PROFILE API: POST - Using user ID: ${userId}`)

    // Ensure user_id is set correctly
    const profileData = {
      ...body,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Create buyer profile
    console.log("🔍 BUYER PROFILE API: POST - About to create buyer_profiles record...")
    const { data: profile, error } = await supabase.from("buyer_profiles").insert(profileData).select().single()

    if (error) {
      console.error("🔍 BUYER PROFILE API: POST - Create error:", error)
      return NextResponse.json(
        {
          error: "Failed to create buyer profile",
          details: getErrorMessage(error),
          code: (error as any)?.code,
        },
        { status: 500 },
      )
    }

    console.log("🔍 BUYER PROFILE API: POST - Profile created successfully")
    return NextResponse.json(
      {
        profile,
        message: "Profile created successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("🔍 BUYER PROFILE API: POST - Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: getErrorMessage(error),
        stack: getErrorStack(error),
      },
      { status: 500 },
    )
  }
}
