// AI Listing Workflow Types

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  isPopular?: boolean
  estimatedTime: string
  color: string
}

export interface IngestionData {
  companyWebsite: string
  linkedinPage: string
  uploadedFiles: File[]
}

export interface AIGeneratedRFQ {
  coreRequirements: {
    employeeCount: string
    features: string[]
    integrations: string[]
    complianceNeeds: string[]
  }
  technicalSpecs: {
    deployment: string
    scalability: string
    security: string[]
    dataRequirements: string
  }
  projectDetails: {
    timeline: string
    budget: {
      min: number
      max: number
    }
    priority: string
    successMetrics: string[]
  }
  businessContext: {
    industry: string
    currentPain: string
    expectedOutcomes: string
    stakeholders: string[]
  }
}

export type AIWorkflowStep = 'category' | 'ingestion' | 'processing' | 'review' | 'approval' | 'submitted'

export interface ChatMessage {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  actionButton?: {
    text: string
    onClick: () => void
  }
}

export interface ProcessingStep {
  id: string
  message: string
  icon: React.ReactNode
  duration: number
}

// API Request/Response Types
export interface AnalyzeRequest {
  companyWebsite?: string
  linkedinPage?: string
  uploadedFiles?: {
    name: string
    size: number
    type: string
  }[]
  categoryName: string
}

export interface AnalyzeResponse {
  success: boolean
  data?: AIGeneratedRFQ
  processingTime?: number
  confidence?: number
  error?: string
}

export interface SubmitListingRequest {
  categoryName: string
  rfqData: AIGeneratedRFQ
}

export interface SubmissionResponse {
  success: boolean
  listingId?: string
  estimatedProposals?: number
  expectedResponseTime?: string
  vendorMatches?: {
    total: number
    premium: number
    verified: number
  }
  nextSteps?: string[]
  error?: string
}

// Form Section Types
export interface FormSection {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  isCompleted?: boolean
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Metrics and Analytics Types
export interface CompletionStats {
  totalFields: number
  completedFields: number
  percentage: number
}

export interface VendorMatchMetrics {
  estimatedProposals: number
  expectedResponseTime: string
  vendorMatches: {
    total: number
    premium: number
    verified: number
  }
}

// Component Props Types
export interface IntelligentIngestionProps {
  categoryName: string
  onAnalyze: (data: IngestionData) => void
  isLoading?: boolean
}

export interface AIWorkingScreenProps {
  onComplete: () => void
  duration?: number
}

export interface AIAssistedReviewProps {
  categoryName: string
  aiGeneratedData: AIGeneratedRFQ
  onComplete: (finalData: AIGeneratedRFQ) => void
}

export interface FinalApprovalProps {
  rfqData: AIGeneratedRFQ
  categoryName: string
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
}

// Utility Types
export type DeploymentType = 'cloud' | 'on-premise' | 'hybrid' | 'flexible'
export type TimelineType = 'urgent' | 'standard' | 'flexible' | 'strategic'
export type PriorityType = 'critical' | 'high' | 'medium' | 'low'
export type EmployeeCountRange = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'

// Category-specific feature lists
export interface CategoryFeatures {
  [categoryId: string]: {
    features: string[]
    integrations: string[]
    securityRequirements: string[]
    successMetrics: string[]
    stakeholders: string[]
  }
}

// Default category features
export const CATEGORY_FEATURES: CategoryFeatures = {
  'hr-payroll': {
    features: [
      'Employee Records Management',
      'Payroll Processing',
      'Benefits Administration',
      'Time & Attendance',
      'Recruitment & Hiring',
      'Performance Management',
      'Training & Development',
      'Compliance Tracking'
    ],
    integrations: [
      'Existing Payroll System',
      'Accounting Software',
      'Email/Calendar (Outlook/Gmail)',
      'Single Sign-On (SSO)',
      'Background Check Services',
      'Benefits Providers',
      'Learning Management System',
      'Applicant Tracking System'
    ],
    securityRequirements: [
      'SOC 2 Compliance',
      'GDPR Compliance',
      'Two-Factor Authentication',
      'Data Encryption',
      'Regular Security Audits',
      'Role-based Access Control',
      'Audit Trails',
      'Backup & Recovery'
    ],
    successMetrics: [
      'Reduce manual HR tasks by 50%+',
      'Improve employee satisfaction scores',
      'Ensure 100% compliance with regulations',
      'Streamline onboarding process',
      'Better reporting and analytics',
      'Reduce time-to-hire',
      'Improve data accuracy',
      'Cost savings on HR operations'
    ],
    stakeholders: [
      'HR Director/Manager',
      'IT Director',
      'CEO/Executive Team',
      'Finance/Accounting',
      'Legal/Compliance',
      'Department Managers',
      'Employees (End Users)',
      'External Consultants'
    ]
  },
  'web-development': {
    features: [
      'Responsive Design',
      'Content Management System',
      'E-commerce Functionality',
      'User Authentication',
      'Search Engine Optimization',
      'Analytics Integration',
      'Social Media Integration',
      'Multi-language Support'
    ],
    integrations: [
      'Payment Gateways',
      'CRM Systems',
      'Email Marketing Tools',
      'Social Media Platforms',
      'Analytics Platforms',
      'Inventory Management',
      'Customer Support Tools',
      'Marketing Automation'
    ],
    securityRequirements: [
      'SSL Certificate',
      'Data Encryption',
      'Regular Security Updates',
      'Backup & Recovery',
      'DDoS Protection',
      'SQL Injection Protection',
      'Cross-Site Scripting Protection',
      'Access Control'
    ],
    successMetrics: [
      'Improve website performance',
      'Increase conversion rates',
      'Better user experience',
      'Mobile optimization',
      'SEO improvements',
      'Reduced bounce rate',
      'Increased page views',
      'Better lead generation'
    ],
    stakeholders: [
      'Marketing Director',
      'IT Director',
      'CEO/Executive Team',
      'Sales Team',
      'Customer Service',
      'Web Content Managers',
      'Digital Marketing Team',
      'UX/UI Designers'
    ]
  }
}

// Error types
export interface AIListingError {
  code: string
  message: string
  field?: string
}

export type AIListingErrorCode = 
  | 'VALIDATION_ERROR'
  | 'ANALYSIS_FAILED'
  | 'SUBMISSION_FAILED'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'