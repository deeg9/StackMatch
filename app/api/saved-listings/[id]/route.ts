import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete by listing_id (the id parameter is the listing_id, not the saved_listing id)
    const { error } = await supabase
      .from("saved_listings")
      .delete()
      .eq("seller_id", user.id)
      .eq("listing_id", params.id)

    if (error) {
      console.error("Error removing saved listing:", error)
      return NextResponse.json({ error: "Failed to remove saved listing" }, { status: 500 })
    }

    return NextResponse.json({ message: "Saved listing removed successfully" })
  } catch (error) {
    console.error("Error in saved listing DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
