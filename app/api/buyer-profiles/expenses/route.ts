import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 EXPENSES API: Starting GET request...")

    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get("profileId")
    const userId = searchParams.get("userId")

    console.log("🔍 EXPENSES API: Received params:", { profileId, userId })

    // Use profileId if provided, otherwise use userId
    let buyerProfileId = profileId

    if (!buyerProfileId && userId) {
      console.log("🔍 EXPENSES API: Looking up buyer profile by user ID:", userId)

      // Get buyer profile ID from user ID
      const { data: buyerProfile, error: profileError } = await supabase
        .from("buyer_profiles")
        .select("id")
        .eq("user_id", userId)
        .single()

      if (profileError || !buyerProfile) {
        console.log("🔍 EXPENSES API: Buyer profile not found:", profileError)
        return NextResponse.json({ error: "Buyer profile not found" }, { status: 404 })
      }

      buyerProfileId = buyerProfile.id
    }

    if (!buyerProfileId) {
      console.log("🔍 EXPENSES API: No profileId or userId provided")
      return NextResponse.json({ error: "Profile ID or User ID is required" }, { status: 400 })
    }

    console.log("🔍 EXPENSES API: Using buyer profile ID:", buyerProfileId)

    // Fetch expenses with budget information using correct column names
    const { data: expenses, error: expenseError } = await supabase
      .from("buyer_expenses")
      .select(`
        id,
        expense_name,
        amount,
        category,
        expense_date,
        description,
        budget_id,
        buyer_budgets (
          project_name,
          allocated_budget
        )
      `)
      .eq("buyer_profile_id", buyerProfileId)
      .order("expense_date", { ascending: false })

    if (expenseError) {
      console.log("🔍 EXPENSES API: Error fetching expenses:", expenseError)
      return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
    }

    console.log("🔍 EXPENSES API: Expenses fetched successfully:", expenses?.length || 0)

    return NextResponse.json({
      success: true,
      expenses: expenses || [],
      totalExpenses: expenses?.length || 0,
    })
  } catch (error) {
    console.error("🔍 EXPENSES API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
