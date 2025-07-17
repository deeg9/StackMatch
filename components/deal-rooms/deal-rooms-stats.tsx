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
  ArrowDown,
  Zap,
  Target,
  Users2
} from 'lucide-react'

export function DealRoomsStats() {
  const stats = [
    {
      title: 'Total Value of Agreements',
      value: '$2.4M',
      subtitle: 'Avg. $200k per deal',
      trend: '+12%',
      trendUp: true,
      icon: DollarSign,
      color: 'text-charcoal',
      bgColor: 'bg-charcoal/10',
      borderColor: 'hover:border-charcoal',
      sparklineData: [180, 220, 190, 240, 210, 250, 280, 240]
    },
    {
      title: 'Average Deal Timeline',
      value: '45 days',
      subtitle: '2x faster than industry avg',
      trend: '-18%',
      trendUp: true,
      icon: Zap,
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#3B82F6]/10',
      borderColor: 'hover:border-[#3B82F6]',
      sparklineData: [65, 58, 52, 48, 45, 47, 43, 45]
    },
    {
      title: 'Average Implementation Timeline',
      value: '60 days',
      subtitle: '3x faster than industry avg',
      trend: '+5%',
      trendUp: true,
      icon: Target,
      color: 'text-[#16A34A]',
      bgColor: 'bg-[#16A34A]/10',
      borderColor: 'hover:border-[#16A34A]',
      sparklineData: [82, 85, 88, 86, 89, 91, 88, 89]
    },
    {
      title: 'Active Deal Rooms',
      value: '12',
      subtitle: '3 new this week',
      trend: '+25%',
      trendUp: true,
      icon: Users2,
      color: 'text-charcoal',
      bgColor: 'bg-charcoal/10',
      borderColor: 'hover:border-charcoal',
      sparklineData: [8, 9, 10, 11, 12, 10, 11, 12]
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
            className={`relative border-2 ${stat.borderColor} transition-all duration-300 hover:shadow-lg animate-slide-up group cursor-pointer overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Vertical colored bar on the left edge */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ 
                backgroundColor: stat.color === 'text-charcoal' ? '#374151' :
                                stat.color === 'text-[#3B82F6]' ? '#3B82F6' :
                                stat.color === 'text-[#16A34A]' ? '#16A34A' :
                                '#374151'
              }}
            />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-2xl font-bold text-stackmatch-navy">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-medium-gray">
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
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
                
                <div className={`${stat.bgColor} p-3 rounded-lg ml-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}