'use client'

import { ReactNode } from 'react'
import { UnifiedPageLayout } from './unified-page-layout'
import { cn } from '@/lib/utils'

interface GridPageLayoutProps {
  header: ReactNode
  stats?: ReactNode
  filters?: ReactNode
  content: ReactNode
  sidebar?: ReactNode
  className?: string
  contentClassName?: string
}

export function GridPageLayout({
  header,
  stats,
  filters,
  content,
  sidebar,
  className,
  contentClassName
}: GridPageLayoutProps) {
  return (
    <UnifiedPageLayout className={className}>
      {/* Header Section */}
      <div className="mb-8">
        {header}
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="mb-8">
          {stats}
        </div>
      )}

      {/* Filters Section */}
      {filters && (
        <div className="mb-6">
          {filters}
        </div>
      )}

      {/* Main Content Grid */}
      <div className={cn(
        "grid gap-8",
        sidebar ? "lg:grid-cols-[1fr,320px]" : "grid-cols-1",
        contentClassName
      )}>
        {/* Content Area */}
        <div className="min-w-0">
          {content}
        </div>

        {/* Sidebar */}
        {sidebar && (
          <div className="space-y-6">
            {sidebar}
          </div>
        )}
      </div>
    </UnifiedPageLayout>
  )
}