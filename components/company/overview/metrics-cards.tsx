'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { KPICard } from '@/components/shared/kpi-card'
import { 
  DollarSign, 
  Clock, 
  Star, 
  Users, 
  TrendingUp, 
  Award,
  Zap,
  CheckCircle
} from 'lucide-react'

interface MetricData {
  title: string
  value: string
  subtitle: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
  trend?: {
    direction: 'up' | 'down'
    value: string
  }
  sparklineData?: number[]
}

interface MetricsCardsProps {
  companyId: string
}

export function MetricsCards({ companyId }: MetricsCardsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  // Mock metrics data for different companies
  const mockMetrics: Record<string, MetricData[]> = {
    'salesforce': [
      {
        title: 'Avg. Contract Value',
        value: '$180K',
        subtitle: 'Annual recurring revenue',
        icon: DollarSign,
        color: 'text-trust-green',
        bgColor: 'bg-trust-green/10',
        borderColor: 'hover:border-trust-green',
        trend: { direction: 'up', value: '12%' },
        sparklineData: [140, 150, 160, 165, 170, 175, 178, 180]
      },
      {
        title: 'Implementation Time',
        value: '3-6 months',
        subtitle: 'Typical deployment',
        icon: Clock,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10',
        borderColor: 'hover:border-stackmatch-blue',
        sparklineData: [6, 5, 4, 4.5, 4, 3.5, 3, 3]
      },
      {
        title: 'Customer Satisfaction',
        value: '4.8/5',
        subtitle: 'G2 Enterprise Grid',
        icon: Star,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'hover:border-yellow-500',
        trend: { direction: 'up', value: '0.2' },
        sparklineData: [4.6, 4.6, 4.7, 4.7, 4.7, 4.8, 4.8, 4.8]
      },
      {
        title: 'ROI Achievement',
        value: '251%',
        subtitle: 'Average 3-year ROI',
        icon: TrendingUp,
        color: 'text-attention-orange',
        bgColor: 'bg-attention-orange/10',
        borderColor: 'hover:border-attention-orange',
        trend: { direction: 'up', value: '25%' },
        sparklineData: [200, 210, 220, 230, 235, 240, 245, 251]
      }
    ],
    'microsoft': [
      {
        title: 'Avg. Contract Value',
        value: '$150K',
        subtitle: 'Enterprise licensing',
        icon: DollarSign,
        color: 'text-trust-green',
        bgColor: 'bg-trust-green/10',
        borderColor: 'hover:border-trust-green',
        trend: { direction: 'up', value: '8%' },
        sparklineData: [130, 135, 140, 142, 145, 147, 148, 150]
      },
      {
        title: 'Time to Value',
        value: '30 days',
        subtitle: 'Office 365 deployment',
        icon: Zap,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10',
        borderColor: 'hover:border-stackmatch-blue',
        sparklineData: [45, 40, 35, 35, 32, 30, 30, 30]
      },
      {
        title: 'Customer Satisfaction',
        value: '4.7/5',
        subtitle: 'Gartner Peer Insights',
        icon: Star,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'hover:border-yellow-500',
        sparklineData: [4.5, 4.5, 4.6, 4.6, 4.6, 4.7, 4.7, 4.7]
      },
      {
        title: 'Uptime Guarantee',
        value: '99.9%',
        subtitle: 'SLA commitment',
        icon: CheckCircle,
        color: 'text-trust-green',
        bgColor: 'bg-trust-green/10',
        borderColor: 'hover:border-trust-green',
        sparklineData: [99.8, 99.9, 99.9, 99.9, 99.9, 99.9, 99.9, 99.9]
      }
    ],
    'oracle': [
      {
        title: 'Avg. Contract Value',
        value: '$250K',
        subtitle: 'Database licensing',
        icon: DollarSign,
        color: 'text-trust-green',
        bgColor: 'bg-trust-green/10',
        borderColor: 'hover:border-trust-green',
        trend: { direction: 'up', value: '15%' },
        sparklineData: [200, 210, 220, 225, 230, 240, 245, 250]
      },
      {
        title: 'Implementation Time',
        value: '6-12 months',
        subtitle: 'Enterprise deployment',
        icon: Clock,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10',
        borderColor: 'hover:border-stackmatch-blue',
        sparklineData: [12, 11, 10, 9, 9, 8, 7, 6]
      },
      {
        title: 'Performance Gain',
        value: '10x faster',
        subtitle: 'Autonomous Database',
        icon: Zap,
        color: 'text-attention-orange',
        bgColor: 'bg-attention-orange/10',
        borderColor: 'hover:border-attention-orange',
        trend: { direction: 'up', value: '200%' },
        sparklineData: [3, 4, 5, 6, 7, 8, 9, 10]
      },
      {
        title: 'Industry Recognition',
        value: '#1 Database',
        subtitle: 'Gartner Magic Quadrant',
        icon: Award,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'hover:border-yellow-500',
        sparklineData: [1, 1, 1, 1, 1, 1, 1, 1]
      }
    ]
  }

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      try {
        // Try API call first
        const response = await fetch(`/api/companies/${companyId}/metrics`)
        if (response.ok) {
          const data = await response.json()
          setMetrics(data.metrics)
        } else {
          // Fallback to mock data
          const mock = mockMetrics[companyId] || mockMetrics['salesforce']
          setMetrics(mock)
        }
      } catch (error) {
        console.error('Error fetching metrics:', error)
        // Fallback to mock data
        const mock = mockMetrics[companyId] || mockMetrics['salesforce']
        setMetrics(mock)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [companyId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-28"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-stackmatch-blue" />
        <h2 className="text-2xl font-bold text-stackmatch-navy">At-a-Glance Metrics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <KPICard
            key={index}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            icon={metric.icon}
            color={metric.color}
            bgColor={metric.bgColor}
            borderColor={metric.borderColor}
            trend={metric.trend}
            sparklineData={metric.sparklineData}
            animationDelay={index * 100}
          />
        ))}
      </div>
    </div>
  )
}