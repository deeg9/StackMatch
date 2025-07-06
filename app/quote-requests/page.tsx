'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Building2, 
  DollarSign, 
  Calendar,
  ArrowRight,
  Mail,
  Send,
  Clock,
  Target,
  Briefcase
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuoteRequest {
  id: string
  title: string
  buyerCompany: string
  industry: string
  budgetMin: number | null
  budgetMax: number | null
  deadline: string
  receivedDate: string
  description: string
  status: 'new' | 'viewed' | 'responded'
  requestType: 'direct' | 'public'
  requirements: string[]
}

export default function QuoteRequestsPage() {
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<QuoteRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')

  useEffect(() => {
    // Fetch quote requests (mock data for now)
    const fetchRequests = async () => {
      try {
        // Mock data
        const mockRequests: QuoteRequest[] = [
          {
            id: '1',
            title: 'Enterprise CRM Implementation',
            buyerCompany: 'TechCorp Industries',
            industry: 'Technology',
            budgetMin: 100000,
            budgetMax: 250000,
            deadline: '2024-02-15',
            receivedDate: '2024-01-28',
            description: 'Looking for a comprehensive CRM solution to manage our sales pipeline and customer relationships.',
            status: 'new',
            requestType: 'direct',
            requirements: ['Salesforce expertise', 'API integration', 'Data migration']
          },
          {
            id: '2',
            title: 'Data Analytics Platform Setup',
            buyerCompany: 'FinanceFlow Corp',
            industry: 'Finance',
            budgetMin: 50000,
            budgetMax: 100000,
            deadline: '2024-02-20',
            receivedDate: '2024-01-27',
            description: 'Need a robust analytics platform to process financial data and generate insights.',
            status: 'viewed',
            requestType: 'direct',
            requirements: ['Tableau', 'Python', 'Real-time processing']
          },
          {
            id: '3',
            title: 'HR Management System Upgrade',
            buyerCompany: 'Global Manufacturing Inc',
            industry: 'Manufacturing',
            budgetMin: 75000,
            budgetMax: 150000,
            deadline: '2024-02-18',
            receivedDate: '2024-01-26',
            description: 'Upgrading our legacy HR system to a modern cloud-based solution.',
            status: 'new',
            requestType: 'public',
            requirements: ['Cloud migration', 'Payroll integration', 'Mobile app']
          },
          {
            id: '4',
            title: 'E-commerce Platform Development',
            buyerCompany: 'RetailFlow Systems',
            industry: 'Retail',
            budgetMin: 150000,
            budgetMax: 300000,
            deadline: '2024-02-25',
            receivedDate: '2024-01-25',
            description: 'Building a scalable e-commerce platform with advanced features.',
            status: 'new',
            requestType: 'public',
            requirements: ['Shopify Plus', 'Multi-currency', 'Inventory management']
          },
          {
            id: '5',
            title: 'Cybersecurity Assessment & Implementation',
            buyerCompany: 'SecureNet Solutions',
            industry: 'Technology',
            budgetMin: 80000,
            budgetMax: 120000,
            deadline: '2024-02-22',
            receivedDate: '2024-01-24',
            description: 'Comprehensive security audit and implementation of security measures.',
            status: 'responded',
            requestType: 'direct',
            requirements: ['CISSP certification', 'Penetration testing', 'Compliance']
          },
          {
            id: '6',
            title: 'Marketing Automation Setup',
            buyerCompany: 'GrowthMetrics Ltd',
            industry: 'Marketing',
            budgetMin: 40000,
            budgetMax: 80000,
            deadline: '2024-02-28',
            receivedDate: '2024-01-23',
            description: 'Implementing marketing automation tools and workflows.',
            status: 'new',
            requestType: 'public',
            requirements: ['HubSpot', 'Email automation', 'Lead scoring']
          }
        ]
        
        setRequests(mockRequests)
        setFilteredRequests(mockRequests)
      } catch (error) {
        console.error('Error fetching quote requests:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...requests]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(request => request.industry === industryFilter)
    }

    // Budget filter
    if (budgetFilter !== 'all') {
      filtered = filtered.filter(request => {
        const maxBudget = request.budgetMax || 0
        switch (budgetFilter) {
          case 'under50k':
            return maxBudget < 50000
          case '50k-100k':
            return maxBudget >= 50000 && maxBudget <= 100000
          case '100k-250k':
            return maxBudget > 100000 && maxBudget <= 250000
          case 'over250k':
            return maxBudget > 250000
          default:
            return true
        }
      })
    }

    setFilteredRequests(filtered)
  }, [searchQuery, industryFilter, budgetFilter, requests])

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Budget not specified'
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    }
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
    return 'Budget not specified'
  }

  const getStatusColor = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'new':
        return 'bg-[#4A73CC] text-white'
      case 'viewed':
        return 'bg-[#F59E0B] text-white'
      case 'responded':
        return 'bg-[#22C55E] text-white'
      default:
        return 'bg-[#6B7280] text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
      {/* Ticker Banner */}
      <TickerBanner />

      {/* Global Navigation */}
      <NavigationWrapper />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1A2B4C] to-[#4A73CC] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Quote Requests & Leads</h1>
            <p className="text-blue-200">
              Review new opportunities from direct requests and public listings
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <Card className="mb-6 border-2 border-[#D1D5DB]">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  type="text"
                  placeholder="Search by company name or listing title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex gap-4 w-full lg:w-auto">
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger className="w-[180px]">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Budgets</SelectItem>
                    <SelectItem value="under50k">Under $50K</SelectItem>
                    <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                    <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                    <SelectItem value="over250k">Over $250K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[#4A73CC] hover:bg-[#1A2B4C]' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[#4A73CC] hover:bg-[#1A2B4C]' : ''}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[#6B7280]">
            Showing {filteredRequests.length} of {requests.length} quote requests
          </p>
          <Badge className="bg-[#22C55E] text-white">
            {filteredRequests.filter(r => r.status === 'new').length} New Requests
          </Badge>
        </div>

        {/* Quote Request Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Mail className="h-16 w-16 text-[#D1D5DB] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1A2B4C] mb-2">No quote requests found</h3>
              <p className="text-[#6B7280]">Try adjusting your filters or search criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
              : 'space-y-6'
          )}>
            {filteredRequests.map((request, index) => (
              <Card 
                key={request.id} 
                className="border-2 hover:border-[#4A73CC] transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-[#1A2B4C] mb-2">
                        {request.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center text-[#6B7280]">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{request.buyerCompany}</span>
                        </div>
                        <Badge variant="outline">{request.industry}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status === 'new' && 'New'}
                        {request.status === 'viewed' && 'Viewed'}
                        {request.status === 'responded' && 'Responded'}
                      </Badge>
                      {request.requestType === 'direct' && (
                        <Badge variant="outline" className="text-xs">
                          <Send className="h-3 w-3 mr-1" />
                          Direct Request
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#6B7280] line-clamp-2">{request.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-[#E5E7EB]">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Budget Range</p>
                      <p className="font-semibold text-[#1A2B4C]">
                        {formatBudget(request.budgetMin, request.budgetMax)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Proposal Deadline</p>
                      <p className="font-semibold text-[#1A2B4C] flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {request.deadline}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#6B7280] mb-2">Key Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {request.requirements.slice(0, 3).map((req, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sm text-[#6B7280]">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Received {request.receivedDate}</span>
                    </div>
                    <Button className="bg-[#4A73CC] hover:bg-[#1A2B4C] text-white">
                      Review & Create Proposal
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}