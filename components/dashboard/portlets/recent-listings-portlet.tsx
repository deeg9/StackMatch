'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Building2, DollarSign, Calendar, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getStatusColor, formatBudget, getListingStatusDotColor, formatCompactBudget, formatDate } from "./utils"

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

// Mock data for UI/UX design with new fields
const mockRecentListings = [
  {
    id: 'listing-1',
    title: 'New Enterprise CRM Platform',
    status: 'Active',
    category: 'CRM Software',
    budgetMin: 100000,
    budgetMax: 150000,
    budget_value: 105000,
    createdDate: '2025-07-01',
    dueDate: '2025-08-02',
    createdAt: '2025-01-10',
    proposalCount: 5,
    stackspaceCount: 2
  },
  {
    id: 'listing-2',
    title: 'Upgrade HR & Payroll System',
    status: 'In Review',
    category: 'HRIS',
    budgetMin: 75000,
    budgetMax: 90000,
    budget_value: 82500,
    createdDate: '2025-06-15',
    dueDate: '2025-07-20',
    createdAt: '2025-01-09',
    proposalCount: 3,
    stackspaceCount: 1
  },
  {
    id: 'listing-3',
    title: 'Cybersecurity Compliance Audit',
    status: 'Closed',
    category: 'Security Services',
    budgetMin: 25000,
    budgetMax: 40000,
    budget_value: 32500,
    createdDate: '2025-05-10',
    dueDate: '2025-06-15',
    createdAt: '2025-01-08',
    proposalCount: 8,
    stackspaceCount: 3
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
        <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Listings</CardTitle>
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
          displayListings.map((listing: any, index) => (
            <div
              key={listing.id}
              className="p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-3">
                {/* Title with status dot */}
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getListingStatusDotColor(listing.status) }}
                  />
                  <h3 className="font-bold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                    {listing.title}
                  </h3>
                </div>

                {/* Date information */}
                <div className="space-y-1 text-sm text-[#6B7280]">
                  <p>Created: {formatDate(listing.createdDate)}</p>
                  <p>Due: {formatDate(listing.dueDate)}</p>
                </div>

                {/* Bottom stats row */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-[#6B7280]" />
                    <span className="font-medium text-[#1A2B4C]">
                      Budget: {formatCompactBudget(listing.budget_value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-[#6B7280]" />
                    <span className="font-medium text-[#1A2B4C]">
                      {listing.proposalCount} Proposals
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-[#6B7280]" />
                    <span className="font-medium text-[#1A2B4C]">
                      {listing.stackspaceCount} StackSpaces
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