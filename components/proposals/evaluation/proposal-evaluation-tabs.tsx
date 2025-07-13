'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Target, DollarSign, ShieldCheck, PaperclipIcon } from 'lucide-react'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { AIGeneratedRFQ } from '@/types/ai-listing'
import { ProposalOverviewTab } from './tabs/proposal-overview-tab'
import { SolutionAlignmentTab } from './tabs/solution-alignment-tab'
import { PricingScopeTab } from './tabs/pricing-scope-tab'
import { TechnicalSecurityTab } from './tabs/technical-security-tab'
import { SupportingDocumentsTab } from './tabs/supporting-documents-tab'

interface ProposalEvaluationTabsProps {
  proposal: AIGeneratedProposal
  buyerRequirements: AIGeneratedRFQ
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProposalEvaluationTabs({
  proposal,
  buyerRequirements,
  activeTab,
  onTabChange
}: ProposalEvaluationTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-5 w-full mb-6 h-auto p-1">
        <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
          <span className="sm:hidden">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="alignment" className="flex items-center gap-2 py-3">
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Solution</span>
          <span className="sm:hidden">Solution</span>
        </TabsTrigger>
        <TabsTrigger value="pricing" className="flex items-center gap-2 py-3">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">Pricing</span>
          <span className="sm:hidden">Pricing</span>
        </TabsTrigger>
        <TabsTrigger value="technical" className="flex items-center gap-2 py-3">
          <ShieldCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Technical</span>
          <span className="sm:hidden">Technical</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2 py-3">
          <PaperclipIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Documents</span>
          <span className="sm:hidden">Documents</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-0">
        <ProposalOverviewTab proposal={proposal} />
      </TabsContent>

      <TabsContent value="alignment" className="mt-0">
        <SolutionAlignmentTab 
          proposal={proposal} 
          buyerRequirements={buyerRequirements}
        />
      </TabsContent>

      <TabsContent value="pricing" className="mt-0">
        <PricingScopeTab proposal={proposal} />
      </TabsContent>

      <TabsContent value="technical" className="mt-0">
        <TechnicalSecurityTab proposal={proposal} />
      </TabsContent>

      <TabsContent value="documents" className="mt-0">
        <SupportingDocumentsTab proposal={proposal} />
      </TabsContent>
    </Tabs>
  )
}