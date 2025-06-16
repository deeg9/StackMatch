import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClientWithCookies } from "@/lib/supabase/server"

export async function PATCH(request: Request, { params }: { params: { milestoneId: string } }) {
  const supabase = await createClientWithCookies()
  const { milestoneId } = params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { status } = await request.json()

    const updateData: any = { status, updated_at: new Date().toISOString() }

    // Add specific fields based on status
    if (status === "APPROVED_FOR_PAYMENT") {
      updateData.approved_for_payment_by = user.id
      updateData.approved_for_payment_at = new Date().toISOString()
    } else if (status === "PAID") {
      updateData.paid_at = new Date().toISOString()
    }

    const { data: milestone, error } = await supabase
      .from("payment_milestones")
      .update(updateData)
      .eq("id", milestoneId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(milestone)
  } catch (error: any) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
