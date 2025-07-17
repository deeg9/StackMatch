'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { KPICard } from '@/components/shared/kpi-card'
import { 
  MessageCircle, 
  Clock, 
  AlertCircle,
  DollarSign
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
      trend: { value: '+63%', direction: 'up' as const },
      icon: MessageCircle,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      borderColor: 'hover:border-stackmatch-blue',
      sparklineData: [12, 15, 13, 17, 16, 18, 17, 18]
    },
    {
      title: 'New Proposals (Last 7 Days)',
      value: stats.newProposalsLast7Days.toString(),
      subtitle: 'Strong response rate',
      trend: { value: '+40%', direction: 'up' as const },
      icon: Clock,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      borderColor: 'hover:border-trust-green',
      sparklineData: [4, 5, 6, 5, 7, 6, 8, 7]
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview.toString(),
      subtitle: 'Requiring your attention',
      trend: { value: '+2', direction: 'up' as const },
      icon: AlertCircle,
      color: 'text-attention-orange',
      bgColor: 'bg-attention-orange/10',
      borderColor: 'hover:border-attention-orange',
      sparklineData: [3, 4, 3, 5, 4, 6, 5, 5]
    },
    {
      title: 'Average Proposal Value',
      value: `$${(stats.averageProposalValue / 1000).toFixed(0)}K`,
      subtitle: 'Above market average',
      trend: { value: '+12%', direction: 'up' as const },
      icon: DollarSign,
      color: 'text-information-blue',
      bgColor: 'bg-information-blue/10',
      borderColor: 'hover:border-information-blue',
      sparklineData: [55, 58, 62, 65, 64, 68, 67, 67.5]
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-2 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <KPICard
          key={stat.title}
          {...stat}
          animationDelay={index * 100}
        />
      ))}
    </div>
  )
}