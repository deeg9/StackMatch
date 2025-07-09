'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { IntelligentAnalysis } from '@/components/create-proposal/intelligent-analysis'
import { AIProcessingScreen } from '@/components/create-proposal/ai-processing-screen'
import { AIGuidedResponse } from '@/components/create-proposal/ai-guided-response'
import { FinalReview } from '@/components/create-proposal/final-review'
import { ProposalSuccess } from '@/components/create-proposal/proposal-success'
import type { 
  ProposalWorkflowStep, 
  AIGeneratedProposal, 
  SellerContext,
  ListingContext,
  ProposalDraft
} from '@/types/ai-proposal'

// Mock function to fetch listing details
const fetchListingDetails = async (listingId: string): Promise<ListingContext> => {
  // This would be replaced with actual API call
  return {
    id: listingId,
    title: 'Enterprise CRM Software Implementation',
    companyName: 'TechCorp Industries',
    category: 'CRM Software',
    budget: '$50,000 - $100,000',
    timeline: '3-6 months',
    requirements: {
      // This would contain the full RFQ data
      coreFeatures: ['Customer Management', 'Sales Pipeline', 'Analytics'],
      integrations: ['Salesforce', 'HubSpot', 'Microsoft 365'],
      security: ['SOC2', 'GDPR', 'SSO'],
    }
  }
}

// Mock function to save draft
const saveDraft = async (draft: ProposalDraft) => {
  // This would save to local storage or API
  localStorage.setItem(`proposal-draft-${draft.listingId}`, JSON.stringify(draft))
}

// Mock function to load draft
const loadDraft = (listingId: string): ProposalDraft | null => {
  const saved = localStorage.getItem(`proposal-draft-${listingId}`)
  return saved ? JSON.parse(saved) : null
}

export default function CreateProposalPage() {
  const params = useParams()
  const listingId = params.listingId as string
  
  const [currentStep, setCurrentStep] = useState<ProposalWorkflowStep>('intelligent-analysis')
  const [sellerContext, setSellerContext] = useState<SellerContext | null>(null)
  const [listingContext, setListingContext] = useState<ListingContext | null>(null)
  const [proposalData, setProposalData] = useState<Partial<AIGeneratedProposal>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load listing details and check for existing draft
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      // Load listing details
      const listing = await fetchListingDetails(listingId)
      setListingContext(listing)
      
      // Check for existing draft
      const draft = loadDraft(listingId)
      if (draft) {
        setProposalData(draft.data)
        setCurrentStep('ai-guided-response') // Skip to editing if draft exists
      }
      
      setIsLoading(false)
    }
    
    loadData()
  }, [listingId])

  // Auto-save draft periodically
  useEffect(() => {
    if (proposalData && Object.keys(proposalData).length > 0) {
      const draft: ProposalDraft = {
        id: `draft-${listingId}`,
        listingId,
        currentSection: 'basic-details', // This would track current section
        completedSections: [],
        data: proposalData,
        lastSaved: new Date()
      }
      saveDraft(draft)
    }
  }, [proposalData, listingId])

  const handleAnalysisComplete = (context: SellerContext) => {
    setSellerContext(context)
    setCurrentStep('ai-processing')
  }

  const handleProcessingComplete = (generatedProposal: Partial<AIGeneratedProposal>) => {
    setProposalData(generatedProposal)
    setCurrentStep('ai-guided-response')
  }

  const handleProposalUpdate = (updatedProposal: Partial<AIGeneratedProposal>) => {
    setProposalData(updatedProposal)
  }

  const handleReviewComplete = () => {
    setCurrentStep('final-review')
  }

  const handleSubmitProposal = async () => {
    // Here would be the API call to submit the proposal
    console.log('Submitting proposal:', proposalData)
    
    // Clear draft after successful submission
    localStorage.removeItem(`proposal-draft-${listingId}`)
    
    setCurrentStep('success')
  }

  const handleBackToReview = () => {
    setCurrentStep('ai-guided-response')
  }

  if (isLoading || !listingContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <TickerBanner />
        <NavigationWrapper />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">Loading listing details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className={`flex items-center ${currentStep === 'intelligent-analysis' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'intelligent-analysis' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Analysis</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-200" />
            
            <div className={`flex items-center ${
              ['ai-processing', 'ai-guided-response', 'final-review', 'success'].includes(currentStep) 
                ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['ai-processing', 'ai-guided-response', 'final-review', 'success'].includes(currentStep)
                  ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Create Proposal</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-200" />
            
            <div className={`flex items-center ${
              ['final-review', 'success'].includes(currentStep) ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['final-review', 'success'].includes(currentStep) ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Review</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-200" />
            
            <div className={`flex items-center ${currentStep === 'success' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'success' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                4
              </div>
              <span className="ml-2 text-sm font-medium">Submit</span>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        {currentStep === 'intelligent-analysis' && (
          <IntelligentAnalysis 
            listingContext={listingContext}
            onComplete={handleAnalysisComplete}
          />
        )}
        
        {currentStep === 'ai-processing' && sellerContext && (
          <AIProcessingScreen 
            sellerContext={sellerContext}
            listingContext={listingContext}
            onComplete={handleProcessingComplete}
          />
        )}
        
        {currentStep === 'ai-guided-response' && (
          <AIGuidedResponse 
            proposalData={proposalData}
            listingContext={listingContext}
            onUpdate={handleProposalUpdate}
            onComplete={handleReviewComplete}
          />
        )}
        
        {currentStep === 'final-review' && (
          <FinalReview 
            proposalData={proposalData as AIGeneratedProposal}
            listingContext={listingContext}
            onSubmit={handleSubmitProposal}
            onBack={handleBackToReview}
          />
        )}
        
        {currentStep === 'success' && (
          <ProposalSuccess 
            proposalData={proposalData as AIGeneratedProposal}
            listingContext={listingContext}
          />
        )}
      </div>
    </div>
  )
}