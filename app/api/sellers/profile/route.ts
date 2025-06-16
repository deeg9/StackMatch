import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get("sellerId")
    const userId = searchParams.get("userId")

    const supabase = await createClient()

    let query = supabase.from("seller_profiles").select(`
        *,
        seller_services(*),
        seller_technologies(*),
        seller_team_members(*),
        seller_certifications(*),
        seller_portfolio(*,
          portfolio_images(*)
        ),
        seller_metrics(*),
        seller_working_hours(*),
        seller_badges(*)
      `)

    if (sellerId) {
      query = query.eq("id", sellerId)
    } else if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error("Error fetching seller profile:", error)
      return NextResponse.json({ error: "Failed to fetch seller profile" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Seller profile API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase.from("seller_profiles").insert(body).select().single()

    if (error) {
      console.error("Error creating seller profile:", error)
      return NextResponse.json({ error: "Failed to create seller profile" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Seller profile creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const supabase = await createClient()

    const { data, error } = await supabase.from("seller_profiles").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating seller profile:", error)
      return NextResponse.json({ error: "Failed to update seller profile" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Seller profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
