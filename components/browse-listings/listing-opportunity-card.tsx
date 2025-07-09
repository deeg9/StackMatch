'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Calendar, 
  Clock, 
  DollarSign,
  Users,
  Briefcase,
  MapPin,
  FileText,
  Star,
  Shield,
  Eye,
  Heart,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface ListingOpportunityCardProps {
  listing: {
    id: string
    buyerCompany: string
    buyerLogo?: string
    title: string
    category: string
    description: string
    keyRequirements: string[]
    companySize: string
    industry: string
    budgetMin?: number
    budgetMax?: number
    budgetDisclosed: boolean
    proposalDeadline: string
    projectStart?: string
    projectScope: string
    location: string
    isVerified: boolean
    isPremium: boolean
    viewCount: number
    proposalCount: number
    matchScore?: number
    status: 'new' | 'closing-soon' | 'active' | 'under-review'
  }
}

export function ListingOpportunityCard({ listing }: ListingOpportunityCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const getStatusBadge = () => {
    switch (listing.status) {
      case 'new':
        return <Badge className="bg-trust-green text-white">New</Badge>
      case 'closing-soon':
        return <Badge className="bg-attention-orange text-white">Closing Soon</Badge>
      case 'under-review':
        return <Badge className="bg-information-blue text-white">Under Review</Badge>
      default:
        return null
    }
  }

  const formatBudget = () => {
    if (!listing.budgetDisclosed) return 'Budget Undisclosed'
    if (listing.budgetMin && listing.budgetMax) {
      return `$${(listing.budgetMin / 1000).toFixed(0)}K - $${(listing.budgetMax / 1000).toFixed(0)}K`
    }
    return 'Budget TBD'
  }

  const getDaysUntilDeadline = () => {
    const deadline = new Date(listing.proposalDeadline)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleSaveToggle = () => {
    setIsSaved(!isSaved)
  }

  return (
    <Card 
      className="border-2 hover:border-stackmatch-blue transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 animate-fade-in"
    >
      <CardContent className="p-8">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3 flex-1">
            {/* Company Logo */}
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {listing.buyerLogo ? (
                <img src={listing.buyerLogo} alt={listing.buyerCompany} className="w-8 h-8 object-contain" />
              ) : (
                <Building2 className="h-6 w-6 text-medium-gray" />
              )}
            </div>
            
            {/* Title and Company */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-stackmatch-navy hover:text-stackmatch-blue transition-colors cursor-pointer">
                  {listing.title}
                </h3>
                {listing.isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm text-charcoal font-medium">{listing.buyerCompany}</p>
                {listing.isVerified && (
                  <Shield className="h-4 w-4 text-trust-green" />
                )}
              </div>
              {getStatusBadge() && (
                <div className="mb-2">
                  {getStatusBadge()}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveToggle}
            className={`p-2 ${isSaved ? 'text-red-500' : 'text-medium-gray'}`}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Company Details */}
        <div className="flex flex-wrap gap-6 mb-6 text-sm">
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4 text-medium-gray" />
            <span className="text-charcoal">{listing.industry}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-medium-gray" />
            <span className="text-charcoal">{listing.companySize}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-medium-gray" />
            <span className="text-charcoal">{listing.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-charcoal mb-6 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        {/* Key Requirements */}
        <div className="mb-6">
          <p className="text-sm font-medium text-charcoal mb-3">Key Requirements:</p>
          <div className="flex flex-wrap gap-3">
            {listing.keyRequirements.slice(0, 3).map((req, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {req}
              </Badge>
            ))}
            {listing.keyRequirements.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{listing.keyRequirements.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Budget and Timeline */}
        <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-slate-50 rounded-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-trust-green" />
              <p className="text-xs text-medium-gray">Budget Range</p>
            </div>
            <p className="text-sm font-semibold text-charcoal">{formatBudget()}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-attention-orange" />
              <p className="text-xs text-medium-gray">Proposal Deadline</p>
            </div>
            <p className="text-sm font-semibold text-charcoal">
              {getDaysUntilDeadline()} days left
            </p>
          </div>
        </div>

        {/* Project Details */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <Badge variant="outline" className="gap-1">
            <FileText className="h-3 w-3" />
            {listing.projectScope}
          </Badge>
          {listing.projectStart && (
            <div className="flex items-center gap-1 text-charcoal">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">Start: {listing.projectStart}</span>
            </div>
          )}
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center gap-6 mb-6 text-sm text-medium-gray">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{listing.viewCount} views</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{listing.proposalCount} proposals</span>
          </div>
          {listing.matchScore && (
            <div className="flex items-center gap-1 text-trust-green font-medium">
              <Star className="h-4 w-4 fill-current" />
              <span>{listing.matchScore}% match</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/listings/${listing.id}`} className="flex-1">
            <Button className="w-full h-12 bg-stackmatch-blue hover:bg-stackmatch-navy text-white font-medium">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Link href={`/create-proposal/${listing.id}`}>
            <Button variant="outline" className="h-12 px-6 hover:bg-trust-green hover:text-white hover:border-trust-green font-medium">
              Submit Proposal
            </Button>
          </Link>
        </div>

      </CardContent>
    </Card>
  )
}