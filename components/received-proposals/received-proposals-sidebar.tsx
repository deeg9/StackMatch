'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { 
  MessageSquare, 
  Upload, 
  Video, 
  Calendar,
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
  FileText,
  Zap
} from 'lucide-react'

export function ReceivedProposalsSidebar() {
  const quickActions = [
    { 
      icon: MessageSquare, 
      label: 'Send Message', 
      color: 'bg-stackmatch-blue hover:bg-stackmatch-navy',
      description: 'Contact vendors directly'
    },
    { 
      icon: Upload, 
      label: 'Upload Document', 
      color: 'bg-information-blue hover:bg-information-blue/80',
      description: 'Share additional requirements'
    },
    { 
      icon: Video, 
      label: 'Start Meeting', 
      color: 'bg-trust-green hover:bg-success-green',
      description: 'Begin vendor discussions'
    },
    { 
      icon: Calendar, 
      label: 'Schedule Meeting', 
      color: 'bg-attention-orange hover:bg-attention-orange/80',
      description: 'Plan proposal reviews'
    },
    { 
      icon: Bell, 
      label: 'Set Reminder', 
      color: 'bg-medium-gray hover:bg-charcoal',
      description: 'Track important deadlines'
    }
  ]

  const pendingActions = [
    {
      id: 1,
      title: 'Review TechSolutions Inc proposal',
      description: 'CRM Implementation - $85K proposal',
      priority: 'high',
      dueDate: 'Today',
      icon: FileText
    },
    {
      id: 2,
      title: 'Schedule demo with DataCorp Analytics',
      description: 'Analytics Platform Selection',
      priority: 'medium',
      dueDate: 'Tomorrow',
      icon: Calendar
    },
    {
      id: 3,
      title: 'Follow up with CloudFirst Solutions',
      description: 'HR Management System proposal',
      priority: 'medium',
      dueDate: 'Friday',
      icon: MessageSquare
    },
    {
      id: 4,
      title: 'Finalize vendor selection criteria',
      description: 'Update evaluation rubric',
      priority: 'low',
      dueDate: 'Next week',
      icon: CheckCircle2
    },
    {
      id: 5,
      title: 'Prepare stakeholder presentation',
      description: 'Present top 3 proposals to leadership',
      priority: 'high',
      dueDate: 'Monday',
      icon: User
    }
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'CRM Proposal Review Deadline',
      description: 'Final decision required',
      date: 'Dec 20, 2024',
      priority: 'urgent',
      isOverdue: false
    },
    {
      id: 2,
      title: 'Analytics Platform Demo Day',
      description: 'Vendor presentations scheduled',
      date: 'Dec 22, 2024',
      priority: 'high',
      isOverdue: false
    },
    {
      id: 3,
      title: 'HR System Implementation Start',
      description: 'Project kickoff meeting',
      date: 'Jan 3, 2025',
      priority: 'medium',
      isOverdue: false
    },
    {
      id: 4,
      title: 'Quarterly Budget Review',
      description: 'Software procurement assessment',
      date: 'Jan 15, 2025',
      priority: 'medium',
      isOverdue: false
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500'
      case 'high':
        return 'bg-attention-orange'
      case 'medium':
        return 'bg-information-blue'
      case 'low':
        return 'bg-trust-green'
      default:
        return 'bg-medium-gray'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white'
      case 'high':
        return 'bg-attention-orange text-white'
      case 'medium':
        return 'bg-information-blue text-white'
      case 'low':
        return 'bg-trust-green text-white'
      default:
        return 'bg-medium-gray text-white'
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            const isPrimary = index === 0
            
            if (isPrimary) {
              return (
                <Button
                  key={action.label}
                  className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white justify-start gap-3 h-auto py-3 px-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.label}</div>
                  </div>
                </Button>
              )
            }
            
            return (
              <button
                key={action.label}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{action.label}</span>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Pending Actions */}
      <SidebarWidget
        title="Pending Actions"
        icon={Clock}
        className="border-2 hover:border-attention-orange transition-all duration-300"
      >
        {pendingActions.map((action, index) => {
          const Icon = action.icon
          return (
            <div
              key={action.id}
              className={`flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all duration-200 cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-1 h-12 rounded-full ${getPriorityColor(action.priority)} flex-shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-medium text-stackmatch-navy line-clamp-2">
                    {action.title}
                  </h4>
                  <Badge 
                    className={`${getPriorityBadge(action.priority)} ml-2 flex-shrink-0 text-xs`}
                  >
                    {action.priority}
                  </Badge>
                </div>
                <p className="text-xs text-medium-gray mb-1 line-clamp-1">
                  {action.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-charcoal">
                  <Icon className="w-3 h-3" />
                  <span>Due: {action.dueDate}</span>
                </div>
              </div>
            </div>
          )
        })}
      </SidebarWidget>

      {/* Upcoming Deadlines */}
      <SidebarWidget
        title="Upcoming Deadlines"
        icon={AlertTriangle}
        className="border-2 hover:border-red-300 transition-all duration-300"
      >
        {upcomingDeadlines.map((deadline, index) => (
          <div
            key={deadline.id}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              deadline.isOverdue 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-slate-50 hover:bg-slate-100'
            } transition-all duration-200 cursor-pointer animate-fade-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-1 h-12 rounded-full ${getPriorityColor(deadline.priority)} flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-medium text-stackmatch-navy line-clamp-2">
                  {deadline.title}
                </h4>
                {deadline.isOverdue && (
                  <Badge className="bg-red-500 text-white ml-2 flex-shrink-0">
                    OVERDUE
                  </Badge>
                )}
              </div>
              <p className="text-xs text-medium-gray mb-1 line-clamp-1">
                {deadline.description}
              </p>
              <div className="flex items-center gap-1 text-xs text-charcoal">
                <Calendar className="w-3 h-3" />
                <span>{deadline.date}</span>
              </div>
            </div>
          </div>
        ))}
      </SidebarWidget>
    </div>
  )
}