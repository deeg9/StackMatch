'use client'

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatItem {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  color?: string
  bgColor?: string
}

interface StatsDashboardProps {
  stats: StatItem[]
  className?: string
  columns?: 2 | 3 | 4 | 5 | 6
}

export function StatsDashboard({ 
  stats, 
  className,
  columns = 4 
}: StatsDashboardProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }

  return (
    <div className={cn(
      "grid gap-4",
      gridCols[columns],
      className
    )}>
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="border-2 hover:border-stackmatch-blue transition-all duration-300 hover:shadow-md"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "p-2 rounded-lg",
                stat.bgColor || "bg-stackmatch-blue/10"
              )}>
                <stat.icon className={cn(
                  "h-5 w-5",
                  stat.color || "text-stackmatch-blue"
                )} />
              </div>
              {stat.trend && (
                <span className={cn(
                  "text-xs font-medium",
                  stat.trendUp ? "text-trust-green" : "text-medium-gray"
                )}>
                  {stat.trend}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-stackmatch-navy mb-1">
              {stat.value}
            </h3>
            <p className="text-xs text-medium-gray">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}