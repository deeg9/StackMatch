import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const listing_id = searchParams.get("listing_id")
    const proposal_id = searchParams.get("proposal_id") // Changed from bid_id
    const status = searchParams.get("status")

    let query = supabase
      .from("proposal_questions")
      .select(
        `
        *,
        proposal_answers(*)
      `,
      )
      .order("created_at", { ascending: false })

    if (listing_id) {
      query = query.eq("listing_id", listing_id)
    }

    if (proposal_id) {
      query = query.eq("proposal_id", proposal_id) // Changed from bid_id
    }

    if (status && status !== "ALL") {
      query = query.eq("status", status)
    }

    const { data: questions, error } = await query

    if (error) {
      console.error("Error fetching questions:", error)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    return NextResponse.json({ questions: questions || [] })
  } catch (error) {
    console.error("Error in questions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const questionData = await request.json()

    // Validate required fields
    if (!questionData.listing_id || !questionData.question_text || !questionData.asked_by) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: question, error } = await supabase
      .from("proposal_questions")
      .insert([
        {
          ...questionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating question:", error)
      return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
    }

    return NextResponse.json({ question })
  } catch (error) {
    console.error("Error in question creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
