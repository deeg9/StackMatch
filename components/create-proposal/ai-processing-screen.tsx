'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Brain, Sparkles, FileText, CheckCircle2 } from 'lucide-react'
import type { SellerContext, ListingContext, AIGeneratedProposal } from '@/types/ai-proposal'

interface AIProcessingScreenProps {
  sellerContext: SellerContext
  listingContext: ListingContext
  onComplete: (generatedProposal: Partial<AIGeneratedProposal>) => void
}

const processingSteps = [
  { id: 'analyze', label: 'Analyzing RFQ requirements', icon: FileText },
  { id: 'match', label: 'Matching your capabilities to buyer needs', icon: Brain },
  { id: 'generate', label: 'Generating personalized proposal content', icon: Sparkles },
  { id: 'optimize', label: 'Optimizing for maximum impact', icon: CheckCircle2 },
]

// Mock AI proposal generation
const generateProposal = (seller: SellerContext, listing: ListingContext): Partial<AIGeneratedProposal> => {
  return {
    id: `proposal-${Date.now()}`,
    listingId: listing.id,
    sellerId: 'seller-123', // Would come from auth
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    
    basicDetails: {
      proposalTitle: `${seller.companyName}'s Proposal for ${listing.companyName}'s ${listing.category} Implementation`,
      contactPerson: {
        id: 'contact-1',
        name: 'Diego Fill',
        email: 'diego@biltlocal.com',
        role: 'CEO & Founder'
      }
    },
    
    corporateOverview: {
      companyProfile: {
        mission: 'Transforming construction and real estate through innovative technology solutions',
        size: seller.teamSize,
        keyDifferentiators: [
          'Industry-leading ' + seller.specializations[0] + ' expertise',
          'Proven track record with ' + seller.targetMarkets.join(' and ') + ' clients',
          'Award-winning customer support and implementation services'
        ],
        industryExpertise: seller.specializations,
        awards: ['PropTech Innovation Award 2024', 'Best Construction Software 2023'],
        certifications: ['ISO 27001', 'SOC 2 Type II'],
        clientTestimonials: [
          'BiltLocal transformed our project management workflow - highly recommended!'
        ]
      },
      personalizedMessage: `Dear ${listing.companyName} team,\n\nWe're excited about the opportunity to support your ${listing.category} initiative. With our deep expertise in ${seller.specializations.join(', ')}, we're confident we can deliver exceptional value within your ${listing.budget} budget and ${listing.timeline} timeline.`,
      caseStudies: []
    },
    
    executiveSummary: {
      projectUnderstanding: `We understand that ${listing.companyName} is seeking a comprehensive ${listing.category} solution to streamline operations and drive growth. Your key requirements include robust features for ${listing.requirements.coreFeatures.join(', ')}, seamless integration with ${listing.requirements.integrations.join(', ')}, and enterprise-grade security with ${listing.requirements.security.join(', ')} compliance.`,
      proposedValue: `${seller.companyName} offers a perfect match for your needs with our proven ${listing.category} platform. We'll deliver a solution that not only meets your immediate requirements but scales with your business growth.`,
      keyBenefits: [
        'Rapid implementation within your ' + listing.timeline + ' timeline',
        'Cost-effective solution within your ' + listing.budget + ' budget',
        'Seamless integration with your existing tech stack',
        'Dedicated support team for smooth transition'
      ]
    },
    
    overallMatchScore: 92,
    
    aiSuggestions: {
      'basic-details': {
        suggestions: ['Consider adding a secondary contact person', 'Proposal title is clear and professional'],
        tips: ['Keep the title concise but descriptive'],
        matchScore: 95
      },
      'corporate-overview': {
        suggestions: ['Add 2-3 more relevant case studies', 'Expand on your PropTech expertise'],
        tips: ['Highlight experience with similar-sized companies'],
        matchScore: 88
      },
      'executive-summary': {
        suggestions: ['Emphasize ROI and time-to-value', 'Add specific metrics from past implementations'],
        tips: ['Lead with the buyer\'s biggest pain point'],
        matchScore: 90
      }
    }
  }
}

export function AIProcessingScreen({ sellerContext, listingContext, onComplete }: AIProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1
        } else {
          setIsComplete(true)
          clearInterval(timer)
          return prev
        }
      })
    }, 1500)
    
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    if (isComplete) {
      const proposal = generateProposal(sellerContext, listingContext)
      setTimeout(() => {
        onComplete(proposal)
      }, 1000)
    }
  }, [isComplete, sellerContext, listingContext, onComplete])
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full">
          <Brain className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          AI is Creating Your Proposal
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Our AI is analyzing {listingContext.companyName}'s requirements and crafting a winning proposal tailored to your strengths.
        </p>
      </div>
      
      <Card className="p-8">
        <div className="space-y-6">
          {processingSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep || (index === currentStep && isComplete)
            
            return (
              <div
                key={step.id}
                className={`flex items-center space-x-4 transition-all duration-500 ${
                  isActive ? 'scale-105' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? 'bg-green-100 text-green-600'
                      : isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                
                <div className="flex-1">
                  <p
                    className={`text-lg font-medium transition-all duration-500 ${
                      isCompleted
                        ? 'text-green-600'
                        : isActive
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  
                  {isActive && !isCompleted && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full animate-progress" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {isComplete && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Proposal Framework Generated!
                </h3>
                <p className="text-green-800 mt-1">
                  Your AI-powered proposal is ready for review. We've matched your capabilities with {listingContext.companyName}'s requirements and created a compelling response.
                </p>
                <div className="mt-3 flex items-center space-x-4 text-sm text-green-700">
                  <span className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    92% Match Score
                  </span>
                  <span>•</span>
                  <span>8 Sections Generated</span>
                  <span>•</span>
                  <span>Ready for Review</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        .animate-progress {
          animation: progress 1.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}