import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Contract } from "@/types"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(contracts as Contract[])
  } catch (e: any) {
    console.error("Unexpected error fetching contracts:", e)
    return NextResponse.json({ error: e.message || "An unexpected error occurred" }, { status: 500 })
  }
}
