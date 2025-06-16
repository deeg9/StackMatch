import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { getErrorMessage } from "@/lib/utils/error-handler"
import type {
  ProposalRequest,
  ProposalResponse,
  CreateProposalRequestData,
  CreateProposalResponseData,
} from "@/types/proposal-request-types"

interface ProposalRequestState {
  buyerRequests: ProposalRequest[]
  sellerRequests: ProposalRequest[]
  currentRequest: ProposalRequest | null
  isLoading: boolean
  error: string | null

  // Dashboard specific
  dashboardRequests: ProposalRequest[]
  dashboardLoading: boolean
  dashboardError: string | null
}

const initialState: ProposalRequestState = {
  buyerRequests: [],
  sellerRequests: [],
  currentRequest: null,
  isLoading: false,
  error: null,

  dashboardRequests: [],
  dashboardLoading: false,
  dashboardError: null,
}

// Async thunks
export const fetchBuyerProposalRequests = createAsyncThunk(
  "proposalRequests/fetchBuyerRequests",
  async (params: { status?: string; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams()
      if (params.status) searchParams.append("status", params.status)
      if (params.limit) searchParams.append("limit", String(params.limit))
      searchParams.append("type", "buyer")

      const response = await fetch(`/api/proposal-requests?${searchParams.toString()}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch buyer proposal requests")
      }
      const data = await response.json()
      return data.requests as ProposalRequest[]
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const fetchSellerProposalRequests = createAsyncThunk(
  "proposalRequests/fetchSellerRequests",
  async (params: { status?: string; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams()
      if (params.status) searchParams.append("status", params.status)
      if (params.limit) searchParams.append("limit", String(params.limit))
      searchParams.append("type", "seller")

      const response = await fetch(`/api/proposal-requests?${searchParams.toString()}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch seller proposal requests")
      }
      const data = await response.json()
      return data.requests as ProposalRequest[]
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const fetchDashboardProposalRequests = createAsyncThunk(
  "proposalRequests/fetchDashboardRequests",
  async (params: { userType: "buyer" | "seller"; limit?: number }, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams()
      searchParams.append("type", params.userType)
      searchParams.append("status", "PENDING")
      if (params.limit) searchParams.append("limit", String(params.limit))

      const response = await fetch(`/api/proposal-requests?${searchParams.toString()}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch dashboard proposal requests")
      }
      const data = await response.json()
      return data.requests as ProposalRequest[]
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const createProposalRequest = createAsyncThunk(
  "proposalRequests/create",
  async (requestData: CreateProposalRequestData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/proposal-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to create proposal request")
      }

      const data = await response.json()
      return data.request as ProposalRequest
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const fetchProposalRequest = createAsyncThunk(
  "proposalRequests/fetchSingle",
  async (requestId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/proposal-requests/${requestId}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch proposal request")
      }
      const data = await response.json()
      return data.request as ProposalRequest
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const createProposalResponse = createAsyncThunk(
  "proposalRequests/createResponse",
  async (responseData: CreateProposalResponseData, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/proposal-requests/${responseData.request_id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to create proposal response")
      }

      const data = await response.json()
      return { requestId: responseData.request_id, response: data.response as ProposalResponse }
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const acceptProposalResponse = createAsyncThunk(
  "proposalRequests/acceptResponse",
  async (responseId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/proposal-responses/${responseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to accept proposal response")
      }

      const data = await response.json()
      return data.response as ProposalResponse
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const createDealRoomFromProposal = createAsyncThunk(
  "proposalRequests/createDealRoom",
  async (params: { requestId: string; responseId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/proposal-responses/${params.responseId}/deal-room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: params.requestId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to create deal room")
      }

      const data = await response.json()
      return data.dealRoom
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

const proposalRequestsSlice = createSlice({
  name: "proposalRequests",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearDashboardError: (state) => {
      state.dashboardError = null
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch buyer requests
      .addCase(fetchBuyerProposalRequests.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBuyerProposalRequests.fulfilled, (state, action: PayloadAction<ProposalRequest[]>) => {
        state.isLoading = false
        state.buyerRequests = action.payload
      })
      .addCase(fetchBuyerProposalRequests.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch seller requests
      .addCase(fetchSellerProposalRequests.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSellerProposalRequests.fulfilled, (state, action: PayloadAction<ProposalRequest[]>) => {
        state.isLoading = false
        state.sellerRequests = action.payload
      })
      .addCase(fetchSellerProposalRequests.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch dashboard requests
      .addCase(fetchDashboardProposalRequests.pending, (state) => {
        state.dashboardLoading = true
        state.dashboardError = null
      })
      .addCase(fetchDashboardProposalRequests.fulfilled, (state, action: PayloadAction<ProposalRequest[]>) => {
        state.dashboardLoading = false
        state.dashboardRequests = action.payload
      })
      .addCase(fetchDashboardProposalRequests.rejected, (state, action) => {
        state.dashboardLoading = false
        state.dashboardError = action.payload as string
      })

      // Create proposal request
      .addCase(createProposalRequest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProposalRequest.fulfilled, (state, action: PayloadAction<ProposalRequest>) => {
        state.isLoading = false
        state.buyerRequests.unshift(action.payload)
      })
      .addCase(createProposalRequest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch single request
      .addCase(fetchProposalRequest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProposalRequest.fulfilled, (state, action: PayloadAction<ProposalRequest>) => {
        state.isLoading = false
        state.currentRequest = action.payload
      })
      .addCase(fetchProposalRequest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Create response
      .addCase(createProposalResponse.fulfilled, (state, action) => {
        const { requestId, response } = action.payload

        // Update the request in seller requests
        const sellerRequestIndex = state.sellerRequests.findIndex((req) => req.id === requestId)
        if (sellerRequestIndex !== -1) {
          if (!state.sellerRequests[sellerRequestIndex].responses) {
            state.sellerRequests[sellerRequestIndex].responses = []
          }
          state.sellerRequests[sellerRequestIndex].responses!.push(response)
          state.sellerRequests[sellerRequestIndex].status = "RESPONDED"
        }

        // Update current request if it matches
        if (state.currentRequest?.id === requestId) {
          if (!state.currentRequest.responses) {
            state.currentRequest.responses = []
          }
          state.currentRequest.responses.push(response)
          state.currentRequest.status = "RESPONDED"
        }
      })

      // Accept response
      .addCase(acceptProposalResponse.fulfilled, (state, action: PayloadAction<ProposalResponse>) => {
        const response = action.payload

        // Update in buyer requests
        const buyerRequest = state.buyerRequests.find((req: any) => req.responses?.some((r: any) => r.id === response.id))
        if (buyerRequest) {
          const responseIndex = buyerRequest.responses!.findIndex((r) => r.id === response.id)
          if (responseIndex !== -1) {
            buyerRequest.responses![responseIndex] = response
          }
          buyerRequest.status = "ACCEPTED"
        }

        // Update current request
        if (state.currentRequest?.responses) {
          const responseIndex = state.currentRequest.responses.findIndex((r) => r.id === response.id)
          if (responseIndex !== -1) {
            state.currentRequest.responses[responseIndex] = response
            state.currentRequest.status = "ACCEPTED"
          }
        }
      })
  },
})

export const { clearError, clearDashboardError, clearCurrentRequest } = proposalRequestsSlice.actions
export default proposalRequestsSlice.reducer
