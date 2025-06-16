import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("provider_metrics").select("*").eq("provider_id", providerId).single()

    if (error) {
      console.error("Error fetching metrics:", error)
      return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Metrics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { providerId } = await request.json()

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Call the stored procedure to update metrics
    const { data, error } = await supabase.rpc("update_provider_metrics", {
      p_provider_id: providerId,
    })

    if (error) {
      console.error("Error updating metrics:", error)
      return NextResponse.json({ error: "Failed to update metrics" }, { status: 500 })
    }

    // Calculate and update health score
    const { data: healthScore, error: healthError } = await supabase.rpc("calculate_provider_health_score", {
      p_provider_id: providerId,
    })

    if (healthError) {
      console.error("Error calculating health score:", healthError)
    }

    return NextResponse.json({ success: true, healthScore })
  } catch (error) {
    console.error("Metrics update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
