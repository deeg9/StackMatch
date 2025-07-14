'use client'

import { ReactNode, useState } from 'react'
import { UnifiedPageLayout } from './unified-page-layout'
import { cn } from '@/lib/utils'

// Types
export interface GridContentProps {
  searchQuery: string
  filters: Record<string, string>
  sortBy: string
}

export interface GridPageLayoutProps {
  header: ReactNode
  stats?: ReactNode
  filters: ReactNode
  grid: (props: GridContentProps) => ReactNode
  sidebar?: ReactNode
  showSidebar?: boolean
  className?: string
  contentClassName?: string
}

export interface UseGridPageStateReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: Record<string, string>
  setFilter: (key: string, value: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  resetFilters: () => void
}

// State management hook
export function useGridPageState(initialState?: {
  filters?: Record<string, string>
  sortBy?: string
}): UseGridPageStateReturn {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState(initialState?.filters || {})
  const [sortBy, setSortBy] = useState(initialState?.sortBy || 'recent')

  const setFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setSearchQuery('')
    setFilters(initialState?.filters || {})
    setSortBy(initialState?.sortBy || 'recent')
  }

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    sortBy,
    setSortBy,
    resetFilters
  }
}

// Layout component
export function GridPageLayout({
  header,
  stats,
  filters,
  grid,
  sidebar,
  showSidebar = true,
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
      <div className="mb-6">
        {filters}
      </div>

      {/* Main Content Grid */}
      <div className={cn(
        "grid gap-8",
        showSidebar && sidebar ? "lg:grid-cols-[1fr,320px]" : "grid-cols-1",
        contentClassName
      )}>
        {/* Content Area */}
        <div className="min-w-0">
          {grid({ searchQuery: '', filters: {}, sortBy: 'recent' })}
        </div>

        {/* Sidebar */}
        {showSidebar && sidebar && (
          <div className="space-y-6">
            {sidebar}
          </div>
        )}
      </div>
    </UnifiedPageLayout>
  )
}