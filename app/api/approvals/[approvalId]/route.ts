import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClientWithCookies } from "@/lib/supabase/server"

export async function PATCH(request: Request, { params }: { params: { approvalId: string } }) {
  const supabase = await createClientWithCookies()
  const { approvalId } = params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { status, comments } = await request.json()

    const { data: approval, error } = await supabase
      .from("approvals")
      .update({
        status,
        comments,
        responded_at: new Date().toISOString(),
      })
      .eq("id", approvalId)
      .eq("approver_id", user.id) // Ensure only the assigned approver can update
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(approval)
  } catch (error: any) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
