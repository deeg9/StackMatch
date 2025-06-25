'use client'

import { useState } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { MyListingsHeader } from '@/components/my-listings/my-listings-header'
import { MyListingsStats } from '@/components/my-listings/my-listings-stats'
import { MyListingsFilters } from '@/components/my-listings/my-listings-filters'
import { MyListingsGrid } from '@/components/my-listings/my-listings-grid'
import { MyListingsSidebar } from '@/components/my-listings/my-listings-sidebar'

export default function MyListingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <MyListingsHeader />
        
        {/* Stats Dashboard */}
        <MyListingsStats />
        
        {/* Filters */}
        <MyListingsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        {/* Main Content */}
        <div className="flex gap-8 mt-8">
          {/* Listings Grid */}
          <div className="flex-1">
            <MyListingsGrid
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              sortBy={sortBy}
            />
          </div>
          
          {/* Sidebar */}
          <div className="w-80 hidden xl:block">
            <MyListingsSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}