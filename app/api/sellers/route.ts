import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const rating = searchParams.get("rating")
    const location = searchParams.get("location")
    const services = searchParams.get("services")

    // Mock seller profiles data
    const sellers = [
      {
        id: "seller-1",
        userId: "user-seller-1",
        companyName: "TechFlow Solutions",
        tagline: "Enterprise Software Integration Specialists",
        description:
          "We specialize in seamless enterprise software integrations with 10+ years of experience helping businesses streamline their operations.",
        logo: "/placeholder.svg?height=80&width=80",
        website: "https://techflow.com",
        location: "San Francisco, CA",
        foundedYear: 2014,
        teamSize: "11-50",
        metrics: {
          totalProposals: 127,
          projectsWon: 89,
          winRate: 70.1,
          completionRate: 96.6,
          averageCompletionTime: 45,
          averageBidSize: 75000,
          responseTime: 4.2,
          bidRevisionCount: 2.3,
          activeProjects: 8,
          industryFocus: [
            { industry: "SaaS", percentage: 35 },
            { industry: "E-commerce", percentage: 25 },
            { industry: "Healthcare", percentage: 20 },
            { industry: "Finance", percentage: 20 },
          ],
        },
        averageRating: {
          communication: 4.8,
          technicalExpertise: 4.9,
          timeliness: 4.7,
          valueForCost: 4.6,
          overallSatisfaction: 4.8,
        },
        totalReviews: 67,
        servicesOffered: ["ERP Implementation", "CRM Integration", "Data Migration", "Custom Development"],
        techStack: ["Salesforce", "NetSuite", "React", "Node.js", "Python"],
        isVerified: true,
        backgroundCheckStatus: "VERIFIED",
        healthScore: 94,
        nextAvailability: "2024-03-01",
        isAcceptingProjects: true,
        followers: [],
        lastActive: "2024-01-20T10:30:00Z",
        isPublic: true,
        allowDirectContact: true,
      },
      // Add more mock sellers as needed
    ]

    // Apply filters
    let filteredSellers = sellers

    if (search) {
      filteredSellers = filteredSellers.filter(
        (seller) =>
          seller.companyName.toLowerCase().includes(search.toLowerCase()) ||
          seller.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (rating) {
      const minRating = Number.parseFloat(rating)
      filteredSellers = filteredSellers.filter((seller: any) => seller.averageRating.overallSatisfaction >= minRating)
    }

    if (location && location !== "all") {
      filteredSellers = filteredSellers.filter((seller: any) => seller.location.includes(location))
    }

    return NextResponse.json({
      sellers: filteredSellers,
      total: filteredSellers.length,
    })
  } catch (error) {
    console.error("Error fetching sellers:", error)
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 })
  }
}
