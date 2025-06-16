import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClientWithCookies } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { contractId: string } }) {
  const supabase = await createClientWithCookies()
  const { contractId } = params

  try {
    const { data: milestones, error } = await supabase
      .from("payment_milestones")
      .select("*")
      .eq("contract_id", contractId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json(milestones)
  } catch (error: any) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { contractId: string } }) {
  const supabase = await createClientWithCookies()
  const { contractId } = params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { deal_room_id, milestone_name, description, due_date, amount, currency = "USD" } = body

    const { data: milestone, error } = await supabase
      .from("payment_milestones")
      .insert({
        contract_id: contractId,
        deal_room_id,
        milestone_name,
        description,
        due_date: due_date || null,
        amount,
        currency,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(milestone, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
