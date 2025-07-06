'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  FileText,
  MessageSquare,
  Phone,
  StickyNote,
  FileSignature,
  DollarSign,
  Clock,
  Users
} from 'lucide-react'
import { Activity } from './client-activity'
import { cn } from '@/lib/utils'

interface ActivityItemProps {
  activity: Activity
  isLast?: boolean
}

export function ActivityItem({ activity, isLast = false }: ActivityItemProps) {
  const getActivityIcon = (type: Activity['type']) => {
    const iconClass = "h-5 w-5"
    switch (type) {
      case 'meeting':
        return <Calendar className={iconClass} />
      case 'message':
        return <MessageSquare className={iconClass} />
      case 'document':
        return <FileText className={iconClass} />
      case 'proposal':
        return <DollarSign className={iconClass} />
      case 'contract':
        return <FileSignature className={iconClass} />
      case 'call':
        return <Phone className={iconClass} />
      case 'note':
        return <StickyNote className={iconClass} />
      default:
        return <FileText className={iconClass} />
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-stackmatch-blue text-white'
      case 'message':
        return 'bg-purple-600 text-white'
      case 'document':
        return 'bg-orange-600 text-white'
      case 'proposal':
        return 'bg-trust-green text-white'
      case 'contract':
        return 'bg-red-600 text-white'
      case 'call':
        return 'bg-yellow-600 text-white'
      case 'note':
        return 'bg-gray-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
    }
    
    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
    }

    // Otherwise show full date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Activity Icon */}
      <div className={cn(
        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
        getActivityColor(activity.type)
      )}>
        {getActivityIcon(activity.type)}
      </div>

      {/* Activity Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                {getInitials(activity.user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">
                <span className="font-medium text-stackmatch-navy">
                  {activity.user.name}
                </span>
                <span className="text-medium-gray mx-1">
                  {activity.description}
                </span>
              </p>
              <p className="text-xs text-medium-gray mt-1">
                {formatDate(activity.date)}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Details */}
        {activity.details && (
          <div className="ml-11 mt-2 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-stackmatch-navy">{activity.details}</p>
          </div>
        )}

        {/* Activity Metadata */}
        {activity.metadata && (
          <div className="ml-11 mt-2 flex flex-wrap gap-2">
            {activity.metadata.duration && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {activity.metadata.duration}
              </Badge>
            )}
            {activity.metadata.documentName && (
              <Badge variant="secondary" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                {activity.metadata.documentName}
              </Badge>
            )}
            {activity.metadata.proposalValue && (
              <Badge className="bg-trust-green/10 text-trust-green border-trust-green/20 text-xs">
                {formatCurrency(activity.metadata.proposalValue)}
              </Badge>
            )}
            {activity.metadata.meetingAttendees && (
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {activity.metadata.meetingAttendees.length} attendees
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}