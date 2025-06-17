'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
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
  Hash,
  ArrowRight
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
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-stackmatch-navy">
            <BarChart3 className="w-5 h-5" />
            Deal Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      {/* Quick Stats Card */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-stackmatch-navy">
            <Activity className="w-5 h-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-stackmatch-blue/5 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <MessageSquare className="w-4 h-4 text-stackmatch-blue" />
              </div>
              <div className="text-lg font-bold text-stackmatch-navy">
                {dealRoom.stats.messagesExchanged}
              </div>
              <div className="text-xs text-medium-gray">Messages</div>
            </div>
            
            <div className="text-center p-3 bg-attention-orange/5 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <FileText className="w-4 h-4 text-attention-orange" />
              </div>
              <div className="text-lg font-bold text-stackmatch-navy">
                {dealRoom.stats.documentsShared}
              </div>
              <div className="text-xs text-medium-gray">Documents</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-trust-green/5 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Video className="w-4 h-4 text-trust-green" />
              </div>
              <div className="text-lg font-bold text-stackmatch-navy">
                {dealRoom.stats.meetingsHeld}
              </div>
              <div className="text-xs text-medium-gray">Meetings</div>
            </div>
            
            <div className="text-center p-3 bg-information-blue/5 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-information-blue" />
              </div>
              <div className="text-lg font-bold text-stackmatch-navy">
                {dealRoom.stats.daysSinceCreation}
              </div>
              <div className="text-xs text-medium-gray">Days</div>
            </div>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-sm text-medium-gray">Average Response Time</div>
            <div className="text-lg font-bold text-stackmatch-navy">
              {dealRoom.stats.averageResponseTime}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-stackmatch-navy">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-stackmatch-navy">
            <Plus className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start bg-stackmatch-blue hover:bg-stackmatch-navy">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Quick Message
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Video className="w-4 h-4 mr-2" />
            Start Video Call
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Users className="w-4 h-4 mr-2" />
            Invite Participant
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Bell className="w-4 h-4 mr-2" />
            Set Reminder
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" />
            Export Room Data
          </Button>
        </CardContent>
      </Card>

      {/* Deal Room ID Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-xs text-medium-gray mb-1">Deal Room ID</div>
            <div className="flex items-center justify-center gap-1">
              <Hash className="w-3 h-3 text-medium-gray" />
              <span className="text-sm font-mono font-medium text-stackmatch-navy">
                {dealRoom.id}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}