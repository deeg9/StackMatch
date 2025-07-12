'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  User, 
  Search, 
  FileText, 
  Trophy, 
  TrendingUp, 
  DollarSign, 
  Star,
  Clock,
  Calendar,
  Building2,
  Eye,
  ArrowRight,
  BookmarkPlus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  XCircle,
  Hourglass,
  Target,
  Briefcase,
  CalendarDays,
  CheckSquare,
  Link2,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Plus,
  Bookmark,
  Mail,
  Send
} from "lucide-react"
import Link from "next/link"
import { TickerBanner } from "@/components/ticker/ticker-banner"
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { SellerDashboardSidebar } from '@/components/dashboard/seller-dashboard-sidebar'
import { SellerProposalsPortlet } from '@/components/dashboard/portlets/seller-proposals-portlet'
import { cn } from "@/lib/utils"

interface SellerStats {
  wonListings: number
  successRate: number
  totalWon: number
  profileRating: number
  profileViews: number
}

interface QuoteRequest {
  id: string
  title: string
  buyerCompany: string
  category: string
  budgetMin: number | null
  budgetMax: number | null
  deadline: string
  receivedDate: string
  status: 'new' | 'viewed' | 'responded'
  requestType: 'direct' | 'public'
}

interface Proposal {
  id: string
  title: string
  clientCompany: string
  proposalAmount: number
  dueDate: string
  status: 'accepted' | 'submitted' | 'under_review' | 'rejected' | 'withdrawn' | 'draft'
  submittedAt: string
}

interface Client {
  id: string
  companyName: string
  industry: string
  totalProjects: number
  totalRevenue: number
  lastProject: string
  status: 'active' | 'inactive'
}

export default function SellerDashboard() {
  const [statsLoading, setStatsLoading] = useState(true)
  const [quoteRequestsLoading, setQuoteRequestsLoading] = useState(true)
  const [proposalsLoading, setProposalsLoading] = useState(true)
  const [clientsLoading, setClientsLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week')
  
  interface Reminder {
    id: number
    text: string
    completed: boolean
    dueDate?: string
    link?: string
    isSmartReminder: boolean
  }

  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, text: 'Submit proposal for ERP project', completed: false, dueDate: '2024-02-05', link: '/listings/TEST', isSmartReminder: true },
    { id: 2, text: 'Follow up with DataCorp on contract', completed: false, dueDate: '2024-02-15', link: '/deal-rooms/DR-002', isSmartReminder: true },
    { id: 3, text: 'Update portfolio with recent case studies', completed: false, dueDate: '2024-02-03', link: '/profile/portfolio', isSmartReminder: true },
    { id: 4, text: 'Renew ISO certification', completed: false, dueDate: '2024-02-20', isSmartReminder: false },
    { id: 5, text: 'Complete Q1 sales forecast', completed: true, dueDate: '2024-01-30', isSmartReminder: false }
  ])
  const [newReminder, setNewReminder] = useState('')
  
  const [stats, setStats] = useState<SellerStats>({
    wonListings: 0,
    successRate: 0,
    totalWon: 0,
    profileRating: 0,
    profileViews: 0
  })
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [profile, setProfile] = useState<{
    id: string
    email: string
    full_name: string
    company_name: string
    user_type: string
    avatar_url?: string
  } | null>(null)

  useEffect(() => {
    // Fetch seller stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/seller/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    // Fetch quote requests
    const fetchQuoteRequests = async () => {
      try {
        // Mock data for now
        setQuoteRequests([
          {
            id: '1',
            title: 'Enterprise CRM Implementation',
            buyerCompany: 'TechCorp Industries',
            category: 'CRM Software',
            budgetMin: 100000,
            budgetMax: 250000,
            deadline: '2024-02-15',
            receivedDate: '2024-01-28',
            status: 'new',
            requestType: 'direct'
          },
          {
            id: '2',
            title: 'Data Analytics Platform',
            buyerCompany: 'FinanceFlow Corp',
            category: 'Analytics',
            budgetMin: 50000,
            budgetMax: 100000,
            deadline: '2024-02-20',
            receivedDate: '2024-01-27',
            status: 'viewed',
            requestType: 'direct'
          },
          {
            id: '3',
            title: 'HR Management System Upgrade',
            buyerCompany: 'Global Manufacturing Inc',
            category: 'HR Software',
            budgetMin: 75000,
            budgetMax: 150000,
            deadline: '2024-02-18',
            receivedDate: '2024-01-26',
            status: 'new',
            requestType: 'public'
          }
        ])
      } catch (error) {
        console.error('Error fetching quote requests:', error)
      } finally {
        setQuoteRequestsLoading(false)
      }
    }

    // Fetch proposals
    const fetchProposals = async () => {
      try {
        const response = await fetch('/api/dashboard/seller/proposals')
        if (response.ok) {
          const data = await response.json()
          setProposals(data)
        }
      } catch (error) {
        console.error('Error fetching proposals:', error)
      } finally {
        setProposalsLoading(false)
      }
    }

    // Fetch clients
    const fetchClients = async () => {
      try {
        // Mock data for now
        setClients([
          {
            id: '1',
            companyName: 'StackMatch',
            industry: 'Software/Technology',
            totalProjects: 3,
            totalRevenue: 450000,
            lastProject: 'CRM Implementation',
            status: 'active'
          },
          {
            id: '2',
            companyName: 'DataCorp Analytics',
            industry: 'Data & Analytics',
            totalProjects: 2,
            totalRevenue: 280000,
            lastProject: 'BI Dashboard',
            status: 'active'
          },
          {
            id: '3',
            companyName: 'RetailFlow Systems',
            industry: 'Retail',
            totalProjects: 1,
            totalRevenue: 125000,
            lastProject: 'E-commerce Platform',
            status: 'inactive'
          }
        ])
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setClientsLoading(false)
      }
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchStats()
    fetchQuoteRequests()
    fetchProposals()
    fetchClients()
    fetchProfile()
  }, [])

  const getStatusBadgeVariant = (status: Proposal['status']) => {
    switch (status) {
      case 'accepted': return 'default'
      case 'under_review': return 'secondary'
      case 'submitted': return 'outline' 
      case 'rejected': return 'destructive'
      case 'withdrawn': return 'destructive'
      case 'draft': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'under_review': return <Target className="h-4 w-4" />
      case 'submitted': return <Hourglass className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'withdrawn': return <XCircle className="h-4 w-4" />
      case 'draft': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified'
    if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`
    if (min) return `From ${formatCurrency(min)}`
    if (max) return `Up to ${formatCurrency(max)}`
    return 'Not specified'
  }

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ))
  }

  const addReminder = () => {
    if (newReminder.trim()) {
      const newId = Math.max(...reminders.map(r => r.id)) + 1
      setReminders([...reminders, {
        id: newId,
        text: newReminder,
        completed: false,
        isSmartReminder: false
      }])
      setNewReminder('')
    }
  }

  // Mock calendar events for sellers
  const calendarEvents = [
    { id: 1, title: 'Proposal Deadline: CRM Implementation', time: '5:00 PM', isStackMatch: true, date: '2024-02-01' },
    { id: 2, title: 'Sales Team Meeting', time: '11:00 AM', isStackMatch: false, date: '2024-02-01' },
    { id: 3, title: 'Client Demo: Analytics Platform', time: '2:00 PM', isStackMatch: true, date: '2024-02-01' },
    { id: 4, title: 'Quarterly Performance Review', time: '3:30 PM', isStackMatch: false, date: '2024-02-02' },
    { id: 5, title: 'Contract Negotiation: E-commerce Platform', time: '9:00 AM', isStackMatch: true, date: '2024-02-02' }
  ]

  const isLoading = statsLoading || quoteRequestsLoading || proposalsLoading || clientsLoading

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
      {/* Ticker Banner */}
      <TickerBanner />

      {/* Global Navigation */}
      <NavigationWrapper />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1A2B4C] to-[#4A73CC] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-4xl font-bold">
                Welcome back, {profileLoading ? '...' : profile?.full_name || 'User'}!
              </h1>
              <p className="text-blue-200">
                {profileLoading ? 'Loading...' : `${profile?.company_name || 'Your Company'}`}
              </p>
            </div>
            <div className="flex space-x-4 animate-slide-up">
              <Link href="/browse-listings">
                <Button size="lg" className="bg-[#22C55E] hover:bg-[#16A34A] text-white transform hover:scale-105 transition-all duration-200">
                  <Search className="h-5 w-5 mr-2" />
                  Find Opportunities
                </Button>
              </Link>
              <Link href="/quote-requests">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-[#1A2B4C] transform hover:scale-105 transition-all duration-200">
                  <FileText className="h-5 w-5 mr-2" />
                  Active Requests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Row 1: Full-width KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Won Listings */}
          <Card className={cn(
            "border-2 hover:border-[#4A73CC] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Won Listings</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : stats.wonListings}
                  </p>
                  <p className="text-sm text-[#16A34A] mt-1 flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +2 more than last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#4A73CC]/10 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-[#4A73CC]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card className={cn(
            "border-2 hover:border-[#22C55E] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : `${stats.successRate}%`}
                  </p>
                  <Progress value={stats.successRate} className="mt-2 h-2" />
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#22C55E]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Won */}
          <Card className={cn(
            "border-2 hover:border-[#F59E0B] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Total Won</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : formatCurrency(stats.totalWon)}
                  </p>
                  <p className="text-sm text-[#16A34A] mt-1 flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    up 15% from last quarter
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Rating */}
          <Card className={cn(
            "border-2 hover:border-[#22C55E] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Profile Rating</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-3xl font-bold text-[#1A2B4C]">
                      {statsLoading ? '...' : stats.profileRating}
                    </p>
                    <Star className="h-5 w-5 text-[#F59E0B] fill-current" />
                  </div>
                  <p className="text-sm text-[#6B7280] mt-1">
                    {statsLoading ? '...' : `${stats.profileViews} profile views`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-[#22C55E]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Layout: Content + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Row 2: Recent Quote Requests & Recent Proposals - Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Quote Requests */}
              <Card className="border-2 hover:border-[#4A73CC] transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Recent Quote Requests</CardTitle>
                  <Link href="/quote-requests">
                    <Button variant="ghost" size="sm" className="text-[#4A73CC] hover:text-[#1A2B4C]">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quoteRequestsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : quoteRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 text-[#D1D5DB] mx-auto mb-4" />
                      <p className="text-[#6B7280] mb-4">No quote requests yet</p>
                      <Link href="/browse-listings">
                        <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
                          Browse Opportunities
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    quoteRequests.map((request, index) => (
                      <div
                        key={request.id}
                        className="p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200 cursor-pointer group animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                                {request.title}
                              </h3>
                              <div className="flex items-center mt-1">
                                <Building2 className="h-4 w-4 mr-1 text-[#6B7280]" />
                                <span className="text-sm text-[#6B7280]">
                                  {request.buyerCompany}
                                </span>
                              </div>
                            </div>
                            {request.status === 'new' && (
                              <Badge className="bg-[#4A73CC] text-white">
                                New
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm text-[#6B7280]">
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              Received {request.receivedDate}
                            </span>
                            <span className="flex items-center font-medium text-[#1A2B4C]">
                              {request.requestType === 'direct' ? (
                                <Badge variant="outline" className="text-xs mr-2">
                                  <Send className="h-3 w-3 mr-1" />
                                  Direct Request
                                </Badge>
                              ) : null}
                              {formatBudget(request.budgetMin, request.budgetMax)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Recent Proposals */}
              <SellerProposalsPortlet />
            </div>

            {/* Row 3: Calendar (Full-width) */}
            <div className="mb-8">
              <Card className="border-2 hover:border-[#4A73CC] transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Calendar</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-[#F9FAFB] rounded-md border border-[#D1D5DB]">
                      <Button
                        variant={calendarView === 'day' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarView('day')}
                        className={cn(
                          "rounded-r-none",
                          calendarView === 'day' && "bg-[#4A73CC] text-white hover:bg-[#1A2B4C]"
                        )}
                      >
                        Day
                      </Button>
                      <Button
                        variant={calendarView === 'week' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarView('week')}
                        className={cn(
                          "rounded-none border-x",
                          calendarView === 'week' && "bg-[#4A73CC] text-white hover:bg-[#1A2B4C]"
                        )}
                      >
                        Week
                      </Button>
                      <Button
                        variant={calendarView === 'month' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarView('month')}
                        className={cn(
                          "rounded-l-none",
                          calendarView === 'month' && "bg-[#4A73CC] text-white hover:bg-[#1A2B4C]"
                        )}
                      >
                        Month
                      </Button>
                    </div>
                    <Button size="sm" className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      New Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Integration Placeholder */}
                  <div className="bg-[#F9FAFB] rounded-lg p-6 text-center mb-4">
                    <CalendarDays className="h-12 w-12 text-[#4A73CC] mx-auto mb-3" />
                    <p className="text-sm text-[#6B7280] mb-3">
                      Calendar sync with Google Calendar and Outlook coming soon
                    </p>
                    <Button variant="outline" size="sm">
                      Connect Calendar
                    </Button>
                  </div>
                  
                  {/* Mock Calendar Events */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#1A2B4C] mb-2">Upcoming Events</h4>
                    {calendarEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                          event.isStackMatch ? "border-[#4A73CC] bg-[#4A73CC]/5" : "border-[#D1D5DB]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {event.isStackMatch && (
                            <div className="w-2 h-2 bg-[#4A73CC] rounded-full" />
                          )}
                          <div>
                            <h5 className="font-medium text-[#1A2B4C] flex items-center gap-2">
                              {event.title}
                              {event.isStackMatch && (
                                <Badge className="bg-[#4A73CC]/10 text-[#4A73CC] text-xs">
                                  StackMatch
                                </Badge>
                              )}
                            </h5>
                            <p className="text-sm text-[#6B7280]">{event.date} • {event.time}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 4: Your Clients & Smart Reminders - Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Your Clients */}
              <Card className="border-2 hover:border-[#4A73CC] transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Your Clients</CardTitle>
                  <Link href="/your-clients">
                    <Button variant="ghost" size="sm" className="text-[#4A73CC] hover:text-[#1A2B4C]">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clientsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clients.map((client) => (
                        <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200">
                          <div>
                            <h3 className="font-bold text-[#1A2B4C]">{client.companyName}</h3>
                            <p className="text-sm text-[#6B7280]">{client.industry}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#1A2B4C]">{formatCurrency(client.totalRevenue)}</p>
                            <Badge className={client.status === 'active' ? 'bg-[#16A34A] text-white' : 'bg-[#6B7280] text-white'}>
                              {client.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Smart Reminders */}
              <Card className="border-2 hover:border-[#22C55E] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Smart Reminders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Reminder Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a reminder..."
                      value={newReminder}
                      onChange={(e) => setNewReminder(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addReminder()}
                      className="flex-1"
                    />
                    <Button
                      onClick={addReminder}
                      size="sm"
                      className="bg-[#22C55E] hover:bg-[#16A34A] text-white"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Reminders List */}
                  <div className="space-y-2">
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
                          reminder.completed ? "bg-[#F9FAFB] opacity-60" : "hover:bg-[#F9FAFB]"
                        )}
                      >
                        <div className="pt-0.5">
                          <input
                            type="checkbox"
                            checked={reminder.completed}
                            onChange={() => toggleReminder(reminder.id)}
                            className="w-4 h-4 text-[#22C55E] rounded border-[#D1D5DB] focus:ring-[#22C55E]"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          {reminder.isSmartReminder && reminder.link ? (
                            <Link
                              href={reminder.link}
                              className={cn(
                                "font-medium hover:text-[#4A73CC] transition-colors flex items-center gap-1",
                                reminder.completed ? "line-through text-[#6B7280]" : "text-[#1A2B4C]"
                              )}
                            >
                              {reminder.text}
                              <Link2 className="w-3 h-3" />
                            </Link>
                          ) : (
                            <p
                              className={cn(
                                "font-medium",
                                reminder.completed ? "line-through text-[#6B7280]" : "text-[#1A2B4C]"
                              )}
                            >
                              {reminder.text}
                            </p>
                          )}
                          {reminder.dueDate && (
                            <p className="text-xs text-[#6B7280] flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due: {reminder.dueDate}
                            </p>
                          )}
                          {reminder.isSmartReminder && (
                            <Badge className="bg-[#4A73CC]/10 text-[#4A73CC] text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Smart Reminder
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <SellerDashboardSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}