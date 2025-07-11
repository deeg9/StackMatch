'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Building2, 
  DollarSign, 
  Clock, 
  Star, 
  MessageSquare,
  Eye,
  Users,
  ChevronRight,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface ListingProposalsTabProps {
  listing: any
}

export function ListingProposalsTab({ listing }: ListingProposalsTabProps) {
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock proposals data - in real app would come from the listing.proposals
  const proposals = listing.proposals || []

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
      case 'new':
        return 'bg-information-blue text-white'
      case 'under_review':
        return 'bg-attention-orange text-white'
      case 'shortlisted':
        return 'bg-trust-green text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      default:
        return 'bg-medium-gray text-white'
    }
  }

  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`
    } else if (budget >= 1000) {
      return `$${(budget / 1000).toLocaleString()}K`
    }
    return `$${budget.toLocaleString()}`
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const filteredProposals = filterStatus === 'all' 
    ? proposals 
    : proposals.filter((p: any) => p.status === filterStatus)

  if (proposals.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-medium-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-charcoal mb-2">
            No Proposals Yet
          </h3>
          <p className="text-medium-gray mb-6">
            You haven't received any proposals for this listing yet. 
            Check back later or consider promoting your listing.
          </p>
          <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
            Promote Listing
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-charcoal">
          {filteredProposals.length} Proposal{filteredProposals.length !== 1 ? 's' : ''}
        </h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-medium-gray" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-light-gray rounded-lg px-3 py-1.5"
          >
            <option value="all">All Proposals</option>
            <option value="submitted">New</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal: any) => (
          <Card key={proposal.id} className="border-2 hover:border-stackmatch-blue transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* Vendor Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-light-gray">
                    <AvatarImage src={proposal.profiles?.avatar_url} />
                    <AvatarFallback className="bg-stackmatch-blue text-white">
                      {getInitials(proposal.profiles?.full_name || 'Unknown')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-stackmatch-navy">
                      {proposal.profiles?.full_name || 'Unknown Vendor'}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-medium-gray mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{proposal.profiles?.company_name || 'Company'}</span>
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-trust-green" />
                        <span className="font-semibold text-trust-green">
                          {formatBudget(proposal.proposed_budget)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-stackmatch-blue" />
                        <span className="text-sm text-charcoal">
                          {proposal.proposed_timeline || '8-12 weeks'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-attention-orange fill-attention-orange" />
                        <span className="text-sm text-charcoal">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <Badge className={getStatusColor(proposal.status)}>
                    {proposal.status?.replace('_', ' ')}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Link href={`/proposals/${proposal.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/deal-rooms/new?proposal=${proposal.id}`}>
                      <Button size="sm" className="bg-trust-green hover:bg-success-green text-white">
                        <Users className="h-4 w-4 mr-1" />
                        Start Deal Room
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Proposal Preview */}
              {proposal.cover_letter && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-charcoal line-clamp-2">
                    {proposal.cover_letter}
                  </p>
                  <Link 
                    href={`/proposals/${proposal.id}`}
                    className="text-sm text-stackmatch-blue hover:text-stackmatch-navy font-medium mt-2 inline-flex items-center gap-1"
                  >
                    Read more <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}