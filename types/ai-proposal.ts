export type ProposalWorkflowStep = 
  | 'intelligent-analysis'
  | 'ai-processing'
  | 'ai-guided-response'
  | 'final-review'
  | 'success'

export type ProposalSectionId = 
  | 'basic-details'
  | 'corporate-overview'
  | 'executive-summary'
  | 'solution-alignment'
  | 'pricing-scoping'
  | 'technical-security'
  | 'custom-responses'
  | 'supporting-documents'

export interface ProposalBasicDetails {
  proposalTitle: string
  contactPerson: {
    id: string
    name: string
    email: string
    role: string
  }
}

export interface ProposalCorporateOverview {
  companyProfile: {
    mission: string
    size: string
    keyDifferentiators: string[]
    industryExpertise: string[]
    awards: string[]
    certifications: string[]
    clientTestimonials?: string[]
  }
  personalizedMessage: string
  caseStudies?: {
    id: string
    title: string
    url?: string
    file?: File
  }[]
}

export interface ProposalExecutiveSummary {
  projectUnderstanding: string
  proposedValue: string
  keyBenefits: string[]
}

export interface FeatureAlignment {
  featureName: string
  supportLevel: 'fully' | 'partial' | 'not-supported' | 'via-integration'
  approach: string
  benefits: string
  evidence?: {
    type: 'screenshot' | 'demo' | 'documentation' | 'case-study'
    url?: string
    file?: File
  }[]
}

export interface IntegrationAlignment {
  integrationName: string
  integrationType: 'pre-built' | 'api-custom' | 'third-party' | 'not-supported'
  details: string
}

export interface ProposalSolutionAlignment {
  features: FeatureAlignment[]
  integrations: IntegrationAlignment[]
}

export interface LineItem {
  id: string
  name: string
  cost: number
  description: string
}

export interface ProposalPricingScoping {
  licensingModel: 'per-user' | 'per-module' | 'tiered' | 'per-transaction' | 'custom'
  annualLicenseFee: number
  pricingModelDescription: string
  oneTimeCosts: LineItem[]
  recurringFees: LineItem[]
  technologyStack: string
  includedModules: string[]
  optionalModules: string[]
  bauSupportRoles: {
    roleName: string
    recommendedCount: number
    responsibilities: string
  }[]
  trainingDeliveryMethods: string[]
  trainingDescription?: string
  trainingCosts?: number
  totalProposedCost: number
}

export interface ProposalTechnicalSecurity {
  deploymentApproach: string
  scalabilityResponse: string
  securityFeatures: {
    feature: string
    explanation: string
  }[]
  dataMigrationApproach: string
  architectureOverview: string
  slaDetails: string
  slaUrl?: string
}

export interface ProposalCustomResponse {
  questionId: string
  question: string
  answer: string
}

export interface ProposalCustomResponses {
  responses: ProposalCustomResponse[]
  evaluationCriteriaAlignment: string
}

export interface ProposalSupportingDocument {
  id: string
  name: string
  type: string
  size: number
  url?: string
  file?: File
}

export interface ProposalSupportingDocuments {
  documents: ProposalSupportingDocument[]
}

export interface AIGeneratedProposal {
  // Workflow metadata
  id: string
  listingId: string
  sellerId: string
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'submitted' | 'accepted' | 'rejected'
  
  // Section data
  basicDetails: ProposalBasicDetails
  corporateOverview: ProposalCorporateOverview
  executiveSummary: ProposalExecutiveSummary
  solutionAlignment: ProposalSolutionAlignment
  pricingScoping: ProposalPricingScoping
  technicalSecurity: ProposalTechnicalSecurity
  customResponses: ProposalCustomResponses
  supportingDocuments: ProposalSupportingDocuments
  
  // AI assistance metadata
  aiSuggestions: {
    [key in ProposalSectionId]?: {
      suggestions: string[]
      tips: string[]
      matchScore?: number
    }
  }
  overallMatchScore: number
}

export interface ProposalDraft {
  id: string
  listingId: string
  currentSection: ProposalSectionId
  completedSections: ProposalSectionId[]
  data: Partial<AIGeneratedProposal>
  lastSaved: Date
}

export interface SellerContext {
  companyName: string
  industry: string
  teamSize: string
  specializations: string[]
  targetMarkets: string[]
  existingClients?: string
  uniqueStrengths?: string
}

export interface ListingContext {
  id: string
  title: string
  companyName: string
  category: string
  budget: string
  timeline: string
  requirements: any // This would be the full RFQ data structure
}