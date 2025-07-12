'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ProposalEvaluationHeader } from '@/components/proposals/evaluation/proposal-evaluation-header'
import { ProposalEvaluationTabs } from '@/components/proposals/evaluation/proposal-evaluation-tabs'
import { ProposalEvaluationSidebar } from '@/components/proposals/evaluation/proposal-evaluation-sidebar'
import { mockProposalData, mockBuyerRequirements, mockProposalEvaluation } from '@/lib/mock-data/proposal-evaluation-data'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'

export default function ProposalEvaluationPage() {
  const params = useParams()
  const proposalId = params.id as string
  const [activeTab, setActiveTab] = useState('overview')
  const [evaluationData, setEvaluationData] = useState(mockProposalEvaluation)
  
  // For now, we're using mock data, but logging the ID for future use
  console.log('Viewing proposal:', proposalId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray/20 via-white to-light-gray/20">
      <TickerBanner />
      <NavigationWrapper />
      
      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Static Header */}
        <ProposalEvaluationHeader 
          proposal={mockProposalData}
          evaluation={evaluationData}
        />

        {/* Main Content Area with Sidebar */}
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