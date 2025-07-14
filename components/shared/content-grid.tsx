'use client'

import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentGridProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  loading?: boolean
  emptyState?: ReactNode
  className?: string
  gridClassName?: string
  columns?: 1 | 2 | 3
}

export function ContentGrid<T>({
  items,
  renderItem,
  loading = false,
  emptyState,
  className,
  gridClassName,
  columns = 1
}: ContentGridProps<T>) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-stackmatch-blue" />
        <span className="ml-2 text-medium-gray">Loading...</span>
      </div>
    )
  }

  if (items.length === 0 && emptyState) {
    return (
      <div className={cn("py-12", className)}>
        {emptyState}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn(
        "grid gap-4",
        gridCols[columns],
        gridClassName
      )}>
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Default empty state component
export function DefaultEmptyState({ 
  title = "No items found",
  description = "Try adjusting your filters or search criteria",
  icon: Icon,
  action
}: {
  title?: string
  description?: string
  icon?: any
  action?: ReactNode
}) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <Icon className="h-12 w-12 text-medium-gray/50 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-medium-gray mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  )
}