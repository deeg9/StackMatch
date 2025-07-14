'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Edit, Eye, Users, FileText, Clock, Building2, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ListingDetailHeaderProps {
  listing: any
  isOwner: boolean
  userType: 'buyer' | 'seller' | null
}

export function ListingDetailHeader({ listing, isOwner, userType }: ListingDetailHeaderProps) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-trust-green text-white'
      case 'DRAFT':
        return 'bg-medium-gray text-white'
      case 'CLOSED':
        return 'bg-charcoal text-white'
      case 'AWARDED':
        return 'bg-information-blue text-white'
      default:
        return 'bg-light-gray text-charcoal'
    }
  }

  const formatBudget = () => {
    if (listing.budget_min && listing.budget_max) {
      return `$${listing.budget_min.toLocaleString()} - $${listing.budget_max.toLocaleString()}`
    } else if (listing.budget_min) {
      return `From $${listing.budget_min.toLocaleString()}`
    } else if (listing.budget_max) {
      return `Up to $${listing.budget_max.toLocaleString()}`
    }
    return 'Budget not specified'
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
          {isOwner ? 'My Listings' : 'Browse Listings'} / {listing.title}
        </div>
      </div>

      {/* Main Header Content - RFQ Command Center Style */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          {/* Title and Status - More Prominent */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-stackmatch-navy mb-2">
              {listing.title}
            </h1>
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(listing.status)} text-base px-3 py-1`}>
                {listing.status}
              </Badge>
              <span className="text-lg text-charcoal font-medium">
                {listing.buyer.company_name || 'Unknown Company'}
              </span>
            </div>
          </div>

          {/* Key Information Bar */}
          <div className="flex items-center gap-8 p-4 bg-light-gray/30 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-stackmatch-blue" />
              <div>
                <p className="text-xs text-medium-gray">Category</p>
                <p className="font-semibold text-charcoal">{listing.category}</p>
              </div>
            </div>
            <div className="border-l border-medium-gray/20 h-10"></div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-trust-green" />
              <div>
                <p className="text-xs text-medium-gray">Budget Range</p>
                <p className="font-semibold text-charcoal">{formatBudget()}</p>
              </div>
            </div>
            <div className="border-l border-medium-gray/20 h-10"></div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-attention-orange" />
              <div>
                <p className="text-xs text-medium-gray">Proposals Due</p>
                <p className="font-semibold text-charcoal">
                  {listing.bid_deadline ? new Date(listing.bid_deadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Context-Aware Action Bar */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          {isOwner ? (
            // Buyer Actions
            <>
              <Link href={`/listings/${listing.id}/edit`}>
                <Button className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white" size="lg">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Listing
                </Button>
              </Link>
              <Link href={`/listings/${listing.id}/proposals`}>
                <Button variant="outline" className="w-full" size="lg">
                  <Eye className="h-4 w-4 mr-2" />
                  View Proposals ({listing.proposals_count})
                </Button>
              </Link>
              {listing.status === 'ACTIVE' && (
                <Button variant="outline" className="w-full text-red-600 hover:bg-red-50" size="lg">
                  Withdraw Listing
                </Button>
              )}
            </>
          ) : userType === 'seller' && listing.status === 'ACTIVE' ? (
            // Seller Actions
            <>
              <Link href={`/create-proposal/${listing.id}`}>
                <Button className="w-full bg-trust-green hover:bg-success-green text-white" size="lg">
                  Submit Proposal
                </Button>
              </Link>
              <Button variant="outline" className="w-full" size="lg">
                Ask a Question
              </Button>
            </>
          ) : (
            // View-only state
            <div className="text-center p-4 bg-light-gray/30 rounded-lg">
              <p className="text-sm text-medium-gray">
                {listing.status === 'CLOSED' ? 'This listing is closed' : 'View-only access'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}