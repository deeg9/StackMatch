'use client'

import { useState, useEffect } from 'react'
import { ListingOpportunityCard } from './listing-opportunity-card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

interface BrowseListingsGridProps {
  searchQuery: string
  selectedCategory: string
  selectedIndustry: string
  selectedBudget: string
  selectedCompanySize: string
  selectedDeadline: string
  selectedScope: string
  selectedLocation: string
  sortBy: string
}

export function BrowseListingsGrid({
  searchQuery,
  selectedCategory,
  selectedIndustry,
  selectedBudget,
  selectedCompanySize,
  selectedDeadline,
  selectedScope,
  selectedLocation,
  sortBy
}: BrowseListingsGridProps) {
  const [listings, setListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Mock data for demonstration
  const mockListings = [
    {
      id: '1',
      buyerCompany: 'Acme Solutions Inc.',
      title: 'Enterprise CRM Implementation',
      category: 'CRM Software',
      description: 'Looking for a comprehensive CRM solution to streamline our sales and customer service operations across multiple departments. Must integrate with existing ERP and marketing automation tools.',
      keyRequirements: ['Salesforce Integration', 'Mobile App Required', 'Cloud-based', 'Multi-language Support', 'API Access'],
      companySize: '500-1000 employees',
      industry: 'Financial Services',
      budgetMin: 100000,
      budgetMax: 250000,
      budgetDisclosed: true,
      proposalDeadline: '2025-07-30',
      projectStart: 'Q3 2025',
      projectScope: 'New Implementation',
      location: 'North America',
      isVerified: true,
      isPremium: true,
      viewCount: 245,
      proposalCount: 12,
      matchScore: 92,
      status: 'new' as const
    },
    {
      id: '2',
      buyerCompany: 'Global Manufacturing Corp',
      title: 'ERP System Migration & Upgrade',
      category: 'ERP Software',
      description: 'Migrating from legacy on-premise ERP to modern cloud-based solution. Need experienced vendor with manufacturing industry expertise and proven migration methodology.',
      keyRequirements: ['SAP Experience', 'Data Migration', 'Training Included', 'Manufacturing Module'],
      companySize: '1000-5000 employees',
      industry: 'Manufacturing',
      budgetMin: 500000,
      budgetMax: 1000000,
      budgetDisclosed: true,
      proposalDeadline: '2025-07-15',
      projectStart: 'Q4 2025',
      projectScope: 'Migration',
      location: 'United States',
      isVerified: true,
      isPremium: false,
      viewCount: 189,
      proposalCount: 8,
      matchScore: 87,
      status: 'closing-soon' as const
    },
    {
      id: '3',
      buyerCompany: 'HealthTech Innovations',
      title: 'Custom Patient Portal Development',
      category: 'Custom Development',
      description: 'Building a HIPAA-compliant patient portal with telehealth capabilities, appointment scheduling, and integration with existing EMR systems.',
      keyRequirements: ['HIPAA Compliance', 'React/Node.js', 'Video Conferencing', 'EMR Integration', 'Mobile Responsive'],
      companySize: '201-500 employees',
      industry: 'Healthcare',
      budgetMin: 150000,
      budgetMax: 300000,
      budgetDisclosed: true,
      proposalDeadline: '2025-08-10',
      projectStart: 'Q3 2025',
      projectScope: 'Custom Development',
      location: 'Remote',
      isVerified: true,
      isPremium: true,
      viewCount: 312,
      proposalCount: 15,
      matchScore: 95,
      status: 'active' as const
    },
    {
      id: '4',
      buyerCompany: 'Retail Solutions Ltd',
      title: 'E-commerce Platform Implementation',
      category: 'E-commerce',
      description: 'Implementing modern e-commerce platform with omnichannel capabilities, inventory management, and advanced analytics.',
      keyRequirements: ['Shopify Plus', 'POS Integration', 'Inventory Sync', 'Multi-currency'],
      companySize: '51-200 employees',
      industry: 'Retail',
      budgetMin: 75000,
      budgetMax: 150000,
      budgetDisclosed: true,
      proposalDeadline: '2025-08-20',
      projectStart: 'Q4 2025',
      projectScope: 'New Implementation',
      location: 'Canada',
      isVerified: false,
      isPremium: false,
      viewCount: 156,
      proposalCount: 6,
      matchScore: 78,
      status: 'active' as const
    },
    {
      id: '5',
      buyerCompany: 'TechStart Inc.',
      title: 'Marketing Automation Setup',
      category: 'Marketing Automation',
      description: 'Need comprehensive marketing automation solution with email campaigns, lead scoring, and CRM integration for B2B SaaS company.',
      keyRequirements: ['HubSpot Expertise', 'Lead Scoring', 'A/B Testing', 'Salesforce Integration'],
      companySize: '11-50 employees',
      industry: 'Technology',
      budgetMin: 25000,
      budgetMax: 50000,
      budgetDisclosed: true,
      proposalDeadline: '2025-08-05',
      projectStart: 'ASAP',
      projectScope: 'New Implementation',
      location: 'North America',
      isVerified: true,
      isPremium: false,
      viewCount: 98,
      proposalCount: 4,
      matchScore: 82,
      status: 'active' as const
    },
    {
      id: '6',
      buyerCompany: 'Education First Academy',
      title: 'Learning Management System',
      category: 'Education Technology',
      description: 'Implementing LMS for 5000+ students with course management, gradebook, parent portal, and virtual classroom capabilities.',
      keyRequirements: ['Canvas/Moodle Experience', 'Parent Portal', 'Mobile Apps', 'SSO Integration'],
      companySize: '201-500 employees',
      industry: 'Education',
      budgetMin: 80000,
      budgetMax: 120000,
      budgetDisclosed: false,
      proposalDeadline: '2025-07-25',
      projectScope: 'New Implementation',
      location: 'United States',
      isVerified: true,
      isPremium: true,
      viewCount: 267,
      proposalCount: 9,
      matchScore: 88,
      status: 'active' as const
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchListings = async () => {
      setIsLoading(true)
      setTimeout(() => {
        // Apply filters to mock data
        let filteredListings = [...mockListings]
        
        // Search filter
        if (searchQuery) {
          filteredListings = filteredListings.filter(listing =>
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        // Category filter
        if (selectedCategory !== 'all') {
          filteredListings = filteredListings.filter(listing =>
            listing.category.toLowerCase().includes(selectedCategory.toLowerCase())
          )
        }

        // Industry filter
        if (selectedIndustry !== 'all') {
          filteredListings = filteredListings.filter(listing =>
            listing.industry.toLowerCase().includes(selectedIndustry.toLowerCase())
          )
        }

        // Sort
        if (sortBy === 'ending-soon') {
          filteredListings.sort((a, b) => 
            new Date(a.proposalDeadline).getTime() - new Date(b.proposalDeadline).getTime()
          )
        } else if (sortBy === 'highest-budget') {
          filteredListings.sort((a, b) => (b.budgetMax || 0) - (a.budgetMax || 0))
        } else if (sortBy === 'relevant') {
          filteredListings.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        }

        setListings(filteredListings)
        setIsLoading(false)
        setHasMore(false) // For demo purposes
      }, 1000)
    }

    fetchListings()
  }, [searchQuery, selectedCategory, selectedIndustry, selectedBudget, selectedCompanySize, selectedDeadline, selectedScope, selectedLocation, sortBy])

  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-stackmatch-blue" />
      </div>
    )
  }

  if (!isLoading && listings.length === 0) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-12 w-12 text-medium-gray mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-charcoal mb-2">No listings found</h3>
        <p className="text-medium-gray">Try adjusting your filters or search criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-medium-gray">
          Showing <span className="font-semibold text-charcoal">{listings.length}</span> opportunities
        </p>
        <p className="text-sm text-stackmatch-blue font-medium">
          {listings.filter(l => l.matchScore && l.matchScore >= 80).length} high matches
        </p>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {listings.map((listing, index) => (
          <div
            key={listing.id}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ListingOpportunityCard listing={listing} />
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Opportunities'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}