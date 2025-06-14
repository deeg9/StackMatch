import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { ForumLayout } from "@/components/forum/forum-layout"
import { ThreadCard } from "@/components/forum/thread-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, Tag } from "lucide-react"
import Link from "next/link"

interface TagPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tagName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  return {
    title: `${tagName} Tag | StackTalk Forum`,
    description: `Browse discussions tagged with ${tagName} on StackTalk Community Forum`,
  }
}

// Mock data for tag-specific threads
const getTagThreads = (tagSlug: string) => {
  const tagName = tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1)

  return [
    {
      id: "tag-1",
      title: `${tagName} integration challenges and solutions`,
      preview: `Sharing our experience with ${tagName} integration. Here are the main challenges we faced and how we solved them.`,
      author: {
        id: "user1",
        name: "Jennifer Lee",
        avatar: "/placeholder.svg?height=32&width=32&query=JL",
        role: "PROVIDER" as const,
        verificationStatus: "EXPERT" as const,
        contributionLevel: 5,
      },
      type: "DISCUSSION" as const,
      category: "Integration",
      tags: [tagName, "Integration", "Solutions"],
      createdAt: "2024-01-21T16:45:00Z",
      stats: {
        views: 189,
        upvotes: 22,
        downvotes: 1,
        comments: 12,
      },
      hasBestAnswer: false,
    },
    {
      id: "tag-2",
      title: `${tagName} pricing and licensing questions`,
      preview: `Can someone explain the different ${tagName} pricing tiers and what's included in each? Looking for real-world cost examples.`,
      author: {
        id: "user2",
        name: "Robert Kim",
        avatar: "/placeholder.svg?height=32&width=32&query=RK",
        role: "BUSINESS" as const,
        verificationStatus: "VERIFIED" as const,
        contributionLevel: 1,
      },
      type: "QUESTION" as const,
      category: "Pricing",
      tags: [tagName, "Pricing", "Licensing"],
      createdAt: "2024-01-20T11:20:00Z",
      stats: {
        views: 267,
        upvotes: 15,
        downvotes: 0,
        comments: 18,
      },
      hasBestAnswer: true,
    },
  ]
}

export default function TagPage({ params }: TagPageProps) {
  const tagName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
  const threads = getTagThreads(params.slug)

  return (
    <>
      <Navigation />
      <ForumLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <Badge variant="outline" className="text-base px-3 py-1">
                  {tagName}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold mb-1">Discussions tagged with "{tagName}"</h1>
              <p className="text-muted-foreground text-sm">Browse all discussions and questions related to {tagName}</p>
            </div>
            <Button asChild>
              <Link href="/forum/create">
                <Plus className="h-4 w-4 mr-2" />
                New Discussion
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder={`Search ${tagName} discussions...`} className="pl-9" />
            </div>
            <div className="flex items-center gap-2 self-end">
              <Select defaultValue="latest">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="upvoted">Most Upvoted</SelectItem>
                  <SelectItem value="commented">Most Commented</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Discussions</h2>
              <span className="text-sm text-muted-foreground">{threads.length} discussions</span>
            </div>
            <div>
              {threads.map((thread) => (
                <ThreadCard key={thread.id} {...thread} />
              ))}
            </div>
          </div>
        </div>
      </ForumLayout>
    </>
  )
}
