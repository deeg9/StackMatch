'use client'

import { RecentListingsPortlet, RecentProposalsPortlet, DashboardPortlet } from './index'

// Example: Using portlets in a seller context
export function SellerDashboardExample() {
  const sellerListings = [
    {
      id: '1',
      title: 'Enterprise CRM Opportunity',
      status: 'active',
      category: 'CRM Software',
      budgetMin: 100000,
      budgetMax: 250000,
      createdAt: '2024-01-28',
      proposalCount: 12
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      <RecentListingsPortlet
        listings={sellerListings}
        viewAllLink="/opportunities"
        showCreateButton={false}
        maxItems={3}
      />
    </div>
  )
}

// Example: Using portlets in a company profile
export function CompanyProfileExample() {
  const companyProposals = [
    {
      id: '1',
      sellerName: 'TechCorp Solutions',
      sellerAvatar: null,
      proposedBudget: 125000,
      listingTitle: 'ERP Implementation',
      status: 'accepted',
      submittedAt: '1 day ago'
    }
  ]

  return (
    <RecentProposalsPortlet
      proposals={companyProposals}
      viewAllLink={`/company/techcorp/proposals`}
      emptyMessage="No proposals for this company"
      emptySubMessage="This company hasn't submitted any proposals yet"
    />
  )
}

// Example: Custom portlet using the wrapper
export function CustomMetricsPortlet() {
  return (
    <DashboardPortlet
      title="Performance Metrics"
      viewAllLink="/analytics"
      hoverBorderColor="hover:border-[#F59E0B]"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 border rounded">
          <span>Conversion Rate</span>
          <span className="font-bold">24.5%</span>
        </div>
        <div className="flex justify-between items-center p-3 border rounded">
          <span>Average Deal Size</span>
          <span className="font-bold">$125,000</span>
        </div>
        <div className="flex justify-between items-center p-3 border rounded">
          <span>Response Time</span>
          <span className="font-bold">2.5 hours</span>
        </div>
      </div>
    </DashboardPortlet>
  )
}

// Example: Mini version for sidebars
export function SidebarListingsPortlet() {
  const miniListings = [
    {
      id: '1',
      title: 'Quick CRM Setup',
      status: 'active',
      category: 'CRM',
      budgetMin: 5000,
      budgetMax: 10000,
      createdAt: '2024-01-30',
      proposalCount: 3
    }
  ]

  return (
    <div className="max-w-sm">
      <RecentListingsPortlet
        listings={miniListings}
        maxItems={2}
        viewAllLink="/my-listings"
        showCreateButton={false}
      />
    </div>
  )
}