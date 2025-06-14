// Clean types for AI listing functionality - no AI SDK imports

// Conversation types
export interface ConversationMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ConversationSession {
  id: string
  sessionId: string
  userId: string
  messages: ConversationMessage[]
  formState: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// API request/response types
export interface SendMessageRequest {
  sessionId: string
  message: string
  currentFormState?: Record<string, any>
  stage?: string
}

export interface AIResponse {
  message: string
  fieldUpdates?: Record<string, any>
  suggestions?: string[]
  nextQuestions?: string[]
  confidence: number
  requiresUserInput: boolean
}

export interface SendMessageResponse {
  success: boolean
  response: AIResponse
  updatedSession: ConversationSession
}

// Enhancement types
export type EnhancementType =
  | "field_improvement"
  | "section_enhancement"
  | "validation_fix"
  | "auto_completion"
  | "suggestion_application"

export interface EnhanceFieldRequest {
  sessionId: string
  fieldName: string
  currentValue: string
  enhancementType: EnhancementType
  formState?: Record<string, any>
  context?: string
}

export interface EnhanceFieldResponse {
  success: boolean
  enhancedValue: string
  explanation: string
  confidence: number
}

// Draft saving types
export interface SaveDraftRequest {
  sessionId: string
  formState: Record<string, any>
  conversationData?: ConversationMessage[]
}

export interface SaveDraftResponse {
  success: boolean
  savedAt: string | Date
  sessionId?: string
}

// AI enhancements tracking
export interface AIEnhancement {
  id: string
  conversationId: string
  fieldName: string
  originalValue: string
  enhancedValue: string
  enhancementType: EnhancementType
  createdAt: Date
}
