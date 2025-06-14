"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Users, FileText } from "lucide-react"
import Link from "next/link"

interface Alternative {
  id: string
  title: string
  description: string
  type: "seller" | "listing" | "resource"
  url: string
}

interface ClosureAlternativesProps {
  dealRoomId: string
  closureReason?: string
}

export function ClosureAlternatives({ dealRoomId, closureReason }: ClosureAlternativesProps) {
  const [alternatives, setAlternatives] = useState<Alternative[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch alternatives from the API
    // based on the deal room details and closure reason
    const fetchAlternatives = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setAlternatives([
          {
            id: "1",
            title: "Top-rated DevOps Specialist",
            description: "Specializes in cloud infrastructure and CI/CD pipelines",
            type: "seller",
            url: "/browse-sellers/1",
          },
          {
            id: "2",
            title: "Enterprise Software Integration",
            description: "Similar project with flexible timeline and budget",
            type: "listing",
            url: "/listings/2",
          },
          {
            id: "3",
            title: "How to Write Effective Project Requirements",
            description: "Guide to creating clear project specifications",
            type: "resource",
            url: "/resources/guides/project-requirements",
          },
          {
            id: "4",
            title: "Full-Stack Development Team",
            description: "Team with experience in similar projects",
            type: "seller",
            url: "/browse-sellers/4",
          },
          {
            id: "5",
            title: "API Integration Project",
            description: "Similar scope with different approach",
            type: "listing",
            url: "/listings/5",
          },
        ])
      } catch (error) {
        console.error("Error fetching alternatives:", error)
        setAlternatives([])
      } finally {
        setLoading(false)
      }
    }

    fetchAlternatives()
  }, [dealRoomId, closureReason])

  const sellerAlternatives = alternatives.filter((alt) => alt.type === "seller")
  const listingAlternatives = alternatives.filter((alt) => alt.type === "listing")
  const resourceAlternatives = alternatives.filter((alt) => alt.type === "resource")

  const renderAlternativesList = (items: Alternative[]) => {
    if (items.length === 0) {
      return <div className="text-center py-8 text-gray-500">No alternatives found</div>
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {item.type === "seller" && <Users className="h-5 w-5 text-blue-500" />}
                  {item.type === "listing" && <FileText className="h-5 w-5 text-green-500" />}
                  {item.type === "resource" && <FileText className="h-5 w-5 text-amber-500" />}
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <div className="mt-3">
                    <Link href={item.url}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <span>Recommended Alternatives</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <Tabs defaultValue="sellers">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sellers">Sellers ({sellerAlternatives.length})</TabsTrigger>
              <TabsTrigger value="listings">Listings ({listingAlternatives.length})</TabsTrigger>
              <TabsTrigger value="resources">Resources ({resourceAlternatives.length})</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="sellers">{renderAlternativesList(sellerAlternatives)}</TabsContent>
              <TabsContent value="listings">{renderAlternativesList(listingAlternatives)}</TabsContent>
              <TabsContent value="resources">{renderAlternativesList(resourceAlternatives)}</TabsContent>
            </div>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
