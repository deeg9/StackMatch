'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Target, TrendingUp, Clock, Award } from 'lucide-react'

export function BrowseListingsStats() {
  const stats = [
    {
      icon: <Target className="h-5 w-5 text-stackmatch-blue" />,
      label: 'Matched to You',
      value: '89',
      change: '+12 this week',
      bgColor: 'bg-stackmatch-blue/10',
      textColor: 'text-stackmatch-blue'
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-trust-green" />,
      label: 'High Budget',
      value: '34',
      change: 'Over $100K',
      bgColor: 'bg-trust-green/10',
      textColor: 'text-trust-green'
    },
    {
      icon: <Clock className="h-5 w-5 text-attention-orange" />,
      label: 'Closing Soon',
      value: '15',
      change: 'Next 7 days',
      bgColor: 'bg-attention-orange/10',
      textColor: 'text-attention-orange'
    },
    {
      icon: <Award className="h-5 w-5 text-information-blue" />,
      label: 'Premium Buyers',
      value: '67',
      change: 'Verified companies',
      bgColor: 'bg-information-blue/10',
      textColor: 'text-information-blue'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="hover:shadow-lg transition-shadow duration-300 hover:border-stackmatch-blue cursor-pointer animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-medium-gray mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-charcoal">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.textColor}`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}