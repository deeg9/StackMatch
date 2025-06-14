"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ForumBreadcrumbs } from "./forum-breadcrumbs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  MessageSquare,
  PlusCircle,
  TrendingUp,
  Clock,
  Award,
  HelpCircle,
  Megaphone,
  BarChart2,
  Star,
  Activity,
  Search,
} from "lucide-react"

interface ForumLayoutProps {
  children: React.ReactNode
}

export function ForumLayout({ children }: ForumLayoutProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { name: "CRM Tools", count: 124 },
    { name: "ERP Systems", count: 87 },
    { name: "Inventory Management", count: 56 },
    { name: "E-commerce Platforms", count: 43 },
    { name: "Payment Processing", count: 38 },
    { name: "Analytics & BI", count: 72 },
    { name: "Project Management", count: 65 },
    { name: "Marketing Automation", count: 49 },
    { name: "Customer Support", count: 31 },
    { name: "DevOps & Infrastructure", count: 28 },
  ]

  const tags = [
    { name: "NetSuite", count: 45 },
    { name: "Salesforce", count: 67 },
    { name: "AWS", count: 38 },
    { name: "Early-Stage", count: 29 },
    { name: "Post-Implementation", count: 42 },
    { name: "Integration", count: 53 },
    { name: "Migration", count: 31 },
    { name: "Cost-Saving", count: 24 },
    { name: "Security", count: 19 },
    { name: "Compliance", count: 22 },
  ]

  const topContributors = [
    { name: "Sarah Johnson", posts: 45, reputation: 1250 },
    { name: "Mike Chen", posts: 38, reputation: 980 },
    { name: "Alex Rivera", posts: 32, reputation: 875 },
    { name: "Emma Davis", posts: 28, reputation: 720 },
  ]

  const recentActivity = [
    { action: "New question about Salesforce integration", time: "2 min ago" },
    { action: "Answer marked as best in NetSuite thread", time: "15 min ago" },
    { action: "New poll: Best CRM for startups", time: "1 hour ago" },
    { action: "Weekly digest published", time: "2 hours ago" },
  ]

  return (
    <div className="pt-16">
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left Sidebar - More compact (220-240px) */}
          <Sidebar className="hidden lg:flex border-r w-[220px] shrink-0 fixed top-16 h-[calc(100vh-4rem)]">
            <SidebarHeader className="py-3">
              <div className="px-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search forum..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9"
                  />
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent className="py-0">
              <SidebarMenu className="gap-0.5">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/forum"} className="py-1.5">
                    <Link href="/forum">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>All Discussions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/forum/trending"} className="py-1.5">
                    <Link href="/forum/trending">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>Trending</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/forum/recent"} className="py-1.5">
                    <Link href="/forum/recent">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Recent</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/forum/top"} className="py-1.5">
                    <Link href="/forum/top">
                      <Award className="h-4 w-4 mr-2" />
                      <span>Top Posts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              <SidebarGroup>
                <SidebarGroupLabel className="text-xs py-1.5">Post Types</SidebarGroupLabel>
                <SidebarGroupContent className="py-0">
                  <SidebarMenu className="gap-0.5">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/forum/type/question"} className="py-1.5">
                        <Link href="/forum/type/question">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          <span>Questions</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/forum/type/discussion"} className="py-1.5">
                        <Link href="/forum/type/discussion">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          <span>Discussions</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/forum/type/announcement"} className="py-1.5">
                        <Link href="/forum/type/announcement">
                          <Megaphone className="h-4 w-4 mr-2" />
                          <span>Announcements</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/forum/type/poll"} className="py-1.5">
                        <Link href="/forum/type/poll">
                          <BarChart2 className="h-4 w-4 mr-2" />
                          <span>Polls</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-xs py-1.5">Categories</SidebarGroupLabel>
                <SidebarGroupContent className="py-0">
                  <SidebarMenu className="gap-0.5">
                    {categories.slice(0, 8).map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/forum/category/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                          className="py-1.5"
                        >
                          <Link href={`/forum/category/${item.name.toLowerCase().replace(/\s+/g, "-")}`}>
                            <span className="text-sm">{item.name}</span>
                            <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">
                              {item.count}
                            </Badge>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-xs py-1.5">Popular Tags</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.slice(0, 6).map((item) => (
                        <Link key={item.name} href={`/forum/tag/${item.name.toLowerCase()}`}>
                          <Badge variant="outline" className="cursor-pointer hover:bg-secondary text-xs px-1.5 py-0">
                            {item.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="py-3">
              <div className="px-3">
                <Button asChild className="w-full">
                  <Link href="/forum/create">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Post
                  </Link>
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content Area - Centered with proper padding */}
          <div className="flex-1 flex justify-center px-4 md:px-6 lg:pl-[220px] xl:pr-[300px]">
            <div className="w-full max-w-3xl py-6">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <SidebarTrigger />
                <Button asChild size="sm">
                  <Link href="/forum/create">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Post
                  </Link>
                </Button>
              </div>

              {/* Breadcrumbs */}
              <ForumBreadcrumbs />

              {children}
            </div>
          </div>

          {/* Right Sidebar - Fixed width (300-320px) */}
          <div className="hidden xl:fixed top-16 right-0 h-[calc(100vh-4rem)] xl:flex flex-col w-[300px] p-5 border-l shrink-0">
            <div className="space-y-5">
              {/* Forum Stats */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Forum Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Discussions</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Members</span>
                    <span className="font-medium">892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Questions Solved</span>
                    <span className="font-medium">734</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-medium text-green-600">+47 posts</span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {topContributors.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          1
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{item.reputation} rep</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {recentActivity.map((item) => (
                    <div key={item.action} className="space-y-0.5">
                      <p className="text-sm">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
