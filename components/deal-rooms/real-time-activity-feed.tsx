"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  FileText,
  Upload,
  CheckCircle,
  UserPlus,
  Calendar,
  DollarSign,
  GitBranch,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/utils/supabase/client"

interface Activity {
  id: string
  activity_type: string
  description: string
  created_at: string
  metadata?: any
  user: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
}

interface RealTimeActivityFeedProps {
  dealRoomId: string
  maxHeight?: string
}

export function RealTimeActivityFeed({ dealRoomId, maxHeight = "400px" }: RealTimeActivityFeedProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch activities
  const fetchActivities = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      else setRefreshing(true)

      const response = await fetch(`/api/deal-rooms/${dealRoomId}/activities`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch activities")
      }

      setActivities(data.activities || [])
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    fetchActivities()

    const supabase = createClient()

    // Subscribe to activity changes
    const subscription = supabase
      .channel(`deal-room-activities-${dealRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "deal_room_activities",
          filter: `deal_room_id=eq.${dealRoomId}`,
        },
        async (payload) => {
          console.log("New activity:", payload)

          // Fetch the complete activity with user data
          const { data: newActivity } = await supabase
            .from("deal_room_activities")
            .select(`
              *,
              user:profiles!deal_room_activities_user_id_fkey (
                first_name,
                last_name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single()

          if (newActivity) {
            setActivities((prev) => [newActivity as Activity, ...prev])
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [dealRoomId])

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "MESSAGE_SENT":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "FILE_UPLOADED":
        return <Upload className="h-4 w-4 text-green-500" />
      case "FILE_VERSION_UPLOADED":
        return <GitBranch className="h-4 w-4 text-purple-500" />
      case "FILE_DELETED":
        return <FileText className="h-4 w-4 text-red-500" />
      case "MILESTONE_COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "MILESTONE_UPDATED":
        return <Calendar className="h-4 w-4 text-orange-500" />
      case "PARTICIPANT_JOINED":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "PAYMENT_PROCESSED":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "DEAL_ROOM_CREATED":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case "MESSAGE_SENT":
        return "bg-blue-100 text-blue-800"
      case "FILE_UPLOADED":
      case "FILE_VERSION_UPLOADED":
        return "bg-green-100 text-green-800"
      case "FILE_DELETED":
        return "bg-red-100 text-red-800"
      case "MILESTONE_COMPLETED":
      case "MILESTONE_UPDATED":
        return "bg-purple-100 text-purple-800"
      case "PARTICIPANT_JOINED":
        return "bg-blue-100 text-blue-800"
      case "PAYMENT_PROCESSED":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatActivityType = (activityType: string) => {
    return activityType
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Loading activities...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Feed
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchActivities(false)}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }} className="px-6 pb-6">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <p>No activity yet in this deal room.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-3">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-muted">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    {index < activities.length - 1 && <div className="w-px h-6 bg-muted mt-2" />}
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {activity.user.first_name[0]}
                          {activity.user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {activity.user.first_name} {activity.user.last_name}
                      </span>
                      <Badge variant="secondary" className={`text-xs ${getActivityColor(activity.activity_type)}`}>
                        {formatActivityType(activity.activity_type)}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>

                    {/* Activity metadata */}
                    {activity.metadata && (
                      <div className="text-xs text-muted-foreground">
                        {activity.metadata.file_name && (
                          <span className="inline-flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {activity.metadata.file_name}
                          </span>
                        )}
                        {activity.metadata.file_size && (
                          <span className="ml-2">({(activity.metadata.file_size / 1024 / 1024).toFixed(2)} MB)</span>
                        )}
                        {activity.metadata.version && (
                          <span className="ml-2 inline-flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />v{activity.metadata.version}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
