'use client'

import { useState } from 'react'
import { GridPageLayout, useGridPageState } from '@/components/layouts/grid-page-layout'
import { PageHeader } from '@/components/ui/page-header'
import { DealRoomsFilters } from '@/components/deal-rooms/deal-rooms-filters'
import { DealRoomsStats } from '@/components/deal-rooms/deal-rooms-stats'
import { DealRoomsGrid } from '@/components/deal-rooms/deal-rooms-grid'
import { DealRoomsSidebar } from '@/components/deal-rooms/deal-rooms-sidebar'
import { Briefcase } from 'lucide-react'

export default function DealRoomsPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    sortBy,
    setSortBy
  } = useGridPageState({
    filters: { status: 'all', date: 'all' },
    sortBy: 'recent'
  })

  return (
    <GridPageLayout
      header={
        <PageHeader
          icon={Briefcase}
          title="Deal Rooms"
          description="Manage your active negotiations and project discussions"
        />
      }
      stats={<DealRoomsStats />}
      filters={
        <DealRoomsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={filters.status}
          setStatusFilter={(value) => setFilter('status', value)}
          dateFilter={filters.date}
          setDateFilter={(value) => setFilter('date', value)}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      }
      grid={(props) => (
        <DealRoomsGrid
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          searchQuery={searchQuery}
          statusFilter={filters.status}
          dateFilter={filters.date}
          sortBy={sortBy}
        />
      )}
      sidebar={<DealRoomsSidebar />}
    />
  )
}