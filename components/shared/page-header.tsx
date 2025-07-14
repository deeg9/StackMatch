'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  icon?: LucideIcon | ReactNode
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
  iconClassName?: string
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
  className,
  iconClassName
}: PageHeaderProps) {
  const isIconComponent = typeof Icon === 'function'

  return (
    <div className={cn("text-center", className)}>
      {/* Icon */}
      {Icon && (
        <div className="flex justify-center mb-4">
          {isIconComponent ? (
            <Icon className={cn(
              "h-16 w-16 text-stackmatch-blue",
              iconClassName
            )} />
          ) : (
            Icon
          )}
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-stackmatch-navy mb-2">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg text-medium-gray max-w-2xl mx-auto mb-6">
          {subtitle}
        </p>
      )}

      {/* Actions */}
      {actions && (
        <div className="flex justify-center gap-4 mt-6">
          {actions}
        </div>
      )}
    </div>
  )
}