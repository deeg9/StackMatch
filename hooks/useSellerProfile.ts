"use client"

import { useState, useEffect } from "react"
import type { ProviderProfile } from "@/types"

export function useSellerProfile(sellerId: string) {
  const [profile, setProfile] = useState<ProviderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        // Mock API call - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockProfile: ProviderProfile = {
          id: sellerId,
          userId: sellerId,
          companyName: "TechFlow Solutions",
          description: "Leading provider of enterprise software integration services with over 10 years of experience.",
          industry: "Software Development",
          companySize: "11-50",
          foundingYear: 2012,
          location: "San Francisco, CA",
          logoUrl: "/placeholder.svg?height=120&width=120",
          bannerImageUrl: "/placeholder.svg?height=300&width=1200",
          websiteUrl: "https://techflow.com",
          isVerified: true,
          isAcceptingProjects: true,
          nextAvailableDate: "2024-02-15",
          healthScore: 95,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z",
          seller_metrics: {
            id: "metrics-1",
            sellerId,
            totalProjects: 150,
            completedProjects: 142,
            averageRating: 4.8,
            totalReviews: 89,
            responseTimeHours: 2.5,
            completionRate: 94.7,
            onTimeDeliveryRate: 96.2,
            repeatClientRate: 78.5,
            winRate: 65.3,
            totalEarnings: 2500000,
            averageProjectValue: 17605,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-15T00:00:00Z",
          },
          seller_services: [
            {
              id: "service-1",
              sellerId,
              serviceName: "ERP Implementation",
              description: "Full-scale ERP system implementation and customization",
              category: "Enterprise Software",
              startingPrice: 25000,
              deliveryTimeWeeks: 12,
              isActive: true,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
            },
            {
              id: "service-2",
              sellerId,
              serviceName: "CRM Integration",
              description: "Salesforce and custom CRM integration services",
              category: "CRM",
              startingPrice: 15000,
              deliveryTimeWeeks: 8,
              isActive: true,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
            },
          ],
          seller_technologies: [
            {
              id: "tech-1",
              sellerId,
              technologyName: "Salesforce",
              experienceYears: 8,
              proficiencyLevel: "EXPERT",
              createdAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "tech-2",
              sellerId,
              technologyName: "NetSuite",
              experienceYears: 6,
              proficiencyLevel: "EXPERT",
              createdAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "tech-3",
              sellerId,
              technologyName: "React",
              experienceYears: 5,
              proficiencyLevel: "ADVANCED",
              createdAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "tech-4",
              sellerId,
              technologyName: "Node.js",
              experienceYears: 5,
              proficiencyLevel: "ADVANCED",
              createdAt: "2024-01-01T00:00:00Z",
            },
          ],
          seller_portfolio: [
            {
              id: "portfolio-1",
              sellerId,
              title: "Enterprise ERP Implementation",
              description: "Complete ERP system implementation for manufacturing company",
              projectType: "ERP Implementation",
              clientIndustry: "Manufacturing",
              technologiesUsed: ["NetSuite", "React", "Node.js"],
              projectUrl: "https://example.com/case-study-1",
              completionDate: "2023-12-15",
              isPublic: true,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
              portfolio_images: [
                {
                  id: "img-1",
                  portfolioItemId: "portfolio-1",
                  imageUrl: "/placeholder.svg?height=200&width=300",
                  caption: "Dashboard Overview",
                  sortOrder: 1,
                  createdAt: "2024-01-01T00:00:00Z",
                },
              ],
            },
          ],
          seller_team_members: [
            {
              id: "team-1",
              sellerId,
              name: "John Smith",
              role: "Lead Developer",
              bio: "Senior developer with 10+ years experience in enterprise software",
              avatarUrl: "/placeholder.svg?height=80&width=80",
              yearsExperience: 10,
              specializations: ["Salesforce", "NetSuite"],
              isPublic: true,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
            },
          ],
          seller_certifications: [
            {
              id: "cert-1",
              sellerId,
              certificationName: "Salesforce Certified Administrator",
              issuingOrganization: "Salesforce",
              issueDate: "2023-06-15",
              expiryDate: "2026-06-15",
              credentialId: "SF-ADMIN-2023-001",
              verificationUrl: "https://trailhead.salesforce.com/credentials/verification",
              isVerified: true,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
            },
          ],
          seller_badges: [
            {
              id: "badge-1",
              sellerId,
              badgeName: "Top Performer",
              description: "Consistently high-quality work and client satisfaction",
              iconUrl: "/placeholder.svg?height=40&width=40",
              earnedAt: "2023-12-01",
              createdAt: "2024-01-01T00:00:00Z",
            },
          ],
        }

        setProfile(mockProfile)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch seller profile")
      } finally {
        setLoading(false)
      }
    }

    if (sellerId) {
      fetchProfile()
    }
  }, [sellerId])

  return { profile, loading, error }
}
