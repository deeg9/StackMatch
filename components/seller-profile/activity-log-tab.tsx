"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, MessageSquare, FileText, Settings, LogIn, Edit3, Star, Shield } from "lucide-react"

interface ActivityItem {
  id: string
  type:
    | "login"
    | "profile_edit"
    | "message_sent"
    | "proposal_submitted"
    | "review_response"
    | "settings_change"
    | "team_action"
  description: string
  timestamp: string
  user: {
    name: string
    avatar?: string
    role?: string
  }
  metadata?: {
    ipAddress?: string
    location?: string
    projectTitle?: string
    clientName?: string
  }
  isPublic?: boolean
}

interface ActivityLogTabProps {
  isViewOnly?: boolean
}

export function ActivityLogTab({ isViewOnly = false }: ActivityLogTabProps) {
  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "proposal_submitted",
      description: "Submitted proposal for E-commerce Platform project",
      timestamp: "2024-02-15T14:30:00Z",
      user: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Owner",
      },
      metadata: {
        projectTitle: "E-commerce Platform Development",
        clientName: "TechCorp Inc.",
      },
      isPublic: true,
    },
    {
      id: "2",
      type: "message_sent",
      description: "Sent message to client regarding project requirements",
      timestamp: "2024-02-15T11:15:00Z",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Admin",
      },
      metadata: {
        clientName: "StartupXYZ",
      },
      isPublic: true,
    },
    {
      id: "3",
      type: "login",
      description: "Logged in to account",
      timestamp: "2024-02-15T09:00:00Z",
      user: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Owner",
      },
      metadata: {
        ipAddress: "192.168.1.100",
        location: "San Francisco, CA",
      },
      isPublic: false,
    },
    {
      id: "4",
      type: "review_response",
      description: "Responded to client review",
      timestamp: "2024-02-14T16:45:00Z",
      user: {
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Contributor",
      },
      metadata: {
        clientName: "RetailCorp",
      },
      isPublic: true,
    },
    {
      id: "5",
      type: "profile_edit",
      description: "Updated company description and tech stack",
      timestamp: "2024-02-14T14:20:00Z",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Admin",
      },
      isPublic: false,
    },
    {
      id: "6",
      type: "team_action",
      description: "Invited new team member (emily@company.com)",
      timestamp: "2024-02-14T10:30:00Z",
      user: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Owner",
      },
      isPublic: false,
    },
    {
      id: "7",
      type: "settings_change",
      description: "Updated notification preferences",
      timestamp: "2024-02-13T15:10:00Z",
      user: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Owner",
      },
      isPublic: false,
    },
    {
      id: "8",
      type: "proposal_submitted",
      description: "Submitted proposal for Mobile App Development",
      timestamp: "2024-02-13T08:30:00Z",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Admin",
      },
      metadata: {
        projectTitle: "Mobile App Development",
        clientName: "FinTech Solutions",
      },
      isPublic: true,
    },
  ])

  const [filterType, setFilterType] = useState<string>("all")
  const [filterUser, setFilterUser] = useState<string>("all")

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="w-4 h-4" />
      case "profile_edit":
        return <Edit3 className="w-4 h-4" />
      case "message_sent":
        return <MessageSquare className="w-4 h-4" />
      case "proposal_submitted":
        return <FileText className="w-4 h-4" />
      case "review_response":
        return <Star className="w-4 h-4" />
      case "settings_change":
        return <Settings className="w-4 h-4" />
      case "team_action":
        return <User className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login":
        return "text-blue-600"
      case "profile_edit":
        return "text-green-600"
      case "message_sent":
        return "text-purple-600"
      case "proposal_submitted":
        return "text-orange-600"
      case "review_response":
        return "text-yellow-600"
      case "settings_change":
        return "text-gray-600"
      case "team_action":
        return "text-indigo-600"
      default:
        return "text-gray-600"
    }
  }

  const formatActivityType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Filter activities based on view mode
  const availableActivities = isViewOnly ? activities.filter((activity) => activity.isPublic) : activities

  const filteredActivities = availableActivities.filter((activity) => {
    if (filterType !== "all" && activity.type !== filterType) return false
    if (filterUser !== "all" && activity.user.name !== filterUser) return false
    return true
  })

  const uniqueUsers = Array.from(new Set(availableActivities.map((a) => a.user.name)))

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{isViewOnly ? "Public Activity" : "Activity Log"}</CardTitle>
          <CardDescription>
            {isViewOnly
              ? "View public activities and project-related actions"
              : "Track all actions taken by your team members"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  {!isViewOnly && <SelectItem value="login">Logins</SelectItem>}
                  {!isViewOnly && <SelectItem value="profile_edit">Profile Edits</SelectItem>}
                  <SelectItem value="message_sent">Messages</SelectItem>
                  <SelectItem value="proposal_submitted">Proposals</SelectItem>
                  <SelectItem value="review_response">Review Responses</SelectItem>
                  {!isViewOnly && <SelectItem value="settings_change">Settings Changes</SelectItem>}
                  {!isViewOnly && <SelectItem value="team_action">Team Actions</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isViewOnly ? "No public activities to display" : "No activities found matching your filters"}
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                  <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {formatActivityType(activity.type)}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                          <AvatarFallback className="text-xs">
                            {activity.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{activity.user.name}</span>
                        {activity.user.role && (
                          <Badge variant="outline" className="text-xs">
                            {activity.user.role}
                          </Badge>
                        )}
                      </div>

                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>

                    {/* Metadata - only show non-sensitive info in view mode */}
                    {activity.metadata && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {activity.metadata.projectTitle && <div>Project: {activity.metadata.projectTitle}</div>}
                        {activity.metadata.clientName && <div>Client: {activity.metadata.clientName}</div>}
                        {!isViewOnly && activity.metadata.ipAddress && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-3 h-3" />
                            <span>IP: {activity.metadata.ipAddress}</span>
                            {activity.metadata.location && <span>• {activity.metadata.location}</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
