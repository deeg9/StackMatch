'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, Building2, DollarSign, Calendar, Users, ArrowRight, MoreVertical } from "lucide-react"
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
              className="p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200 cursor-pointer group animate-fade-in relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Actions dropdown menu */}
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-[#F3F4F6] transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 text-[#6B7280]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link 
                        href={`/my-listings/${listing.id}`}
                        className="cursor-pointer"
                      >
                        View Listing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href={`/my-listings/${listing.id}/edit`}
                        className="cursor-pointer"
                      >
                        Edit Listing
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 pr-8">
                {/* Title with status badge */}
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                    {listing.title}
                  </h3>
                  <Badge className={getStatusColor(listing.status)}>
                    {listing.status}
                  </Badge>
                </div>

                {/* Date information */}
                <div className="space-y-1 text-sm text-[#6B7280]">
                  <p>Created: {formatDate(listing.createdDate)}</p>
                  <p>Due: {formatDate(listing.dueDate)}</p>
                </div>

                {/* Bottom stats row - stacked layout */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  {/* Budget */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-[#6B7280]">
                      <DollarSign className="h-3 w-3" />
                      <span>Budget</span>
                    </div>
                    <p className="text-base font-semibold text-[#1A2B4C] mt-1">
                      {formatCompactBudget(listing.budget_value)}
                    </p>
                  </div>
                  
                  {/* Proposals */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-[#6B7280]">
                      <FileText className="h-3 w-3" />
                      <span>Proposals</span>
                    </div>
                    <p className="text-base font-semibold text-[#1A2B4C] mt-1">
                      {listing.proposalCount}
                    </p>
                  </div>
                  
                  {/* StackSpaces */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-[#6B7280]">
                      <Users className="h-3 w-3" />
                      <span>StackSpaces</span>
                    </div>
                    <p className="text-base font-semibold text-[#1A2B4C] mt-1">
                      {listing.stackspaceCount}
                    </p>
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