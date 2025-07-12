'use client'

import { cn } from '@/lib/utils'
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

const tabs = [
  { id: 'overview', label: 'Proposal Overview' },
  { id: 'alignment', label: 'Solution Alignment' },
  { id: 'pricing', label: 'Pricing & Scope' },
  { id: 'technical', label: 'Technical & Security' },
  { id: 'documents', label: 'Supporting Documents' }
]

export function ProposalEvaluationTabs({
  proposal,
  buyerRequirements,
  activeTab,
  onTabChange
}: ProposalEvaluationTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <ProposalOverviewTab proposal={proposal} />
        )}
        {activeTab === 'alignment' && (
          <SolutionAlignmentTab 
            proposal={proposal} 
            buyerRequirements={buyerRequirements}
          />
        )}
        {activeTab === 'pricing' && (
          <PricingScopeTab proposal={proposal} />
        )}
        {activeTab === 'technical' && (
          <TechnicalSecurityTab proposal={proposal} />
        )}
        {activeTab === 'documents' && (
          <SupportingDocumentsTab proposal={proposal} />
        )}
      </div>
    </div>
  )
}