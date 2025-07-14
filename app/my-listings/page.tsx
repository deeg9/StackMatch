'use client'

import { GridPageLayout, useGridPageState } from '@/components/layouts/grid-page-layout'
import { MyListingsHeader } from '@/components/my-listings/my-listings-header'
import { MyListingsStats } from '@/components/my-listings/my-listings-stats'
import { MyListingsFilters } from '@/components/my-listings/my-listings-filters'
import { MyListingsGrid } from '@/components/my-listings/my-listings-grid'
import { MyListingsSidebar } from '@/components/my-listings/my-listings-sidebar'

export default function MyListingsPage() {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    sortBy,
    setSortBy
  } = useGridPageState({
    filters: { status: 'all' },
    sortBy: 'recent'
  })

  return (
    <GridPageLayout
      header={<MyListingsHeader />}
      stats={<MyListingsStats />}
      filters={
        <MyListingsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={filters.status}
          setStatusFilter={(value) => setFilter('status', value)}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      }
      grid={(props) => (
        <MyListingsGrid
          searchQuery={searchQuery}
          statusFilter={filters.status}
          sortBy={sortBy}
        />
      )}
      sidebar={<MyListingsSidebar />}
    />
  )
}