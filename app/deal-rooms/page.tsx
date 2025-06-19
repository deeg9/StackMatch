'use client'

import { useState } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { DealRoomsHeader } from '@/components/deal-rooms/deal-rooms-header'
import { DealRoomsStats } from '@/components/deal-rooms/deal-rooms-stats'
import { DealRoomsGrid } from '@/components/deal-rooms/deal-rooms-grid'

export default function DealRoomsPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Clean Header */}
        <DealRoomsHeader />
        
        {/* Three Essential KPIs */}
        <DealRoomsStats />
        
        {/* Unified Deal Rooms Grid with Integrated Navigation */}
        <DealRoomsGrid
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
    </div>
  )
}