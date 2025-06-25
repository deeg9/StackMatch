'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users,
  AlertCircle,
  Clock,
  ArrowRight,
  Calendar,
  MessageSquare,
  Upload,
  Video,
  Bell,
  CalendarDays
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
      {/* Quick Actions Card */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-stackmatch-navy">
            <Users className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start bg-stackmatch-blue hover:bg-stackmatch-navy">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Video className="w-4 h-4 mr-2" />
            Start Meeting
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <CalendarDays className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          
          <Button variant="outline" className="w-full justify-start hover:bg-slate-50">
            <Bell className="w-4 h-4 mr-2" />
            Set Reminder
          </Button>
        </CardContent>
      </Card>

      {/* Pending Actions Card */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-stackmatch-navy">
            <AlertCircle className="w-5 h-5" />
            Pending Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
          <Button variant="ghost" size="sm" className="w-full text-stackmatch-blue hover:text-stackmatch-navy">
            View All Actions
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines Card */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-stackmatch-navy">
            <Clock className="w-5 h-5" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
          <Button variant="ghost" size="sm" className="w-full text-stackmatch-blue hover:text-stackmatch-navy">
            View All Deadlines
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}