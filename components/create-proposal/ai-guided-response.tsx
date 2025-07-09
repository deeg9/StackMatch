'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowRight, 
  Brain, 
  Building2, 
  FileText, 
  DollarSign, 
  Shield, 
  MessageSquare, 
  Paperclip,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  CheckCircle2,
  Upload,
  X
} from 'lucide-react'
import type { 
  AIGeneratedProposal, 
  ListingContext,
  ProposalSectionId,
  FeatureAlignment,
  IntegrationAlignment,
  LineItem
} from '@/types/ai-proposal'

interface AIGuidedResponseProps {
  proposalData: Partial<AIGeneratedProposal>
  listingContext: ListingContext
  onUpdate: (updatedProposal: Partial<AIGeneratedProposal>) => void
  onComplete: () => void
}

const sectionConfigs = [
  { id: 'basic-details' as ProposalSectionId, title: 'Basic Details', icon: FileText },
  { id: 'corporate-overview' as ProposalSectionId, title: 'Corporate Overview', icon: Building2 },
  { id: 'executive-summary' as ProposalSectionId, title: 'Executive Summary', icon: Target },
  { id: 'solution-alignment' as ProposalSectionId, title: 'Solution Alignment', icon: CheckCircle2 },
  { id: 'pricing-scoping' as ProposalSectionId, title: 'Pricing & Scoping', icon: DollarSign },
  { id: 'technical-security' as ProposalSectionId, title: 'Technical & Security', icon: Shield },
  { id: 'custom-responses' as ProposalSectionId, title: 'Custom Responses', icon: MessageSquare },
  { id: 'supporting-documents' as ProposalSectionId, title: 'Supporting Documents', icon: Paperclip },
]

// Map section IDs to property names in the data structure
const sectionToPropertyMap: Record<ProposalSectionId, keyof Partial<AIGeneratedProposal>> = {
  'basic-details': 'basicDetails',
  'corporate-overview': 'corporateOverview',
  'executive-summary': 'executiveSummary',
  'solution-alignment': 'solutionAlignment',
  'pricing-scoping': 'pricingScoping',
  'technical-security': 'technicalSecurity',
  'custom-responses': 'customResponses',
  'supporting-documents': 'supportingDocuments',
}

// Mock data for buyer requirements
const mockBuyerRequirements = {
  coreFeatures: [
    'Employee Records Management',
    'Payroll Processing',
    'Benefits Administration',
    'Time & Attendance Tracking',
    'Performance Management',
    'Recruitment & Onboarding'
  ],
  integrations: [
    'Existing Payroll System',
    'Microsoft 365',
    'Slack',
    'Salesforce CRM'
  ],
  customQuestions: [
    {
      id: 'q1',
      question: 'How do you handle data migration from legacy HR systems?'
    },
    {
      id: 'q2', 
      question: 'What is your approach to user training and adoption?'
    },
    {
      id: 'q3',
      question: 'Can you provide examples of similar implementations in our industry?'
    }
  ],
  evaluationCriteria: [
    'Implementation timeline',
    'Total cost of ownership',
    'User experience and ease of use',
    'Security and compliance features',
    'Post-implementation support'
  ]
}

export function AIGuidedResponse({ 
  proposalData, 
  listingContext, 
  onUpdate, 
  onComplete 
}: AIGuidedResponseProps) {
  const [currentSection, setCurrentSection] = useState<ProposalSectionId>('basic-details')
  const [expandedRFQ, setExpandedRFQ] = useState(false)
  const [localData, setLocalData] = useState(proposalData)
  const [completedSections, setCompletedSections] = useState<ProposalSectionId[]>([])

  // Initialize with mock data if needed
  useEffect(() => {
    if (!localData.solutionAlignment) {
      const initialFeatures: FeatureAlignment[] = mockBuyerRequirements.coreFeatures.map(feature => ({
        featureName: feature,
        supportLevel: 'fully',
        approach: '',
        benefits: '',
        evidence: []
      }))
      
      const initialIntegrations: IntegrationAlignment[] = mockBuyerRequirements.integrations.map(integration => ({
        integrationName: integration,
        integrationType: 'pre-built',
        details: ''
      }))
      
      setLocalData(prev => ({
        ...prev,
        solutionAlignment: {
          features: initialFeatures,
          integrations: initialIntegrations
        },
        pricingScoping: {
          ...prev.pricingScoping,
          licensingModel: 'per-user',
          annualLicenseFee: 0,
          pricingModelDescription: '',
          oneTimeCosts: [],
          recurringFees: [],
          technologyStack: '',
          includedModules: [],
          optionalModules: [],
          bauSupportRoles: [],
          trainingDeliveryMethods: [],
          totalProposedCost: 0
        },
        customResponses: {
          responses: mockBuyerRequirements.customQuestions.map(q => ({
            questionId: q.id,
            question: q.question,
            answer: ''
          })),
          evaluationCriteriaAlignment: ''
        },
        supportingDocuments: {
          documents: []
        }
      }))
    }
  }, [])

  const handleSectionComplete = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection])
    }
    
    // Save current data
    onUpdate(localData)
    
    // Move to next section
    const currentIndex = sectionConfigs.findIndex(s => s.id === currentSection)
    if (currentIndex < sectionConfigs.length - 1) {
      setCurrentSection(sectionConfigs[currentIndex + 1].id)
    } else {
      onComplete()
    }
  }

  const updateSectionData = (sectionId: ProposalSectionId, data: any) => {
    const propertyName = sectionToPropertyMap[sectionId]
    setLocalData(prev => {
      const existingData = prev[propertyName as keyof typeof prev]
      return {
        ...prev,
        [propertyName]: {
          ...(typeof existingData === 'object' && existingData !== null ? existingData : {}),
          ...data
        }
      }
    })
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'basic-details':
        return <BasicDetailsSection data={localData.basicDetails} onChange={(data) => updateSectionData('basic-details', data)} />
      case 'corporate-overview':
        return <CorporateOverviewSection data={localData.corporateOverview} onChange={(data) => updateSectionData('corporate-overview', data)} />
      case 'executive-summary':
        return <ExecutiveSummarySection data={localData.executiveSummary} onChange={(data) => updateSectionData('executive-summary', data)} />
      case 'solution-alignment':
        return <SolutionAlignmentSection data={localData.solutionAlignment} onChange={(data) => updateSectionData('solution-alignment', data)} />
      case 'pricing-scoping':
        return <PricingScopingSection data={localData.pricingScoping} onChange={(data) => updateSectionData('pricing-scoping', data)} />
      case 'technical-security':
        return <TechnicalSecuritySection data={localData.technicalSecurity} onChange={(data) => updateSectionData('technical-security', data)} />
      case 'custom-responses':
        return <CustomResponsesSection data={localData.customResponses} onChange={(data) => updateSectionData('custom-responses', data)} />
      case 'supporting-documents':
        return <SupportingDocumentsSection data={localData.supportingDocuments} onChange={(data) => updateSectionData('supporting-documents', data)} />
      default:
        return null
    }
  }

  const currentSectionConfig = sectionConfigs.find(s => s.id === currentSection)
  const CurrentIcon = currentSectionConfig?.icon || FileText

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Review and Edit Your Proposal
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI has generated a comprehensive proposal based on your company profile and {listingContext.companyName}'s requirements. Review and customize each section.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {sectionConfigs.map((section, index) => {
            const isActive = section.id === currentSection
            const isCompleted = completedSections.includes(section.id)
            const Icon = section.icon
            
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive ? 'bg-blue-50' : isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {section.title}
                </span>
              </button>
            )
          })}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((completedSections.length + 1) / sectionConfigs.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <CurrentIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Review and Edit: {currentSectionConfig?.title}
                </h2>
                <p className="text-gray-600">
                  Section {sectionConfigs.findIndex(s => s.id === currentSection) + 1} of {sectionConfigs.length}
                </p>
              </div>
            </div>

            {renderSection()}
          </Card>
        </div>

        {/* AI Co-Pilot Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Suggestions */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  AI Co-Pilot
                </h3>
                
                {proposalData.aiSuggestions?.[currentSection] && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Suggestions:</p>
                      <ul className="space-y-1">
                        {proposalData.aiSuggestions[currentSection].suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-blue-700 flex items-start">
                            <span className="mr-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Pro Tips:</p>
                      <ul className="space-y-1">
                        {proposalData.aiSuggestions[currentSection].tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-blue-700 flex items-start">
                            <Sparkles className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {proposalData.aiSuggestions[currentSection].matchScore && (
                      <div className="pt-3 border-t border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">Section Match Score</span>
                          <span className="text-lg font-bold text-blue-900">
                            {proposalData.aiSuggestions[currentSection].matchScore}%
                          </span>
                        </div>
                        <div className="mt-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600"
                            style={{ width: `${proposalData.aiSuggestions[currentSection].matchScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleSectionComplete}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  Looks Good, Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Buyer RFQ Context */}
          <Card className="p-6">
            <button
              onClick={() => setExpandedRFQ(!expandedRFQ)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Buyer's RFQ Context
              </h3>
              {expandedRFQ ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {expandedRFQ && (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{listingContext.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project</p>
                  <p className="font-medium">{listingContext.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">{listingContext.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timeline</p>
                  <p className="font-medium">{listingContext.timeline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Key Requirements</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {listingContext.requirements.coreFeatures.map((feature: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Overall Match Score */}
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Overall Match Score
              </h3>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#3b82f6"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (proposalData.overallMatchScore || 0) / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {proposalData.overallMatchScore || 0}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Your proposal has a strong match with the buyer's requirements
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Section Components (simplified versions - would be more detailed in production)

function BasicDetailsSection({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Proposal Title
        </label>
        <Input
          value={data?.proposalTitle || ''}
          onChange={(e) => onChange({ ...data, proposalTitle: e.target.value })}
          placeholder="Enter your proposal title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Primary Contact Person
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={data?.contactPerson?.name || ''}
            onChange={(e) => onChange({ 
              ...data, 
              contactPerson: { ...data?.contactPerson, name: e.target.value }
            })}
            placeholder="Contact name"
          />
          <Input
            value={data?.contactPerson?.email || ''}
            onChange={(e) => onChange({ 
              ...data, 
              contactPerson: { ...data?.contactPerson, email: e.target.value }
            })}
            placeholder="Contact email"
            type="email"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Role
        </label>
        <Input
          value={data?.contactPerson?.role || ''}
          onChange={(e) => onChange({ 
            ...data, 
            contactPerson: { ...data?.contactPerson, role: e.target.value }
          })}
          placeholder="e.g., Sales Director, Account Manager"
        />
      </div>
    </div>
  )
}

function CorporateOverviewSection({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Mission
        </label>
        <Textarea
          value={data?.companyProfile?.mission || ''}
          onChange={(e) => onChange({ 
            ...data, 
            companyProfile: { ...data?.companyProfile, mission: e.target.value }
          })}
          placeholder="Your company's mission statement"
          rows={2}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Personalized Message for the Buyer
        </label>
        <Textarea
          value={data?.personalizedMessage || ''}
          onChange={(e) => onChange({ ...data, personalizedMessage: e.target.value })}
          placeholder="Add a personalized message for the buyer..."
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Key Differentiators
        </label>
        <div className="space-y-2">
          {data?.companyProfile?.keyDifferentiators?.map((diff: string, idx: number) => (
            <Input
              key={idx}
              value={diff}
              onChange={(e) => {
                const newDiffs = [...data.companyProfile.keyDifferentiators]
                newDiffs[idx] = e.target.value
                onChange({
                  ...data,
                  companyProfile: { ...data.companyProfile, keyDifferentiators: newDiffs }
                })
              }}
              placeholder={`Differentiator ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ExecutiveSummarySection({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Understanding
        </label>
        <Textarea
          value={data?.projectUnderstanding || ''}
          onChange={(e) => onChange({ ...data, projectUnderstanding: e.target.value })}
          placeholder="Demonstrate your understanding of the buyer's needs..."
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Proposed Value
        </label>
        <Textarea
          value={data?.proposedValue || ''}
          onChange={(e) => onChange({ ...data, proposedValue: e.target.value })}
          placeholder="Explain the value your solution brings..."
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Key Benefits
        </label>
        <div className="space-y-2">
          {data?.keyBenefits?.map((benefit: string, idx: number) => (
            <Input
              key={idx}
              value={benefit}
              onChange={(e) => {
                const newBenefits = [...data.keyBenefits]
                newBenefits[idx] = e.target.value
                onChange({ ...data, keyBenefits: newBenefits })
              }}
              placeholder={`Key benefit ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SolutionAlignmentSection({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Core Feature Requirements
        </h3>
        <div className="space-y-4">
          {data?.features?.map((feature: FeatureAlignment, idx: number) => (
            <Card key={idx} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{feature.featureName}</p>
                  <select
                    value={feature.supportLevel}
                    onChange={(e) => {
                      const newFeatures = [...data.features]
                      newFeatures[idx] = { ...feature, supportLevel: e.target.value as any }
                      onChange({ ...data, features: newFeatures })
                    }}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="fully">Fully Supported</option>
                    <option value="partial">Partially Supported</option>
                    <option value="via-integration">Via Integration</option>
                    <option value="not-supported">Not Supported</option>
                  </select>
                </div>
                
                {feature.supportLevel !== 'not-supported' && (
                  <>
                    <Textarea
                      value={feature.approach}
                      onChange={(e) => {
                        const newFeatures = [...data.features]
                        newFeatures[idx] = { ...feature, approach: e.target.value }
                        onChange({ ...data, features: newFeatures })
                      }}
                      placeholder="Describe your approach to this feature..."
                      rows={2}
                    />
                    <Input
                      value={feature.benefits}
                      onChange={(e) => {
                        const newFeatures = [...data.features]
                        newFeatures[idx] = { ...feature, benefits: e.target.value }
                        onChange({ ...data, features: newFeatures })
                      }}
                      placeholder="Key benefits for the buyer..."
                    />
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Integration Requirements
        </h3>
        <div className="space-y-4">
          {data?.integrations?.map((integration: IntegrationAlignment, idx: number) => (
            <Card key={idx} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{integration.integrationName}</p>
                  <select
                    value={integration.integrationType}
                    onChange={(e) => {
                      const newIntegrations = [...data.integrations]
                      newIntegrations[idx] = { ...integration, integrationType: e.target.value as any }
                      onChange({ ...data, integrations: newIntegrations })
                    }}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="pre-built">Pre-built Connector</option>
                    <option value="api-custom">API Custom Integration</option>
                    <option value="third-party">Third-Party Service</option>
                    <option value="not-supported">Not Supported</option>
                  </select>
                </div>
                
                {integration.integrationType !== 'not-supported' && (
                  <Textarea
                    value={integration.details}
                    onChange={(e) => {
                      const newIntegrations = [...data.integrations]
                      newIntegrations[idx] = { ...integration, details: e.target.value }
                      onChange({ ...data, integrations: newIntegrations })
                    }}
                    placeholder="Describe the integration approach..."
                    rows={2}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function PricingScopingSection({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const calculateTotal = () => {
    const annual = data?.annualLicenseFee || 0
    const oneTime = data?.oneTimeCosts?.reduce((sum: number, item: LineItem) => sum + item.cost, 0) || 0
    const recurring = data?.recurringFees?.reduce((sum: number, item: LineItem) => sum + (item.cost * 12), 0) || 0
    return annual + oneTime + recurring
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Licensing Model
          </label>
          <select
            value={data?.licensingModel || 'per-user'}
            onChange={(e) => onChange({ ...data, licensingModel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option value="per-user">Per User</option>
            <option value="per-module">Per Module</option>
            <option value="tiered">Tiered</option>
            <option value="per-transaction">Per Transaction</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual License Fee
          </label>
          <Input
            type="number"
            value={data?.annualLicenseFee || ''}
            onChange={(e) => onChange({ ...data, annualLicenseFee: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pricing Model Description
        </label>
        <Textarea
          value={data?.pricingModelDescription || ''}
          onChange={(e) => onChange({ ...data, pricingModelDescription: e.target.value })}
          placeholder="Explain how your pricing model works..."
          rows={3}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">One-Time Costs</h3>
        <div className="space-y-2">
          {data?.oneTimeCosts?.map((item: LineItem, idx: number) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                value={item.name}
                onChange={(e) => {
                  const newItems = [...data.oneTimeCosts]
                  newItems[idx] = { ...item, name: e.target.value }
                  onChange({ ...data, oneTimeCosts: newItems })
                }}
                placeholder="Item name"
                className="flex-1"
              />
              <Input
                type="number"
                value={item.cost}
                onChange={(e) => {
                  const newItems = [...data.oneTimeCosts]
                  newItems[idx] = { ...item, cost: Number(e.target.value) }
                  onChange({ ...data, oneTimeCosts: newItems })
                }}
                placeholder="Cost"
                className="w-32"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newItems = data.oneTimeCosts.filter((_: any, i: number) => i !== idx)
                  onChange({ ...data, oneTimeCosts: newItems })
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newItem = { id: Date.now().toString(), name: '', cost: 0, description: '' }
              onChange({ ...data, oneTimeCosts: [...(data.oneTimeCosts || []), newItem] })
            }}
          >
            Add One-Time Cost
          </Button>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-blue-900">Total Proposed Cost</p>
          <p className="text-2xl font-bold text-blue-900">
            ${calculateTotal().toLocaleString()}
          </p>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          First year total (including one-time costs)
        </p>
      </div>
    </div>
  )
}

function TechnicalSecuritySection({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deployment Approach
        </label>
        <Textarea
          value={data?.deploymentApproach || ''}
          onChange={(e) => onChange({ ...data, deploymentApproach: e.target.value })}
          placeholder="Describe your deployment approach and methodology..."
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scalability Response
        </label>
        <Textarea
          value={data?.scalabilityResponse || ''}
          onChange={(e) => onChange({ ...data, scalabilityResponse: e.target.value })}
          placeholder="How does your solution handle growth and scale..."
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Migration Approach
        </label>
        <Textarea
          value={data?.dataMigrationApproach || ''}
          onChange={(e) => onChange({ ...data, dataMigrationApproach: e.target.value })}
          placeholder="Explain your data migration strategy..."
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Architecture Overview
        </label>
        <Textarea
          value={data?.architectureOverview || ''}
          onChange={(e) => onChange({ ...data, architectureOverview: e.target.value })}
          placeholder="Provide a high-level overview of your technical architecture..."
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SLA Details
        </label>
        <Textarea
          value={data?.slaDetails || ''}
          onChange={(e) => onChange({ ...data, slaDetails: e.target.value })}
          placeholder="Summarize your Service Level Agreement..."
          rows={3}
        />
      </div>
    </div>
  )
}

function CustomResponsesSection({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Buyer's Custom Questions
        </h3>
        <div className="space-y-4">
          {data?.responses?.map((response: any, idx: number) => (
            <Card key={response.questionId} className="p-4">
              <p className="font-medium text-gray-900 mb-2">{response.question}</p>
              <Textarea
                value={response.answer}
                onChange={(e) => {
                  const newResponses = [...data.responses]
                  newResponses[idx] = { ...response, answer: e.target.value }
                  onChange({ ...data, responses: newResponses })
                }}
                placeholder="Your detailed answer..."
                rows={3}
              />
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          How Your Proposal Excels Against Key Evaluation Criteria
        </label>
        <Textarea
          value={data?.evaluationCriteriaAlignment || ''}
          onChange={(e) => onChange({ ...data, evaluationCriteriaAlignment: e.target.value })}
          placeholder="Reference the buyer's evaluation criteria and explain how your proposal meets them..."
          rows={4}
        />
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-1">Buyer's Key Evaluation Criteria:</p>
          <div className="flex flex-wrap gap-1">
            {mockBuyerRequirements.evaluationCriteria.map((criteria, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {criteria}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SupportingDocumentsSection({ data, onChange }: { data: any, onChange: (data: any) => void }) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newDocuments = files.map(file => ({
      id: Date.now().toString() + file.name,
      name: file.name,
      type: file.type,
      size: file.size,
      file: file
    }))
    onChange({ ...data, documents: [...(data?.documents || []), ...newDocuments] })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Supporting Documents
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload additional documents to strengthen your proposal, such as case studies, certifications, or technical specifications.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.mp4"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Select Files
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supported: PDF, Word, Excel, Images, Videos (max 25MB each)
          </p>
        </div>
        
        {data?.documents?.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.documents.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newDocs = data.documents.filter((d: any) => d.id !== doc.id)
                    onChange({ ...data, documents: newDocs })
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}