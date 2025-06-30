'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  ArrowRight, TrendingUp, Building2, DollarSign, FileText, 
  CheckCircle2, Clock, AlertCircle, Plus, MessageSquare, 
  Bell, ChevronDown, Moon, Sun, Sparkles, Activity,
  Briefcase, Target, PiggyBank, ArrowUp, ArrowDown, Calendar, Users,
  CalendarDays, CheckSquare, Link2, CalendarPlus, ChevronLeft, ChevronRight
} from "lucide-react"
import Link from "next/link"
import { TickerBanner } from "@/components/ticker/ticker-banner"
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { BuyerDashboardSidebar } from '@/components/dashboard/buyer-dashboard-sidebar'
import { cn } from "@/lib/utils"

// Type definitions for API responses
interface DashboardStats {
  activeListings: number
  totalProposals: number
  completedProjects: number
  successRate: number
  totalInvested: number
}

interface Listing {
  id: string
  title: string
  status: string
  category: string
  budgetMin: number | null
  budgetMax: number | null
  createdAt: string
  proposalCount: number
}

interface Proposal {
  id: string
  sellerName: string
  sellerAvatar: string | null
  proposedBudget: number
  listingTitle: string
  status: string
  submittedAt: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  company_name: string
  user_type: string
  avatar_url?: string
}

export default function BuyerDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)
  const [listingsLoading, setListingsLoading] = useState(true)
  const [proposalsLoading, setProposalsLoading] = useState(true)
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
    { id: 1, text: 'Sign Master Service Agreement', completed: false, dueDate: '2024-02-05', link: '/deal-rooms/DR-001/documents', isSmartReminder: true },
    { id: 2, text: 'Salesforce renewal approaching', completed: false, dueDate: '2024-02-15', link: '#tech-stack', isSmartReminder: true },
    { id: 3, text: 'Review new proposal from CRM Experts', completed: false, dueDate: '2024-02-03', link: '/proposals/PR-003', isSmartReminder: true },
    { id: 4, text: 'Schedule quarterly software review', completed: false, dueDate: '2024-02-20', isSmartReminder: false },
    { id: 5, text: 'Complete security assessment for new vendor', completed: true, dueDate: '2024-01-30', isSmartReminder: false }
  ])
  const [newReminder, setNewReminder] = useState('')
  
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    totalProposals: 0,
    completedProjects: 0,
    successRate: 0,
    totalInvested: 0
  })
  const [listings, setListings] = useState<Listing[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/buyer/stats')
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

    // Fetch recent listings
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/dashboard/buyer/listings')
        if (response.ok) {
          const data = await response.json()
          setListings(data)
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setListingsLoading(false)
      }
    }

    // Fetch recent proposals
    const fetchProposals = async () => {
      try {
        const response = await fetch('/api/dashboard/buyer/proposals')
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
    fetchListings()
    fetchProposals()
    fetchProfile()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#22C55E] text-white'
      case 'draft': return 'bg-[#6B7280] text-white'
      case 'closed': return 'bg-[#F59E0B] text-white'
      case 'archived': return 'bg-[#374151] text-white'
      default: return 'bg-[#D1D5DB] text-[#374151]'
    }
  }

  const getProposalStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-[#3B82F6] text-white'
      case 'under_review': return 'bg-[#F59E0B] text-white'
      case 'accepted': return 'bg-[#22C55E] text-white'
      case 'rejected': return 'bg-red-500 text-white'
      default: return 'bg-[#D1D5DB] text-[#374151]'
    }
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified'
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
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

  // Mock calendar events
  const calendarEvents = [
    { id: 1, title: 'Deal Room Meeting: CRM Implementation', time: '10:00 AM', isStackMatch: true, date: '2024-02-01' },
    { id: 2, title: 'Team Standup', time: '11:00 AM', isStackMatch: false, date: '2024-02-01' },
    { id: 3, title: 'Vendor Demo: Analytics Platform', time: '2:00 PM', isStackMatch: true, date: '2024-02-01' },
    { id: 4, title: 'Quarterly Business Review', time: '3:30 PM', isStackMatch: false, date: '2024-02-02' },
    { id: 5, title: 'Contract Review: E-commerce Platform', time: '9:00 AM', isStackMatch: true, date: '2024-02-02' }
  ]

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
              <Link href="/create-listing">
                <Button size="lg" className="bg-[#22C55E] hover:bg-[#16A34A] text-white transform hover:scale-105 transition-all duration-200">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Listing
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
          {/* Active Listings */}
          <Card className={cn(
            "border-2 hover:border-[#4A73CC] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Active Listings</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : '4'}
                  </p>
                  <p className="text-sm text-[#16A34A] mt-1 flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +3 more than last year
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#4A73CC]/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#4A73CC]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Proposals Received */}
          <Card className={cn(
            "border-2 hover:border-[#22C55E] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Total Proposals Received</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : '3'}
                  </p>
                  <p className="text-sm text-[#16A34A] mt-1 flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +1 more than last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-[#22C55E]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Software Licenses */}
          <Card className={cn(
            "border-2 hover:border-[#F59E0B] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Active Software Licenses</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : '5'}
                  </p>
                  <p className="text-sm text-[#16A34A] mt-1 flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +2 more than last year
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Software Cost */}
          <Card className={cn(
            "border-2 hover:border-[#22C55E] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Current Software Cost</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : '$12,500/yr'}
                  </p>
                  <p className="text-sm text-[#16A34A] mt-1 flex items-center">
                    <ArrowDown className="w-3 h-3 mr-1" />
                    down 5% from last year
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-[#22C55E]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Layout: Content + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Row 2: Active Procurement - Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Listings */}
          <Card className="border-2 hover:border-[#4A73CC] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Recent Listings</CardTitle>
              <Link href="/my-listings">
                <Button variant="ghost" size="sm" className="text-[#4A73CC] hover:text-[#1A2B4C]">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {listingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-[#D1D5DB] mx-auto mb-4" />
                  <p className="text-[#6B7280] mb-4">No listings yet</p>
                  <Link href="/create-listing">
                    <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
                      Create Your First Listing
                    </Button>
                  </Link>
                </div>
              ) : (
                listings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200 cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-3">
                      {/* Line 1: Primary Information & Key Constraints */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                            {listing.title}
                          </h3>
                          <Badge className={getStatusColor(listing.status)}>
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-[#1A2B4C]">
                          <span className="flex items-center font-medium">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {formatBudget(listing.budgetMin, listing.budgetMax)}
                          </span>
                          <span className="flex items-center font-medium">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due: Jul 15
                          </span>
                        </div>
                      </div>

                      {/* Line 2: Context & Engagement Metrics */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6B7280] flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {listing.category}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-[#6B7280]">
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {listing.proposalCount} Proposals
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            2 Deal Rooms
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Proposals */}
          <Card className="border-2 hover:border-[#22C55E] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Recent Proposals</CardTitle>
              <Link href="/proposals">
                <Button variant="ghost" size="sm" className="text-[#22C55E] hover:text-[#16A34A]">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposalsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : proposals.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-[#D1D5DB] mx-auto mb-4" />
                  <p className="text-[#6B7280] mb-4">No proposals received yet</p>
                  <p className="text-sm text-[#6B7280]">
                    Create listings to start receiving proposals from sellers
                  </p>
                </div>
              ) : (
                proposals.map((proposal, index) => (
                  <div
                    key={proposal.id}
                    className="p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200 cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={proposal.sellerAvatar || ''} />
                        <AvatarFallback className="bg-[#4A73CC] text-white">
                          {proposal.sellerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-[#1A2B4C] group-hover:text-[#22C55E] transition-colors">
                            {proposal.sellerName}
                          </h4>
                          <Badge className={getProposalStatusColor(proposal.status)}>
                            {proposal.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6B7280]">
                          {proposal.listingTitle}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-[#22C55E]">
                            ${proposal.proposedBudget.toLocaleString()}
                          </span>
                          <span className="text-[#6B7280]">{proposal.submittedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
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

            {/* Row 4: Asset Management & Smart Reminders - Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-2 hover:border-[#4A73CC] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Your Tech Stack</CardTitle>
              <Link href="/my-tech-stack">
                <Button variant="ghost" size="sm" className="text-[#4A73CC] hover:text-[#1A2B4C]">
                  Manage Software
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tech Stack Items */}
              <div className="space-y-3">
                {/* CRM - Salesforce */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200">
                  <div>
                    <h3 className="font-bold text-[#1A2B4C]">CRM</h3>
                    <p className="text-sm text-[#6B7280]">Salesforce</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-[#1A2B4C]">$20,000/yr</span>
                    <Badge className="bg-[#F59E0B] text-[#FFFFFF]">
                      Renewal Approaching
                    </Badge>
                  </div>
                </div>

                {/* Project Management - Asana */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200">
                  <div>
                    <h3 className="font-bold text-[#1A2B4C]">Project Management</h3>
                    <p className="text-sm text-[#6B7280]">Asana</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-[#1A2B4C]">$12,000/yr</span>
                    <Badge className="bg-[#16A34A] text-[#FFFFFF]">
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Communication - Slack */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200">
                  <div>
                    <h3 className="font-bold text-[#1A2B4C]">Communication</h3>
                    <p className="text-sm text-[#6B7280]">Slack</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-[#1A2B4C]">$8,400/yr</span>
                    <Badge className="bg-[#16A34A] text-[#FFFFFF]">
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Analytics - Tableau */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200">
                  <div>
                    <h3 className="font-bold text-[#1A2B4C]">Analytics</h3>
                    <p className="text-sm text-[#6B7280]">Tableau</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-[#1A2B4C]">$15,600/yr</span>
                    <Badge className="bg-[#6B7280] text-[#FFFFFF]">
                      Inactive
                    </Badge>
                  </div>
                </div>

                {/* HR Management - BambooHR */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200">
                  <div>
                    <h3 className="font-bold text-[#1A2B4C]">HR Management</h3>
                    <p className="text-sm text-[#6B7280]">BambooHR</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-[#1A2B4C]">$9,600/yr</span>
                    <Badge className="bg-[#16A34A] text-[#FFFFFF]">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
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
            <BuyerDashboardSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}