'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
  sparklineData?: number[]
  showSparkline?: boolean
  animationDelay?: number
  onClick?: () => void
  className?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  sparklineData,
  showSparkline = true,
  animationDelay = 0,
  onClick,
  className
}: KPICardProps) {
  const TrendIcon = trend?.direction === 'up' ? ArrowUp : ArrowDown
  const isPositiveTrend = trend?.direction === 'up'
  
  return (
    <Card 
      className={cn(
        "border-2 transition-all duration-300 hover:shadow-lg animate-slide-up group cursor-pointer",
        borderColor,
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-medium-gray">
              {title}
            </p>
            <div className="flex items-center gap-3">
              <p className={cn("text-3xl font-bold group-hover:scale-105 transition-transform", color)}>
                {value}
              </p>
              {/* Mini Sparkline */}
              {showSparkline && sparklineData && (
                <div className="flex items-end gap-px h-8">
                  {sparklineData.map((point, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-1 rounded-sm transition-all duration-300 group-hover:opacity-80",
                        bgColor.replace('/10', '/30')
                      )}
                      style={{
                        height: `${(point / Math.max(...sparklineData)) * 100}%`,
                        animationDelay: `${idx * 50}ms`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            {(subtitle || trend) && (
              <div className="flex items-center gap-2">
                {subtitle && (
                  <p className="text-xs text-medium-gray">
                    {subtitle}
                  </p>
                )}
                {trend && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      isPositiveTrend 
                        ? 'text-trust-green bg-trust-green/10' 
                        : 'text-red-500 bg-red-50'
                    )}
                  >
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {trend.value}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-xl group-hover:scale-110 transition-transform relative overflow-hidden",
            bgColor
          )}>
            <Icon className={cn("w-6 h-6 relative z-10", color)} />
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-current" />
              <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-current" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}