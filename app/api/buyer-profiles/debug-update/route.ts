import { NextResponse } from "next/server"
import { getErrorMessage } from "@/lib/utils/error-handler"

export async function GET() {
  try {
    console.log("🔍 DEBUG UPDATE: Testing update functionality...")

    const testData = {
      user_id: "1cae22cb-1311-48ca-9caa-47d474c0a20e",
      company_name: "StackMatch Updated",
      industry: "Technology/Software",
      company_size: "11-50 employees",
      detailed_company_description: "Updated description for testing",
    }

    // Test the PUT endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/buyer-profiles`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()

    return NextResponse.json({
      message: "Debug update test completed",
      status: response.status,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🔍 DEBUG UPDATE: Error:", error)
    return NextResponse.json(
      {
        error: "Debug update failed",
        details: getErrorMessage(error),
      },
      { status: 500 },
    )
  }
}
