export interface SaveDraftRequest {
  formData: GuidedListingFormData
  sessionId?: string
}

export interface SaveDraftResponse {
  draftId: string
  savedAt: string
  success: boolean
}

export interface EnhanceResponseRequest {
  questionId: string
  currentResponse: string
  context: {
    category: string
    previousResponses: Record<string, any>
  }
}

export interface EnhanceResponseResponse {
  enhancedResponse: string
  suggestions: string[]
  confidence: number
  success: boolean
}

export interface CompletenessCheckRequest {
  formData: GuidedListingFormData
  templateId: string
}

export interface CompletenessCheckResponse {
  completenessScore: number
  qualityScore: number
  missingFields: string[]
  suggestions: string[]
  estimatedTimeToComplete: number
  success: boolean
}

export interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadedAt: string
}

export interface ProjectDetails {
  timeline: string
  startDate?: string
  budgetRange: {
    min?: number
    max?: number
    currency: string
  }
  locationPreference: "remote" | "onsite" | "hybrid"
  timeZone?: string
  preferredCommunication: string[]
  additionalInfo: string
  files: FileAttachment[]
  urgency?: "low" | "medium" | "high"
}

export interface ConditionalLogic {
  dependsOn: string
  condition: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  value: any
  action: "show" | "hide" | "require"
}

export interface SubQuestion {
  id: string
  text: string
  type: "text" | "textarea" | "select" | "multiselect" | "boolean" | "number" | "date" | "range"
  options?: { value: string; label: string; description?: string }[]
  required: boolean
  helpText?: string
  placeholder?: string
  description?: string
  contextTooltip?: string
  conditionalLogic?: ConditionalLogic
}

export interface Question {
  id: string
  text: string
  type: "text" | "textarea" | "select" | "multiselect" | "boolean" | "number" | "date" | "range" | "group"
  options?: { value: string; label: string; description?: string }[]
  required: boolean
  helpText?: string
  placeholder?: string
  description?: string
  aiHints?: string
  contextTooltip?: string
  conditionalLogic?: ConditionalLogic
  subQuestions?: SubQuestion[]
  proTip?: string
  section?: string
}

export interface QuestionSection {
  id: string
  title: string
  description?: string
  questions: Question[]
  conditionalLogic?: ConditionalLogic
  proTip?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  completenessScore: number
}

export interface ListingDraft {
  id: string
  user_id: string
  category: string
  form_data: GuidedListingFormData
  created_at: string
  updated_at: string
}

export interface FormStep {
  id: number
  title: string
  description: string
  component: "qualification" | "scoping" | "logistics" | "review"
  isCompleted: boolean
  isOptional: boolean
  estimatedTime: string
}

export interface CategoryTemplate {
  id?: string
  value: string
  label: string
  name: string
  description: string
  icon: string
  color: string
  popularity: number
  avgTime: string
  qualificationQuestions: Question[]
  qualificationSections?: QuestionSection[]
  scopingQuestions: Question[]
  scopingSections?: QuestionSection[]
}

export interface GuidedListingFormData {
  selectedCategory: string
  currentStep: number
  completedSteps: Set<number>
  qualificationResponses: Record<string, any>
  scopingResponses: Record<string, any>
  projectDetails: ProjectDetails
  aiSuggestions: Record<string, string[]>
  completenessScore: number
  qualityScore: number
  startedAt: string
  estimatedTimeRemaining: number
}
