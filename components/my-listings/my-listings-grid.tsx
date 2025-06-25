'use client'

import { useState, useEffect } from 'react'
import { ListingCard } from './listing-card'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'

interface MyListingsGridProps {
  searchQuery: string
  statusFilter: string
  sortBy: string
}

interface Listing {
  id: string
  title: string
  status: 'active' | 'draft' | 'in-review' | 'closed'
  category: string
  datePosted: string
  proposalDeadline: string
  views: number
  proposalsReceived: number
  dealRoomsCreated: number
  budgetRange?: string
  description?: string
}

export function MyListingsGrid({ searchQuery, statusFilter, sortBy }: MyListingsGridProps) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  // Mock listings data
  const mockListings: Listing[] = [
    {
      id: 'LST-001',
      title: 'CRM Implementation for Mid-Market Company',
      status: 'active',
      category: 'Customer Relationship Management',
      datePosted: 'Jan 15, 2024',
      proposalDeadline: 'Feb 28, 2024',
      views: 147,
      proposalsReceived: 8,
      dealRoomsCreated: 3,
      budgetRange: '$50,000 - $100,000',
      description: 'Looking for a comprehensive CRM solution to manage our growing customer base of 10,000+ contacts with advanced automation features.'
    },
    {
      id: 'LST-002',
      title: 'Analytics Platform Selection',
      status: 'active',
      category: 'Business Intelligence & Analytics',
      datePosted: 'Jan 20, 2024',
      proposalDeadline: 'Mar 15, 2024',
      views: 89,
      proposalsReceived: 5,
      dealRoomsCreated: 2,
      budgetRange: '$25,000 - $75,000',
      description: 'Need a modern analytics platform with real-time dashboards, predictive analytics, and integration capabilities.'
    },
    {
      id: 'LST-003',
      title: 'HR Management System Upgrade',
      status: 'active',
      category: 'Human Resources',
      datePosted: 'Jan 25, 2024',
      proposalDeadline: 'Mar 30, 2024',
      views: 124,
      proposalsReceived: 7,
      dealRoomsCreated: 4,
      budgetRange: '$30,000 - $80,000',
      description: 'Seeking to replace legacy HR system with modern cloud-based solution supporting payroll, benefits, and performance management.'
    },
    {
      id: 'LST-004',
      title: 'E-commerce Platform Migration',
      status: 'draft',
      category: 'E-commerce',
      datePosted: 'Jan 30, 2024',
      proposalDeadline: 'TBD',
      views: 0,
      proposalsReceived: 0,
      dealRoomsCreated: 0,
      budgetRange: '$75,000 - $150,000',
      description: 'Planning to migrate from legacy e-commerce platform to modern, scalable solution with advanced inventory management.'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchListings = async () => {
      setLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredListings = [...mockListings]

      // Apply status filter
      if (statusFilter !== 'all') {
        filteredListings = filteredListings.filter(listing => listing.status === statusFilter)
      }

      // Apply search filter
      if (searchQuery) {
        filteredListings = filteredListings.filter(listing =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Apply sorting
      switch (sortBy) {
        case 'recent':
          filteredListings.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
          break
        case 'oldest':
          filteredListings.sort((a, b) => new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime())
          break
        case 'name':
          filteredListings.sort((a, b) => a.title.localeCompare(b.title))
          break
        case 'proposals':
          filteredListings.sort((a, b) => b.proposalsReceived - a.proposalsReceived)
          break
        case 'deadline':
          filteredListings.sort((a, b) => {
            // Handle TBD deadlines
            if (a.proposalDeadline === 'TBD') return 1
            if (b.proposalDeadline === 'TBD') return -1
            return new Date(a.proposalDeadline).getTime() - new Date(b.proposalDeadline).getTime()
          })
          break
        default:
          break
      }

      setListings(filteredListings)
      setLoading(false)
    }

    fetchListings()
  }, [searchQuery, statusFilter, sortBy])

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg border-2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-medium-gray" />
        </div>
        
        <h3 className="text-xl font-semibold text-stackmatch-navy mb-2">
          {searchQuery || statusFilter !== 'all' ? 'No listings found' : 'No listings yet'}
        </h3>
        
        <p className="text-medium-gray mb-6 max-w-md mx-auto">
          {searchQuery || statusFilter !== 'all' 
            ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
            : 'Create your first listing to start receiving proposals from qualified vendors.'
          }
        </p>
        
        {!searchQuery && statusFilter === 'all' && (
          <Link href="/create-listing">
            <Button size="lg" className="bg-trust-green hover:bg-success-green text-white">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Listing
            </Button>
          </Link>
        )}
        
        {(searchQuery || statusFilter !== 'all') && (
          <Button 
            variant="outline" 
            onClick={() => {
              // This would be handled by parent component
              console.log('Clear filters')
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stackmatch-navy">
          {listings.length} {listings.length === 1 ? 'Listing' : 'Listings'}
          {statusFilter !== 'all' && (
            <span className="text-medium-gray ml-2">
              • {statusFilter.replace('-', ' ')}
            </span>
          )}
        </h2>
      </div>

      <div className="grid gap-6">
        {listings.map((listing, index) => (
          <div
            key={listing.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  )
}