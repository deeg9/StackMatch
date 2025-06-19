'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export function DealRoomsStats() {
  const stats = [
    {
      title: 'Active Negotiations',
      value: '12',
      subtitle: '3 new this week',
      trend: '+25%',
      trendUp: true,
      icon: Briefcase,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      borderColor: 'hover:border-stackmatch-blue'
    },
    {
      title: 'Total Deal Value',
      value: '$2.4M',
      subtitle: 'Avg: $200K per deal',
      trend: '+12%',
      trendUp: true,
      icon: DollarSign,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      borderColor: 'hover:border-trust-green'
    },
    {
      title: 'Response Metrics',
      value: '2.5h',
      subtitle: '24 unread messages',
      trend: '-15%',
      trendUp: false,
      icon: Clock,
      color: 'text-attention-orange',
      bgColor: 'bg-attention-orange/10',
      borderColor: 'hover:border-attention-orange'
    },
    {
      title: 'Success Rate',
      value: '89%',
      subtitle: '8 deals closed this month',
      trend: '+5%',
      trendUp: true,
      icon: CheckCircle2,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10',
      borderColor: 'hover:border-information-blue'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trendUp ? ArrowUp : ArrowDown
        
        return (
          <Card 
            key={stat.title} 
            className={`border-2 ${stat.borderColor} transition-all duration-300 hover:shadow-lg animate-slide-up group cursor-pointer`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-medium-gray">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-stackmatch-navy group-hover:scale-105 transition-transform">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-medium-gray">
                      {stat.subtitle}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${stat.trendUp ? 'text-trust-green bg-trust-green/10' : 'text-red-500 bg-red-50'}`}
                    >
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
                
                <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}