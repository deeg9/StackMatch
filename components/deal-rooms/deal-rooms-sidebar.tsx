'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { 
  Activity,
  Calendar,
  Clock,
  Plus,
  Upload,
  Users,
  FileText,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Bell,
  ExternalLink
} from 'lucide-react'

export function DealRoomsSidebar() {
  const router = useRouter()

  const handleDeadlineClick = (deadline: any) => {
    router.push(`/deal-rooms/${deadline.dealRoomId}?tab=timeline&action=${deadline.action}`)
  }

  const handleActionClick = (action: any) => {
    router.push(`/deal-rooms/${action.dealRoomId}?tab=${action.type === 'message' ? 'discussion' : action.type === 'proposal' ? 'proposals' : 'documents'}&action=${action.action}`)
  }
  const recentActivity = [
    {
      id: 1,
      type: 'message',
      title: 'New message in CRM Implementation',
      time: '5 min ago',
      avatar: '/api/placeholder/32/32',
      user: 'Sarah Johnson'
    },
    {
      id: 2,
      type: 'proposal',
      title: 'Proposal updated for E-commerce Platform',
      time: '1 hour ago',
      avatar: '/api/placeholder/32/32',
      user: 'Michael Chen'
    },
    {
      id: 3,
      type: 'document',
      title: 'Contract signed for Analytics Dashboard',
      time: '3 hours ago',
      avatar: '/api/placeholder/32/32',
      user: 'Anna Martinez'
    },
    {
      id: 4,
      type: 'meeting',
      title: 'Meeting scheduled for Marketing Automation',
      time: '1 day ago',
      avatar: '/api/placeholder/32/32',
      user: 'James Wilson'
    }
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Contract review due',
      project: 'CRM Implementation',
      date: 'Today, 5:00 PM',
      priority: 'high',
      dealRoomId: 'crm-impl-001',
      action: 'contract-review'
    },
    {
      id: 2,
      title: 'Final proposal submission',
      project: 'E-commerce Platform',
      date: 'Tomorrow, 2:00 PM',
      priority: 'medium',
      dealRoomId: 'ecom-platform-002',
      action: 'proposal-submission'
    },
    {
      id: 3,
      title: 'Client meeting',
      project: 'Marketing Automation',
      date: 'Jan 25, 10:00 AM',
      priority: 'low',
      dealRoomId: 'marketing-auto-003',
      action: 'meeting-prep'
    }
  ]

  const pendingActions = [
    {
      id: 1,
      title: 'Review proposal for HealthTech Solutions',
      type: 'proposal',
      urgency: 'high',
      dealRoomId: 'healthtech-004',
      action: 'review-proposal'
    },
    {
      id: 2,
      title: 'Sign NDA for RetailFlow project',
      type: 'document',
      urgency: 'medium',
      dealRoomId: 'retailflow-005',
      action: 'sign-nda'
    },
    {
      id: 3,
      title: 'Respond to questions in DataDriven deal',
      type: 'message',
      urgency: 'low',
      dealRoomId: 'datadriven-006',
      action: 'respond-messages'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4 text-stackmatch-blue" />
      case 'proposal':
        return <FileText className="w-4 h-4 text-trust-green" />
      case 'document':
        return <CheckCircle2 className="w-4 h-4 text-information-blue" />
      case 'meeting':
        return <Calendar className="w-4 h-4 text-attention-orange" />
      default:
        return <Activity className="w-4 h-4 text-medium-gray" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-attention-orange bg-orange-50'
      case 'low':
        return 'text-trust-green bg-green-50'
      default:
        return 'text-medium-gray bg-slate-50'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-attention-orange bg-orange-50'
      case 'low':
        return 'border-l-trust-green bg-green-50'
      default:
        return 'border-l-slate-300 bg-slate-50'
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Recent Activity */}
      <SidebarWidget
        title="Recent Activity"
        icon={Activity}
        actionLabel="View All Activity"
        onAction={() => router.push('/deal-rooms?tab=activity')}
      >
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stackmatch-navy line-clamp-2">
                {activity.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={activity.avatar} alt={activity.user} />
                  <AvatarFallback className="text-xs">{activity.user[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-medium-gray">{activity.user}</span>
                <span className="text-xs text-medium-gray">•</span>
                <span className="text-xs text-medium-gray">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </SidebarWidget>

      {/* Upcoming Deadlines */}
      <SidebarWidget
        title="Upcoming Deadlines"
        icon={Clock}
      >
        {upcomingDeadlines.map((deadline) => (
          <div 
            key={deadline.id} 
            className="p-3 border border-slate-200 rounded-lg hover:shadow-sm transition-all cursor-pointer hover:border-stackmatch-blue/50 group"
            onClick={() => handleDeadlineClick(deadline)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-stackmatch-navy text-sm group-hover:text-stackmatch-blue transition-colors flex items-center gap-1">
                  {deadline.title}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-medium-gray mt-1">
                  {deadline.project}
                </p>
                <p className="text-xs text-charcoal mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {deadline.date}
                </p>
              </div>
              <Badge className={`text-xs ${getPriorityColor(deadline.priority)}`}>
                {deadline.priority}
              </Badge>
            </div>
          </div>
        ))}
      </SidebarWidget>

      {/* Pending Actions */}
      <SidebarWidget
        title="Pending Actions"
        icon={Bell}
        actionLabel="View All Actions"
        onAction={() => router.push('/deal-rooms?tab=actions')}
      >
        {pendingActions.map((action) => (
          <div 
            key={action.id} 
            className={`p-3 border-l-4 rounded-r-lg ${getUrgencyColor(action.urgency)} cursor-pointer hover:shadow-sm transition-all group`}
            onClick={() => handleActionClick(action)}
          >
            <p className="font-medium text-stackmatch-navy text-sm group-hover:text-stackmatch-blue transition-colors flex items-center gap-1">
              {action.title}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline" className="text-xs">
                {action.type}
              </Badge>
              <span className="text-xs text-medium-gray capitalize">
                {action.urgency} priority
              </span>
            </div>
          </div>
        ))}
      </SidebarWidget>
    </div>
  )
}