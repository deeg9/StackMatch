'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, ArrowRight, DollarSign, TrendingUp, FileText } from "lucide-react"
import Link from "next/link"
import { getProposalStatusColor, formatCompactBudget } from "./utils"

interface Proposal {
  id: string
  sellerName: string
  sellerAvatar: string | null
  proposedBudget: number
  listingTitle: string
  status: string
  submittedAt: string
}

// Mock data for UI/UX design with new fields
const mockRecentProposals = [
  {
    id: 'proposal-1',
    sellerName: 'Salesforce Inc.',
    sellerAvatar: '/logos/salesforce.png',
    proposedBudget: 125000,
    proposed_cost: 95000,
    match_score: 92,
    listingTitle: 'For: New Enterprise CRM Platform',
    status: 'Under Review',
    submittedAt: '2025-01-09'
  },
  {
    id: 'proposal-2',
    sellerName: 'Okta',
    sellerAvatar: '/logos/okta.png',
    proposedBudget: 32000,
    proposed_cost: 28500,
    match_score: 88,
    listingTitle: 'For: Identity Management Solution',
    status: 'Under Review',
    submittedAt: '2025-01-08'
  },
  {
    id: 'proposal-3',
    sellerName: 'Workday',
    sellerAvatar: '/logos/workday.png',
    proposedBudget: 82500,
    proposed_cost: 78000,
    match_score: 95,
    listingTitle: 'For: Upgrade HR & Payroll System',
    status: 'Under Review',
    submittedAt: '2025-01-10'
  },
]

interface RecentProposalsPortletProps {
  proposals: Proposal[]
  loading?: boolean
  viewAllLink?: string
  maxItems?: number
  emptyMessage?: string
  emptySubMessage?: string
}

export function RecentProposalsPortlet({
  proposals,
  loading = false,
  viewAllLink = "/proposals",
  maxItems = 5,
  emptyMessage = "No proposals received yet",
  emptySubMessage = "Create listings to start receiving proposals from sellers"
}: RecentProposalsPortletProps) {
  // Use mock data instead of passed proposals for UI/UX design
  const displayProposals = mockRecentProposals.slice(0, maxItems)

  return (
    <Card className="border-2 hover:border-[#22C55E] transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-[#1A2B4C]">Proposals</CardTitle>
        <Link href={viewAllLink}>
          <Button variant="ghost" size="sm" className="text-[#22C55E] hover:text-[#16A34A]">
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
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : false ? ( // Always show populated state with mock data
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-[#D1D5DB] mx-auto mb-4" />
            <p className="text-[#6B7280] mb-4">{emptyMessage}</p>
            <p className="text-sm text-[#6B7280]">{emptySubMessage}</p>
          </div>
        ) : (
          displayProposals.map((proposal: any, index) => (
            <div
              key={proposal.id}
              className="p-4 border rounded-lg hover:bg-[#F9FAFB] transition-all duration-200 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={proposal.sellerAvatar || ''} />
                  <AvatarFallback className="bg-[#4A73CC] text-white">
                    {proposal.sellerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#1A2B4C] group-hover:text-[#22C55E] transition-colors">
                      {proposal.sellerName}
                    </h4>
                    <Badge className={getProposalStatusColor(proposal.status)}>
                      {proposal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6B7280]">
                    {proposal.listingTitle}
                  </p>
                  
                  {/* New bottom stats row */}
                  <div className="flex items-center gap-6 text-sm pt-1">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-[#6B7280]" />
                      <span className="font-medium text-[#1A2B4C]">
                        Proposed Cost: {formatCompactBudget(proposal.proposed_cost)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-[#6B7280]" />
                      <span className="font-medium text-[#1A2B4C]">
                        Match: {proposal.match_score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-[#6B7280]" />
                      <span className="font-medium text-[#1A2B4C]">
                        Status: {proposal.status}
                      </span>
                    </div>
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