'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  FileText, 
  MessageCircle, 
  TrendingUp, 
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'

export function MyListingsStats() {
  const stats = [
    {
      title: 'Total Active Listings',
      value: '4',
      subtitle: '+2 this month',
      trend: '+100%',
      trendUp: true,
      icon: FileText,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      borderColor: 'hover:border-stackmatch-blue'
    },
    {
      title: 'Total Proposals Received',
      value: '12',
      subtitle: 'Avg. 3 per listing',
      trend: '+50%',
      trendUp: true,
      icon: MessageCircle,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      borderColor: 'hover:border-trust-green'
    },
    {
      title: 'Average Responses/Listing',
      value: '3.2',
      subtitle: '15% above platform avg',
      trend: '+15%',
      trendUp: true,
      icon: TrendingUp,
      color: 'text-attention-orange',
      bgColor: 'bg-attention-orange/10',
      borderColor: 'hover:border-attention-orange'
    },
    {
      title: 'Proposals to Review',
      value: '5',
      subtitle: '2 require urgent action',
      trend: '+2',
      trendUp: true,
      icon: CheckCircle2,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10',
      borderColor: 'hover:border-information-blue'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trendUp ? ArrowUp : ArrowDown
        
        return (
          <Card 
            key={stat.title}
            className={`border-2 ${stat.borderColor} transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-trust-green' : 'text-red-500'}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span className="font-medium">{stat.trend}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold text-stackmatch-navy">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-charcoal">
                  {stat.title}
                </p>
                <p className="text-xs text-medium-gray">
                  {stat.subtitle}
                </p>
              </div>

              {/* Sparkline placeholder */}
              <div className="mt-4 h-8 flex items-end gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
                  <div
                    key={i}
                    className={`${stat.bgColor} rounded-sm animate-pulse`}
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      width: '8px',
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}