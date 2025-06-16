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

    const { data, error } = await supabase
      .from("provider_portfolio")
      .select(`
        *,
        portfolio_images(*)
      `)
      .eq("provider_id", providerId)
      .eq("is_public", true)
      .order("is_featured", { ascending: false })
      .order("completion_date", { ascending: false })

    if (error) {
      console.error("Error fetching portfolio:", error)
      return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Portfolio API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { images, ...portfolioData } = body
    const supabase = await createClient()

    // Insert portfolio item
    const { data: portfolio, error: portfolioError } = await supabase
      .from("provider_portfolio")
      .insert(portfolioData)
      .select()
      .single()

    if (portfolioError) {
      console.error("Error creating portfolio item:", portfolioError)
      return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 })
    }

    // Insert images if provided
    if (images && images.length > 0) {
      const imageData = images.map((image: any, index: number) => ({
        portfolio_id: portfolio.id,
        image_url: image.url,
        caption: image.caption,
        display_order: index,
        is_primary: index === 0,
      }))

      const { error: imagesError } = await supabase.from("portfolio_images").insert(imageData)

      if (imagesError) {
        console.error("Error adding portfolio images:", imagesError)
      }
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Portfolio creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, images, ...updates } = body
    const supabase = await createClient()

    const { data, error } = await supabase.from("provider_portfolio").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating portfolio item:", error)
      return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 })
    }

    // Update images if provided
    if (images) {
      // Delete existing images
      await supabase.from("portfolio_images").delete().eq("portfolio_id", id)

      // Insert new images
      if (images.length > 0) {
        const imageData = images.map((image: any, index: number) => ({
          portfolio_id: id,
          image_url: image.url,
          caption: image.caption,
          display_order: index,
          is_primary: index === 0,
        }))

        await supabase.from("portfolio_images").insert(imageData)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Portfolio update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("provider_portfolio").delete().eq("id", id)

    if (error) {
      console.error("Error deleting portfolio item:", error)
      return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Portfolio deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
