'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { 
  Sparkles,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Users,
  MessageSquare,
  Upload,
  Video,
  Bell,
  CalendarDays,
  Lightbulb,
  Target,
  DollarSign,
  BookmarkPlus,
  Send,
  UserPlus,
  Award,
  Zap
} from 'lucide-react'

export function SellerDashboardSidebar() {
  // Mock Pending Actions data for sellers
  const pendingActions = [
    {
      id: 1,
      title: 'Submit proposal for CRM project',
      project: 'Enterprise CRM Solution',
      dueDate: '2024-02-03',
      priority: 'high',
      link: '/listings/TEST'
    },
    {
      id: 2,
      title: 'Update pricing for Analytics RFP',
      project: 'Data Analytics Platform',
      dueDate: '2024-02-05',
      priority: 'high',
      link: '/proposals/draft/PR-002'
    },
    {
      id: 3,
      title: 'Complete security questionnaire',
      project: 'FinTech Client Onboarding',
      dueDate: '2024-02-07',
      priority: 'medium',
      link: '/documents/security-assessment'
    },
    {
      id: 4,
      title: 'Schedule demo with TechCorp',
      project: 'HR Management System',
      dueDate: '2024-02-10',
      priority: 'low',
      link: '/calendar/schedule'
    },
    {
      id: 5,
      title: 'Renew certifications',
      project: 'Profile Maintenance',
      dueDate: '2024-02-12',
      priority: 'medium',
      link: '/profile/certifications'
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

  // Mock AI Insights data for sellers
  const aiInsights = [
    {
      id: 1,
      icon: TrendingUp,
      text: 'Your win rate improved by 25% this quarter',
      link: '/analytics'
    },
    {
      id: 2,
      icon: Target,
      text: '5 new RFPs match your expertise in CRM',
      link: '/browse-listings?category=crm'
    },
    {
      id: 3,
      icon: DollarSign,
      text: 'Your pricing is 15% below market average',
      link: '/pricing-insights'
    },
    {
      id: 4,
      icon: Award,
      text: 'Complete profile to increase visibility by 40%',
      link: '/profile'
    }
  ]

  // Mock Upcoming Deadlines data for sellers
  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Proposal submission deadline',
      project: 'Enterprise CRM Solution',
      dueDate: '2024-02-03',
      dueTime: '5:00 PM',
      priority: 'high',
      overdue: false
    },
    {
      id: 2,
      title: 'Contract negotiation deadline',
      project: 'Data Warehouse Implementation',
      dueDate: '2024-02-05',
      dueTime: '11:59 PM',
      priority: 'high',
      overdue: false
    },
    {
      id: 3,
      title: 'Milestone 1 delivery',
      project: 'E-commerce Platform',
      dueDate: '2024-02-15',
      dueTime: 'EOD',
      priority: 'medium',
      overdue: false
    },
    {
      id: 4,
      title: 'Client presentation',
      project: 'Marketing Automation',
      dueDate: '2024-01-30',
      dueTime: '3:00 PM',
      priority: 'high',
      overdue: true
    },
    {
      id: 5,
      title: 'Monthly performance review',
      project: 'Account Management',
      dueDate: '2024-02-20',
      dueTime: '2:00 PM',
      priority: 'low',
      overdue: false
    }
  ]

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
      {/* AI Insights Card */}
      <SidebarWidget
        title="AI Insights"
        icon={Sparkles}
        actionLabel="View All Insights"
        onAction={() => window.location.href = '/analytics'}
      >
        {aiInsights.map((insight) => {
          const Icon = insight.icon
          return (
            <a
              key={insight.id}
              href={insight.link}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
            >
              <div className="p-1.5 rounded-full bg-stackmatch-blue/10 group-hover:bg-stackmatch-blue/20 transition-colors">
                <Icon className="w-4 h-4 text-stackmatch-blue" />
              </div>
              <p className="text-sm text-charcoal group-hover:text-stackmatch-navy flex-1">
                {insight.text}
              </p>
            </a>
          )
        })}
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
            <Send className="w-4 h-4 mr-2" />
            Submit Proposal
          </Button>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
            <BookmarkPlus className="w-4 h-4" />
            Save Listing
          </button>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
            <Video className="w-4 h-4" />
            Schedule Demo
          </button>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
            <UserPlus className="w-4 h-4" />
            Invite Client
          </button>
          
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
            <Upload className="w-4 h-4" />
            Upload Portfolio
          </button>
        </CardContent>
      </Card>

      {/* Pending Actions Card */}
      <SidebarWidget
        title="Pending Actions"
        icon={AlertCircle}
        actionLabel="View All Actions"
        onAction={() => window.location.href = '/actions'}
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

      {/* Upcoming Deadlines Card */}
      <SidebarWidget
        title="Upcoming Deadlines"
        icon={Clock}
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