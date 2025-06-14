"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Upload,
  Target,
  DollarSign,
  ExternalLink,
  BookMarkedIcon as MarkAsRead,
  Settings,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  action_url?: string
  deal_room?: {
    id: string
    room_name: string
    listing?: {
      title: string
    }
  }
}

interface NotificationCenterProps {
  className?: string
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "deal_room_message":
      return MessageSquare
    case "deal_room_created":
      return FileText
    case "deal_room_file_uploaded":
      return Upload
    case "deal_room_milestone_updated":
      return Target
    case "proposal_accepted":
      return CheckCircle
    case "proposal_rejected":
      return XCircle
    case "payment_milestone_completed":
      return DollarSign
    default:
      return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "proposal_accepted":
    case "deal_room_milestone_updated":
      return "text-green-500"
    case "proposal_rejected":
      return "text-red-500"
    case "deal_room_message":
      return "text-blue-500"
    case "deal_room_file_uploaded":
      return "text-purple-500"
    case "payment_milestone_completed":
      return "text-yellow-500"
    default:
      return "text-gray-500"
  }
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/notifications?limit=50")
      const data = await response.json()

      if (data.notifications) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_read",
          notificationIds,
        }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => (notificationIds.includes(notif.id) ? { ...notif, is_read: true } : notif)),
        )
        setUnreadCount((prev) => Math.max(0, prev - notificationIds.length))
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead([notification.id])
    }

    if (notification.action_url) {
      router.push(notification.action_url)
      setIsOpen(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative rounded-full h-9 w-9", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="text-base font-semibold">Notifications</DropdownMenuLabel>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                <MarkAsRead className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => router.push("/notifications")} className="h-6 w-6">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      !notification.is_read && "bg-blue-50/50 dark:bg-blue-950/20",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn("mt-1", iconColor)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn("text-sm font-medium truncate", !notification.is_read && "font-semibold")}>
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                          {notification.action_url && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={() => {
                  router.push("/notifications")
                  setIsOpen(false)
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
