'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Eye, MessageCircle, Users, Clock } from 'lucide-react'

interface ListingDetailStatsProps {
  listing: any
}

export function ListingDetailStats({ listing }: ListingDetailStatsProps) {
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!listing.bid_deadline) return 0
    const deadline = new Date(listing.bid_deadline)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }


  const stats = [
    {
      title: 'Total Views',
      value: listing.view_count || 0,
      icon: Eye,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Proposals Received',
      value: listing.proposals_count || 0,
      icon: MessageCircle,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      trend: '+3',
      trendUp: true
    },
    {
      title: 'Deal Rooms',
      value: 0, // This would come from actual data
      icon: Users,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      trend: '0',
      trendUp: false
    },
    {
      title: 'Days Remaining',
      value: calculateDaysRemaining(),
      icon: Clock,
      color: 'text-attention-orange',
      bgColor: 'bg-attention-orange/10',
      trend: listing.status === 'ACTIVE' ? 'Active' : 'Closed',
      trendUp: false
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-2 hover:border-stackmatch-blue transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {stat.trend && (
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-trust-green' : 'text-medium-gray'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-stackmatch-navy mb-1">
              {stat.value}
            </h3>
            <p className="text-xs text-medium-gray">
              {stat.title}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}