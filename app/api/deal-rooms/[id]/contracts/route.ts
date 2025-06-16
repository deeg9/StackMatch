import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClientWithCookies } from "@/lib/supabase/server"
import type { Contract } from "@/types"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClientWithCookies()
  const dealRoomId = params.id

  if (!dealRoomId) {
    return NextResponse.json({ error: "Deal Room ID is required" }, { status: 400 })
  }

  try {
    const { data: contracts, error } = await supabase
      .from("contracts")
      .select(`
        *,
        creator:users!contracts_created_by_fkey (id, full_name, email)
      `)
      .eq("deal_room_id", dealRoomId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contracts:", error)
      return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
    }

    return NextResponse.json(contracts as Contract[])
  } catch (e: any) {
    console.error("Unexpected error fetching contracts:", e)
    return NextResponse.json({ error: e.message || "An unexpected error occurred" }, { status: 500 })
  }
}
