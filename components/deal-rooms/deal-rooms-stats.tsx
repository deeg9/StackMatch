'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  Briefcase, 
  DollarSign, 
  CheckCircle2
} from 'lucide-react'

export function DealRoomsStats() {
  const stats = [
    {
      title: 'Active Deals',
      value: '12',
      icon: Briefcase,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10'
    },
    {
      title: 'Total Value',
      value: '$2.4M',
      icon: DollarSign,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10'
    },
    {
      title: 'Success Rate',
      value: '89%',
      icon: CheckCircle2,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <Card 
            key={stat.title} 
            className="border-0 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-gray mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-stackmatch-navy">
                    {stat.value}
                  </p>
                </div>
                
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}