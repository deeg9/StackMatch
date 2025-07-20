'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface SidebarWidgetProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function SidebarWidget({ 
  title, 
  icon: Icon, 
  children, 
  actionLabel,
  onAction,
  className 
}: SidebarWidgetProps) {
  return (
    <Card className={cn(
      "border-slate-200 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        {actionLabel && onAction && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-stackmatch-blue hover:text-stackmatch-navy"
            onClick={onAction}
          >
            {actionLabel}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}