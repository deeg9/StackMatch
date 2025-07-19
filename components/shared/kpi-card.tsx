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
  barColor?: string // New prop for explicit bar color
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
  barColor,
  sparklineData,
  showSparkline = true,
  animationDelay = 0,
  onClick,
  className
}: KPICardProps) {
  const TrendIcon = trend?.direction === 'up' ? ArrowUp : ArrowDown
  const isPositiveTrend = trend?.direction === 'up'
  
  // Extract the color for the vertical bar
  const getBarColor = () => {
    if (barColor) return barColor
    // Map common Tailwind color classes to their hex values
    const colorMap: Record<string, string> = {
      'bg-stackmatch-blue/10': '#4A73CC',
      'bg-trust-green/10': '#22C55E',
      'bg-attention-orange/10': '#F59E0B',
      'bg-information-blue/10': '#3B82F6',
      'bg-charcoal/10': '#374151',
      'bg-[#3B82F6]/10': '#3B82F6',
      'bg-[#16A34A]/10': '#16A34A',
      'bg-purple-100': '#9333EA',
      'bg-orange-100': '#F97316',
      'bg-yellow-500/10': '#EAB308'
    }
    return colorMap[bgColor] || '#4A73CC'
  }
  
  // Get the saturated icon color based on the tinted background color
  const getIconColor = () => {
    const iconColorMap: Record<string, string> = {
      'bg-stackmatch-blue/10': 'text-stackmatch-blue',
      'bg-trust-green/10': 'text-trust-green',
      'bg-attention-orange/10': 'text-attention-orange',
      'bg-information-blue/10': 'text-information-blue',
      'bg-charcoal/10': 'text-charcoal',
      'bg-[#3B82F6]/10': 'text-[#3B82F6]',
      'bg-[#16A34A]/10': 'text-[#16A34A]',
      'bg-purple-100': 'text-purple-600',
      'bg-orange-100': 'text-orange-600',
      'bg-yellow-500/10': 'text-yellow-600'
    }
    return iconColorMap[bgColor] || 'text-stackmatch-blue'
  }
  
  return (
    <Card 
      className={cn(
        "relative border transition-all duration-300 hover:shadow-lg animate-slide-up group cursor-pointer overflow-hidden",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onClick}
    >
      {/* Vertical colored bar on the left edge */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: getBarColor() }}
      />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-2xl font-bold text-stackmatch-navy">
              {value}
            </p>
            <p className="text-sm font-medium text-medium-gray">
              {title}
            </p>
            {(subtitle || trend) && (
              <div className="flex items-center gap-2 mt-2">
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
            "p-3 rounded-lg ml-4",
            bgColor
          )}>
            <Icon className={cn("w-6 h-6", getIconColor())} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}