'use client'

import { useState } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { DealRoomsHeader } from '@/components/deal-rooms/deal-rooms-header'
import { DealRoomsFilters } from '@/components/deal-rooms/deal-rooms-filters'
import { DealRoomsStats } from '@/components/deal-rooms/deal-rooms-stats'
import { DealRoomsGrid } from '@/components/deal-rooms/deal-rooms-grid'
import { DealRoomsSidebar } from '@/components/deal-rooms/deal-rooms-sidebar'

export default function DealRoomsPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <DealRoomsHeader />
        
        {/* Filters */}
        <DealRoomsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        {/* Stats Dashboard */}
        <DealRoomsStats />
        
        {/* Main Content */}
        <div className="flex gap-8 mt-8">
          {/* Deal Rooms Grid */}
          <div className="flex-1">
            <DealRoomsGrid
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              roleFilter={roleFilter}
              dateFilter={dateFilter}
              sortBy={sortBy}
            />
          </div>
          
          {/* Sidebar */}
          <div className="w-80 hidden xl:block">
            <DealRoomsSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}