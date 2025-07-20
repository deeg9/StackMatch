'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  TrendingUp,
  MessageSquare,
  FileText,
  Video,
  Plus,
  Download,
  Bell,
  Upload,
  Users,
  Activity,
  BarChart3,
  CreditCard,
  Timer,
  ArrowRight,
  Zap
} from 'lucide-react'

interface DealRoomSidebarProps {
  dealRoom: any
}

export function DealRoomSidebar({ dealRoom }: DealRoomSidebarProps) {

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageSquare
      case 'document':
        return FileText
      case 'proposal':
        return FileText
      case 'meeting':
        return Video
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'text-stackmatch-blue'
      case 'document':
        return 'text-attention-orange'
      case 'proposal':
        return 'text-trust-green'
      case 'meeting':
        return 'text-information-blue'
      default:
        return 'text-medium-gray'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Deal Summary Card */}
      <SidebarWidget
        title="Deal Summary"
        icon={BarChart3}
      >
        <div className="space-y-6">
          {/* Deal Value */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-medium-gray">Total Value</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-trust-green" />
                <span className="text-lg font-bold text-trust-green">
                  {dealRoom.currency} {dealRoom.dealValue.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-medium-gray">Payment Method</span>
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-medium-gray" />
                <span className="font-medium">{dealRoom.paymentMethod}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-medium-gray">Duration</span>
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3 text-medium-gray" />
                <span className="font-medium">{dealRoom.duration}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-medium-gray">Start Date</span>
              <span className="font-medium">{dealRoom.startDate}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-medium-gray">Expected Completion</span>
              <span className="font-medium">{dealRoom.expectedCompletion}</span>
            </div>
          </div>

          <Separator />

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-medium-gray">Progress</span>
              <span className="text-sm font-bold text-stackmatch-blue">
                {dealRoom.progress}%
              </span>
            </div>
            <Progress 
              value={dealRoom.progress} 
              className="h-2"
            />
          </div>
        </div>
      </SidebarWidget>

      {/* Quick Actions Card */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          
          <Button className="w-full justify-start bg-stackmatch-blue hover:bg-stackmatch-navy">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
            <Video className="w-4 h-4" />
            Start Meeting
          </button>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
            <Calendar className="w-4 h-4" />
            Add Meeting
          </button>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
            <Bell className="w-4 h-4" />
            Set Reminder
          </button>
          
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <SidebarWidget
        title="Recent Activity"
        icon={TrendingUp}
        actionLabel="View All"
        onAction={() => console.log('View all activity')}
      >
        {dealRoom.recentActivity.map((activity: any) => {
          const Icon = getActivityIcon(activity.type)
          const colorClass = getActivityColor(activity.type)
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
              <div className={`p-1.5 rounded-full bg-white border-2 ${colorClass.replace('text-', 'border-')}`}>
                <Icon className={`w-3 h-3 ${colorClass}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-xs text-medium-gray">{activity.timestamp}</div>
                <div className="text-sm font-medium text-stackmatch-navy">
                  {activity.user}
                </div>
                <div className="text-xs text-medium-gray">
                  {activity.action}
                </div>
                <div className="text-xs text-charcoal font-medium mt-1">
                  {activity.details}
                </div>
              </div>
            </div>
          )
        })}
      </SidebarWidget>

    </div>
  )
}