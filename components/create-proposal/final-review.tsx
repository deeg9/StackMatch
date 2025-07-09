'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  Send, 
  FileText, 
  Building2, 
  Target, 
  CheckCircle2, 
  DollarSign, 
  Shield, 
  MessageSquare, 
  Paperclip,
  Edit3,
  AlertCircle,
  Clock,
  Users,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import type { AIGeneratedProposal, ListingContext } from '@/types/ai-proposal'

interface FinalReviewProps {
  proposalData: AIGeneratedProposal
  listingContext: ListingContext
  onSubmit: () => void
  onBack: () => void
}

const sectionIcons = {
  'basic-details': FileText,
  'corporate-overview': Building2,
  'executive-summary': Target,
  'solution-alignment': CheckCircle2,
  'pricing-scoping': DollarSign,
  'technical-security': Shield,
  'custom-responses': MessageSquare,
  'supporting-documents': Paperclip,
}

export function FinalReview({ proposalData, listingContext, onSubmit, onBack }: FinalReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic-details'])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    onSubmit()
  }

  const calculateTotalCost = () => {
    const annual = proposalData.pricingScoping?.annualLicenseFee || 0
    const oneTime = proposalData.pricingScoping?.oneTimeCosts?.reduce((sum, item) => sum + item.cost, 0) || 0
    const recurring = proposalData.pricingScoping?.recurringFees?.reduce((sum, item) => sum + (item.cost * 12), 0) || 0
    return annual + oneTime + recurring
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Review Your Proposal
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Take a final look at your proposal for {listingContext.companyName}. You can go back to edit any section or submit when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {/* Proposal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
              <h2 className="text-2xl font-bold mb-2">
                {proposalData.basicDetails?.proposalTitle}
              </h2>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>{proposalData.sellerId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{proposalData.basicDetails?.contactPerson.name}</span>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="p-8 space-y-6">
                {/* Basic Details Section */}
                <ReviewSection
                  id="basic-details"
                  title="Basic Details"
                  icon={FileText}
                  expanded={expandedSections.includes('basic-details')}
                  onToggle={() => toggleSection('basic-details')}
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Proposal Title</p>
                      <p className="font-medium">{proposalData.basicDetails?.proposalTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Primary Contact</p>
                      <p className="font-medium">
                        {proposalData.basicDetails?.contactPerson.name} - {proposalData.basicDetails?.contactPerson.role}
                      </p>
                      <p className="text-sm text-gray-600">{proposalData.basicDetails?.contactPerson.email}</p>
                    </div>
                  </div>
                </ReviewSection>

                {/* Corporate Overview Section */}
                <ReviewSection
                  id="corporate-overview"
                  title="Corporate Overview"
                  icon={Building2}
                  expanded={expandedSections.includes('corporate-overview')}
                  onToggle={() => toggleSection('corporate-overview')}
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Company Mission</p>
                      <p className="text-gray-700">{proposalData.corporateOverview?.companyProfile.mission}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Personalized Message</p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {proposalData.corporateOverview?.personalizedMessage}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Key Differentiators</p>
                      <div className="space-y-1">
                        {proposalData.corporateOverview?.companyProfile.keyDifferentiators.map((diff, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{diff}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ReviewSection>

                {/* Executive Summary Section */}
                <ReviewSection
                  id="executive-summary"
                  title="Executive Summary"
                  icon={Target}
                  expanded={expandedSections.includes('executive-summary')}
                  onToggle={() => toggleSection('executive-summary')}
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Project Understanding</p>
                      <p className="text-gray-700">{proposalData.executiveSummary?.projectUnderstanding}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Proposed Value</p>
                      <p className="text-gray-700">{proposalData.executiveSummary?.proposedValue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Key Benefits</p>
                      <div className="space-y-1">
                        {proposalData.executiveSummary?.keyBenefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start">
                            <Sparkles className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ReviewSection>

                {/* Solution Alignment Section */}
                <ReviewSection
                  id="solution-alignment"
                  title="Solution Alignment"
                  icon={CheckCircle2}
                  expanded={expandedSections.includes('solution-alignment')}
                  onToggle={() => toggleSection('solution-alignment')}
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Feature Support</p>
                      <div className="space-y-2">
                        {proposalData.solutionAlignment?.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{feature.featureName}</span>
                            <Badge 
                              variant={feature.supportLevel === 'fully' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {feature.supportLevel === 'fully' ? 'Fully Supported' :
                               feature.supportLevel === 'partial' ? 'Partial' :
                               feature.supportLevel === 'via-integration' ? 'Via Integration' :
                               'Not Supported'}
                            </Badge>
                          </div>
                        ))}
                        {proposalData.solutionAlignment && proposalData.solutionAlignment.features.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{proposalData.solutionAlignment.features.length - 3} more features
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Integrations</p>
                      <div className="flex flex-wrap gap-2">
                        {proposalData.solutionAlignment?.integrations.map((integration, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {integration.integrationName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </ReviewSection>

                {/* Pricing Section */}
                <ReviewSection
                  id="pricing-scoping"
                  title="Pricing & Scoping"
                  icon={DollarSign}
                  expanded={expandedSections.includes('pricing-scoping')}
                  onToggle={() => toggleSection('pricing-scoping')}
                >
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold text-blue-900">Total First Year Cost</p>
                        <p className="text-2xl font-bold text-blue-900">
                          ${calculateTotalCost().toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1 text-sm text-blue-700">
                        <div className="flex justify-between">
                          <span>Annual License Fee:</span>
                          <span>${proposalData.pricingScoping?.annualLicenseFee?.toLocaleString() || 0}</span>
                        </div>
                        {proposalData.pricingScoping?.oneTimeCosts && proposalData.pricingScoping.oneTimeCosts.length > 0 && (
                          <div className="flex justify-between">
                            <span>One-Time Costs:</span>
                            <span>
                              ${proposalData.pricingScoping.oneTimeCosts.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Licensing Model</p>
                      <p className="font-medium capitalize">{proposalData.pricingScoping?.licensingModel.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pricing Description</p>
                      <p className="text-gray-700">{proposalData.pricingScoping?.pricingModelDescription}</p>
                    </div>
                  </div>
                </ReviewSection>

                {/* Technical & Security Section */}
                <ReviewSection
                  id="technical-security"
                  title="Technical & Security"
                  icon={Shield}
                  expanded={expandedSections.includes('technical-security')}
                  onToggle={() => toggleSection('technical-security')}
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Deployment Approach</p>
                      <p className="text-gray-700">{proposalData.technicalSecurity?.deploymentApproach}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Security Features</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {proposalData.technicalSecurity?.securityFeatures.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature.feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </ReviewSection>

                {/* Custom Responses Section */}
                <ReviewSection
                  id="custom-responses"
                  title="Custom Responses"
                  icon={MessageSquare}
                  expanded={expandedSections.includes('custom-responses')}
                  onToggle={() => toggleSection('custom-responses')}
                >
                  <div className="space-y-3">
                    {proposalData.customResponses?.responses.map((response, idx) => (
                      <div key={response.questionId}>
                        <p className="text-sm text-gray-500">{response.question}</p>
                        <p className="text-gray-700 mt-1">{response.answer || 'No answer provided'}</p>
                      </div>
                    ))}
                  </div>
                </ReviewSection>

                {/* Supporting Documents Section */}
                <ReviewSection
                  id="supporting-documents"
                  title="Supporting Documents"
                  icon={Paperclip}
                  expanded={expandedSections.includes('supporting-documents')}
                  onToggle={() => toggleSection('supporting-documents')}
                >
                  <div className="space-y-2">
                    {proposalData.supportingDocuments?.documents.length > 0 ? (
                      proposalData.supportingDocuments.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{doc.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No supporting documents attached</p>
                    )}
                  </div>
                </ReviewSection>
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="border-t bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Edit
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Proposal
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Submission Checklist */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
              Submission Checklist
            </h3>
            <div className="space-y-3">
              <ChecklistItem 
                completed={!!proposalData.basicDetails?.proposalTitle} 
                label="Proposal title and contact info"
              />
              <ChecklistItem 
                completed={!!proposalData.corporateOverview?.personalizedMessage} 
                label="Personalized message for buyer"
              />
              <ChecklistItem 
                completed={!!proposalData.executiveSummary?.projectUnderstanding} 
                label="Executive summary completed"
              />
              <ChecklistItem 
                completed={proposalData.solutionAlignment?.features.some(f => f.approach)} 
                label="Feature alignments described"
              />
              <ChecklistItem 
                completed={!!proposalData.pricingScoping?.annualLicenseFee} 
                label="Pricing details provided"
              />
              <ChecklistItem 
                completed={!!proposalData.technicalSecurity?.deploymentApproach} 
                label="Technical approach outlined"
              />
              <ChecklistItem 
                completed={proposalData.customResponses?.responses.some(r => r.answer)} 
                label="Custom questions answered"
              />
            </div>
          </Card>

          {/* Proposal Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Proposal Statistics
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Overall Match Score</p>
                <div className="flex items-center mt-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600"
                      style={{ width: `${proposalData.overallMatchScore}%` }}
                    />
                  </div>
                  <span className="ml-2 text-lg font-bold text-gray-900">
                    {proposalData.overallMatchScore}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-gray-500">Sections Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {proposalData.solutionAlignment?.features.filter(f => f.supportLevel === 'fully').length || 0}
                  </p>
                  <p className="text-sm text-gray-500">Features Supported</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Buyer Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submitting To
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{listingContext.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <p className="font-medium">{listingContext.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget Range</p>
                <p className="font-medium">{listingContext.budget}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timeline</p>
                <p className="font-medium">{listingContext.timeline}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface ReviewSectionProps {
  id: string
  title: string
  icon: any
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function ReviewSection({ id, title, icon: Icon, expanded, onToggle, children }: ReviewSectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle edit - would navigate back to specific section
            }}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {expanded && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  )
}

function ChecklistItem({ completed, label }: { completed: boolean, label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        completed ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        {completed ? (
          <CheckCircle2 className="w-3 h-3 text-green-600" />
        ) : (
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
        )}
      </div>
      <span className={`text-sm ${completed ? 'text-gray-900' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  )
}