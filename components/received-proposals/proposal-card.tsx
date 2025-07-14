'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  Eye,
  MessageSquare,
  MoreVertical,
  Archive,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface ProposalCardProps {
  proposal: {
    id: string
    sellerName: string
    sellerAvatar?: string
    sellerCompany?: string
    proposedBudget: number
    proposedTimeline?: string
    listingTitle: string
    listingId: string
    status: string
    submittedAt: string
    sellerRating?: number
    isNew?: boolean
  }
  onArchive?: (proposalId: string) => void
}

export function ProposalCard({ proposal, onArchive }: ProposalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending_review':
      case 'pending review':
        return 'bg-information-blue text-white'
      case 'in_discussion':
      case 'under review':
        return 'bg-attention-orange text-white'
      case 'accepted':
        return 'bg-trust-green text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      case 'archived':
        return 'bg-medium-gray text-white'
      default:
        return 'bg-medium-gray text-white'
    }
  }

  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`
    } else if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(0)}K`
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

  return (
    <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 group relative">
      
      <CardContent className="p-6">
        {/* Header Section - Vendor Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-light-gray">
              <AvatarImage src={proposal.sellerAvatar} />
              <AvatarFallback className="bg-stackmatch-blue text-white font-bold">
                {getInitials(proposal.sellerName)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-lg font-bold text-stackmatch-navy">
                {proposal.sellerName}
              </h3>
              {proposal.sellerCompany && (
                <div className="flex items-center gap-1 text-sm text-medium-gray">
                  <Building2 className="w-3 h-3" />
                  <span>{proposal.sellerCompany}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(proposal.status)}>
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1).replace('_', ' ')}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onArchive?.(proposal.id)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Proposal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Listing Context */}
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-medium-gray mb-1">
            <FileText className="w-3 h-3" />
            <span>For:</span>
          </div>
          <p className="text-stackmatch-navy font-medium">
            {proposal.listingTitle}
          </p>
        </div>

        {/* Key Comparison Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-4 h-4 text-trust-green" />
              <span className="text-xs text-medium-gray font-medium">Proposed Value</span>
            </div>
            <p className="text-xl font-bold text-trust-green">
              {formatBudget(proposal.proposedBudget)}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-stackmatch-blue" />
              <span className="text-xs text-medium-gray font-medium">Timeline</span>
            </div>
            <p className="text-lg font-bold text-stackmatch-navy">
              {proposal.proposedTimeline || '8-12 weeks'}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-attention-orange" />
              <span className="text-xs text-medium-gray font-medium">Rating</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <p className="text-lg font-bold text-stackmatch-navy">
                {proposal.sellerRating || 4.8}
              </p>
              <Star className="w-4 h-4 text-attention-orange fill-attention-orange" />
            </div>
          </div>
        </div>

        {/* Footer - Time and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-light-gray">
          <div className="flex items-center gap-2 text-sm text-medium-gray">
            <Calendar className="h-4 w-4" />
            <span>Submitted {proposal.submittedAt}</span>
          </div>
          
          <div className="flex gap-2">
            <Link href={`/proposals/evaluate/${proposal.id.toLowerCase()}`}>
              <Button variant="outline" size="sm" className="text-stackmatch-blue border-stackmatch-blue hover:bg-stackmatch-blue hover:text-white">
                <Eye className="h-4 w-4 mr-1" />
                View Proposal
              </Button>
            </Link>
            
            <Link href={`/deal-rooms/${proposal.listingId}`}>
              <Button size="sm" className="bg-trust-green hover:bg-success-green text-white">
                <MessageSquare className="h-4 w-4 mr-1" />
                Open Deal Room
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}