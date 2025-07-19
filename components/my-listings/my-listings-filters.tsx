'use client'

import { ListControlPanel } from '@/components/ui/list-control-panel'

interface MyListingsFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export function MyListingsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}: MyListingsFiltersProps) {
  const statusTabs = [
    { id: 'all', label: 'All', count: 4 },
    { id: 'active', label: 'Active', count: 3 },
    { id: 'draft', label: 'Draft', count: 1 },
    { id: 'in-review', label: 'In Review', count: 0 },
    { id: 'closed', label: 'Closed', count: 0 }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'proposals', label: 'Most Proposals' },
    { value: 'deadline', label: 'Deadline Soon' }
  ]

  const activeFilters = []
  if (searchQuery) {
    activeFilters.push({
      type: 'search',
      label: `Search: "${searchQuery}"`,
      value: searchQuery
    })
  }
  if (statusFilter !== 'all') {
    const statusLabel = statusTabs.find(t => t.id === statusFilter)?.label || statusFilter
    activeFilters.push({
      type: 'status',
      label: `Status: ${statusLabel}`,
      value: statusFilter
    })
  }

  return (
    <ListControlPanel
      searchPlaceholder="Search listings by name or keyword..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortOptions={sortOptions}
      sortBy={sortBy}
      onSortChange={setSortBy}
      statusTabs={statusTabs}
      activeStatus={statusFilter}
      onStatusChange={setStatusFilter}
      activeFilters={activeFilters}
      onClearFilter={(filter) => {
        if (filter.type === 'search') {
          setSearchQuery('')
        } else if (filter.type === 'status') {
          setStatusFilter('all')
        }
      }}
      onClearAllFilters={() => {
        setSearchQuery('')
        setStatusFilter('all')
      }}
    />
  )
}