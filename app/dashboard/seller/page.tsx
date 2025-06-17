'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  Briefcase
} from "lucide-react"

interface SellerStats {
  activeProposals: number
  wonListings: number
  successRate: number
  totalEarned: number
  profileRating: number
  profileViews: number
}

interface Proposal {
  id: string
  title: string
  clientCompany: string
  proposalAmount: number
  dueDate: string
  status: 'accepted' | 'submitted' | 'shortlisted' | 'rejected'
  submittedAt: string
}

interface Deadline {
  id: string
  title: string
  dueDate: string
  type: 'proposal' | 'milestone'
}

interface RecommendedListing {
  id: string
  title: string
  company: string
  description: string
  budgetMin: number
  budgetMax: number
  tags: string[]
  isConfidential: boolean
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [recommendedListings, setRecommendedListings] = useState<RecommendedListing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock seller data - replace with actual API calls
  const sellerName = "Christopher Fill"
  const sellerCompany = "StackMatch"
  const sellerAvatar = "/api/placeholder/40/40"

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [statsRes, proposalsRes, recommendationsRes] = await Promise.all([
          fetch('/api/dashboard/seller/stats'),
          fetch('/api/dashboard/seller/proposals'),
          fetch('/api/dashboard/seller/recommendations')
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (proposalsRes.ok) {
          const proposalsData = await proposalsRes.json()
          setProposals(proposalsData)
        }

        if (recommendationsRes.ok) {
          const recommendationsData = await recommendationsRes.json()
          setRecommendedListings(recommendationsData)
        }

        // Mock deadlines for now (in production, this would come from contracts/milestones)
        setDeadlines([
          {
            id: '1',
            title: 'Project Proposal Review',
            dueDate: '2025-06-20',
            type: 'proposal'
          },
          {
            id: '2',
            title: 'Development Milestone 1',
            dueDate: '2025-06-23',
            type: 'milestone'
          },
          {
            id: '3',
            title: 'Client Demo Presentation',
            dueDate: '2025-06-28',
            type: 'milestone'
          }
        ])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadgeVariant = (status: Proposal['status']) => {
    switch (status) {
      case 'accepted': return 'default'
      case 'shortlisted': return 'secondary'
      case 'submitted': return 'outline' 
      case 'rejected': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'shortlisted': return <Target className="h-4 w-4" />
      case 'submitted': return <Hourglass className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB] p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <Card className="border-2 border-[#D1D5DB] hover:border-[#4A73CC] transition-all duration-300 shadow-lg animate-fade-in">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-4 border-[#22C55E] shadow-lg">
                  <AvatarImage src={sellerAvatar} alt={sellerName} />
                  <AvatarFallback className="bg-[#22C55E] text-white text-xl font-bold">
                    {sellerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-[#1A2B4C]">
                      Welcome back, {sellerName}
                    </h1>
                    <Badge className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-3 py-1">
                      <User className="h-4 w-4 mr-1" />
                      Seller
                    </Badge>
                  </div>
                  <p className="text-[#6B7280] text-lg">{sellerCompany}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="border-[#4A73CC] text-[#4A73CC] hover:bg-[#4A73CC] hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
                <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <Search className="h-4 w-4 mr-2" />
                  Find Listings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-2 border-[#D1D5DB] hover:border-[#22C55E] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280] text-sm font-medium">Active Proposals</p>
                  <p className="text-3xl font-bold text-[#1A2B4C]">{stats?.activeProposals}</p>
                </div>
                <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#D1D5DB] hover:border-[#F59E0B] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280] text-sm font-medium">Won Listings</p>
                  <p className="text-3xl font-bold text-[#1A2B4C]">{stats?.wonListings}</p>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#D1D5DB] hover:border-[#3B82F6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280] text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-[#1A2B4C]">{stats?.successRate}%</p>
                  <Progress value={stats?.successRate} className="mt-2 h-2" />
                </div>
                <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#D1D5DB] hover:border-[#16A34A] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280] text-sm font-medium">Total Earned</p>
                  <p className="text-3xl font-bold text-[#1A2B4C]">{formatCurrency(stats?.totalEarned || 0)}</p>
                </div>
                <div className="w-12 h-12 bg-[#16A34A] rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#D1D5DB] hover:border-[#F59E0B] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280] text-sm font-medium">Profile Rating</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold text-[#1A2B4C]">{stats?.profileRating}</p>
                    <Star className="h-5 w-5 text-[#F59E0B] fill-current" />
                  </div>
                  <p className="text-sm text-[#6B7280]">{stats?.profileViews} views</p>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Proposals Section */}
          <Card className="lg:col-span-1 border-2 border-[#D1D5DB] hover:border-[#4A73CC] transition-all duration-300 shadow-lg animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[#1A2B4C]">My Recent Proposals</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#4A73CC] hover:text-[#1A2B4C]">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[#4A73CC] transition-all duration-300 hover:shadow-md">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-[#1A2B4C] leading-tight">{proposal.title}</h4>
                      <Badge variant={getStatusBadgeVariant(proposal.status)} className="flex items-center space-x-1">
                        {getStatusIcon(proposal.status)}
                        <span className="capitalize">{proposal.status}</span>
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                        <Building2 className="h-4 w-4" />
                        <span>{proposal.clientCompany}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-[#6B7280]">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(proposal.proposalAmount)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#6B7280]">
                          <Clock className="h-4 w-4" />
                          <span>Due {proposal.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full border-[#4A73CC] text-[#4A73CC] hover:bg-[#4A73CC] hover:text-white">
                      View Proposal
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines Section */}
          <Card className="lg:col-span-1 border-2 border-[#D1D5DB] hover:border-[#F59E0B] transition-all duration-300 shadow-lg animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[#1A2B4C]">Upcoming Deadlines</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#F59E0B] hover:text-[#D97706]">
                  View Calendar
                  <Calendar className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {deadlines.map((deadline) => (
                <div key={deadline.id} className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[#F59E0B] transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      deadline.type === 'proposal' ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'
                    }`}>
                      {deadline.type === 'proposal' ? 
                        <FileText className="h-5 w-5 text-white" /> : 
                        <Briefcase className="h-5 w-5 text-white" />
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1A2B4C]">{deadline.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-[#6B7280] mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{deadline.dueDate}</span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {deadline.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Listings Section */}
          <Card className="lg:col-span-1 border-2 border-[#D1D5DB] hover:border-[#22C55E] transition-all duration-300 shadow-lg animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[#1A2B4C]">Recommended for You</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#22C55E] hover:text-[#16A34A]">
                  Browse All
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedListings.map((listing) => (
                <div key={listing.id} className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[#22C55E] transition-all duration-300 hover:shadow-md">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-[#1A2B4C] leading-tight">{listing.title}</h4>
                      <button className="text-[#6B7280] hover:text-[#22C55E] transition-colors">
                        <BookmarkPlus className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                        <Building2 className="h-4 w-4" />
                        <span>{listing.isConfidential ? 'Confidential' : listing.company}</span>
                      </div>
                      <p className="text-sm text-[#6B7280] line-clamp-2">{listing.description}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="h-4 w-4 text-[#22C55E]" />
                        <span className="font-semibold text-[#1A2B4C]">
                          {formatCurrency(listing.budgetMin)} - {formatCurrency(listing.budgetMax)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {listing.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#4A73CC] text-[#4A73CC] hover:bg-[#4A73CC] hover:text-white">
                        Find Similar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}