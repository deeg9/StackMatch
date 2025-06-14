import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { providerId, verificationType, documents, businessInfo } = body
    const supabase = createClient()

    // Create verification request
    const verificationRequest = {
      provider_id: providerId,
      verification_type: verificationType,
      status: "PENDING",
      submitted_at: new Date().toISOString(),
      documents: documents || [],
      business_info: businessInfo || {},
      priority: "MEDIUM",
    }

    // For business verification, check if auto-verification is possible
    if (verificationType === "BUSINESS" && businessInfo) {
      const isAutoVerifiable = await checkBusinessAutoVerification(businessInfo)
      if (isAutoVerifiable) {
        verificationRequest.status = "VERIFIED"

        // Update provider profile
        await supabase
          .from("provider_profiles")
          .update({
            is_verified: true,
            verification_status: "VERIFIED",
            verified_at: new Date().toISOString(),
          })
          .eq("id", providerId)
      }
    }

    const { data, error } = await supabase.from("verification_requests").insert(verificationRequest).select().single()

    if (error) {
      console.error("Error creating verification request:", error)
      return NextResponse.json({ error: "Failed to create verification request" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Verification request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("provider_id", providerId)
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("Error fetching verification requests:", error)
      return NextResponse.json({ error: "Failed to fetch verification requests" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Verification fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function checkBusinessAutoVerification(businessInfo: any): Promise<boolean> {
  // Auto-verification logic for business registration
  // This would integrate with external APIs like:
  // - Secretary of State databases
  // - IRS EIN verification
  // - D&B business verification

  const { registrationNumber, taxId, businessName } = businessInfo

  // Mock verification - in production, this would call external APIs
  if (registrationNumber && taxId && businessName) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock verification success for demo
    return registrationNumber.includes("LLC") || registrationNumber.includes("CORP")
  }

  return false
}
