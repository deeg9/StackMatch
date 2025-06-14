import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { action } = await request.json()

    if (action !== "create_sample_data") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Sample deal room IDs
    const dealRoomIds = [
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002",
      "550e8400-e29b-41d4-a716-446655440003",
    ]

    // Create sample users if they don't exist
    const sampleUsers = [
      { id: user.id, email: user.email || "current@user.com", full_name: "Current User" },
      { id: "550e8400-e29b-41d4-a716-446655440010", email: "business@techcorp.com", full_name: "John Business" },
      { id: "550e8400-e29b-41d4-a716-446655440011", email: "provider@softsolutions.com", full_name: "Jane Provider" },
    ]

    // Insert users (ignore conflicts)
    for (const sampleUser of sampleUsers) {
      await supabase.from("users").upsert(sampleUser, { onConflict: "id" })
    }

    // Create sample deal rooms
    const sampleDealRooms = [
      {
        id: dealRoomIds[0],
        room_name: "ERP Implementation Project",
        business_id: sampleUsers[1].id,
        provider_id: sampleUsers[2].id,
        status: "ACTIVE",
      },
      {
        id: dealRoomIds[1],
        room_name: "CRM System Integration",
        business_id: sampleUsers[1].id,
        provider_id: sampleUsers[2].id,
        status: "NEGOTIATION",
      },
      {
        id: dealRoomIds[2],
        room_name: "POS System Deployment",
        business_id: sampleUsers[1].id,
        provider_id: sampleUsers[2].id,
        status: "ACTIVE",
      },
    ]

    await supabase.from("deal_rooms").upsert(sampleDealRooms, { onConflict: "id" })

    // Create sample contracts
    const sampleContracts = [
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        deal_room_id: dealRoomIds[0],
        contract_name: "Master Service Agreement - ERP",
        status: "DRAFT",
        total_value: 150000.0,
        currency: "USD",
        summary: "Comprehensive ERP implementation including customization and training",
        created_by: user.id,
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440002",
        deal_room_id: dealRoomIds[1],
        contract_name: "CRM Integration Contract",
        status: "PENDING_SIGNATURES",
        total_value: 75000.0,
        currency: "USD",
        summary: "CRM system integration with existing infrastructure",
        created_by: user.id,
      },
    ]

    await supabase.from("contracts").upsert(sampleContracts, { onConflict: "id" })

    // Create sample payment milestones
    const sampleMilestones = [
      {
        contract_id: sampleContracts[0].id,
        deal_room_id: dealRoomIds[0],
        milestone_name: "Initial Payment",
        description: "25% upfront payment upon contract signing",
        amount: 37500.0,
        currency: "USD",
        status: "PENDING",
      },
      {
        contract_id: sampleContracts[0].id,
        deal_room_id: dealRoomIds[0],
        milestone_name: "Development Milestone",
        description: "50% payment upon completion of development phase",
        amount: 75000.0,
        currency: "USD",
        status: "PENDING",
      },
      {
        contract_id: sampleContracts[0].id,
        deal_room_id: dealRoomIds[0],
        milestone_name: "Final Payment",
        description: "25% final payment upon project completion",
        amount: 37500.0,
        currency: "USD",
        status: "PENDING",
      },
    ]

    await supabase.from("payment_milestones").upsert(sampleMilestones, { onConflict: "id" })

    // Create sample approvals
    const sampleApprovals = [
      {
        deal_room_id: dealRoomIds[0],
        contract_id: sampleContracts[0].id,
        approver_id: sampleUsers[1].id,
        approver_role: "BUSINESS_LEAD",
        approval_step_name: "Business Review",
        approval_order: 1,
        status: "PENDING",
        created_by: user.id,
      },
      {
        deal_room_id: dealRoomIds[0],
        contract_id: sampleContracts[0].id,
        approver_id: sampleUsers[2].id,
        approver_role: "PROVIDER_LEAD",
        approval_step_name: "Provider Review",
        approval_order: 2,
        status: "PENDING",
        created_by: user.id,
      },
    ]

    await supabase.from("approvals").upsert(sampleApprovals, { onConflict: "id" })

    return NextResponse.json({
      message: "Sample data created successfully",
      dealRooms: sampleDealRooms.length,
      contracts: sampleContracts.length,
      milestones: sampleMilestones.length,
      approvals: sampleApprovals.length,
    })
  } catch (error: any) {
    console.error("Error creating sample data:", error)
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
