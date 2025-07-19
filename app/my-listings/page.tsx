'use client'

import { GridPageLayout, useGridPageState } from '@/components/layouts/grid-page-layout'
import { PageHeader } from '@/components/ui/page-header'
import { MyListingsStats } from '@/components/my-listings/my-listings-stats'
import { MyListingsFilters } from '@/components/my-listings/my-listings-filters'
import { MyListingsGrid } from '@/components/my-listings/my-listings-grid'
import { MyListingsSidebar } from '@/components/my-listings/my-listings-sidebar'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
      header={
        <>
          <PageHeader
            icon={FileText}
            title="My Listings"
            description="Create, manage, and track all your software and service listings"
          />
          <div className="text-center mb-8">
            <Link href="/create-listing">
              <Button 
                size="lg" 
                className="bg-trust-green hover:bg-success-green text-white transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Listing
              </Button>
            </Link>
          </div>
        </>
      }
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