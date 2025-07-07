'use client'

import { useState } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { BrowseListingsHeader } from '@/components/browse-listings/browse-listings-header'
import { BrowseListingsStats } from '@/components/browse-listings/browse-listings-stats'
import { BrowseListingsFilters } from '@/components/browse-listings/browse-listings-filters'
import { BrowseListingsGrid } from '@/components/browse-listings/browse-listings-grid'
import { BrowseListingsSidebar } from '@/components/browse-listings/browse-listings-sidebar'

export default function BrowseListingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedBudget, setSelectedBudget] = useState('all')
  const [selectedCompanySize, setSelectedCompanySize] = useState('all')
  const [selectedDeadline, setSelectedDeadline] = useState('all')
  const [selectedScope, setSelectedScope] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <BrowseListingsHeader />
        
        {/* Stats Dashboard */}
        <BrowseListingsStats />
        
        {/* Filters */}
        <BrowseListingsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          selectedCompanySize={selectedCompanySize}
          setSelectedCompanySize={setSelectedCompanySize}
          selectedDeadline={selectedDeadline}
          setSelectedDeadline={setSelectedDeadline}
          selectedScope={selectedScope}
          setSelectedScope={setSelectedScope}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        {/* Main Content */}
        <div className="flex gap-8 mt-8">
          {/* Listings Grid */}
          <div className="flex-1">
            <BrowseListingsGrid
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedIndustry={selectedIndustry}
              selectedBudget={selectedBudget}
              selectedCompanySize={selectedCompanySize}
              selectedDeadline={selectedDeadline}
              selectedScope={selectedScope}
              selectedLocation={selectedLocation}
              sortBy={sortBy}
            />
          </div>
          
          {/* Sidebar */}
          <div className="w-80 hidden xl:block">
            <BrowseListingsSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}