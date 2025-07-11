'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Building2, 
  Star, 
  CheckCircle, 
  XCircle, 
  Users, 
  MessageSquare,
  GitCompare,
  Download,
  Clock,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProposalDetailHeaderProps {
  proposal: any
  isOwner: boolean
  onToggleComparison: () => void
  showComparison: boolean
}

export function ProposalDetailHeader({ 
  proposal, 
  isOwner, 
  onToggleComparison,
  showComparison 
}: ProposalDetailHeaderProps) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
      case 'new':
        return 'bg-information-blue text-white'
      case 'under_review':
        return 'bg-attention-orange text-white'
      case 'accepted':
      case 'shortlisted':
        return 'bg-trust-green text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      case 'withdrawn':
        return 'bg-medium-gray text-white'
      default:
        return 'bg-light-gray text-charcoal'
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

  const handleAccept = () => {
    // TODO: Implement accept functionality
    console.log('Accept proposal:', proposal.id)
  }

  const handleReject = () => {
    // TODO: Implement reject functionality
    console.log('Reject proposal:', proposal.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-light-gray p-6 mb-6">
      {/* Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-sm text-medium-gray">
          Proposals / {proposal.listing.title}
        </div>
      </div>

      {/* Main Header Content */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          {/* Vendor Info */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-light-gray">
              <AvatarImage src={proposal.seller.avatar_url} />
              <AvatarFallback className="bg-stackmatch-blue text-white text-lg">
                {getInitials(proposal.seller.full_name || 'Unknown')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold text-stackmatch-navy mb-1">
                {proposal.seller.full_name || 'Unknown Vendor'}
              </h1>
              <div className="flex items-center gap-2 text-medium-gray mb-2">
                <Building2 className="h-4 w-4" />
                <span>{proposal.seller.company_name || 'Unknown Company'}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-attention-orange fill-attention-orange" />
                  <span className="font-medium text-charcoal">4.8</span>
                  <span className="text-sm text-medium-gray">(127 reviews)</span>
                </div>
                <Badge className={getStatusColor(proposal.status)}>
                  {proposal.status?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-medium-gray mb-1">Proposed Budget</p>
              <p className="text-2xl font-bold text-trust-green">
                {formatBudget(proposal.proposed_budget)}
              </p>
            </div>
            <div className="w-px h-12 bg-light-gray"></div>
            <div>
              <p className="text-sm text-medium-gray mb-1">Timeline</p>
              <p className="text-xl font-bold text-charcoal">
                {proposal.proposed_timeline || '8-12 weeks'}
              </p>
            </div>
            <div className="w-px h-12 bg-light-gray"></div>
            <div>
              <p className="text-sm text-medium-gray mb-1">Submitted</p>
              <p className="text-sm font-medium text-charcoal flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {isOwner ? (
            <>
              {proposal.status === 'submitted' && (
                <>
                  <Button 
                    className="bg-trust-green hover:bg-success-green text-white"
                    onClick={handleAccept}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Proposal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              <Link href={`/deal-rooms/new?proposal=${proposal.id}`}>
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Start Deal Room
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={onToggleComparison}
                className={showComparison ? 'bg-stackmatch-blue text-white' : ''}
              >
                <GitCompare className="h-4 w-4 mr-2" />
                {showComparison ? 'Exit Comparison' : 'Compare'}
              </Button>
            </>
          ) : (
            <>
              <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Buyer
              </Button>
              {proposal.status === 'submitted' && (
                <Button variant="outline" className="text-red-600 hover:bg-red-50">
                  Withdraw Proposal
                </Button>
              )}
            </>
          )}
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Listing Context */}
      <div className="mt-4 pt-4 border-t border-light-gray">
        <p className="text-sm text-medium-gray mb-1">Proposal for:</p>
        <Link 
          href={`/listings/${proposal.listing_id}`}
          className="text-stackmatch-blue hover:text-stackmatch-navy font-medium"
        >
          {proposal.listing.title}
        </Link>
      </div>
    </div>
  )
}