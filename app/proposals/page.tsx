'use client'

import { useState } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { ReceivedProposalsHeader } from '@/components/received-proposals/received-proposals-header'
import { ReceivedProposalsStats } from '@/components/received-proposals/received-proposals-stats'
import { ReceivedProposalsFilters } from '@/components/received-proposals/received-proposals-filters'
import { ReceivedProposalsGrid } from '@/components/received-proposals/received-proposals-grid'
import { ReceivedProposalsSidebar } from '@/components/received-proposals/received-proposals-sidebar'

export default function ReceivedProposalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [listingFilter, setListingFilter] = useState('all')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ReceivedProposalsHeader />
        
        {/* Stats Dashboard */}
        <ReceivedProposalsStats />
        
        {/* Filters */}
        <ReceivedProposalsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          listingFilter={listingFilter}
          setListingFilter={setListingFilter}
        />
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Proposals Grid */}
          <div className="lg:col-span-3">
            <ReceivedProposalsGrid
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              listingFilter={listingFilter}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <ReceivedProposalsSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}