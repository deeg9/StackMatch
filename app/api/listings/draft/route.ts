import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { SaveDraftRequest, SaveDraftResponse } from "@/types/guided-listing-types"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 })
    }

    const userId = session.user.id
    const body: SaveDraftRequest = await request.json()
    const { formData, sessionId } = body

    // Check if this is an update to an existing draft
    let draftId = sessionId

    if (draftId) {
      // Update existing draft
      const { error } = await supabase
        .from("listing_drafts")
        .update({
          form_data: formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", draftId)
        .eq("user_id", userId)

      if (error) {
        console.error("Error updating draft:", error)
        return NextResponse.json({ error: "Failed to update draft", success: false }, { status: 500 })
      }
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from("listing_drafts")
        .insert({
          user_id: userId,
          form_data: formData,
          category: formData.selectedCategory,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single()

      if (error) {
        console.error("Error creating draft:", error)
        return NextResponse.json({ error: "Failed to create draft", success: false }, { status: 500 })
      }

      draftId = data.id
    }

    const response: SaveDraftResponse = {
      draftId: draftId!,
      savedAt: new Date().toISOString(),
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error saving draft:", error)
    return NextResponse.json({ error: "Failed to save draft", success: false }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const draftId = searchParams.get("id")

    if (draftId) {
      // Get specific draft
      const { data, error } = await supabase
        .from("listing_drafts")
        .select("*")
        .eq("id", draftId)
        .eq("user_id", userId)
        .single()

      if (error) {
        console.error("Error fetching draft:", error)
        return NextResponse.json({ error: "Failed to fetch draft", success: false }, { status: 500 })
      }

      return NextResponse.json({
        draft: data,
        success: true,
      })
    } else {
      // Get all drafts for user
      const { data, error } = await supabase
        .from("listing_drafts")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching drafts:", error)
        return NextResponse.json({ error: "Failed to fetch drafts", success: false }, { status: 500 })
      }

      return NextResponse.json({
        drafts: data,
        success: true,
      })
    }
  } catch (error) {
    console.error("Error fetching drafts:", error)
    return NextResponse.json({ error: "Failed to fetch drafts", success: false }, { status: 500 })
  }
}
