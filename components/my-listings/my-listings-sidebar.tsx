'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { 
  Users,
  AlertCircle,
  Clock,
  Calendar,
  MessageSquare,
  Upload,
  Video,
  Bell,
  CalendarDays,
  Zap
} from 'lucide-react'

export function MyListingsSidebar() {
  // Mock Pending Actions data (listing-specific)
  const pendingActions = [
    {
      id: 1,
      title: 'Review CRM proposals',
      project: 'CRM Implementation',
      dueDate: '2024-02-05',
      priority: 'high',
      link: '/my-listings/LST-001/proposals'
    },
    {
      id: 2,
      title: 'Update Analytics listing requirements',
      project: 'Analytics Platform Selection',
      dueDate: '2024-02-07',
      priority: 'medium',
      link: '/my-listings/LST-002/edit'
    },
    {
      id: 3,
      title: 'Schedule vendor demos for HR system',
      project: 'HR Management System',
      dueDate: '2024-02-10',
      priority: 'medium',
      link: '/my-listings/LST-003/schedule'
    },
    {
      id: 4,
      title: 'Finalize E-commerce listing draft',
      project: 'E-commerce Platform Migration',
      dueDate: '2024-02-12',
      priority: 'low',
      link: '/my-listings/LST-004/edit'
    }
  ]

  // Mock Upcoming Deadlines data (listing-specific)
  const upcomingDeadlines = [
    {
      id: 1,
      title: 'CRM proposal deadline',
      project: 'CRM Implementation',
      dueDate: '2024-02-28',
      dueTime: '11:59 PM',
      priority: 'high',
      overdue: false
    },
    {
      id: 2,
      title: 'Analytics platform decision',
      project: 'Analytics Platform Selection',
      dueDate: '2024-03-15',
      dueTime: '5:00 PM',
      priority: 'medium',
      overdue: false
    },
    {
      id: 3,
      title: 'HR system vendor selection',
      project: 'HR Management System',
      dueDate: '2024-03-30',
      dueTime: 'EOD',
      priority: 'medium',
      overdue: false
    }
  ]

  const getPendingActionPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-orange-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string, overdue: boolean) => {
    if (overdue) return 'bg-red-500 text-white'
    switch (priority) {
      case 'high':
        return 'bg-attention-orange text-white'
      case 'medium':
        return 'bg-stackmatch-blue text-white'
      case 'low':
        return 'bg-medium-gray text-white'
      default:
        return 'bg-light-gray text-charcoal'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Actions Widget */}
      <SidebarWidget
        title="Quick Actions"
        icon={Zap}
      >
        <Button className="w-full justify-start bg-stackmatch-blue hover:bg-stackmatch-navy">
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Message
        </Button>
        
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-medium-gray hover:text-stackmatch-blue transition-colors">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
        
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-medium-gray hover:text-stackmatch-blue transition-colors">
          <Video className="w-4 h-4" />
          Start Meeting
        </button>
        
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-medium-gray hover:text-stackmatch-blue transition-colors">
          <CalendarDays className="w-4 h-4" />
          Schedule Meeting
        </button>
        
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-medium-gray hover:text-stackmatch-blue transition-colors">
          <Bell className="w-4 h-4" />
          Set Reminder
        </button>
      </SidebarWidget>

      {/* Pending Actions Widget */}
      <SidebarWidget
        title="Pending Actions"
        icon={AlertCircle}
        actionLabel="View All Actions"
        onAction={() => console.log('View all actions')}
      >
        {pendingActions.map((action) => (
          <a
            key={action.id}
            href={action.link}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
          >
            <div className={`w-1 h-12 ${getPendingActionPriorityColor(action.priority)} rounded-full flex-shrink-0`}></div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-medium text-stackmatch-navy group-hover:text-stackmatch-blue">
                {action.title}
              </h4>
              <p className="text-xs text-medium-gray">
                {action.project}
              </p>
              <div className="flex items-center gap-2 text-xs text-medium-gray">
                <Calendar className="w-3 h-3" />
                <span>Due: {action.dueDate}</span>
              </div>
            </div>
          </a>
        ))}
      </SidebarWidget>

      {/* Upcoming Deadlines Widget */}
      <SidebarWidget
        title="Upcoming Deadlines"
        icon={Clock}
        actionLabel="View All Deadlines"
        onAction={() => console.log('View all deadlines')}
      >
        {upcomingDeadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-stackmatch-navy">
                  {deadline.title}
                </h4>
                <p className="text-xs text-medium-gray">
                  {deadline.project}
                </p>
              </div>
              <Badge className={getPriorityColor(deadline.priority, deadline.overdue)}>
                {deadline.overdue ? 'Overdue' : deadline.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-medium-gray">
              <Calendar className="w-3 h-3" />
              <span>{deadline.dueDate}</span>
              <span>•</span>
              <span>{deadline.dueTime}</span>
              {deadline.overdue && (
                <>
                  <span>•</span>
                  <AlertCircle className="w-3 h-3 text-red-500" />
                </>
              )}
            </div>
          </div>
        ))}
      </SidebarWidget>
    </div>
  )
}