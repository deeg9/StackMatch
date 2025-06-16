import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { getErrorMessage } from "@/lib/utils/error-handler"
import type { Proposal, ProposalMilestone } from "@/types/proposal-types"

interface ProposalState {
  proposals: Proposal[] // For general proposal lists (e.g., seller's own proposals)
  currentProposal: Proposal | null
  isLoading: boolean // General loading for single/list operations
  error: string | null // General error

  dashboardProposals: Proposal[] // Specifically for buyer dashboard recent proposals
  dashboardProposalsLoading: boolean
  dashboardProposalsError: string | null
}

const initialState: ProposalState = {
  proposals: [],
  currentProposal: null,
  isLoading: false,
  error: null,

  dashboardProposals: [],
  dashboardProposalsLoading: false,
  dashboardProposalsError: null,
}

// Async thunks

// Fetches proposals based on various filters (listingId, sellerId, status)
export const fetchProposals = createAsyncThunk(
  "proposals/fetchProposals",
  async (
    params: { listingId?: string; sellerId?: string; status?: string; limit?: number } = {},
    { rejectWithValue },
  ) => {
    try {
      const searchParams = new URLSearchParams()
      if (params.listingId) searchParams.append("listing_id", params.listingId)
      if (params.sellerId) searchParams.append("seller_id", params.sellerId)
      if (params.status) searchParams.append("status", params.status)
      if (params.limit) searchParams.append("limit", String(params.limit))

      const response = await fetch(`/api/proposals?${searchParams.toString()}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch proposals")
      }
      const data = await response.json()
      return data.proposals as Proposal[]
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

// Fetches proposals specifically for the buyer's dashboard
export const fetchDashboardProposals = createAsyncThunk(
  "proposals/fetchDashboardProposals",
  async (params: { buyerId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams()
      searchParams.append("buyer_id", params.buyerId)
      if (params.limit) searchParams.append("limit", String(params.limit))

      const response = await fetch(`/api/proposals?${searchParams.toString()}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch dashboard proposals")
      }
      const data = await response.json()
      return data.proposals as Proposal[]
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const fetchProposal = createAsyncThunk(
  "proposals/fetchProposal",
  async (proposalId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch proposal")
      }
      const data = await response.json()
      return data.proposal as Proposal
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const submitProposal = createAsyncThunk(
  "proposals/submitProposal",
  async (
    proposalData: {
      listing_id: string
      cover_letter: string
      proposed_budget: number
      proposed_timeline?: string
      technical_approach?: string
      relevant_experience?: string
      milestones?: Omit<ProposalMilestone, "id" | "proposal_id">[] // Milestones without IDs for creation
      status?: "DRAFT" | "SUBMITTED"
      is_sealed?: boolean
      attachments?: any[]
    },
    { rejectWithValue },
  ) => {
    console.log("🔍 REDUX DEBUG: submitProposal thunk started with data:", proposalData)

    try {
      console.log("🔍 REDUX DEBUG: Making POST request to /api/proposals")
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalData),
      })

      console.log("🔍 REDUX DEBUG: POST response status:", response.status)

      // Get the response body as text first for debugging
      const responseText = await response.text()
      console.log("🔍 REDUX DEBUG: Response body (text):", responseText)

      // Try to parse as JSON
      let responseData
      try {
        responseData = JSON.parse(responseText)
        console.log("🔍 REDUX DEBUG: Parsed response data:", responseData)
      } catch (e) {
        console.error("🔍 REDUX DEBUG: Failed to parse response as JSON:", e)
        return rejectWithValue("Invalid JSON response from server")
      }

      if (!response.ok) {
        console.error("🔍 REDUX DEBUG: Error response:", responseData)
        return rejectWithValue(responseData.error || responseData.details || "Failed to submit proposal")
      }

      console.log("🔍 REDUX DEBUG: Successful response:", responseData)
      return responseData.proposal as Proposal
    } catch (error: any) {
      console.error("🔍 REDUX DEBUG: Exception in submitProposal:", error)
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const updateProposal = createAsyncThunk(
  "proposals/updateProposal",
  async (
    {
      proposalId,
      updates,
    }: {
      proposalId: string
      updates: Partial<Omit<Proposal, "id" | "listing_id" | "seller_id" | "created_at" | "updated_at">> & {
        milestones?: Partial<ProposalMilestone>[] // Allow updating milestones
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to update proposal")
      }

      const data = await response.json()
      return data.proposal as Proposal
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

export const deleteProposal = createAsyncThunk(
  "proposals/deleteProposal",
  async (proposalId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to delete proposal")
      }

      return proposalId // Return the ID of the deleted proposal
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

const proposalSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {
    clearProposalError: (state) => {
      state.error = null
    },
    clearCurrentProposal: (state) => {
      state.currentProposal = null
    },
    clearDashboardProposalsError: (state) => {
      state.dashboardProposalsError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch proposals (general list)
      .addCase(fetchProposals.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProposals.fulfilled, (state, action: PayloadAction<Proposal[]>) => {
        state.isLoading = false
        state.proposals = action.payload
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch Dashboard Proposals
      .addCase(fetchDashboardProposals.pending, (state) => {
        state.dashboardProposalsLoading = true
        state.dashboardProposalsError = null
      })
      .addCase(fetchDashboardProposals.fulfilled, (state, action: PayloadAction<Proposal[]>) => {
        state.dashboardProposalsLoading = false
        state.dashboardProposals = action.payload
      })
      .addCase(fetchDashboardProposals.rejected, (state, action) => {
        state.dashboardProposalsLoading = false
        state.dashboardProposalsError = action.payload as string
      })

      // Fetch single proposal
      .addCase(fetchProposal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProposal.fulfilled, (state, action: PayloadAction<Proposal>) => {
        state.isLoading = false
        state.currentProposal = action.payload
      })
      .addCase(fetchProposal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Submit proposal
      .addCase(submitProposal.pending, (state) => {
        console.log("🔍 REDUX DEBUG: submitProposal.pending")
        state.isLoading = true
        state.error = null
      })
      .addCase(submitProposal.fulfilled, (state, action: PayloadAction<Proposal>) => {
        console.log("🔍 REDUX DEBUG: submitProposal.fulfilled with payload:", action.payload)
        state.isLoading = false
        // Add to general proposals list if relevant (e.g., if it's the seller viewing their own)
        // state.proposals.unshift(action.payload);
        state.currentProposal = action.payload // Set as current after submission
        // Potentially add to dashboardProposals if the context matches, or trigger a refetch
      })
      .addCase(submitProposal.rejected, (state, action) => {
        console.log("🔍 REDUX DEBUG: submitProposal.rejected with error:", action.payload)
        state.isLoading = false
        state.error = action.payload as string
      })

      // Update proposal
      .addCase(updateProposal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProposal.fulfilled, (state, action: PayloadAction<Proposal>) => {
        state.isLoading = false
        const index = state.proposals.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.proposals[index] = action.payload
        }
        const dashboardIndex = state.dashboardProposals.findIndex((p) => p.id === action.payload.id)
        if (dashboardIndex !== -1) {
          state.dashboardProposals[dashboardIndex] = action.payload
        }
        if (state.currentProposal?.id === action.payload.id) {
          state.currentProposal = action.payload
        }
      })
      .addCase(updateProposal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete proposal
      .addCase(deleteProposal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProposal.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.proposals = state.proposals.filter((p: any: any) => p.id !== action.payload)
        state.dashboardProposals = state.dashboardProposals.filter((p: any: any) => p.id !== action.payload)
        if (state.currentProposal?.id === action.payload) {
          state.currentProposal = null
        }
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearProposalError, clearCurrentProposal, clearDashboardProposalsError } = proposalSlice.actions
export default proposalSlice.reducer
