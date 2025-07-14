'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListingProjectSummaryTab } from './listing-project-summary-tab'
import { ListingFullRequirementsTab } from './listing-full-requirements-tab'
import { ListingBusinessContextTab } from './listing-business-context-tab'
import { ListingBudgetEvaluationTab } from './listing-budget-evaluation-tab'
import { FileText, ClipboardList, Building2, DollarSign } from 'lucide-react'

interface ListingDetailTabsProps {
  listing: any
  activeTab: string
  setActiveTab: (tab: string) => void
  isOwner: boolean
  userType: 'buyer' | 'seller' | null
}

export function ListingDetailTabs({ 
  listing, 
  activeTab, 
  setActiveTab, 
  isOwner,
  userType 
}: ListingDetailTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full mb-6 h-auto p-1">
        <TabsTrigger value="summary" className="flex items-center gap-2 py-3">
          <FileText className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="requirements" className="flex items-center gap-2 py-3">
          <ClipboardList className="h-4 w-4" />
          <span>Requirements</span>
        </TabsTrigger>
        <TabsTrigger value="business" className="flex items-center gap-2 py-3">
          <Building2 className="h-4 w-4" />
          <span>Business</span>
        </TabsTrigger>
        <TabsTrigger value="budget" className="flex items-center gap-2 py-3">
          <DollarSign className="h-4 w-4" />
          <span>Budget</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-0">
        <ListingProjectSummaryTab listing={listing} />
      </TabsContent>

      <TabsContent value="requirements" className="mt-0">
        <ListingFullRequirementsTab listing={listing} />
      </TabsContent>

      <TabsContent value="business" className="mt-0">
        <ListingBusinessContextTab listing={listing} />
      </TabsContent>

      <TabsContent value="budget" className="mt-0">
        <ListingBudgetEvaluationTab listing={listing} isOwner={isOwner} />
      </TabsContent>
    </Tabs>
  )
}