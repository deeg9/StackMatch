'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  trend?: {
    direction: 'up' | 'down'
    value: string
  }
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
        trend: { direction: 'up', value: '12%' }
      },
      {
        title: 'Implementation Time',
        value: '3-6 months',
        subtitle: 'Typical deployment',
        icon: Clock,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10'
      },
      {
        title: 'Customer Satisfaction',
        value: '4.8/5',
        subtitle: 'G2 Enterprise Grid',
        icon: Star,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        trend: { direction: 'up', value: '0.2' }
      },
      {
        title: 'ROI Achievement',
        value: '251%',
        subtitle: 'Average 3-year ROI',
        icon: TrendingUp,
        color: 'text-attention-orange',
        bgColor: 'bg-attention-orange/10',
        trend: { direction: 'up', value: '25%' }
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
        trend: { direction: 'up', value: '8%' }
      },
      {
        title: 'Time to Value',
        value: '30 days',
        subtitle: 'Office 365 deployment',
        icon: Zap,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10'
      },
      {
        title: 'Customer Satisfaction',
        value: '4.7/5',
        subtitle: 'Gartner Peer Insights',
        icon: Star,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10'
      },
      {
        title: 'Uptime Guarantee',
        value: '99.9%',
        subtitle: 'SLA commitment',
        icon: CheckCircle,
        color: 'text-trust-green',
        bgColor: 'bg-trust-green/10'
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
        trend: { direction: 'up', value: '15%' }
      },
      {
        title: 'Implementation Time',
        value: '6-12 months',
        subtitle: 'Enterprise deployment',
        icon: Clock,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10'
      },
      {
        title: 'Performance Gain',
        value: '10x faster',
        subtitle: 'Autonomous Database',
        icon: Zap,
        color: 'text-attention-orange',
        bgColor: 'bg-attention-orange/10',
        trend: { direction: 'up', value: '200%' }
      },
      {
        title: 'Industry Recognition',
        value: '#1 Database',
        subtitle: 'Gartner Magic Quadrant',
        icon: Award,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10'
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
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stackmatch-navy text-sm">
                      {metric.title}
                    </h3>
                    {metric.trend && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs mt-1 ${
                          metric.trend.direction === 'up' 
                            ? 'bg-trust-green/10 text-trust-green' 
                            : 'bg-red-500/10 text-red-600'
                        }`}
                      >
                        <TrendingUp className={`w-3 h-3 mr-1 ${
                          metric.trend.direction === 'down' ? 'rotate-180' : ''
                        }`} />
                        {metric.trend.value}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-medium-gray">
                    {metric.subtitle}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}