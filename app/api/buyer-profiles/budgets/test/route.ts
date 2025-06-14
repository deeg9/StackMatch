import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    console.log("🔍 BUDGET TEST API: Starting test...")

    const userId = "1cae22cb-1311-48ca-9caa-47d474c0a20e" // Christopher's ID

    // Get buyer profile ID
    const { data: buyerProfile, error: profileError } = await supabase
      .from("buyer_profiles")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (profileError || !buyerProfile) {
      return NextResponse.json(
        {
          error: "Buyer profile not found",
          details: profileError,
          userId,
        },
        { status: 404 },
      )
    }

    console.log("🔍 BUDGET TEST API: Buyer profile ID:", buyerProfile.id)

    // Test budgets table
    const { data: budgets, error: budgetError } = await supabase
      .from("buyer_budgets")
      .select("*")
      .eq("buyer_profile_id", buyerProfile.id)

    // Test expenses table
    const { data: expenses, error: expenseError } = await supabase
      .from("buyer_expenses")
      .select("*")
      .eq("buyer_profile_id", buyerProfile.id)

    return NextResponse.json({
      success: true,
      userId,
      buyerProfileId: buyerProfile.id,
      budgets: {
        data: budgets,
        error: budgetError,
        count: budgets?.length || 0,
      },
      expenses: {
        data: expenses,
        error: expenseError,
        count: expenses?.length || 0,
      },
    })
  } catch (error) {
    console.error("🔍 BUDGET TEST API: Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error,
      },
      { status: 500 },
    )
  }
}
