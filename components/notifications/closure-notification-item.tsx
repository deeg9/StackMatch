"use client"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import type { ClosureOutcomeType, ClosureReasonCategory } from "@/types/deal-room-types"
import { Check, X, Clock, Star, MessageSquare } from "lucide-react"

interface ClosureNotificationItemProps {
  id: string
  type: string
  title: string
  message: string
  createdAt: string
  isRead: boolean
  data: {
    dealRoomId: string
    dealRoomName: string
    initiatorId?: string
    initiatorName?: string
    initiatorType?: "BUYER" | "SELLER"
    reasonCategory?: ClosureReasonCategory
    outcomeType?: ClosureOutcomeType
    coolingPeriodEndsAt?: string
    feedbackRating?: number
  }
  onMarkAsRead: (id: string) => void
  onNavigate: (dealRoomId: string) => void
}

export function ClosureNotificationItem({
  id,
  type,
  title,
  message,
  createdAt,
  isRead,
  data,
  onMarkAsRead,
  onNavigate,
}: ClosureNotificationItemProps) {
  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(id)
    }
    onNavigate(data.dealRoomId)
  }

  const getIcon = () => {
    switch (type) {
      case "CLOSURE_REQUESTED":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "CLOSURE_CONFIRMED":
        return data.outcomeType === "SUCCESSFUL" ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        )
      case "CLOSURE_CANCELLED":
        return <X className="h-5 w-5 text-gray-500" />
      case "CLOSURE_FEEDBACK_SUBMITTED":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "CLOSURE_COOLING_PERIOD_ENDING":
        return <Clock className="h-5 w-5 text-orange-500" />
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />
    }
  }

  const getBadge = () => {
    switch (type) {
      case "CLOSURE_REQUESTED":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Closure Requested
          </Badge>
        )
      case "CLOSURE_CONFIRMED":
        return data.outcomeType === "SUCCESSFUL" ? (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Successfully Closed
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Unsuccessfully Closed
          </Badge>
        )
      case "CLOSURE_CANCELLED":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Cancelled
          </Badge>
        )
      case "CLOSURE_FEEDBACK_SUBMITTED":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Feedback
          </Badge>
        )
      case "CLOSURE_COOLING_PERIOD_ENDING":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Action Required
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`p-4 border-b cursor-pointer transition-colors ${isRead ? "bg-white" : "bg-blue-50"} hover:bg-gray-50`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
          <div className="mt-2 flex items-center gap-2">
            {getBadge()}
            <span className="text-xs text-gray-500">{data.dealRoomName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
