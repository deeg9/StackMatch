'use client'

import { DashboardPortlet } from './dashboard-portlet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Building2, 
  Calendar, 
  Eye,
  Send,
  ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

// Mock data for seller's submitted proposals
const mockSellerProposals = [
  {
    id: 'prop-001',
    projectTitle: 'Enterprise CRM Implementation',
    buyerCompanyName: 'Innovate Corp',
    submittedDate: '2025-01-10',
    status: 'Viewed',
    proposedAmount: 125000,
  },
  {
    id: 'prop-002',
    projectTitle: 'Data Analytics Platform Selection',
    buyerCompanyName: 'Global Retail Inc.',
    submittedDate: '2025-01-08',
    status: 'Shortlisted',
    proposedAmount: 85000,
  },
  {
    id: 'prop-003',
    projectTitle: 'New HR Management System',
    buyerCompanyName: 'HealthWell Partners',
    submittedDate: '2025-01-05',
    status: 'Submitted',
    proposedAmount: 95000,
  },
]

export function SellerProposalsPortlet() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Viewed':
        return 'bg-blue-100 text-blue-700'
      case 'Shortlisted':
        return 'bg-green-100 text-green-700'
      case 'Submitted':
        return 'bg-gray-100 text-gray-700'
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-700'
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-700'
      case 'Rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (mockSellerProposals.length === 0) {
    return (
      <DashboardPortlet 
        title="Recent Proposals" 
        viewAllLink="/my-proposals"
        hoverBorderColor="hover:border-[#22C55E]"
      >
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-[#6B7280]" />
          </div>
          <p className="text-[#6B7280] mb-4">No proposals submitted yet</p>
          <p className="text-sm text-[#9CA3AF] mb-6">
            Browse active listings and submit proposals to win new business
          </p>
          <Link href="/browse-listings">
            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
              Browse Listings
            </Button>
          </Link>
        </div>
      </DashboardPortlet>
    )
  }

  return (
    <DashboardPortlet 
      title="Recent Proposals" 
      viewAllLink="/my-proposals"
      viewAllText="View All Proposals"
      hoverBorderColor="hover:border-[#22C55E]"
    >
      <div className="space-y-4">
        {mockSellerProposals.map((proposal, index) => (
          <div
            key={proposal.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header with Project Title and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                  {proposal.projectTitle}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-[#6B7280]">
                  <Building2 className="h-4 w-4" />
                  <span>{proposal.buyerCompanyName}</span>
                </div>
              </div>
              <Badge className={getStatusColor(proposal.status)}>
                {proposal.status}
              </Badge>
            </div>

            {/* Proposal Details */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium text-[#22C55E]">
                    {formatCurrency(proposal.proposedAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(proposal.submittedDate)}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <Link href={`/proposals/evaluate/${proposal.id}`}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-[#4A73CC] border-[#4A73CC] hover:bg-[#4A73CC] hover:text-white"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View My Proposal
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link at Bottom */}
      <div className="mt-6 text-center">
        <Link href="/my-proposals">
          <Button 
            variant="ghost" 
            className="text-[#22C55E] hover:text-[#16A34A] font-medium"
          >
            View All Submitted Proposals
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </DashboardPortlet>
  )
}