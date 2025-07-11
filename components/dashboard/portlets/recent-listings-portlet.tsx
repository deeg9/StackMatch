'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Building2, DollarSign, Calendar, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getStatusColor, formatBudget } from "./utils"

interface Listing {
  id: string
  title: string
  status: string
  category: string
  budgetMin: number | null
  budgetMax: number | null
  createdAt: string
  proposalCount: number
}

// Mock data for UI/UX design
const mockRecentListings = [
  {
    id: 'listing-1',
    title: 'New Enterprise CRM Platform',
    status: 'Due: In 15 Days',
    category: 'CRM Software',
    budgetMin: 100000,
    budgetMax: 150000,
    createdAt: '2025-01-10',
    proposalCount: 3
  },
  {
    id: 'listing-2',
    title: 'Upgrade HR & Payroll System',
    status: 'Due: In 2 Days',
    category: 'HRIS',
    budgetMin: 75000,
    budgetMax: 90000,
    createdAt: '2025-01-09',
    proposalCount: 5
  },
  {
    id: 'listing-3',
    title: 'Cybersecurity Compliance Audit',
    status: '5 Proposals Received',
    category: 'Security Services',
    budgetMin: 25000,
    budgetMax: 40000,
    createdAt: '2025-01-08',
    proposalCount: 5
  },
]

interface RecentListingsPortletProps {
  listings: Listing[]
  loading?: boolean
  viewAllLink?: string
  maxItems?: number
  showCreateButton?: boolean
  createLink?: string
}

export function RecentListingsPortlet({
  listings,
  loading = false,
  viewAllLink = "/my-listings",
  maxItems = 5,
  showCreateButton = true,
  createLink = "/create-listing"
}: RecentListingsPortletProps) {
  // Use mock data instead of passed listings for UI/UX design
  const displayListings = mockRecentListings.slice(0, maxItems)

  return (
    <Card className="border-2 hover:border-[#4A73CC] transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Recent Listings</CardTitle>
        <Link href={viewAllLink}>
          <Button variant="ghost" size="sm" className="text-[#4A73CC] hover:text-[#1A2B4C]">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : displayListings.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-[#D1D5DB] mx-auto mb-4" />
            <p className="text-[#6B7280] mb-4">No listings yet</p>
            {showCreateButton && (
              <Link href={createLink}>
                <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
                  Create Your First Listing
                </Button>
              </Link>
            )}
          </div>
        ) : (
          displayListings.map((listing, index) => (
            <div
              key={listing.id}
              className="p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-3">
                {/* Line 1: Primary Information & Key Constraints */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                      {listing.title}
                    </h3>
                    <Badge className={listing.status.includes('Due') ? (listing.status.includes('2 Days') ? 'bg-[#F59E0B] text-white' : 'bg-[#22C55E] text-white') : 'bg-[#22C55E] text-white'}>
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-[#1A2B4C]">
                    <span className="flex items-center font-medium">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatBudget(listing.budgetMin, listing.budgetMax)}
                    </span>
                    <span className="flex items-center font-medium">
                      <Calendar className="h-3 w-3 mr-1" />
                      {listing.status.includes('Due') ? listing.status.replace('Due: ', '') : 'In 15 Days'}
                    </span>
                  </div>
                </div>

                {/* Line 2: Context & Engagement Metrics */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280] flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {listing.category}
                  </span>
                  <div className="flex items-center space-x-4 text-sm text-[#6B7280]">
                    <span className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {listing.proposalCount} Proposals
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      2 Deal Rooms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}