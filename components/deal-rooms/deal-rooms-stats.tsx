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
      title: 'Total Deal Value',
      value: '$2.4M',
      subtitle: 'Avg: $200K per deal',
      trend: '+12%',
      trendUp: true,
      icon: DollarSign,
      color: 'text-success-green',
      bgColor: 'bg-success-green/10',
      borderColor: 'hover:border-success-green',
      sparklineData: [180, 220, 190, 240, 210, 250, 280, 240],
      description: 'Total value of active deals showing strong growth'
    },
    {
      title: 'Average Deal Velocity',
      value: '45 days',
      subtitle: '2x faster than industry avg',
      trend: '-18%',
      trendUp: true,
      icon: Zap,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10',
      borderColor: 'hover:border-information-blue',
      sparklineData: [65, 58, 52, 48, 45, 47, 43, 45],
      description: 'Average time from first contact to deal closure'
    },
    {
      title: 'Deal Win Rate',
      value: '89%',
      subtitle: '8 deals closed this month',
      trend: '+5%',
      trendUp: true,
      icon: Target,
      color: 'text-success-green',
      bgColor: 'bg-success-green/10',
      borderColor: 'hover:border-success-green',
      sparklineData: [82, 85, 88, 86, 89, 91, 88, 89],
      description: 'Percentage of engaged deals that result in successful closure'
    },
    {
      title: 'Active Negotiations',
      value: '12',
      subtitle: '3 new this week',
      trend: '+25%',
      trendUp: true,
      icon: Users2,
      color: 'text-stackmatch-navy',
      bgColor: 'bg-stackmatch-navy/10',
      borderColor: 'hover:border-stackmatch-navy',
      sparklineData: [8, 9, 10, 11, 12, 10, 11, 12],
      description: 'Current active deal rooms with ongoing negotiations'
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
                  <div className="flex items-center gap-3">
                    <p className={`text-3xl font-bold group-hover:scale-105 transition-transform ${stat.color}`}>
                      {stat.value}
                    </p>
                    {/* Mini Sparkline */}
                    <div className="flex items-end gap-px h-8">
                      {stat.sparklineData.map((point, idx) => (
                        <div
                          key={idx}
                          className={`w-1 rounded-sm transition-all duration-300 group-hover:opacity-80 ${stat.bgColor.replace('/10', '/30')}`}
                          style={{
                            height: `${(point / Math.max(...stat.sparklineData)) * 100}%`,
                            animationDelay: `${idx * 50}ms`
                          }}
                        />
                      ))}
                    </div>
                  </div>
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
                
                <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform relative overflow-hidden`}>
                  <Icon className={`w-6 h-6 ${stat.color} relative z-10`} />
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-current" />
                    <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-current" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}