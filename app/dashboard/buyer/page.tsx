'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowRight, TrendingUp, Building2, DollarSign, FileText, 
  CheckCircle2, Clock, AlertCircle, Plus, MessageSquare, 
  Bell, ChevronDown, Moon, Sun, Sparkles, Activity,
  Briefcase, Target, PiggyBank
} from "lucide-react"
import Link from "next/link"
import { TickerBanner } from "@/components/ticker/ticker-banner"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
      {/* Ticker Banner */}
      <TickerBanner />

      {/* Navigation */}
      <nav className="bg-[#1A2B4C] border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white hover:text-[#4A73CC] transition-colors">
                StackMatch
              </Link>
              <Badge className="ml-3 bg-[#4A73CC] text-white">Buyer</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-[#4A73CC] hover:bg-white/10 relative"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-[#22C55E] rounded-full animate-pulse"></span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-[#4A73CC] hover:bg-white/10 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-white hover:text-[#4A73CC] hover:bg-white/10"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                className="text-white hover:text-[#4A73CC] hover:bg-white/10"
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-[#4A73CC] text-white">JD</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1A2B4C] to-[#4A73CC] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-4xl font-bold">
                Welcome back, {profileLoading ? '...' : profile?.full_name || 'User'}!
              </h1>
              <p className="text-blue-200">
                {profileLoading ? 'Loading...' : `${profile?.company_name || 'Your Company'} • ${profile?.user_type === 'buyer' ? 'Mid-Market Enterprise' : 'Professional Services'}`}
              </p>
            </div>
            <div className="flex space-x-4 animate-slide-up">
              <Link href="/create-listing">
                <Button size="lg" className="bg-[#22C55E] hover:bg-[#16A34A] text-white transform hover:scale-105 transition-all duration-200">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Listing
                </Button>
              </Link>
              <Link href="/deal-rooms">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1A2B4C] transform hover:scale-105 transition-all duration-200">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Deal Rooms
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                    {statsLoading ? '...' : stats.activeListings}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#4A73CC]/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#4A73CC]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Proposals */}
          <Card className={cn(
            "border-2 hover:border-[#22C55E] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Total Proposals</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : stats.totalProposals}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-[#22C55E]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Projects */}
          <Card className={cn(
            "border-2 hover:border-[#F59E0B] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Completed</p>
                  <p className="text-3xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : stats.completedProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card className={cn(
            "border-2 hover:border-[#3B82F6] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#6B7280] font-medium">Success Rate</p>
                  <Target className="h-5 w-5 text-[#3B82F6]" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-[#1A2B4C]">
                    {statsLoading ? '...' : `${stats.successRate}%`}
                  </p>
                  <Progress 
                    value={statsLoading ? 0 : stats.successRate} 
                    className="h-2"
                    indicatorClassName="bg-[#3B82F6]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Invested */}
          <Card className={cn(
            "border-2 hover:border-[#22C55E] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
            statsLoading && "animate-pulse"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Total Invested</p>
                  <p className="text-2xl font-bold text-[#1A2B4C] mt-1">
                    {statsLoading ? '...' : `$${stats.totalInvested.toLocaleString()}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-[#22C55E]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Listings */}
          <Card className="border-2 hover:border-[#4A73CC] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Recent Listings</CardTitle>
              <Link href="/listings">
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
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                            {listing.title}
                          </h3>
                          <Badge className={getStatusColor(listing.status)}>
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-[#6B7280]">
                          <span className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {listing.category}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatBudget(listing.budgetMin, listing.budgetMax)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B7280]">{listing.createdAt}</span>
                          {listing.proposalCount > 0 && (
                            <span className="text-[#22C55E] font-medium">
                              {listing.proposalCount} proposals
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#D1D5DB] group-hover:text-[#4A73CC] transition-colors" />
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

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-[#4A73CC] transition-all duration-300 hover:shadow-lg group cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-[#4A73CC]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-[#4A73CC]" />
              </div>
              <h3 className="font-semibold text-[#1A2B4C] mb-2">AI Assistant</h3>
              <p className="text-sm text-[#6B7280]">Get help creating listings with AI guidance</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#22C55E] transition-all duration-300 hover:shadow-lg group cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-[#22C55E]" />
              </div>
              <h3 className="font-semibold text-[#1A2B4C] mb-2">Analytics</h3>
              <p className="text-sm text-[#6B7280]">View detailed insights and procurement metrics</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#F59E0B] transition-all duration-300 hover:shadow-lg group cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-[#F59E0B]" />
              </div>
              <h3 className="font-semibold text-[#1A2B4C] mb-2">Browse Sellers</h3>
              <p className="text-sm text-[#6B7280]">Discover verified software vendors</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}