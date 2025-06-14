import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { ForumLayout } from "@/components/forum/forum-layout"
import { ThreadCard } from "@/components/forum/thread-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"
import Link from "next/link"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return {
    title: `${categoryName} Discussions | StackTalk Forum`,
    description: `Browse discussions about ${categoryName} on StackTalk Community Forum`,
  }
}

// Mock data for category-specific threads
const getCategoryThreads = (categorySlug: string) => {
  const categoryName = categorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return [
    {
      id: "cat-1",
      title: `Best practices for ${categoryName} implementation`,
      preview: `Looking for advice on implementing ${categoryName} solutions. What are the key considerations and common pitfalls to avoid?`,
      author: {
        id: "user1",
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=32&width=32&query=AT",
        role: "BUSINESS" as const,
        verificationStatus: "VERIFIED" as const,
        contributionLevel: 2,
      },
      type: "QUESTION" as const,
      category: categoryName,
      tags: [categoryName, "Implementation", "Best Practices"],
      createdAt: "2024-01-20T14:30:00Z",
      stats: {
        views: 156,
        upvotes: 12,
        downvotes: 1,
        comments: 8,
      },
      hasBestAnswer: false,
    },
    {
      id: "cat-2",
      title: `${categoryName} vendor comparison`,
      preview: `Has anyone done a comprehensive comparison of ${categoryName} vendors? Looking for insights on pricing, features, and support quality.`,
      author: {
        id: "user2",
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=32&width=32&query=MG",
        role: "BUSINESS" as const,
        verificationStatus: "TRUSTED" as const,
        contributionLevel: 3,
      },
      type: "DISCUSSION" as const,
      category: categoryName,
      tags: [categoryName, "Vendor Comparison", "Pricing"],
      createdAt: "2024-01-19T09:15:00Z",
      stats: {
        views: 234,
        upvotes: 18,
        downvotes: 2,
        comments: 15,
      },
      hasBestAnswer: true,
    },
  ]
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const threads = getCategoryThreads(params.slug)

  return (
    <>
      <Navigation />
      <ForumLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{categoryName} Discussions</h1>
              <p className="text-muted-foreground text-sm">Browse discussions and questions about {categoryName}</p>
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
              <Input type="search" placeholder={`Search ${categoryName} discussions...`} className="pl-9" />
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
