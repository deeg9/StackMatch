import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const listing_id = searchParams.get("listing_id")
    const business_user_id = searchParams.get("business_user_id")

    let query = supabase.from("proposal_comparisons").select("*").order("created_at", { ascending: false })

    if (listing_id) {
      query = query.eq("listing_id", listing_id)
    }

    if (business_user_id) {
      query = query.eq("business_user_id", business_user_id)
    }

    const { data: comparisons, error } = await query

    if (error) {
      console.error("Error fetching comparisons:", error)
      return NextResponse.json({ error: "Failed to fetch comparisons" }, { status: 500 })
    }

    return NextResponse.json({ comparisons: comparisons || [] })
  } catch (error) {
    console.error("Error in comparisons API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const comparisonData = await request.json()

    // Validate required fields
    if (!comparisonData.listing_id || !comparisonData.business_user_id || !comparisonData.comparison_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: comparison, error } = await supabase
      .from("proposal_comparisons")
      .insert([
        {
          ...comparisonData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating comparison:", error)
      return NextResponse.json({ error: "Failed to create comparison" }, { status: 500 })
    }

    return NextResponse.json({ comparison })
  } catch (error) {
    console.error("Error in comparison creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
