"use client"

import { useState } from "react"
// REMOVED: import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Search, TrendingUp, Clock, Users, Pin, MessageCircle, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function ForumClientPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock forum data
  const categories = [
    {
      id: "general",
      name: "General Discussion",
      description: "General topics about software development and business",
      topics: 245,
      posts: 1832,
      color: "bg-blue-500",
    },
    {
      id: "providers",
      name: "Provider Discussions",
      description: "For software providers to share experiences and tips",
      topics: 89,
      posts: 567,
      color: "bg-green-500",
    },
    {
      id: "buyers",
      name: "Buyer Community",
      description: "For businesses looking for software solutions",
      topics: 156,
      posts: 923,
      color: "bg-purple-500",
    },
    {
      id: "showcase",
      name: "Project Showcase",
      description: "Share your completed projects and success stories",
      topics: 67,
      posts: 234,
      color: "bg-orange-500",
    },
  ]

  const featuredTopics = [
    {
      id: "1",
      title: "Best practices for ERP implementation in 2024",
      author: "Sarah Chen",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      category: "General Discussion",
      replies: 23,
      views: 456,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      isPinned: true,
      isHot: true,
    },
    {
      id: "2",
      title: "How to evaluate software providers effectively",
      author: "Mike Johnson",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      category: "Buyer Community",
      replies: 18,
      views: 342,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isPinned: false,
      isHot: true,
    },
    {
      id: "3",
      title: "Successful CRM migration case study",
      author: "Alex Rodriguez",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      category: "Project Showcase",
      replies: 12,
      views: 289,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 4),
      isPinned: false,
      isHot: false,
    },
  ]

  const recentTopics = [
    {
      id: "4",
      title: "Questions about API integration costs",
      author: "Jennifer Liu",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      category: "General Discussion",
      replies: 5,
      views: 78,
      lastActivity: new Date(Date.now() - 1000 * 60 * 15),
      isPinned: false,
      isHot: false,
    },
    {
      id: "5",
      title: "Provider onboarding process feedback",
      author: "David Kim",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      category: "Provider Discussions",
      replies: 8,
      views: 134,
      lastActivity: new Date(Date.now() - 1000 * 60 * 45),
      isPinned: false,
      isHot: false,
    },
    {
      id: "6",
      title: "Mobile app development timeline expectations",
      author: "Lisa Wang",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      category: "Buyer Community",
      replies: 15,
      views: 267,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60),
      isPinned: false,
      isHot: false,
    },
  ]

  const stats = {
    totalTopics: 557,
    totalPosts: 3556,
    totalMembers: 1234,
    onlineNow: 89,
  }

  return (
    // REMOVED: <div className="min-h-screen bg-background">
    // REMOVED: <Navigation />

    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">StackTalk Community Forum</h1>
        <p className="text-muted-foreground">
          Connect with other professionals, share experiences, and get help with your software projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Topics</p>
                <p className="text-2xl font-bold">{stats.totalTopics}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Posts</p>
                <p className="text-2xl font-bold">{stats.totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Online Now</p>
                <p className="text-2xl font-bold">{stats.onlineNow}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Search and New Topic */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Topic
            </Button>
          </div>

          {/* Topics Tabs */}
          <Tabs defaultValue="featured" className="space-y-6">
            <TabsList>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            <TabsContent value="featured">
              <div className="space-y-4">
                {featuredTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="space-y-4">
                {recentTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <div className="space-y-4">
                {featuredTopics
                  .filter((t) => t.isHot)
                  .map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Browse topics by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/forum/category/${category.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <div>
                        <p className="font-medium text-sm">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{category.topics}</p>
                      <p className="text-xs text-muted-foreground">topics</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/forum/guidelines" className="block text-sm text-blue-600 hover:underline">
                Community Guidelines
              </Link>
              <Link href="/forum/help" className="block text-sm text-blue-600 hover:underline">
                Forum Help
              </Link>
              <Link href="/forum/feedback" className="block text-sm text-blue-600 hover:underline">
                Feedback & Suggestions
              </Link>
              <Link href="/contact" className="block text-sm text-blue-600 hover:underline">
                Contact Moderators
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    // REMOVED: </div>
  )
}

function TopicCard({ topic }: { topic: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {topic.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
              {topic.isHot && <TrendingUp className="h-4 w-4 text-red-500" />}
              <Link href={`/forum/topic/${topic.id}`}>
                <h3 className="font-semibold hover:text-blue-600 transition-colors">{topic.title}</h3>
              </Link>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={topic.authorAvatar || "/placeholder.svg"} alt={topic.author} />
                  <AvatarFallback>{topic.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{topic.author}</span>
              </div>
              <Badge variant="outline">{topic.category}</Badge>
              <span>{formatDistanceToNow(topic.lastActivity, { addSuffix: true })}</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{topic.replies} replies</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{topic.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
