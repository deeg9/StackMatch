"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ArrowUpRight } from "lucide-react"
import { UserBadge } from "@/components/forum/user-badge"

interface RelatedDiscussionsProps {
  listingId: string
  tags?: string[]
  category?: string
}

export function RelatedDiscussions({ listingId, tags = [], category }: RelatedDiscussionsProps) {
  const [discussions, setDiscussions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedDiscussions = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would fetch from an API endpoint
        // For now, we'll use mock data based on the tags and category

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockDiscussions = [
          {
            id: "thread-1",
            title: "What CRM do you recommend for a SaaS startup?",
            excerpt: "We're a small SaaS startup looking for a CRM solution. Any recommendations?",
            category: "CRM Tools",
            tags: ["SaaS", "Startup", "CRM"],
            createdAt: "2023-05-15T10:30:00Z",
            author: {
              id: "user-1",
              name: "John Doe",
              role: "BUSINESS",
              isVerified: true,
            },
            stats: {
              comments: 8,
            },
          },
          {
            id: "thread-2",
            title: "Our NetSuite implementation took 4 months. AMA.",
            excerpt:
              "We recently completed our NetSuite implementation. It took 4 months and cost us $50k. Ask me anything!",
            category: "ERP Systems",
            tags: ["NetSuite", "Implementation", "Case Study"],
            createdAt: "2023-05-10T14:20:00Z",
            author: {
              id: "user-2",
              name: "Jane Smith",
              role: "BUSINESS",
              isVerified: true,
            },
            stats: {
              comments: 15,
            },
          },
          {
            id: "thread-3",
            title: "Which inventory management system integrates best with Shopify?",
            excerpt:
              "We're running a Shopify store and need a robust inventory management system. What do you recommend?",
            category: "Inventory Management",
            tags: ["Shopify", "Inventory", "E-commerce"],
            createdAt: "2023-05-08T08:45:00Z",
            author: {
              id: "user-3",
              name: "Mike Johnson",
              role: "BUSINESS",
              isVerified: false,
            },
            stats: {
              comments: 10,
            },
          },
        ]

        // Filter discussions based on tags and category
        let filteredDiscussions = mockDiscussions

        if (tags.length > 0) {
          filteredDiscussions = filteredDiscussions.filter((discussion) =>
            discussion.tags.some((tag: string) => tags.includes(tag)),
          )
        }

        if (category) {
          filteredDiscussions = filteredDiscussions.filter((discussion) => discussion.category === category)
        }

        setDiscussions(filteredDiscussions)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching related discussions:", error)
        setIsLoading(false)
      }
    }

    fetchRelatedDiscussions()
  }, [listingId, tags, category])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Discussions</CardTitle>
          <CardDescription>Loading discussions...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (discussions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Discussions</CardTitle>
          <CardDescription>No related discussions found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Be the first to start a discussion about this topic in our community forum.
          </p>
          <Link href="/forum/create" className="text-sm text-primary hover:underline flex items-center mt-2">
            Start a discussion <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Discussions</CardTitle>
        <CardDescription>Community conversations about similar topics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="border-b pb-4 last:border-0 last:pb-0">
            <Link href={`/forum/thread/${discussion.id}`} className="block hover:opacity-80">
              <h4 className="font-medium text-sm mb-1">{discussion.title}</h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{discussion.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserBadge user={discussion.author} size="xs" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(discussion.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{discussion.stats.comments}</span>
                </div>
              </div>
            </Link>
            <div className="flex flex-wrap gap-1 mt-2">
              {discussion.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        <Link href="/forum" className="text-sm text-primary hover:underline flex items-center justify-end mt-2">
          View all discussions <ArrowUpRight className="h-3 w-3 ml-1" />
        </Link>
      </CardContent>
    </Card>
  )
}
