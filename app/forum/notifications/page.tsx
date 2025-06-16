"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ForumLayout } from "@/components/forum/forum-layout"
import { MessageSquare, ThumbsUp, Award, Users, Megaphone, Bell, Check } from "lucide-react"
import type { RootState } from "@/store"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/store/slices/forumSlice"
import { formatDistanceToNow } from "date-fns"

export default function ForumNotificationsPage() {
  const dispatch = useDispatch()

  // Add safe destructuring with default values
  const forumState = useSelector((state: RootState) => state.forum)
  const notifications = forumState?.notifications || []
  const unreadCount = notifications.filter((n) => !n.isRead).length || 0

  const [filter, setFilter] = useState<"all" | "unread" | "mentions" | "upvotes">("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_thread":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "new_comment":
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case "mention":
        return <Users className="h-5 w-5 text-purple-500" />
      case "upvote":
        return <ThumbsUp className="h-5 w-5 text-orange-500" />
      case "best_answer":
        return <Award className="h-5 w-5 text-yellow-500" />
      case "announcement":
        return <Megaphone className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
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

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.isRead
      case "mentions":
        return notification.type === "mention"
      case "upvotes":
        return notification.type === "upvote" || notification.type === "best_answer"
      default:
        return true
    }
  })

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id))
    }
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead())
  }

  return (
    <ForumLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Forum Notifications</h1>
            <p className="text-muted-foreground">Stay updated with forum activity</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="mentions">
              Mentions
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "mention").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upvotes">
              Upvotes & Awards
              <Badge variant="secondary" className="ml-2">
                {notifications.filter((n) => n.type === "upvote" || n.type === "best_answer").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {filter === "unread"
                      ? "You're all caught up! No unread notifications."
                      : filter === "mentions"
                        ? "No one has mentioned you yet."
                        : filter === "upvotes"
                          ? "No upvotes or awards yet."
                          : "You don't have any notifications yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <Link
                        href={
                          notification.threadId
                            ? `/forum/thread/${notification.threadId}${
                                notification.commentId ? `#comment-${notification.commentId}` : ""
                              }`
                            : "/forum"
                        }
                        className="flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium">{getNotificationTitle(notification)}</h3>
                            <div className="flex items-center space-x-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.createdAt || notification.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{getNotificationContent(notification)}</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ForumLayout>
  )
}
