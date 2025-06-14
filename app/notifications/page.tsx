"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Upload,
  Target,
  DollarSign,
  Search,
  Filter,
  BookMarkedIcon as MarkAsRead,
  ExternalLink,
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

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/notifications?limit=100")
      const data = await response.json()

      if (data.notifications) {
        setNotifications(data.notifications)
        setFilteredNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    let filtered = notifications

    // Filter by tab
    if (activeTab === "unread") {
      filtered = filtered.filter((n) => !n.is_read)
    } else if (activeTab === "deal_rooms") {
      filtered = filtered.filter((n) => n.type.startsWith("deal_room"))
    } else if (activeTab === "proposals") {
      filtered = filtered.filter((n) => n.type.startsWith("proposal"))
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((n) => n.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, activeTab, filterType, searchTerm])

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
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your deal rooms, proposals, and messages</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <MarkAsRead className="h-4 w-4 mr-2" />
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>All Notifications</span>
              {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deal_room_message">Messages</SelectItem>
                  <SelectItem value="deal_room_created">Deal Rooms</SelectItem>
                  <SelectItem value="proposal_accepted">Proposals</SelectItem>
                  <SelectItem value="deal_room_file_uploaded">File Uploads</SelectItem>
                  <SelectItem value="deal_room_milestone_updated">Milestones</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
              <TabsTrigger value="deal_rooms">Deal Rooms</TabsTrigger>
              <TabsTrigger value="proposals">Proposals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your filters or search terms"
                      : "You're all caught up! New notifications will appear here."}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {filteredNotifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type)
                      const iconColor = getNotificationColor(notification.type)

                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                            !notification.is_read &&
                              "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={cn("mt-1", iconColor)}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className={cn("text-sm font-medium", !notification.is_read && "font-semibold")}>
                                  {notification.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                  </span>
                                  {!notification.is_read && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              {notification.deal_room && (
                                <div className="flex items-center mt-2 space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {notification.deal_room.room_name}
                                  </Badge>
                                  {notification.deal_room.listing && (
                                    <Badge variant="secondary" className="text-xs">
                                      {notification.deal_room.listing.title}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              {notification.action_url && (
                                <div className="flex items-center mt-2 text-xs text-blue-600 dark:text-blue-400">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Click to view
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
