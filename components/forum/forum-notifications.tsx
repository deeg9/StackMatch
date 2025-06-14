"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, MessageSquare, ThumbsUp, Award, Megaphone, Users, Check } from "lucide-react"
import type { RootState } from "@/store"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/store/slices/forumSlice"
import { formatDistanceToNow } from "date-fns"

export function ForumNotifications() {
  const dispatch = useDispatch()
  const { notifications, unreadCount } = useSelector((state: RootState) => state.forum)
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_thread":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "new_comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "mention":
        return <Users className="h-4 w-4 text-purple-500" />
      case "upvote":
        return <ThumbsUp className="h-4 w-4 text-orange-500" />
      case "best_answer":
        return <Award className="h-4 w-4 text-yellow-500" />
      case "announcement":
        return <Megaphone className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationTitle = (notification: any) => {
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

  const getNotificationContent = (notification: any) => {
    switch (notification.type) {
      case "new_thread":
        return notification.title
      case "new_comment":
        return notification.content
      case "mention":
        return `in "${notification.threadTitle}"`
      case "upvote":
        return notification.content
      case "best_answer":
        return `in "${notification.threadTitle}"`
      case "announcement":
        return notification.content
      default:
        return ""
    }
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification.id))
    }
    setIsOpen(false)
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead())
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Forum Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-auto p-1">
              <Check className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <Link
                  href={
                    notification.threadId
                      ? `/forum/thread/${notification.threadId}${
                          notification.commentId ? `#comment-${notification.commentId}` : ""
                        }`
                      : "/forum"
                  }
                  className="w-full p-3 flex items-start space-x-3 hover:bg-muted/50"
                >
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{getNotificationTitle(notification)}</p>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{getNotificationContent(notification)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/forum/notifications" className="w-full text-center">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
