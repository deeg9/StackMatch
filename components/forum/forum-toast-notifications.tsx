"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { MessageSquare, ThumbsUp, Award, Users, Megaphone } from "lucide-react"
import type { RootState } from "@/store"

export function ForumToastNotifications() {
  const { notifications } = useSelector((state: RootState) => state.forum)

  useEffect(() => {
    // Listen for new notifications and show toast
    const latestNotification = notifications[0]
    if (latestNotification && !latestNotification.read) {
      const getIcon = (type: string) => {
        switch (type) {
          case "new_thread":
            return <MessageSquare className="h-4 w-4" />
          case "new_comment":
            return <MessageSquare className="h-4 w-4" />
          case "mention":
            return <Users className="h-4 w-4" />
          case "upvote":
            return <ThumbsUp className="h-4 w-4" />
          case "best_answer":
            return <Award className="h-4 w-4" />
          case "announcement":
            return <Megaphone className="h-4 w-4" />
          default:
            return null
        }
      }

      const getTitle = (notification: any) => {
        switch (notification.type) {
          case "new_thread":
            return `New thread in ${notification.category}`
          case "new_comment":
            return "New comment on your thread"
          case "mention":
            return `${notification.mentionedBy} mentioned you`
          case "upvote":
            return "Your post was upvoted"
          case "best_answer":
            return "Your answer was marked as best"
          case "announcement":
            return "New announcement"
          default:
            return "Forum notification"
        }
      }

      const getDescription = (notification: any) => {
        switch (notification.type) {
          case "new_thread":
            return notification.title
          case "new_comment":
            return notification.content?.substring(0, 100) + (notification.content?.length > 100 ? "..." : "")
          case "mention":
            return `in "${notification.threadTitle}"`
          case "upvote":
            return notification.content?.substring(0, 100) + (notification.content?.length > 100 ? "..." : "")
          case "best_answer":
            return `in "${notification.threadTitle}"`
          case "announcement":
            return notification.content?.substring(0, 100) + (notification.content?.length > 100 ? "..." : "")
          default:
            return ""
        }
      }

      toast(getTitle(latestNotification), {
        description: getDescription(latestNotification),
        icon: getIcon(latestNotification.type),
        action: {
          label: "View",
          onClick: () => {
            window.location.href = latestNotification.threadId
              ? `/forum/thread/${latestNotification.threadId}${
                  latestNotification.commentId ? `#comment-${latestNotification.commentId}` : ""
                }`
              : "/forum"
          },
        },
        duration: 5000,
      })
    }
  }, [notifications])

  return null
}
