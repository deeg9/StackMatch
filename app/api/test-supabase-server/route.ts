import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export async function GET() {
  try {
    console.log("🔍 SUPABASE TEST: Starting comprehensive test...")

    // Test 1: Environment Variables
    const envTest = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    }
    console.log("🔍 SUPABASE TEST: Environment check:", envTest)

    // Test 2: Client Creation
    let supabase
    try {
      const cookieStore = cookies()
      supabase = createClient(cookieStore)
      console.log("🔍 SUPABASE TEST: Client created successfully")
    } catch (clientError: unknown) {
      console.error("🔍 SUPABASE TEST: Client creation failed:", clientError)
      return NextResponse.json({
        success: false,
        error: "Client creation failed",
        details: clientError.message,
        envTest,
      })
    }

    // Test 3: Client Properties
    const clientTest = {
      hasClient: !!supabase,
      hasAuth: !!supabase?.auth,
      hasFrom: !!supabase?.from,
      hasStorage: !!supabase?.storage,
      clientType: typeof supabase,
      authType: typeof supabase?.auth,
    }
    console.log("🔍 SUPABASE TEST: Client properties:", clientTest)

    // Test 4: Auth Test
    let authTest
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      authTest = {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        authError: authError?.message,
        authErrorCode: authError?.code,
      }
      console.log("🔍 SUPABASE TEST: Auth test:", authTest)
    } catch (authException: unknown) {
      authTest = {
        error: "Auth call failed",
        details: authException.message,
      }
      console.error("🔍 SUPABASE TEST: Auth exception:", authException)
    }

    // Test 5: Database Query Test (simple table)
    let dbTest
    try {
      const { data: profiles, error: dbError } = await supabase.from("profiles").select("id, email").limit(1)

      dbTest = {
        hasData: !!profiles,
        dataCount: profiles?.length || 0,
        dbError: dbError?.message,
        dbErrorCode: dbError?.code,
      }
      console.log("🔍 SUPABASE TEST: Database test:", dbTest)
    } catch (dbException: unknown) {
      dbTest = {
        error: "Database query failed",
        details: dbException.message,
      }
      console.error("🔍 SUPABASE TEST: Database exception:", dbException)
    }

    // Test 6: Buyer Profiles Table Test
    let buyerProfileTest
    try {
      const { data: buyerProfiles, error: bpError } = await supabase
        .from("buyer_profiles")
        .select("id, user_id")
        .limit(1)

      buyerProfileTest = {
        hasData: !!buyerProfiles,
        dataCount: buyerProfiles?.length || 0,
        bpError: bpError?.message,
        bpErrorCode: bpError?.code,
      }
      console.log("🔍 SUPABASE TEST: Buyer profiles test:", buyerProfileTest)
    } catch (bpException: unknown) {
      buyerProfileTest = {
        error: "Buyer profiles query failed",
        details: bpException.message,
      }
      console.error("🔍 SUPABASE TEST: Buyer profiles exception:", bpException)
    }

    // Test 7: Christopher Specific Test
    let christopherTest
    try {
      const { data: christopherProfile, error: cError } = await supabase
        .from("buyer_profiles")
        .select("*")
        .eq("user_id", "1cae22cb-1311-48ca-9caa-47d474c0a20e")
        .single()

      christopherTest = {
        hasProfile: !!christopherProfile,
        profileId: christopherProfile?.id,
        companyName: christopherProfile?.company_name,
        cError: cError?.message,
        cErrorCode: cError?.code,
      }
      console.log("🔍 SUPABASE TEST: Christopher test:", christopherTest)
    } catch (cException: unknown) {
      christopherTest = {
        error: "Christopher query failed",
        details: cException.message,
      }
      console.error("🔍 SUPABASE TEST: Christopher exception:", cException)
    }

    return NextResponse.json({
      success: true,
      message: "Supabase server test completed",
      tests: {
        environment: envTest,
        client: clientTest,
        auth: authTest,
        database: dbTest,
        buyerProfiles: buyerProfileTest,
        christopher: christopherTest,
      },
    })
  } catch (error: unknown) {
    console.error("🔍 SUPABASE TEST: Unexpected error:", error)
    return NextResponse.json({
      success: false,
      error: "Unexpected error in test",
      details: getErrorMessage(error),
      stack: getErrorStack(error),
    })
  }
}
