"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Navigation } from "@/components/navigation"
import { ForumLayout } from "@/components/forum/forum-layout"
import { UserBadge } from "@/components/forum/user-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share,
  Bookmark,
  Flag,
  MoreHorizontal,
  CheckCircle,
  HelpCircle,
  Send,
  Edit,
  Trash,
  Eye,
  Home,
  ChevronRight,
} from "lucide-react"

// Mock thread data
const mockThread = {
  id: "1",
  title: "What's your experience with NetSuite for manufacturing?",
  content: `
    <p>We're a growing manufacturing company (about 50 employees) looking to implement NetSuite. I'd love to hear about your experiences, especially around inventory management and production planning.</p>
    
    <p>Specifically, I'm curious about:</p>
    <ul>
      <li>How long did implementation take?</li>
      <li>What were the biggest challenges?</li>
      <li>How well does it handle lot tracking and serial numbers?</li>
      <li>Did you need many customizations?</li>
      <li>What integrations were most valuable?</li>
    </ul>
    
    <p>We're currently using a mix of QuickBooks and spreadsheets, but it's becoming unmanageable as we grow. Any insights would be greatly appreciated!</p>
  `,
  author: {
    id: "user1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40&query=SJ",
    role: "BUSINESS" as const,
    verificationStatus: "VERIFIED" as const,
    contributionLevel: 3,
    joinedAt: "2023-03-15T00:00:00Z",
    postCount: 27,
  },
  type: "QUESTION",
  category: "ERP Systems",
  tags: ["NetSuite", "Manufacturing", "Inventory Management", "Implementation"],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  stats: {
    views: 342,
    upvotes: 24,
    downvotes: 2,
    comments: 18,
  },
  hasBestAnswer: true,
  bestAnswerId: "comment2",
}

// Mock comments data
const mockComments = [
  {
    id: "comment1",
    content: `
      <p>We implemented NetSuite for our manufacturing business (75 employees) about 18 months ago. Here's my take:</p>
      
      <p><strong>Implementation time:</strong> It took us about 5 months from start to finish, but we had some complex requirements.</p>
      
      <p><strong>Biggest challenges:</strong></p>
      <ul>
        <li>Data migration was more complex than expected</li>
        <li>Training staff took longer than planned</li>
        <li>Some of our processes needed to be redesigned to fit NetSuite's workflow</li>
      </ul>
      
      <p><strong>Lot tracking/serial numbers:</strong> NetSuite handles this well out of the box. We track both and haven't had any issues.</p>
      
      <p><strong>Customizations:</strong> We needed several SuiteScripts for our specific workflows, but nothing too extreme.</p>
      
      <p><strong>Valuable integrations:</strong> We integrated with our shipping software and our e-commerce platform. Both were worth the investment.</p>
      
      <p>Overall, it was a significant improvement over our previous system. The visibility across departments alone was worth it. Happy to answer any specific questions!</p>
    `,
    author: {
      id: "user5",
      name: "Robert Chen",
      avatar: "/placeholder.svg?height=40&width=40&query=RC",
      role: "BUSINESS" as const,
      verificationStatus: "TRUSTED" as const,
      contributionLevel: 4,
      joinedAt: "2022-08-10T00:00:00Z",
      postCount: 42,
    },
    createdAt: "2024-01-15T11:45:00Z",
    updatedAt: "2024-01-15T11:45:00Z",
    stats: {
      upvotes: 15,
      downvotes: 0,
    },
    isBestAnswer: false,
  },
  {
    id: "comment2",
    content: `
      <p>NetSuite implementation consultant here. I've worked with several manufacturing clients similar to your size.</p>
      
      <p>To add to what Robert said:</p>
      
      <p><strong>Implementation time:</strong> 4-6 months is typical for manufacturing. Companies that dedicate internal resources to the project tend to finish faster.</p>
      
      <p><strong>Lot tracking:</strong> NetSuite's lot tracking is robust. You can track lots through the entire lifecycle - from receipt to production to fulfillment.</p>
      
      <p><strong>Common customizations for manufacturing:</strong></p>
      <ul>
        <li>Custom work order forms</li>
        <li>Production dashboards</li>
        <li>Quality control processes</li>
        <li>Advanced planning tools</li>
      </ul>
      
      <p><strong>Advice:</strong></p>
      <ul>
        <li>Start with standard functionality before customizing</li>
        <li>Invest in proper training - this is often underbudgeted</li>
        <li>Plan for a phased approach rather than a "big bang" implementation</li>
        <li>Document your requirements thoroughly before starting</li>
      </ul>
      
      <p>Moving from QuickBooks to NetSuite is a significant step up in complexity, but also in capabilities. Feel free to DM me if you have specific questions about your implementation.</p>
    `,
    author: {
      id: "user6",
      name: "Jennifer Martinez",
      avatar: "/placeholder.svg?height=40&width=40&query=JM",
      role: "PROVIDER" as const,
      verificationStatus: "EXPERT" as const,
      contributionLevel: 5,
      joinedAt: "2022-05-22T00:00:00Z",
      postCount: 156,
    },
    createdAt: "2024-01-15T13:20:00Z",
    updatedAt: "2024-01-15T13:20:00Z",
    stats: {
      upvotes: 28,
      downvotes: 0,
    },
    isBestAnswer: true,
  },
]

// Custom breadcrumbs for thread detail page
function ThreadBreadcrumbs({ threadTitle }: { threadTitle: string }) {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="hover:text-primary transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/forum" className="hover:text-primary transition-colors">
              Forum
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium max-w-[200px] truncate">{threadTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function ThreadDetailPage() {
  const params = useParams()
  const threadId = params.id as string
  const [newComment, setNewComment] = useState("")
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({})
  const [isBookmarked, setIsBookmarked] = useState(false)

  // In a real app, fetch thread data based on threadId
  const thread = mockThread
  const comments = mockComments

  const handleVote = (id: string, direction: "up" | "down") => {
    setUserVotes((prev) => ({
      ...prev,
      [id]: prev[id] === direction ? null : direction,
    }))
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // In a real app, submit comment to API
      console.log("Submitting comment:", newComment)
      setNewComment("")
    }
  }

  const handleMarkAsBestAnswer = (commentId: string) => {
    // In a real app, update best answer in API
    console.log("Marking as best answer:", commentId)
  }

  return (
    <>
      <Navigation />
      <ForumLayout>
        <div className="space-y-6">
          {/* Custom breadcrumbs with thread title */}
          <ThreadBreadcrumbs threadTitle={thread.title} />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <HelpCircle className="h-3 w-3 mr-1" />
                Question
              </Badge>
              <Badge variant="outline">{thread.category}</Badge>
              {thread.hasBestAnswer && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold mb-6">{thread.title}</h1>
          </div>

          {/* Main Thread Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Vote Column */}
                <div className="hidden sm:flex flex-col items-center space-y-2">
                  <Button
                    variant={userVotes[thread.id] === "up" ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => handleVote(thread.id, "up")}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="sr-only">Upvote</span>
                  </Button>
                  <span className="text-lg font-medium">
                    {thread.stats.upvotes -
                      thread.stats.downvotes +
                      (userVotes[thread.id] === "up" ? 1 : 0) -
                      (userVotes[thread.id] === "down" ? 1 : 0)}
                  </span>
                  <Button
                    variant={userVotes[thread.id] === "down" ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => handleVote(thread.id, "down")}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span className="sr-only">Downvote</span>
                  </Button>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  <div
                    className="prose prose-sm sm:prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: thread.content }}
                  />

                  <div className="flex flex-wrap gap-1.5 mt-6">
                    {thread.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {!thread.author.isAnonymous && thread.author.avatar && (
                          <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
                        )}
                        <AvatarFallback>
                          {thread.author.isAnonymous ? "A" : thread.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {thread.author.isAnonymous ? "Anonymous" : thread.author.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Posted {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      {!thread.author.isAnonymous && (
                        <UserBadge
                          role={thread.author.role}
                          verificationStatus={thread.author.verificationStatus}
                          contributionLevel={thread.author.contributionLevel}
                        />
                      )}
                    </div>

                    <div className="flex sm:hidden items-center gap-2 mt-4 sm:mt-0">
                      <Button variant="outline" size="sm" onClick={() => handleVote(thread.id, "up")}>
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {thread.stats.upvotes}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleVote(thread.id, "down")}>
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {thread.stats.downvotes}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {thread.stats.views} views
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {thread.stats.comments} comments
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                    <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? "fill-current" : ""}`} />
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Comments Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{comments.length} Answers</h2>

            {comments.map((comment) => (
              <Card key={comment.id} className={`mb-4 ${comment.isBestAnswer ? "border-green-500" : ""}`}>
                {comment.isBestAnswer && (
                  <CardHeader className="bg-green-50 py-2 px-6">
                    <CardTitle className="text-sm text-green-700 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Best Answer
                    </CardTitle>
                  </CardHeader>
                )}
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Vote Column */}
                    <div className="hidden sm:flex flex-col items-center space-y-2">
                      <Button
                        variant={userVotes[comment.id] === "up" ? "default" : "ghost"}
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleVote(comment.id, "up")}
                      >
                        <ThumbsUp className="h-5 w-5" />
                        <span className="sr-only">Upvote</span>
                      </Button>
                      <span className="text-lg font-medium">
                        {comment.stats.upvotes -
                          comment.stats.downvotes +
                          (userVotes[comment.id] === "up" ? 1 : 0) -
                          (userVotes[comment.id] === "down" ? 1 : 0)}
                      </span>
                      <Button
                        variant={userVotes[comment.id] === "down" ? "default" : "ghost"}
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleVote(comment.id, "down")}
                      >
                        <ThumbsDown className="h-5 w-5" />
                        <span className="sr-only">Downvote</span>
                      </Button>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="prose prose-sm sm:prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                      />

                      <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {!comment.author.isAnonymous && comment.author.avatar && (
                              <AvatarImage
                                src={comment.author.avatar || "/placeholder.svg"}
                                alt={comment.author.name}
                              />
                            )}
                            <AvatarFallback>
                              {comment.author.isAnonymous ? "A" : comment.author.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {comment.author.isAnonymous ? "Anonymous" : comment.author.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Posted {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                          {!comment.author.isAnonymous && (
                            <UserBadge
                              role={comment.author.role}
                              verificationStatus={comment.author.verificationStatus}
                              contributionLevel={comment.author.contributionLevel}
                            />
                          )}
                        </div>

                        <div className="flex sm:hidden items-center gap-2 mt-4 sm:mt-0">
                          <Button variant="outline" size="sm" onClick={() => handleVote(comment.id, "up")}>
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {comment.stats.upvotes}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleVote(comment.id, "down")}>
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {comment.stats.downvotes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 px-6 py-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      {thread.author.id === "user1" && !comment.isBestAnswer && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkAsBestAnswer(comment.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Best Answer
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Add Comment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your answer here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={6}
              />
              <div className="text-xs text-muted-foreground mt-2">
                Markdown and basic HTML formatting are supported.
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="anonymous" className="mr-2" />
                <label htmlFor="anonymous" className="text-sm">
                  Post anonymously
                </label>
              </div>
              <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Post Answer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ForumLayout>
    </>
  )
}
