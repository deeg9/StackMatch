'use client'

import { KPICard } from '@/components/shared/kpi-card'
import { 
  FileText, 
  MessageCircle
} from 'lucide-react'

export function MyListingsStats() {
  const stats = [
    {
      title: 'Total Active Listings',
      value: '4',
      subtitle: '+2 this month',
      trend: { value: '+100%', direction: 'up' as const },
      icon: FileText,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      borderColor: 'hover:border-stackmatch-blue',
      sparklineData: [2, 2, 3, 4, 3, 4, 4, 4]
    },
    {
      title: 'Total Proposals Received',
      value: '12',
      subtitle: 'Avg. 3 per listing',
      trend: { value: '+50%', direction: 'up' as const },
      icon: MessageCircle,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      borderColor: 'hover:border-trust-green',
      sparklineData: [6, 7, 8, 9, 10, 11, 12, 12]
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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