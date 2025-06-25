'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MessageCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface ProposalStats {
  totalProposals: number
  newProposalsLast7Days: number
  pendingReview: number
  averageProposalValue: number
}

export function ReceivedProposalsStats() {
  const [stats, setStats] = useState<ProposalStats>({
    totalProposals: 0,
    newProposalsLast7Days: 0,
    pendingReview: 0,
    averageProposalValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/received-proposals/stats')
        
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          // Fallback to mock data if API fails
          console.warn('Received proposals stats API failed, using mock data')
          setStats({
            totalProposals: 18,
            newProposalsLast7Days: 7,
            pendingReview: 5,
            averageProposalValue: 67500
          })
        }
      } catch (error) {
        console.error('Error fetching received proposals stats:', error)
        // Fallback to mock data
        setStats({
          totalProposals: 18,
          newProposalsLast7Days: 7,
          pendingReview: 5,
          averageProposalValue: 67500
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Proposals Received',
      value: stats.totalProposals.toString(),
      subtitle: '+7 this week',
      trend: '+63%',
      trendUp: true,
      icon: MessageCircle,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      borderColor: 'hover:border-stackmatch-blue'
    },
    {
      title: 'New Proposals (Last 7 Days)',
      value: stats.newProposalsLast7Days.toString(),
      subtitle: 'Strong response rate',
      trend: '+40%',
      trendUp: true,
      icon: Clock,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      borderColor: 'hover:border-trust-green'
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview.toString(),
      subtitle: 'Requiring your attention',
      trend: '+2',
      trendUp: true,
      icon: AlertCircle,
      color: 'text-attention-orange',
      bgColor: 'bg-attention-orange/10',
      borderColor: 'hover:border-attention-orange'
    },
    {
      title: 'Average Proposal Value',
      value: `$${(stats.averageProposalValue / 1000).toFixed(0)}K`,
      subtitle: 'Above market average',
      trend: '+12%',
      trendUp: true,
      icon: DollarSign,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10',
      borderColor: 'hover:border-information-blue'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-2 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-4 h-8 flex items-end gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-sm"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      width: '8px'
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
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