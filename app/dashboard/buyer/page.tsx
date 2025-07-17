'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  TrendingUp, Building2, DollarSign, FileText, 
  Plus, Activity, ArrowRight,
  ArrowUp, ArrowDown, Calendar, Users,
  CalendarDays, CheckSquare, Link2, CalendarPlus, Sparkles
} from "lucide-react"
import Link from "next/link"
import { TickerBanner } from "@/components/ticker/ticker-banner"
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { BuyerDashboardSidebar } from '@/components/dashboard/buyer-dashboard-sidebar'
import { RecentListingsPortlet, RecentProposalsPortlet } from '@/components/dashboard/portlets'
import { KPICard } from '@/components/shared/kpi-card'
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

    // Fetch recent listings - COMMENTED OUT FOR UI/UX DESIGN
    const fetchListings = async () => {
      // try {
      //   const response = await fetch('/api/dashboard/buyer/listings')
      //   if (response.ok) {
      //     const data = await response.json()
      //     setListings(data)
      //   }
      // } catch (error) {
      //   console.error('Error fetching listings:', error)
      // } finally {
        setListingsLoading(false)
      // }
    }

    // Fetch recent proposals - COMMENTED OUT FOR UI/UX DESIGN
    const fetchProposals = async () => {
      // try {
      //   const response = await fetch('/api/dashboard/buyer/proposals')
      //   if (response.ok) {
      //     const data = await response.json()
      //     setProposals(data)
      //   }
      // } catch (error) {
      //   console.error('Error fetching proposals:', error)
      // } finally {
        setProposalsLoading(false)
      // }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Active Listings"
            value={statsLoading ? '...' : '4'}
            subtitle="+3 more than last year"
            trend={{ value: '+300%', direction: 'up' }}
            icon={FileText}
            color="text-stackmatch-blue"
            bgColor="bg-stackmatch-blue/10"
            borderColor="hover:border-stackmatch-blue"
            animationDelay={0}
          />

          <KPICard
            title="Total Proposals Received"
            value={statsLoading ? '...' : '3'}
            subtitle="+1 more than last week"
            trend={{ value: '+33%', direction: 'up' }}
            icon={Activity}
            color="text-trust-green"
            bgColor="bg-trust-green/10"
            borderColor="hover:border-trust-green"
            animationDelay={100}
          />

          <KPICard
            title="Active Software Licenses"
            value={statsLoading ? '...' : '5'}
            subtitle="+2 more than last year"
            trend={{ value: '+40%', direction: 'up' }}
            icon={Building2}
            color="text-attention-orange"
            bgColor="bg-attention-orange/10"
            borderColor="hover:border-attention-orange"
            animationDelay={200}
          />

          <KPICard
            title="Current Software Cost"
            value={statsLoading ? '...' : '$12,500/yr'}
            subtitle="down 5% from last year"
            trend={{ value: '-5%', direction: 'down' }}
            icon={DollarSign}
            color="text-trust-green"
            bgColor="bg-trust-green/10"
            borderColor="hover:border-trust-green"
            animationDelay={300}
          />
        </div>

        {/* Main Layout: Content + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Row 2: Active Procurement - Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Listings */}
          <RecentListingsPortlet
            listings={listings}
            loading={listingsLoading}
            viewAllLink="/my-listings"
            showCreateButton={true}
            createLink="/create-listing"
          />

          {/* Recent Proposals */}
          <RecentProposalsPortlet
            proposals={proposals}
            loading={proposalsLoading}
            viewAllLink="/proposals"
            emptyMessage="No proposals received yet"
            emptySubMessage="Create listings to start receiving proposals from sellers"
          />
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