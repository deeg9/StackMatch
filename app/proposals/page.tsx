'use client'

import { GridPageLayout, useGridPageState } from '@/components/layouts/grid-page-layout'
import { PageHeader } from '@/components/ui/page-header'
import { ReceivedProposalsStats } from '@/components/received-proposals/received-proposals-stats'
import { ReceivedProposalsFilters } from '@/components/received-proposals/received-proposals-filters'
import { ReceivedProposalsGrid } from '@/components/received-proposals/received-proposals-grid'
import { ReceivedProposalsSidebar } from '@/components/received-proposals/received-proposals-sidebar'
import { MessageCircle } from 'lucide-react'

export default function ReceivedProposalsPage() {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter
  } = useGridPageState({
    filters: { status: 'all', listing: 'all' }
  })

  return (
    <GridPageLayout
      header={
        <PageHeader
          icon={MessageCircle}
          title="Received Proposals"
          description="Review, compare, and manage all proposals submitted by vendors"
        />
      }
      stats={<ReceivedProposalsStats />}
      filters={
        <ReceivedProposalsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={filters.status}
          setStatusFilter={(value) => setFilter('status', value)}
          listingFilter={filters.listing}
          setListingFilter={(value) => setFilter('listing', value)}
        />
      }
      grid={(props) => (
        <ReceivedProposalsGrid
          searchQuery={searchQuery}
          statusFilter={filters.status}
          listingFilter={filters.listing}
        />
      )}
      sidebar={<ReceivedProposalsSidebar />}
      contentClassName="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8"
    />
  )
}