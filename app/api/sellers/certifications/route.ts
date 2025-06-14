import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("provider_certifications")
      .select("*")
      .eq("provider_id", providerId)
      .order("is_verified", { ascending: false })
      .order("issue_date", { ascending: false })

    if (error) {
      console.error("Error fetching certifications:", error)
      return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Certifications API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()

    // Check for auto-verification based on credential ID patterns
    const isAutoVerifiable = await checkAutoVerification(body.credential_id, body.issuing_organization)

    const certificationData = {
      ...body,
      is_verified: isAutoVerifiable,
      verification_date: isAutoVerifiable ? new Date().toISOString() : null,
    }

    const { data, error } = await supabase.from("provider_certifications").insert(certificationData).select().single()

    if (error) {
      console.error("Error creating certification:", error)
      return NextResponse.json({ error: "Failed to create certification" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Certification creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("provider_certifications")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating certification:", error)
      return NextResponse.json({ error: "Failed to update certification" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Certification update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Certification ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase.from("provider_certifications").delete().eq("id", id)

    if (error) {
      console.error("Error deleting certification:", error)
      return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Certification deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function checkAutoVerification(credentialId: string, issuer: string): Promise<boolean> {
  // Auto-verification logic for known certification providers
  const autoVerifiablePatterns = {
    "Amazon Web Services": /^AWS-[A-Z]+-\d{4}-\d+$/,
    Salesforce: /^SF-[A-Z]+-\d{4}-\d+$/,
    Microsoft: /^MS-[A-Z]+-\d{4}-\d+$/,
    "Google Cloud": /^GCP-[A-Z]+-\d{4}-\d+$/,
  }

  const pattern = autoVerifiablePatterns[issuer as keyof typeof autoVerifiablePatterns]
  return pattern ? pattern.test(credentialId) : false
}
