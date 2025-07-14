'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'

interface ReceivedProposalsFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  listingFilter: string
  setListingFilter: (listing: string) => void
}

interface Listing {
  id: string
  title: string
  proposalCount: number
}

export function ReceivedProposalsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  listingFilter,
  setListingFilter
}: ReceivedProposalsFiltersProps) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/my-listings')
        
        if (response.ok) {
          const data = await response.json()
          const listingsWithProposals = data.map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            proposalCount: Math.floor(Math.random() * 8) + 1 // Mock proposal count
          }))
          setListings(listingsWithProposals)
        } else {
          // Fallback to mock data if API fails
          console.warn('Listings API failed, using mock data')
          setListings([
            { id: 'TEST', title: 'CRM Implementation for Mid-Market Company', proposalCount: 6 },
            { id: 'TEST2', title: 'Analytics Platform Selection', proposalCount: 4 },
            { id: 'TEST3', title: 'HR Management System Upgrade', proposalCount: 5 },
            { id: 'TEST4', title: 'Cloud Infrastructure Migration', proposalCount: 3 }
          ])
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
        // Fallback to mock data
        setListings([
          { id: 'TEST', title: 'CRM Implementation for Mid-Market Company', proposalCount: 6 },
          { id: 'TEST2', title: 'Analytics Platform Selection', proposalCount: 4 },
          { id: 'TEST3', title: 'HR Management System Upgrade', proposalCount: 5 },
          { id: 'TEST4', title: 'Cloud Infrastructure Migration', proposalCount: 3 }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  const statusTabs = [
    { key: 'all', label: 'All', count: 18 },
    { key: 'pending_review', label: 'Pending Review', count: 7 },
    { key: 'in_discussion', label: 'In Discussion', count: 6 },
    { key: 'accepted', label: 'Accepted', count: 3 },
    { key: 'archived', label: 'Archived', count: 2 }
  ]

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setListingFilter('all')
  }

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || listingFilter !== 'all'

  return (
    <div className="space-y-6 mb-8">
      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
          <Input
            placeholder="Search by vendor name or listing title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-2 focus:border-stackmatch-blue"
          />
        </div>

        {/* Filter by Listing Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-medium-gray" />
          <Select value={listingFilter} onValueChange={setListingFilter}>
            <SelectTrigger className="w-80 border-2 focus:border-stackmatch-blue">
              <SelectValue placeholder="Filter by Listing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Listings</SelectItem>
              {listings.map((listing) => (
                <SelectItem key={listing.id} value={listing.id}>
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate max-w-[200px]">{listing.title}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {listing.proposalCount}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2 border-medium-gray text-medium-gray hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <Button
            key={tab.key}
            variant={statusFilter === tab.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 ${
              statusFilter === tab.key 
                ? 'bg-stackmatch-blue hover:bg-stackmatch-navy text-white' 
                : 'border-light-gray text-charcoal hover:border-stackmatch-blue hover:text-stackmatch-blue'
            }`}
          >
            <span>{tab.label}</span>
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                statusFilter === tab.key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-light-gray text-charcoal'
              }`}
            >
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-light-gray">
          <span className="text-sm text-medium-gray">Active filters:</span>
          
          {searchQuery && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Search: "{searchQuery}"</span>
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-600" 
                onClick={() => setSearchQuery('')}
              />
            </Badge>
          )}
          
          {statusFilter !== 'all' && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Status: {statusTabs.find(t => t.key === statusFilter)?.label}</span>
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-600" 
                onClick={() => setStatusFilter('all')}
              />
            </Badge>
          )}
          
          {listingFilter !== 'all' && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Listing: {listings.find(l => l.id === listingFilter)?.title?.substring(0, 30)}...</span>
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-600" 
                onClick={() => setListingFilter('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}