import type { ListingFormData } from "./listing-types"

// Core conversation types
export interface ConversationMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    fieldUpdates?: string[]
    enhancementType?: string
    processingTime?: number
  }
}

export interface ConversationSession {
  id: string
  sessionId: string
  userId: string
  messages: ConversationMessage[]
  formState: Partial<ListingFormData>
  createdAt: Date
  updatedAt: Date
}

// AI Enhancement types
export interface AIEnhancement {
  id: string
  conversationId: string
  fieldName: string
  originalValue?: string
  enhancedValue: string
  enhancementType: EnhancementType
  userFeedback?: number // 1-5 rating
  createdAt: Date
}

export type EnhancementType =
  | "field_improvement"
  | "section_enhancement"
  | "validation_fix"
  | "auto_completion"
  | "suggestion_application"

// Form field mapping types
export interface FieldMapping {
  fieldName: keyof ListingFormData
  aiValue: any
  confidence: number
  requiresValidation: boolean
}

export interface AIFormUpdate {
  fieldMappings: FieldMapping[]
  updatedFields: Set<string>
  validationErrors: string[]
  suggestions: Record<string, string>
}

// Conversation state types
export interface ConversationState {
  stage: ConversationStage
  completedStages: Set<ConversationStage>
  currentFocus?: string
  extractedData: Partial<ListingFormData>
  pendingQuestions: string[]
  contextSummary: string
}

export type ConversationStage =
  | "introduction"
  | "project_basics"
  | "requirements_gathering"
  | "technical_details"
  | "success_metrics"
  | "timeline_milestones"
  | "budget_discussion"
  | "final_review"
  | "completed"

// AI Response types
export interface AIResponse {
  message: string
  fieldUpdates?: Record<string, any>
  suggestions?: string[]
  nextQuestions?: string[]
  stage?: ConversationStage
  confidence: number
  requiresUserInput: boolean
}

export interface AIPromptContext {
  conversationHistory: ConversationMessage[]
  currentFormState: Partial<ListingFormData>
  userProfile?: {
    industry?: string
    companySize?: string
    previousProjects?: number
  }
  stage: ConversationStage
}

// Provider matching types (for Phase 3)
export interface ProviderMatch {
  providerId: string
  matchScore: number
  matchReasons: string[]
  skillAlignment: number
  experienceRelevance: number
  availabilityScore: number
  budgetCompatibility: number
}

export interface ProviderRecommendation {
  matches: ProviderMatch[]
  totalProviders: number
  averageMatchScore: number
  recommendationConfidence: number
  generatedAt: Date
}

// UI State types
export interface AIListingUIState {
  conversationCollapsed: boolean
  activeEnhancement: string | null
  formCompletionPercentage: number
  highlightedFields: Set<string>
  showSuggestions: boolean
  isProcessing: boolean
  lastSavedAt: Date | null
}

// API Request/Response types
export interface SendMessageRequest {
  sessionId: string
  message: string
  currentFormState: Partial<ListingFormData>
  stage?: ConversationStage
}

export interface SendMessageResponse {
  success: boolean
  response: AIResponse
  updatedSession: ConversationSession
  error?: string
}

export interface EnhanceFieldRequest {
  sessionId: string
  fieldName: string
  currentValue: string
  enhancementType: EnhancementType
  context?: string
}

export interface EnhanceFieldResponse {
  success: boolean
  enhancedValue: string
  explanation: string
  confidence: number
  error?: string
}

export interface SaveDraftRequest {
  sessionId: string
  formState: Partial<ListingFormData>
  conversationData: ConversationMessage[]
}

export interface SaveDraftResponse {
  success: boolean
  savedAt: Date
  error?: string
}

// Prompt template types
export interface PromptTemplate {
  id: string
  name: string
  stage: ConversationStage
  template: string
  variables: string[]
  examples?: string[]
}

export interface ConversationFlow {
  stage: ConversationStage
  requiredFields: string[]
  optionalFields: string[]
  nextStages: ConversationStage[]
  prompts: PromptTemplate[]
  validationRules: ValidationRule[]
}

export interface ValidationRule {
  field: string
  rule: "required" | "format" | "range" | "dependency"
  params?: any
  errorMessage: string
}
