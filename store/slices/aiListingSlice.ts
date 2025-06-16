import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { getErrorMessage } from "@/lib/utils/error-handler"
import type {
  ConversationMessage,
  AIListingSession,
  SendMessageRequest,
  SendMessageResponse,
  SaveDraftRequest,
  SaveDraftResponse,
  EnhanceFieldRequest,
  EnhanceFieldResponse,
} from "@/types/ai-listing-types-clean"
import type { ListingFormData } from "@/types/listing-types"

// Async thunks
export const sendMessage = createAsyncThunk<SendMessageResponse, SendMessageRequest>(
  "aiListing/sendMessage",
  async (payload, { rejectWithValue }) => {
    console.log("🔍 REDUX: Starting sendMessage thunk...")
    console.log("🔍 REDUX: Payload:", {
      sessionId: payload.sessionId,
      messageLength: payload.message?.length,
      formStateKeys: Object.keys(payload.currentFormState || {}),
    })

    try {
      console.log("🔍 REDUX: Making fetch request to /api/ai-listing/conversation...")
      const response = await fetch("/api/ai-listing/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: payload.message,
          sessionId: payload.sessionId,
          formState: payload.currentFormState,
          stage: payload.stage,
        }),
      })

      console.log("🔍 REDUX: Response status:", response.status)
      console.log("🔍 REDUX: Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("❌ REDUX: Response not ok, error text:", errorText)
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("✅ REDUX: Response data received:", {
        hasMessage: !!data.message,
        sessionId: data.sessionId,
      })

      return {
        success: true,
        response: {
          message: data.message,
          confidence: 0.8,
          requiresUserInput: true,
        },
        updatedSession: {
          id: data.conversationId || payload.sessionId,
          sessionId: payload.sessionId,
          userId: "current-user",
          messages: [],
          formState: payload.currentFormState || {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }
    } catch (error) {
      console.error("❌ REDUX: sendMessage error:", error)
      console.error("❌ REDUX: Error details:", error instanceof Error ? getErrorMessage(error) : "Unknown error")
      return rejectWithValue(error instanceof Error ? getErrorMessage(error) : "Network error occurred")
    }
  },
)

export const saveDraft = createAsyncThunk<SaveDraftResponse, SaveDraftRequest>(
  "aiListing/saveDraft",
  async (payload, { rejectWithValue }) => {
    console.log("🔍 REDUX: Starting saveDraft thunk...")
    console.log("🔍 REDUX: Payload:", {
      sessionId: payload.sessionId,
      formStateKeys: Object.keys(payload.formState || {}),
      conversationDataLength: payload.conversationData?.length || 0,
    })

    try {
      console.log("🔍 REDUX: Making fetch request to /api/ai-listing/save-draft...")
      const response = await fetch("/api/ai-listing/save-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: payload.sessionId,
          formState: payload.formState,
          conversationData: payload.conversationData,
        }),
      })

      console.log("🔍 REDUX: saveDraft response status:", response.status)
      console.log("🔍 REDUX: saveDraft response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("❌ REDUX: saveDraft response not ok, error text:", errorText)
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("✅ REDUX: saveDraft response data received")

      return {
        success: true,
        savedAt: data.savedAt || new Date().toISOString(),
        sessionId: payload.sessionId,
      }
    } catch (error) {
      console.error("❌ REDUX: saveDraft error:", error)
      console.error("❌ REDUX: saveDraft error details:", error instanceof Error ? getErrorMessage(error) : "Unknown error")
      return rejectWithValue(error instanceof Error ? getErrorMessage(error) : "Network error occurred")
    }
  },
)

export const enhanceField = createAsyncThunk<EnhanceFieldResponse, EnhanceFieldRequest>(
  "aiListing/enhanceField",
  async (payload, { rejectWithValue }) => {
    console.log("🔍 REDUX: Starting enhanceField thunk...")
    console.log("🔍 REDUX: Payload:", {
      sessionId: payload.sessionId,
      fieldName: payload.fieldName,
      enhancementType: payload.enhancementType,
    })

    try {
      console.log("🔍 REDUX: Making fetch request to /api/ai-listing/enhance-field...")
      const response = await fetch("/api/ai-listing/enhance-field", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: payload.fieldName,
          content: payload.currentValue,
          enhancementType: payload.enhancementType,
          context: payload.context,
        }),
      })

      console.log("🔍 REDUX: enhanceField response status:", response.status)
      console.log("🔍 REDUX: enhanceField response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("❌ REDUX: enhanceField response not ok, error text:", errorText)
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("✅ REDUX: enhanceField response data received")

      return {
        success: true,
        enhancedValue: data.enhancedContent || payload.currentValue,
        explanation: "Enhanced with AI assistance",
        confidence: 0.8,
      }
    } catch (error) {
      console.error("❌ REDUX: enhanceField error:", error)
      console.error("❌ REDUX: enhanceField error details:", error instanceof Error ? getErrorMessage(error) : "Unknown error")
      return rejectWithValue(error instanceof Error ? getErrorMessage(error) : "Network error occurred")
    }
  },
)

// Initial state
interface AIListingState {
  sessions: Record<string, AIListingSession>
  currentSessionId: string | null
  isLoading: boolean
  error: string | null
  lastSaved: string | null

  // Form state for the enhanced form
  formData: Partial<ListingFormData>
  aiPopulatedFields: Set<string>
  fieldVersionHistory: Record<string, string[]>
  enhancementSuggestions: Record<string, string>
  activeEnhancement: string | null
  highlightedFields: Set<string>
  formCompletionPercentage: number

  // UI state
  isConversationPanelOpen: boolean
}

const initialState: AIListingState = {
  sessions: {},
  currentSessionId: null,
  isLoading: false,
  error: null,
  lastSaved: null,

  // Form state
  formData: {},
  aiPopulatedFields: new Set(),
  fieldVersionHistory: {},
  enhancementSuggestions: {},
  activeEnhancement: null,
  highlightedFields: new Set(),
  formCompletionPercentage: 0,

  // UI state
  isConversationPanelOpen: true,
}

// Helper function to calculate form completion percentage
function calculateCompletionPercentage(formData: Partial<ListingFormData>): number {
  const requiredFields = ["title", "categoryId", "budgetMin", "bidDeadline", "aboutBusiness"]
  const optionalFields = [
    "budgetMax",
    "aboutCompany",
    "tags",
    "detailedNeeds",
    "successMetrics",
    "currentChallenges",
    "timelinePhases",
  ]

  const totalFields = requiredFields.length + optionalFields.length
  let completedFields = 0

  requiredFields.forEach((field: any) => {
    if (formData[field as keyof ListingFormData]) {
      completedFields += 1
    }
  })

  optionalFields.forEach((field: any) => {
    if (formData[field as keyof ListingFormData]) {
      completedFields += 0.5 // Optional fields count for half
    }
  })

  return Math.round((completedFields / totalFields) * 100)
}

// Slice
const aiListingSlice = createSlice({
  name: "aiListing",
  initialState,
  reducers: {
    initializeSession: (state, action: PayloadAction<string>) => {
      console.log("🔍 REDUX: Initializing session:", action.payload)
      const sessionId = action.payload

      // Prevent duplicate initialization
      if (state.currentSessionId === sessionId && state.sessions[sessionId]) {
        console.log("🔍 REDUX: Session already initialized and current:", sessionId)
        return
      }

      // Only create session if it doesn't exist
      if (!state.sessions[sessionId]) {
        console.log("🔍 REDUX: Creating new session:", sessionId)

        state.sessions[sessionId] = {
          id: sessionId,
          sessionId,
          userId: "current-user",
          messages: [
            {
              id: "welcome",
              role: "assistant",
              content:
                "Hi! I'm here to help you create a comprehensive project listing. Let's start by understanding what kind of software solution you need. Could you tell me about your project?",
              timestamp: new Date(),
            },
          ],
          formState: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      } else {
        console.log("🔍 REDUX: Session already exists:", sessionId)
      }

      state.currentSessionId = sessionId
      state.error = null
    },

    setCurrentSession: (state, action: PayloadAction<string>) => {
      console.log("🔍 REDUX: Setting current session:", action.payload)
      const sessionId = action.payload
      if (state.sessions[sessionId]) {
        state.currentSessionId = sessionId
        console.log("✅ REDUX: Current session set to:", sessionId)
      } else {
        console.error("❌ REDUX: Cannot set current session - session not found:", sessionId)
      }
    },

    addMessage: (state, action: PayloadAction<{ sessionId: string; message: Omit<ConversationMessage, "id"> }>) => {
      console.log(
        "🔍 REDUX: Adding message:",
        action.payload.message.role,
        action.payload.message.content.slice(0, 50) + "...",
      )
      const { sessionId, message } = action.payload

      if (state.sessions[sessionId]) {
        const newMessage: ConversationMessage = {
          ...message,
          id: `${message.role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }

        state.sessions[sessionId].messages.push(newMessage)
        state.sessions[sessionId].updatedAt = new Date()

        console.log("🔍 REDUX: Message added to session:", sessionId)
        console.log("🔍 REDUX: Session now has", state.sessions[sessionId].messages.length, "messages")
      } else {
        console.error("❌ REDUX: Failed to add message - session not found:", sessionId)
      }
    },

    updateFormState: (state, action: PayloadAction<{ sessionId: string; formState: Record<string, any> }>) => {
      console.log("🔍 REDUX: Updating form state for session:", action.payload.sessionId)
      const { sessionId, formState } = action.payload
      if (state.sessions[sessionId]) {
        state.sessions[sessionId].formState = { ...state.sessions[sessionId].formState, ...formState }
        state.sessions[sessionId].updatedAt = new Date()
      }
    },

    // Form field management actions
    updateFormField: (state, action: PayloadAction<{ field: string; value: any; isAIGenerated?: boolean }>) => {
      const { field, value, isAIGenerated = false } = action.payload

      // Store previous value in history
      if (!state.fieldVersionHistory[field]) {
        state.fieldVersionHistory[field] = []
      }
      if (state.formData[field as keyof ListingFormData]) {
        state.fieldVersionHistory[field].push(state.formData[field as keyof ListingFormData] as string)
      }

      // Update form data
      state.formData = { ...state.formData, [field]: value }

      // Track AI-populated fields
      if (isAIGenerated) {
        state.aiPopulatedFields.add(field)
        state.highlightedFields.add(field)
      }

      // Update completion percentage
      state.formCompletionPercentage = calculateCompletionPercentage(state.formData)
    },

    undoFieldChange: (state, action: PayloadAction<string>) => {
      const field = action.payload
      const history = state.fieldVersionHistory[field]

      if (history && history.length > 0) {
        const previousValue = history.pop()
        state.formData = { ...state.formData, [field]: previousValue }
        state.formCompletionPercentage = calculateCompletionPercentage(state.formData)
      }
    },

    addEnhancementSuggestion: (state, action: PayloadAction<{ field: string; suggestion: string }>) => {
      const { field, suggestion } = action.payload
      state.enhancementSuggestions[field] = suggestion
    },

    clearEnhancementSuggestion: (state, action: PayloadAction<string>) => {
      delete state.enhancementSuggestions[action.payload]
    },

    highlightField: (state, action: PayloadAction<string>) => {
      state.highlightedFields.add(action.payload)
    },

    clearHighlightedFields: (state) => {
      state.highlightedFields = new Set()
    },

    clearError: (state) => {
      state.error = null
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    clearSession: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload
      delete state.sessions[sessionId]
      if (state.currentSessionId === sessionId) {
        state.currentSessionId = null
      }
    },

    resetFormData: (state) => {
      state.formData = {}
      state.aiPopulatedFields = new Set()
      state.fieldVersionHistory = {}
      state.enhancementSuggestions = {}
      state.activeEnhancement = null
      state.highlightedFields = new Set()
      state.formCompletionPercentage = 0
    },

    loadExistingData: (
      state,
      action: PayloadAction<{ formData: Partial<ListingFormData>; sessionData?: AIListingSession }>,
    ) => {
      const { formData, sessionData } = action.payload

      // Load form data
      state.formData = { ...state.formData, ...formData }
      state.formCompletionPercentage = calculateCompletionPercentage(state.formData)

      // Load session data if provided
      if (sessionData) {
        state.sessions[sessionData.sessionId] = sessionData
        state.currentSessionId = sessionData.sessionId
      }

      // Clear any existing errors
      state.error = null

      console.log("🔍 REDUX: Loaded existing data:", {
        formDataKeys: Object.keys(formData),
        hasSessionData: !!sessionData,
        completionPercentage: state.formCompletionPercentage,
      })
    },

    toggleConversationPanel: (state, action: PayloadAction<boolean | undefined>) => {
      // If a boolean value is provided, use it; otherwise toggle the current state
      state.isConversationPanelOpen = action.payload !== undefined ? action.payload : !state.isConversationPanelOpen

      console.log("🔍 REDUX: Conversation panel toggled:", state.isConversationPanelOpen)
    },
  },

  extraReducers: (builder) => {
    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        console.log("🔍 REDUX: sendMessage pending...")
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        console.log("✅ REDUX: sendMessage fulfilled")
        state.isLoading = false
        const { response } = action.payload
        const originalSessionId = action.meta.arg.sessionId // Get the session ID from the original request

        if (response && originalSessionId && state.sessions[originalSessionId]) {
          // Add AI response to the correct session
          const aiMessage: ConversationMessage = {
            id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            role: "assistant",
            content: response.message,
            timestamp: new Date(),
            metadata: {
              confidence: response.confidence,
              suggestions: response.suggestions,
              nextQuestions: response.nextQuestions,
            },
          }

          console.log("🔍 REDUX: Adding AI response to session:", originalSessionId)
          console.log("🔍 REDUX: AI message content:", response.message.slice(0, 100) + "...")

          state.sessions[originalSessionId].messages.push(aiMessage)
          state.sessions[originalSessionId].updatedAt = new Date()

          console.log("🔍 REDUX: Session now has", state.sessions[originalSessionId].messages.length, "messages")
        } else {
          console.error("❌ REDUX: Failed to add AI response - missing session or response data")
          console.error("❌ REDUX: Session ID:", originalSessionId)
          console.error("❌ REDUX: Available sessions:", Object.keys(state.sessions))
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        console.log("❌ REDUX: sendMessage rejected:", action.payload)
        state.isLoading = false
        state.error = action.payload as string
      })

    // Save draft
    builder
      .addCase(saveDraft.pending, (state) => {
        console.log("🔍 REDUX: saveDraft pending...")
        // Don't set loading for draft saves to avoid UI blocking
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        console.log("✅ REDUX: saveDraft fulfilled")
        state.lastSaved = action.payload.savedAt
        state.error = null
      })
      .addCase(saveDraft.rejected, (state, action) => {
        console.log("❌ REDUX: saveDraft rejected:", action.payload)
        // Don't set error for draft saves to avoid disrupting user experience
        console.warn("Save draft failed:", action.payload)
      })

    // Enhance field
    builder
      .addCase(enhanceField.pending, (state, action) => {
        console.log("🔍 REDUX: enhanceField pending...")
        state.activeEnhancement = action.meta.arg.fieldName
        state.error = null
      })
      .addCase(enhanceField.fulfilled, (state, action) => {
        console.log("✅ REDUX: enhanceField fulfilled")
        state.activeEnhancement = null
        const { enhancedValue } = action.payload
        const fieldName = action.meta.arg.fieldName

        // Store previous value in history
        if (!state.fieldVersionHistory[fieldName]) {
          state.fieldVersionHistory[fieldName] = []
        }
        if (state.formData[fieldName as keyof ListingFormData]) {
          state.fieldVersionHistory[fieldName].push(state.formData[fieldName as keyof ListingFormData] as string)
        }

        // Update form data
        state.formData = { ...state.formData, [fieldName]: enhancedValue }
        state.aiPopulatedFields.add(fieldName)
        state.highlightedFields.add(fieldName)
        state.formCompletionPercentage = calculateCompletionPercentage(state.formData)
      })
      .addCase(enhanceField.rejected, (state, action) => {
        console.log("❌ REDUX: enhanceField rejected:", action.payload)
        state.activeEnhancement = null
        state.error = action.payload as string
      })
  },
})

export const {
  initializeSession,
  setCurrentSession,
  addMessage,
  updateFormState,
  updateFormField,
  undoFieldChange,
  addEnhancementSuggestion,
  clearEnhancementSuggestion,
  highlightField,
  clearHighlightedFields,
  clearSession,
  resetFormData,
  loadExistingData,
  toggleConversationPanel,
  clearError,
  setLoading,
} = aiListingSlice.actions

export default aiListingSlice.reducer

// Selectors
export const selectCurrentSession = (state: { aiListing: AIListingState }) => {
  const { sessions, currentSessionId } = state.aiListing
  return currentSessionId ? sessions[currentSessionId] : null
}

export const selectAllSessions = (state: { aiListing: AIListingState }) => state.aiListing.sessions

export const selectIsLoading = (state: { aiListing: AIListingState }) => state.aiListing.isLoading

export const selectError = (state: { aiListing: AIListingState }) => state.aiListing.error

export const selectLastSaved = (state: { aiListing: AIListingState }) => state.aiListing.lastSaved

export const selectFormData = (state: { aiListing: AIListingState }) => state.aiListing.formData

export const selectAIPopulatedFields = (state: { aiListing: AIListingState }) => state.aiListing.aiPopulatedFields

export const selectFieldVersionHistory = (state: { aiListing: AIListingState }) => state.aiListing.fieldVersionHistory

export const selectEnhancementSuggestions = (state: { aiListing: AIListingState }) =>
  state.aiListing.enhancementSuggestions

export const selectActiveEnhancement = (state: { aiListing: AIListingState }) => state.aiListing.activeEnhancement

export const selectHighlightedFields = (state: { aiListing: AIListingState }) => state.aiListing.highlightedFields

export const selectFormCompletionPercentage = (state: { aiListing: AIListingState }) =>
  state.aiListing.formCompletionPercentage

export const selectIsConversationPanelOpen = (state: { aiListing: AIListingState }) =>
  state.aiListing.isConversationPanelOpen
