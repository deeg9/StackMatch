'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { 
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Share2,
  Star,
  TrendingUp,
  AlertCircle,
  Download,
  Bookmark,
  MessageSquare,
  Zap,
  FileText,
  Info
} from 'lucide-react'
import Link from 'next/link'

interface ListingDetailSidebarProps {
  listing: any
  isOwner: boolean
  userType: 'buyer' | 'seller' | null
}

export function ListingDetailSidebar({ listing, isOwner, userType }: ListingDetailSidebarProps) {
  const calculateDaysRemaining = () => {
    if (!listing.bid_deadline) return 0
    const deadline = new Date(listing.bid_deadline)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysRemaining = calculateDaysRemaining()
  const urgencyLevel = daysRemaining <= 3 ? 'high' : daysRemaining <= 7 ? 'medium' : 'low'

  return (
    <div className="space-y-6">
      {/* Export & Share - Now at the top for all users */}
      <SidebarWidget
        title="Export & Share"
        icon={Share2}
        className="border-2"
      >
        <Button variant="outline" className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          Share to Socials
        </Button>
        <Button variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </SidebarWidget>

      {/* Quick Actions */}
      {!isOwner && userType === 'seller' && listing.status === 'ACTIVE' && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={`/create-proposal/${listing.id}`} className="block">
              <Button className="w-full bg-trust-green hover:bg-success-green text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Submit Proposal
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              <Bookmark className="h-4 w-4 mr-2" />
              Save Listing
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Key Information */}
      <SidebarWidget
        title="Key Information"
        icon={Info}
        className="border-2"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-stackmatch-blue mt-0.5" />
            <div>
              <p className="text-sm font-medium text-charcoal">Posted Date</p>
              <p className="text-sm text-medium-gray">
                {listing.created_at ? new Date(listing.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-attention-orange mt-0.5" />
            <div>
              <p className="text-sm font-medium text-charcoal">Proposal Deadline</p>
              <p className="text-sm text-medium-gray">
                {listing.bid_deadline ? new Date(listing.bid_deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-trust-green mt-0.5" />
            <div>
              <p className="text-sm font-medium text-charcoal">Budget Range</p>
              <p className="text-sm text-medium-gray">
                {listing.budget_min && listing.budget_max
                  ? `$${listing.budget_min.toLocaleString()} - $${listing.budget_max.toLocaleString()}`
                  : listing.budget_min
                  ? `From $${listing.budget_min.toLocaleString()}`
                  : listing.budget_max
                  ? `Up to $${listing.budget_max.toLocaleString()}`
                  : 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-information-blue mt-0.5" />
            <div>
              <p className="text-sm font-medium text-charcoal">Location</p>
              <p className="text-sm text-medium-gray">
                {listing.location_preference || 'No preference'}
              </p>
            </div>
          </div>
        </div>
      </SidebarWidget>

      {/* Engagement Stats */}
      {isOwner && (
        <SidebarWidget
          title="Engagement Stats"
          icon={TrendingUp}
          className="border-2"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-trust-green" />
                <span className="text-sm text-medium-gray">Conversion Rate</span>
              </div>
              <span className="text-sm font-semibold text-charcoal">
                {listing.view_count > 0 
                  ? `${((listing.proposals_count / listing.view_count) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-attention-orange" />
                <span className="text-sm text-medium-gray">Quality Score</span>
              </div>
              <span className="text-sm font-semibold text-charcoal">8.5/10</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-stackmatch-blue" />
                <span className="text-sm text-medium-gray">Avg. Response Time</span>
              </div>
              <span className="text-sm font-semibold text-charcoal">2.4 hours</span>
            </div>
          </div>
        </SidebarWidget>
      )}


      {/* Related Listings */}
      {!isOwner && (
        <SidebarWidget
          title="Similar Listings"
          icon={FileText}
          className="border-2"
        >
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Link 
                key={i} 
                href={`/listings/similar-${i}`}
                className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <h4 className="font-medium text-sm text-charcoal mb-1">
                  Enterprise Software Implementation
                </h4>
                <p className="text-xs text-medium-gray">
                  $50K - $100K • 2 days left
                </p>
              </Link>
            ))}
          </div>
        </SidebarWidget>
      )}
    </div>
  )
}