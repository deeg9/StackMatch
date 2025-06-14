import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { contractId: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { contractId } = params

  try {
    const { data: approvals, error } = await supabase
      .from("approvals")
      .select(`
        *,
        approver:users!approvals_approver_id_fkey (id, full_name, email),
        creator:users!approvals_created_by_fkey (id, full_name, email)
      `)
      .eq("contract_id", contractId)
      .order("approval_order", { ascending: true })

    if (error) throw error

    return NextResponse.json(approvals)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { contractId: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { contractId } = params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { deal_room_id, approver_id, approver_role, approval_step_name, approval_order = 1 } = body

    const { data: approval, error } = await supabase
      .from("approvals")
      .insert({
        deal_room_id,
        contract_id: contractId,
        approver_id,
        approver_role,
        approval_step_name,
        approval_order,
        created_by: user.id,
      })
      .select(`
        *,
        approver:users!approvals_approver_id_fkey (id, full_name, email),
        creator:users!approvals_created_by_fkey (id, full_name, email)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(approval, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
