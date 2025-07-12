'use client'

import { useState } from 'react'
import { ProposalEvaluationHeader } from '@/components/proposals/evaluation/proposal-evaluation-header'
import { ProposalEvaluationTabs } from '@/components/proposals/evaluation/proposal-evaluation-tabs'
import { ProposalEvaluationSidebar } from '@/components/proposals/evaluation/proposal-evaluation-sidebar'
import { mockProposalData, mockBuyerRequirements, mockProposalEvaluation } from '@/lib/mock-data/proposal-evaluation-data'

export default function ProposalEvaluationPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [evaluationData, setEvaluationData] = useState(mockProposalEvaluation)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Static Header */}
      <ProposalEvaluationHeader 
        proposal={mockProposalData}
        evaluation={evaluationData}
      />

      {/* Main Content Area with Sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Tab Container - Main Content */}
          <div className="flex-1">
            <ProposalEvaluationTabs
              proposal={mockProposalData}
              buyerRequirements={mockBuyerRequirements}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Right Sidebar - Evaluation Workspace */}
          <div className="w-80 flex-shrink-0">
            <ProposalEvaluationSidebar
              proposal={mockProposalData}
              evaluation={evaluationData}
              onEvaluationUpdate={setEvaluationData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}