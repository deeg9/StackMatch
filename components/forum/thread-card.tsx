import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  HelpCircle,
  Megaphone,
  BarChart2,
  CheckCircle,
  Bookmark,
} from "lucide-react"

export type ThreadType = "QUESTION" | "DISCUSSION" | "ANNOUNCEMENT" | "POLL"

export interface ThreadCardProps {
  id: string
  title: string
  preview: string
  author: {
    id: string
    name: string
    avatar?: string
    role: "BUSINESS" | "PROVIDER" | "ADMIN" | "MODERATOR"
    verificationStatus?: "VERIFIED" | "TRUSTED" | "EXPERT" | "NONE"
    isAnonymous?: boolean
    contributionLevel?: number
  }
  type: ThreadType
  category: string
  tags: string[]
  createdAt: string
  stats: {
    views: number
    upvotes: number
    downvotes: number
    comments: number
  }
  hasBestAnswer?: boolean
  isFollowing?: boolean
}

export function ThreadCard({
  id,
  title,
  preview,
  author,
  type,
  category,
  tags,
  createdAt,
  stats,
  hasBestAnswer = false,
  isFollowing = false,
}: ThreadCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "QUESTION":
        return <HelpCircle className="h-5 w-5 text-blue-500" />
      case "DISCUSSION":
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case "ANNOUNCEMENT":
        return <Megaphone className="h-5 w-5 text-purple-500" />
      case "POLL":
        return <BarChart2 className="h-5 w-5 text-amber-500" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case "QUESTION":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Question
          </Badge>
        )
      case "DISCUSSION":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Discussion
          </Badge>
        )
      case "ANNOUNCEMENT":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Announcement
          </Badge>
        )
      case "POLL":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Poll
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="mb-6 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Voting Section */}
          <div className="hidden sm:flex flex-col items-center space-y-3 pt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-green-50 hover:text-green-600"
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="sr-only">Upvote</span>
            </Button>
            <span className="text-lg font-bold text-center min-w-[2rem]">{stats.upvotes - stats.downvotes}</span>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-600">
              <ThumbsDown className="h-5 w-5" />
              <span className="sr-only">Downvote</span>
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {getTypeIcon()}
              {getTypeLabel()}
              <Badge variant="outline" className="font-medium">
                {category}
              </Badge>
              {hasBestAnswer && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
            </div>

            <Link href={`/forum/thread/${id}`} className="hover:underline">
              <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">{title}</h3>
            </Link>

            <p className="text-muted-foreground mb-4 line-clamp-3 text-base leading-relaxed">{preview}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                  {tag}
                </Badge>
              ))}
              {tags.length > 4 && (
                <Badge variant="outline" className="text-sm">
                  +{tags.length - 4} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {!author.isAnonymous && author.avatar && (
                    <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                  )}
                  <AvatarFallback>{author.isAnonymous ? "A" : author.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{author.isAnonymous ? "Anonymous" : author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {stats.views}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {stats.comments}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bookmark className="h-4 w-4" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
