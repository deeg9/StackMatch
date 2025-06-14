import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const platformId = searchParams.get("platformId")

    // Mock endorsements data
    const endorsements = [
      {
        id: "end-1",
        providerId: "provider-1",
        platformId: "salesforce",
        platformName: "Salesforce",
        platformLogo: "/placeholder.svg?height=60&width=60",
        badgeType: "certified_partner",
        badgeLevel: "gold",
        title: "Salesforce Certified Implementation Partner",
        description: "Recognized for excellence in Salesforce implementations and customer success",
        issuedDate: "2024-01-15T00:00:00Z",
        expiryDate: "2025-01-15T00:00:00Z",
        isActive: true,
        isVerified: true,
        verificationDate: "2024-01-16T00:00:00Z",
        verifiedBy: "Salesforce Partner Team",
        endorsementDetails: {
          projectsCompleted: 25,
          clientSatisfactionScore: 4.8,
          certificationLevel: "Advanced",
          specializations: ["Sales Cloud", "Service Cloud", "Marketing Cloud"],
          endorsementQuote: "TechFlow Solutions has consistently delivered exceptional Salesforce implementations.",
          endorsedBy: {
            name: "Sarah Johnson",
            title: "Partner Success Manager",
            company: "Salesforce",
            avatar: "/placeholder.svg?height=40&width=40",
          },
        },
        evidence: {
          certificationIds: ["SF-CERT-001", "SF-CERT-002"],
          projectReferences: ["proj-1", "proj-2", "proj-3"],
          testimonials: [
            {
              id: "test-1",
              clientName: "John Smith",
              projectTitle: "Sales Cloud Implementation",
              quote: "Exceptional work and great communication throughout the project.",
              rating: 5,
            },
          ],
        },
        displaySettings: {
          showOnProfile: true,
          showInSearch: true,
          priority: 1,
        },
      },
    ]

    // Filter by providerId if specified
    let filteredEndorsements = endorsements
    if (providerId) {
      filteredEndorsements = endorsements.filter((e) => e.providerId === providerId)
    }
    if (platformId) {
      filteredEndorsements = filteredEndorsements.filter((e) => e.platformId === platformId)
    }

    return NextResponse.json({
      success: true,
      data: filteredEndorsements,
    })
  } catch (error) {
    console.error("Failed to fetch endorsements:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch endorsements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { providerId, platformId, badgeType, badgeLevel, evidence } = body

    // Mock creating a new endorsement application
    const application = {
      id: Math.random().toString(36).substr(2, 9),
      providerId,
      platformId,
      requestedBadgeType: badgeType,
      requestedLevel: badgeLevel,
      applicationDate: new Date().toISOString(),
      status: "pending",
      submittedEvidence: evidence,
    }

    return NextResponse.json({
      success: true,
      data: application,
      message: "Endorsement application submitted successfully",
    })
  } catch (error) {
    console.error("Failed to create endorsement application:", error)
    return NextResponse.json({ success: false, error: "Failed to submit application" }, { status: 500 })
  }
}
