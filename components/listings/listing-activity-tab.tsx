'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  Eye, 
  MessageCircle, 
  Users, 
  Calendar,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react'

interface ListingActivityTabProps {
  listing: any
  isOwner: boolean
}

export function ListingActivityTab({ listing, isOwner }: ListingActivityTabProps) {
  // Mock activity data - in real app would come from API
  const activities = [
    {
      id: '1',
      type: 'listing_created',
      icon: CheckCircle,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      title: 'Listing Created',
      description: 'You created this listing',
      timestamp: listing.created_at ? new Date(listing.created_at).toLocaleString() : 'Unknown',
      user: listing.buyer.full_name || 'Unknown'
    },
    {
      id: '2',
      type: 'listing_published',
      icon: TrendingUp,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10',
      title: 'Listing Published',
      description: 'Your listing went live and is visible to sellers',
      timestamp: listing.published_at || listing.created_at ? new Date(listing.published_at || listing.created_at || Date.now()).toLocaleString() : 'Unknown',
      user: 'System'
    },
    {
      id: '3',
      type: 'view_milestone',
      icon: Eye,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      title: 'Reached 50 Views',
      description: 'Your listing has been viewed 50 times',
      timestamp: '2 days ago',
      user: 'System'
    },
    {
      id: '4',
      type: 'proposal_received',
      icon: MessageCircle,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      title: 'First Proposal Received',
      description: 'CRM Experts Inc submitted a proposal',
      timestamp: '3 days ago',
      user: 'Michael Chen'
    },
    {
      id: '5',
      type: 'listing_edited',
      icon: Edit,
      color: 'text-attention-orange',
      bgColor: 'bg-attention-orange/10',
      title: 'Listing Updated',
      description: 'Budget range was updated',
      timestamp: '5 days ago',
      user: listing.buyer.full_name || 'Unknown'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Activity Timeline */}
      <Card className="border-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-stackmatch-navy mb-6">
            Activity Timeline
          </h3>
          
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${activity.bgColor}`}>
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 h-full bg-light-gray mt-2"></div>
                  )}
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 pb-6">
                  <h4 className="font-semibold text-charcoal">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-medium-gray mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-medium-gray">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp}
                    </span>
                    <span>by {activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="border-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-stackmatch-navy mb-4">
            Activity Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Eye className="h-6 w-6 text-information-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-charcoal">{listing.view_count || 0}</p>
              <p className="text-sm text-medium-gray">Total Views</p>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <MessageCircle className="h-6 w-6 text-trust-green mx-auto mb-2" />
              <p className="text-2xl font-bold text-charcoal">{listing.proposals_count || 0}</p>
              <p className="text-sm text-medium-gray">Proposals</p>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Users className="h-6 w-6 text-stackmatch-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-charcoal">0</p>
              <p className="text-sm text-medium-gray">Deal Rooms</p>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Calendar className="h-6 w-6 text-attention-orange mx-auto mb-2" />
              <p className="text-2xl font-bold text-charcoal">
                {listing.bid_deadline 
                  ? Math.max(0, Math.ceil((new Date(listing.bid_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                  : 'N/A'}
              </p>
              <p className="text-sm text-medium-gray">Days Left</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}