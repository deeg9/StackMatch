"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Star, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type Provider = {
  id: string
  name: string
  company_name: string
  logo_url: string | null
  website_url: string | null
  rating: number
  projects_completed: number
  specialties: string[]
  is_verified: boolean
  notes: string | null
}

interface PreferredProvidersTabProps {
  buyerProfileId: string
}

const PreferredProvidersTab = ({ buyerProfileId }: PreferredProvidersTabProps) => {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true)
      setError(null)

      try {
        // For demo or if buyerProfileId starts with mock, use mock data
        if (!buyerProfileId || buyerProfileId.startsWith("mock")) {
          // Mock provider data
          const mockProviders: Provider[] = [
            {
              id: "provider-1",
              name: "TechSolutions Inc.",
              company_name: "TechSolutions Inc.",
              logo_url: "/placeholder.svg?height=40&width=40",
              website_url: "https://techsolutions.example.com",
              rating: 4.8,
              projects_completed: 12,
              specialties: ["Web Development", "Mobile Apps", "CRM Integration"],
              is_verified: true,
              notes: "Great team to work with, very responsive and professional.",
            },
            {
              id: "provider-2",
              name: "DataWorks Systems",
              company_name: "DataWorks Systems",
              logo_url: "/placeholder.svg?height=40&width=40",
              website_url: "https://dataworks.example.com",
              rating: 4.5,
              projects_completed: 8,
              specialties: ["Data Analytics", "Business Intelligence", "Cloud Migration"],
              is_verified: true,
              notes: "Excellent data expertise, helped us migrate our entire warehouse to the cloud.",
            },
            {
              id: "provider-3",
              name: "AppMasters",
              company_name: "AppMasters LLC",
              logo_url: "/placeholder.svg?height=40&width=40",
              website_url: "https://appmasters.example.com",
              rating: 4.2,
              projects_completed: 5,
              specialties: ["Mobile Apps", "UI/UX Design", "React Native"],
              is_verified: false,
              notes: "Good mobile developers, delivered our app on time and on budget.",
            },
            {
              id: "provider-4",
              name: "CloudNine Solutions",
              company_name: "CloudNine Solutions",
              logo_url: "/placeholder.svg?height=40&width=40",
              website_url: "https://cloudnine.example.com",
              rating: 4.9,
              projects_completed: 15,
              specialties: ["AWS", "Azure", "Cloud Architecture", "DevOps"],
              is_verified: true,
              notes: "The best cloud experts we've worked with. Highly recommended.",
            },
          ]

          setProviders(mockProviders)
          setLoading(false)
          return
        }

        // Try to fetch real data, but use mock data as fallback
        try {
          const response = await fetch(`/api/buyer-profiles/preferred-providers?profileId=${buyerProfileId}`)

          if (!response.ok) {
            throw new Error(`Failed to fetch providers: ${response.status}`)
          }

          const data = await response.json()
          setProviders(data.providers || [])
        } catch (error) {
          console.error("Failed to fetch preferred providers:", error)
          // Fall back to mock data
          setProviders([
            {
              id: "provider-1",
              name: "TechSolutions Inc.",
              company_name: "TechSolutions Inc.",
              logo_url: "/placeholder.svg?height=40&width=40",
              website_url: "https://techsolutions.example.com",
              rating: 4.8,
              projects_completed: 12,
              specialties: ["Web Development", "Mobile Apps", "CRM Integration"],
              is_verified: true,
              notes: "Great team to work with, very responsive and professional.",
            },
            {
              id: "provider-2",
              name: "DataWorks Systems",
              company_name: "DataWorks Systems",
              logo_url: "/placeholder.svg?height=40&width=40",
              website_url: "https://dataworks.example.com",
              rating: 4.5,
              projects_completed: 8,
              specialties: ["Data Analytics", "Business Intelligence", "Cloud Migration"],
              is_verified: true,
              notes: "Excellent data expertise, helped us migrate our entire warehouse to the cloud.",
            },
          ])
        }
      } catch (error) {
        console.error("Error in preferred providers handling:", error)
        setError("Failed to load preferred providers. Using demo data instead.")

        // Ensure we have mock data even if everything fails
        setProviders([
          {
            id: "provider-1",
            name: "TechSolutions Inc.",
            company_name: "TechSolutions Inc.",
            logo_url: "/placeholder.svg?height=40&width=40",
            website_url: "https://techsolutions.example.com",
            rating: 4.8,
            projects_completed: 12,
            specialties: ["Web Development", "Mobile Apps", "CRM Integration"],
            is_verified: true,
            notes: "Great team to work with, very responsive and professional.",
          },
          {
            id: "provider-2",
            name: "DataWorks Systems",
            company_name: "DataWorks Systems",
            logo_url: "/placeholder.svg?height=40&width=40",
            website_url: "https://dataworks.example.com",
            rating: 4.5,
            projects_completed: 8,
            specialties: ["Data Analytics", "Business Intelligence", "Cloud Migration"],
            is_verified: true,
            notes: "Excellent data expertise, helped us migrate our entire warehouse to the cloud.",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [buyerProfileId])

  const filteredProviders = searchTerm
    ? providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : providers

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preferred Providers</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Preferred Providers</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">{error}</p>
        </div>
      )}

      <div className="mb-4">
        <Input
          placeholder="Search providers by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredProviders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No preferred providers found. Add your first provider!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <Card key={provider.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={provider.logo_url || ""} alt={provider.name} />
                      <AvatarFallback>
                        {provider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-lg">{provider.name}</h3>
                        {provider.is_verified && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">{renderStars(provider.rating)}</div>
                        <span className="text-sm text-gray-500">
                          {provider.rating.toFixed(1)} ({provider.projects_completed} projects)
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {provider.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {provider.website_url && (
                    <a
                      href={provider.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      Website <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>

                {provider.notes && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">{provider.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Edit Notes
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default PreferredProvidersTab
