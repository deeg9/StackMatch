import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("provider_team_members")
      .select("*")
      .eq("provider_id", providerId)
      .eq("is_active", true)
      .order("is_lead", { ascending: false })
      .order("joined_date", { ascending: true })

    if (error) {
      console.error("Error fetching team members:", error)
      return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Team API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createClient()

    const { data, error } = await supabase.from("provider_team_members").insert(body).select().single()

    if (error) {
      console.error("Error creating team member:", error)
      return NextResponse.json({ error: "Failed to create team member" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Team member creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const supabase = createClient()

    const { data, error } = await supabase.from("provider_team_members").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating team member:", error)
      return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Team member update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Team member ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Soft delete by setting is_active to false
    const { error } = await supabase.from("provider_team_members").update({ is_active: false }).eq("id", id)

    if (error) {
      console.error("Error removing team member:", error)
      return NextResponse.json({ error: "Failed to remove team member" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Team member removal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
