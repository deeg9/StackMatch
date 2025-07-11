'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListingProjectSummaryTab } from './listing-project-summary-tab'
import { ListingFullRequirementsTab } from './listing-full-requirements-tab'
import { ListingBusinessContextTab } from './listing-business-context-tab'
import { ListingBudgetEvaluationTab } from './listing-budget-evaluation-tab'
import { ListingActivityQATab } from './listing-activity-qa-tab'
import { FileText, ClipboardList, Building2, DollarSign, MessageSquare } from 'lucide-react'

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
      <TabsList className="grid grid-cols-5 w-full mb-6 h-auto p-1">
        <TabsTrigger value="summary" className="flex items-center gap-2 py-3">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Project Summary</span>
          <span className="sm:hidden">Summary</span>
        </TabsTrigger>
        <TabsTrigger value="requirements" className="flex items-center gap-2 py-3">
          <ClipboardList className="h-4 w-4" />
          <span className="hidden sm:inline">Full Requirements</span>
          <span className="sm:hidden">Requirements</span>
        </TabsTrigger>
        <TabsTrigger value="business" className="flex items-center gap-2 py-3">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Business & Company</span>
          <span className="sm:hidden">Business</span>
        </TabsTrigger>
        <TabsTrigger value="budget" className="flex items-center gap-2 py-3">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">Budget & Evaluation</span>
          <span className="sm:hidden">Budget</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2 py-3">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Activity & Q&A</span>
          <span className="sm:hidden">Q&A</span>
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

      <TabsContent value="activity" className="mt-0">
        <ListingActivityQATab listing={listing} userType={userType} />
      </TabsContent>
    </Tabs>
  )
}