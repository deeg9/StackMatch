"use client"

import { useState } from "react"
import {
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Bell,
  Award,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock KPI data
const kpiData = {
  avgResponseTime: "4.2 hours",
  conversionRate: 73,
  totalSpend: 125000,
  budgetAllocated: 150000,
  activeListings: 5,
  totalProposals: 47,
}

// Mock notifications
const notifications = [
  {
    id: "1",
    type: "proposal",
    title: "New proposal received",
    message: "TechCorp Solutions submitted a proposal for CRM Implementation",
    time: "2 minutes ago",
    unread: true,
    avatar: "/placeholder.svg?height=32&width=32",
    amount: "$42,000",
  },
  {
    id: "2",
    type: "message",
    title: "Message from DevPro Inc",
    message: "Question about project timeline and requirements",
    time: "1 hour ago",
    unread: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    type: "deadline",
    title: "Deadline reminder",
    message: "E-commerce Platform Upgrade proposals due in 3 days",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: "4",
    type: "award",
    title: "Proposal awarded",
    message: "Successfully awarded Financial Dashboard project to DataViz Pro",
    time: "1 day ago",
    unread: false,
    amount: "$28,000",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "proposal":
      return <Award className="h-4 w-4 text-blue-400" />
    case "message":
      return <MessageSquare className="h-4 w-4 text-green-400" />
    case "deadline":
      return <AlertCircle className="h-4 w-4 text-yellow-400" />
    case "award":
      return <CheckCircle className="h-4 w-4 text-purple-400" />
    default:
      return <Bell className="h-4 w-4 text-slate-400" />
  }
}

export function KPINotificationsRail() {
  const [activeTab, setActiveTab] = useState("kpis")
  const spendPercentage = (kpiData.totalSpend / kpiData.budgetAllocated) * 100

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger
            value="kpis"
            className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            KPIs
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-4 mt-6">
          {/* Average Response Time */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{kpiData.avgResponseTime}</div>
              <div className="text-xs text-green-400 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                12% faster than last month
              </div>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{kpiData.conversionRate}%</div>
              <Progress value={kpiData.conversionRate} className="mt-2 bg-slate-700" />
              <div className="text-xs text-slate-400 mt-1">
                {kpiData.activeListings} of {kpiData.totalProposals} proposals converted
              </div>
            </CardContent>
          </Card>

          {/* Spend vs Budget */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Spend vs Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Spent</span>
                  <span className="text-white font-medium">${kpiData.totalSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Budget</span>
                  <span className="text-slate-300">${kpiData.budgetAllocated.toLocaleString()}</span>
                </div>
                <Progress value={spendPercentage} className="bg-slate-700" />
                <div className="text-xs text-slate-400">{Math.round(spendPercentage)}% of budget used</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Award className="h-4 w-4 mr-2" />
                Award Proposal
              </Button>
              <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          {/* Notifications Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors ${
                  notification.unread ? "ring-1 ring-blue-500/30" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-slate-700 text-white text-xs">
                            {notification.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                        {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">{notification.time}</span>
                        {notification.amount && (
                          <Badge variant="outline" className="text-xs bg-slate-700 text-green-400 border-green-400/30">
                            {notification.amount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
            View All Notifications
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
