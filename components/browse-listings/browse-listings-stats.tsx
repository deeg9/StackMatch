'use client'

import { KPICard } from '@/components/shared/kpi-card'
import { Target, TrendingUp, Clock, Award } from 'lucide-react'

export function BrowseListingsStats() {
  const stats = [
    {
      title: 'Matched to You',
      value: '89',
      subtitle: '+12 this week',
      icon: Target,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      borderColor: 'hover:border-stackmatch-blue',
      sparklineData: [65, 70, 75, 78, 82, 85, 87, 89]
    },
    {
      title: 'High Budget',
      value: '34',
      subtitle: 'Over $100K',
      icon: TrendingUp,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      borderColor: 'hover:border-trust-green',
      sparklineData: [25, 27, 28, 30, 31, 32, 33, 34]
    },
    {
      title: 'Closing Soon',
      value: '15',
      subtitle: 'Next 7 days',
      icon: Clock,
      color: 'text-attention-orange',
      bgColor: 'bg-attention-orange/10',
      borderColor: 'hover:border-attention-orange',
      sparklineData: [18, 17, 16, 15, 14, 15, 15, 15]
    },
    {
      title: 'Premium Buyers',
      value: '67',
      subtitle: 'Verified companies',
      icon: Award,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10',
      borderColor: 'hover:border-information-blue',
      sparklineData: [55, 58, 60, 62, 63, 65, 66, 67]
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <KPICard
          key={stat.title}
          {...stat}
          animationDelay={index * 100}
        />
      ))}
    </div>
  )
}