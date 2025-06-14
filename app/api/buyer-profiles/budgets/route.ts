import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 BUDGET API: Starting GET request...")

    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get("profileId")
    const userId = searchParams.get("userId")

    console.log("🔍 BUDGET API: Received params:", { profileId, userId })

    // Use profileId if provided, otherwise use userId
    let buyerProfileId = profileId

    if (!buyerProfileId && userId) {
      console.log("🔍 BUDGET API: Looking up buyer profile by user ID:", userId)

      // Get buyer profile ID from user ID
      const { data: buyerProfile, error: profileError } = await supabase
        .from("buyer_profiles")
        .select("id")
        .eq("user_id", userId)
        .single()

      if (profileError || !buyerProfile) {
        console.log("🔍 BUDGET API: Buyer profile not found:", profileError)
        return NextResponse.json({ error: "Buyer profile not found" }, { status: 404 })
      }

      buyerProfileId = buyerProfile.id
    }

    if (!buyerProfileId) {
      console.log("🔍 BUDGET API: No profileId or userId provided")
      return NextResponse.json({ error: "Profile ID or User ID is required" }, { status: 400 })
    }

    console.log("🔍 BUDGET API: Using buyer profile ID:", buyerProfileId)

    // Fetch budgets with correct column names
    const { data: budgets, error: budgetError } = await supabase
      .from("buyer_budgets")
      .select(`
        id,
        project_name,
        allocated_budget,
        spent_amount,
        remaining_budget,
        budget_period,
        status,
        created_at,
        updated_at
      `)
      .eq("buyer_profile_id", buyerProfileId)
      .order("created_at", { ascending: false })

    if (budgetError) {
      console.log("🔍 BUDGET API: Error fetching budgets:", budgetError)
      return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
    }

    console.log("🔍 BUDGET API: Budgets fetched successfully:", budgets?.length || 0)

    // Transform data to match frontend expectations
    const transformedBudgets =
      budgets?.map((budget) => ({
        id: budget.id,
        name: budget.project_name,
        amount: budget.allocated_budget,
        spent: budget.spent_amount,
        remaining: budget.remaining_budget,
        period: budget.budget_period,
        status: budget.status,
        start_date: budget.created_at,
        end_date: budget.updated_at,
      })) || []

    return NextResponse.json({
      success: true,
      budgets: transformedBudgets,
      totalBudgets: transformedBudgets.length,
    })
  } catch (error) {
    console.error("🔍 BUDGET API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
