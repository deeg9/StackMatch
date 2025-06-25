'use client'

import { useState, useEffect } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MessageCircle, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface Proposal {
  id: string
  sellerName: string
  sellerAvatar?: string
  proposedBudget: number
  listingTitle: string
  status: string
  submittedAt: string
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock proposals data for demonstration
  const mockProposals: Proposal[] = [
    {
      id: 'PROP-001',
      sellerName: 'TechSolutions Inc',
      proposedBudget: 85000,
      listingTitle: 'CRM Implementation for Mid-Market Company',
      status: 'submitted',
      submittedAt: '2 hours ago'
    },
    {
      id: 'PROP-002',
      sellerName: 'DataCorp Analytics',
      proposedBudget: 45000,
      listingTitle: 'Analytics Platform Selection',
      status: 'under review',
      submittedAt: '1 day ago'
    },
    {
      id: 'PROP-003',
      sellerName: 'CloudFirst Solutions',
      proposedBudget: 65000,
      listingTitle: 'HR Management System Upgrade',
      status: 'submitted',
      submittedAt: '3 days ago'
    }
  ]

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard/buyer/proposals')
        
        if (response.ok) {
          const data = await response.json()
          setProposals(data)
        } else {
          // Fallback to mock data if API fails
          console.warn('Proposals API failed, using mock data')
          setProposals(mockProposals)
        }
      } catch (error) {
        console.error('Error fetching proposals:', error)
        // Fallback to mock data
        setProposals(mockProposals)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-information-blue text-white'
      case 'under review':
        return 'bg-attention-orange text-white'
      case 'accepted':
        return 'bg-trust-green text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      default:
        return 'bg-medium-gray text-white'
    }
  }

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = searchQuery === '' || 
      proposal.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <TickerBanner />
        <NavigationWrapper />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg border-2 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-trust-green to-success-green rounded-2xl animate-float">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-stackmatch-navy animate-fade-in">
                Proposals
              </h1>
              <p className="text-xl text-charcoal animate-fade-in">
                Review and manage proposals from vendors
              </p>
            </div>
          </div>
          
          <Link href="/my-listings">
            <Button 
              variant="outline"
              className="border-stackmatch-blue text-stackmatch-blue hover:bg-stackmatch-blue hover:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              View My Listings
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
            <Input
              placeholder="Search proposals or sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'submitted', 'under review', 'accepted', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? 'bg-stackmatch-blue' : ''}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-information-blue transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-gray font-medium">Total Proposals</p>
                  <p className="text-3xl font-bold text-stackmatch-navy mt-1">{proposals.length}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-information-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-attention-orange transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-gray font-medium">Under Review</p>
                  <p className="text-3xl font-bold text-stackmatch-navy mt-1">
                    {proposals.filter(p => p.status === 'under review').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-attention-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-trust-green transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-gray font-medium">Accepted</p>
                  <p className="text-3xl font-bold text-stackmatch-navy mt-1">
                    {proposals.filter(p => p.status === 'accepted').length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-trust-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-gray font-medium">Avg. Budget</p>
                  <p className="text-3xl font-bold text-stackmatch-navy mt-1">
                    ${proposals.length > 0 ? Math.round(proposals.reduce((sum, p) => sum + p.proposedBudget, 0) / proposals.length).toLocaleString() : '0'}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-stackmatch-blue" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="h-16 w-16 text-medium-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stackmatch-navy mb-2">
                {searchQuery || statusFilter !== 'all' ? 'No proposals found' : 'No proposals yet'}
              </h3>
              <p className="text-medium-gray mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Proposals will appear here when vendors respond to your listings.'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link href="/my-listings">
                  <Button className="bg-trust-green hover:bg-success-green text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    View My Listings
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            filteredProposals.map((proposal, index) => (
              <Card
                key={proposal.id}
                className="border-2 hover:border-stackmatch-blue transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-stackmatch-navy">
                          {proposal.sellerName}
                        </h3>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-medium-gray">{proposal.listingTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-trust-green">
                        ${proposal.proposedBudget.toLocaleString()}
                      </p>
                      <p className="text-sm text-medium-gray">{proposal.submittedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-medium-gray">
                      <Calendar className="h-4 w-4" />
                      <span>Submitted {proposal.submittedAt}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                        Review Proposal
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}