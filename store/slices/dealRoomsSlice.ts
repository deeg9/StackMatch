import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { getErrorMessage } from "@/lib/utils/error-handler"
import {
  DealRoomStatus,
  type ClosureReasonCategory,
  ClosureOutcomeType,
  type DealRoomClosure,
} from "@/types/deal-room-types"

interface DealRoom {
  id: string
  listingId: string
  listingTitle: string
  bidId: string
  businessId: string
  businessName: string
  providerId: string
  providerName: string
  providerCompany: string
  status: DealRoomStatus
  createdAt: string
  updatedAt: string
  closingDate?: string
  projectBudget: number
  projectTimeline: string
  files: Array<{
    id: string
    name: string
    size: number
    type: string
    url: string
    uploadedBy: string
    uploadedByName: string
    uploadedAt: string
    category: "reference" | "deliverable" | "contract"
  }>
  milestones: Array<{
    id: string
    title: string
    description: string
    dueDate: string
    status: "pending" | "in_progress" | "completed" | "overdue"
    deliverables: string[]
    assignedTo: "provider" | "business"
    completedAt?: string
  }>
  messages: Array<{
    id: string
    senderId: string
    senderName: string
    senderType: "BUSINESS" | "PROVIDER"
    content: string
    timestamp: string
    type: "message" | "system"
  }>
  lastActivity: string
  sharedNotes: string
  contractStatus: "pending" | "signed" | "completed"
  unreadCount: {
    business: number
    provider: number
  }
  // New fields for closure
  pendingClosure?: {
    requestedAt: string
    initiatorType: "BUYER" | "SELLER"
    reasonCategory: ClosureReasonCategory
    reasonDescription?: string
    coolingPeriodEndsAt: string
  }
}

interface DealRoomsState {
  dealRooms: DealRoom[]
  isLoading: boolean
  error: string | null
  filters: {
    status: string
    search: string
  }
  // New state for closure operations
  closureOperation: {
    isLoading: boolean
    error: string | null
    success: boolean
  }
  closures: {
    [dealRoomId: string]: DealRoomClosure
  }
  closureLoading: boolean
  closureError: string | null
}

const initialState: DealRoomsState = {
  dealRooms: [],
  isLoading: false,
  error: null,
  filters: {
    status: "all",
    search: "",
  },
  closureOperation: {
    isLoading: false,
    error: null,
    success: false,
  },
  closures: {},
  closureLoading: false,
  closureError: null,
}

// Async thunk for requesting deal room closure
export const requestDealRoomClosure = createAsyncThunk(
  "dealRooms/requestClosure",
  async (
    params: {
      dealRoomId: string
      reasonCategory: ClosureReasonCategory
      reasonDescription?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/deal-rooms/${params.dealRoomId}/close/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reasonCategory: params.reasonCategory,
          reasonDescription: params.reasonDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to request deal room closure")
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

// Async thunk for confirming deal room closure
export const confirmDealRoomClosure = createAsyncThunk(
  "dealRooms/confirmClosure",
  async (
    params: {
      dealRoomId: string
      outcomeType: ClosureOutcomeType
      feedbackRating?: number
      feedbackComment?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/deal-rooms/${params.dealRoomId}/close/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcomeType: params.outcomeType,
          feedbackRating: params.feedbackRating,
          feedbackComment: params.feedbackComment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to confirm deal room closure")
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

// Async thunk for cancelling deal room closure
export const cancelDealRoomClosure = createAsyncThunk(
  "dealRooms/cancelClosure",
  async (
    params: {
      dealRoomId: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/deal-rooms/${params.dealRoomId}/close/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to cancel deal room closure")
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

// Async thunk for submitting feedback
export const submitDealRoomFeedback = createAsyncThunk(
  "dealRooms/submitFeedback",
  async (
    params: {
      dealRoomId: string
      rating: number
      comment?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/deal-rooms/${params.dealRoomId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: params.rating,
          comment: params.comment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to submit feedback")
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

const dealRoomsSlice = createSlice({
  name: "dealRooms",
  initialState,
  reducers: {
    setDealRooms: (state, action: PayloadAction<DealRoom[]>) => {
      state.dealRooms = action.payload
      state.isLoading = false
      state.error = null
    },
    updateFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    resetClosureOperation: (state) => {
      state.closureOperation = {
        isLoading: false,
        error: null,
        success: false,
      }
    },
  },
  extraReducers: (builder) => {
    // Request closure
    builder.addCase(requestDealRoomClosure.pending, (state) => {
      state.closureOperation.isLoading = true
      state.closureOperation.error = null
      state.closureOperation.success = false
      state.closureLoading = true
      state.closureError = null
    })
    builder.addCase(requestDealRoomClosure.fulfilled, (state, action) => {
      state.closureOperation.isLoading = false
      state.closureOperation.success = true
      state.closureLoading = false

      // Update the specific deal room status
      const dealRoomIndex = state.dealRooms.findIndex((dr) => dr.id === action.payload.dealRoomId)
      if (dealRoomIndex !== -1) {
        state.dealRooms[dealRoomIndex].status = DealRoomStatus.PENDING_CLOSURE
        state.dealRooms[dealRoomIndex].pendingClosure = {
          requestedAt: action.payload.requestedAt,
          initiatorType: action.payload.initiatorType,
          reasonCategory: action.payload.reasonCategory,
          reasonDescription: action.payload.reasonDescription,
          coolingPeriodEndsAt: action.payload.coolingPeriodEndsAt,
        }
      }

      // Store the closure information
      state.closures[action.payload.dealRoomId] = {
        id: action.payload.closureId,
        dealRoomId: action.payload.dealRoomId,
        initiatorId: action.meta.arg.initiatorId || "",
        initiatorType: action.meta.arg.initiatorType || "BUYER",
        reasonCategory: action.meta.arg.reasonCategory,
        reasonDescription: action.meta.arg.reasonDescription,
        outcomeType: ClosureOutcomeType.CANCELLED,
        requestedAt: new Date().toISOString(),
        coolingPeriodEndsAt: action.payload.coolingPeriodEndsAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })
    builder.addCase(requestDealRoomClosure.rejected, (state, action) => {
      state.closureOperation.isLoading = false
      state.closureOperation.error = action.payload as string
      state.closureOperation.success = false
      state.closureLoading = false
      state.closureError = action.payload as string
    })

    // Confirm closure
    builder.addCase(confirmDealRoomClosure.pending, (state) => {
      state.closureOperation.isLoading = true
      state.closureOperation.error = null
      state.closureOperation.success = false
      state.closureLoading = true
      state.closureError = null
    })
    builder.addCase(confirmDealRoomClosure.fulfilled, (state, action) => {
      state.closureOperation.isLoading = false
      state.closureOperation.success = true
      state.closureLoading = false

      // Update the specific deal room status
      const dealRoomIndex = state.dealRooms.findIndex((dr) => dr.id === action.payload.dealRoomId)
      if (dealRoomIndex !== -1) {
        state.dealRooms[dealRoomIndex].status =
          action.meta.arg.outcomeType === ClosureOutcomeType.SUCCESSFUL
            ? DealRoomStatus.CLOSED_SUCCESSFULLY
            : DealRoomStatus.CLOSED_UNSUCCESSFULLY

        // Remove the pending closure data
        delete state.dealRooms[dealRoomIndex].pendingClosure
      }

      // Update the closure information
      if (state.closures[action.payload.dealRoomId]) {
        state.closures[action.payload.dealRoomId].outcomeType = action.meta.arg.outcomeType
        state.closures[action.payload.dealRoomId].finalizedAt = new Date().toISOString()
        state.closures[action.payload.dealRoomId].updatedAt = new Date().toISOString()
      }
    })
    builder.addCase(confirmDealRoomClosure.rejected, (state, action) => {
      state.closureOperation.isLoading = false
      state.closureOperation.error = action.payload as string
      state.closureOperation.success = false
      state.closureLoading = false
      state.closureError = action.payload as string
    })

    // Cancel closure
    builder.addCase(cancelDealRoomClosure.pending, (state) => {
      state.closureOperation.isLoading = true
      state.closureOperation.error = null
      state.closureOperation.success = false
      state.closureLoading = true
      state.closureError = null
    })
    builder.addCase(cancelDealRoomClosure.fulfilled, (state, action) => {
      state.closureOperation.isLoading = false
      state.closureOperation.success = true
      state.closureLoading = false

      // Update the specific deal room status back to ACTIVE
      const dealRoomIndex = state.dealRooms.findIndex((dr) => dr.id === action.payload.dealRoomId)
      if (dealRoomIndex !== -1) {
        state.dealRooms[dealRoomIndex].status = DealRoomStatus.ACTIVE

        // Remove the pending closure data
        delete state.dealRooms[dealRoomIndex].pendingClosure
      }

      // Update the closure information
      if (state.closures[action.payload.dealRoomId]) {
        state.closures[action.payload.dealRoomId].outcomeType = ClosureOutcomeType.CANCELLED
        state.closures[action.payload.dealRoomId].finalizedAt = new Date().toISOString()
        state.closures[action.payload.dealRoomId].updatedAt = new Date().toISOString()
      }
    })
    builder.addCase(cancelDealRoomClosure.rejected, (state, action) => {
      state.closureOperation.isLoading = false
      state.closureOperation.error = action.payload as string
      state.closureOperation.success = false
      state.closureLoading = false
      state.closureError = action.payload as string
    })

    // Submit feedback
    builder.addCase(submitDealRoomFeedback.pending, (state) => {
      state.closureOperation.isLoading = true
      state.closureOperation.error = null
      state.closureOperation.success = false
      state.closureLoading = true
      state.closureError = null
    })
    builder.addCase(submitDealRoomFeedback.fulfilled, (state) => {
      state.closureOperation.isLoading = false
      state.closureOperation.success = true
      state.closureLoading = false
    })
    builder.addCase(submitDealRoomFeedback.rejected, (state, action) => {
      state.closureOperation.isLoading = false
      state.closureOperation.error = action.payload as string
      state.closureOperation.success = false
      state.closureLoading = false
      state.closureError = action.payload as string
    })
  },
})

export const { setDealRooms, updateFilters, setLoading, setError, resetClosureOperation } = dealRoomsSlice.actions
export default dealRoomsSlice.reducer
