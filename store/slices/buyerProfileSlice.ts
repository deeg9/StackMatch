import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface BuyerProfile {
  id: string
  user_id: string
  company_name?: string
  company_size?: string
  industry?: string
  company_description?: string
  website_url?: string
  company_address?: string
  primary_contact_name?: string
  primary_contact_email?: string
  primary_contact_phone?: string
  secondary_contact_name?: string
  secondary_contact_email?: string
  typical_project_budget_min?: number
  typical_project_budget_max?: number
  preferred_project_duration?: string
  preferred_communication_methods?: string[]
  timezone?: string
  primary_goals?: string[]
  success_metrics?: string[]
  previous_experience_level?: string
  verification_status?: string
  verification_documents?: string[]
  is_verified?: boolean
  created_at: string
  updated_at: string
}

interface BuyerProfileState {
  profile: BuyerProfile | null
  loading: boolean
  error: string | null
  lastFetch: number | null
  updateLoading: boolean
  createLoading: boolean
}

const initialState: BuyerProfileState = {
  profile: null,
  loading: false,
  error: null,
  lastFetch: null,
  updateLoading: false,
  createLoading: false,
}

// Async thunks with enhanced error handling
export const fetchBuyerProfile = createAsyncThunk("buyerProfile/fetch", async (_, { rejectWithValue }) => {
  try {
    console.log("🔍 REDUX: Fetching buyer profile...")

    const response = await fetch("/api/buyer-profiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("🔍 REDUX: Response status:", response.status)
    console.log("🔍 REDUX: Response ok:", response.ok)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("🔍 REDUX: API error:", errorData)
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log("🔍 REDUX: Profile data received:", !!data.profile)

    return data.profile
  } catch (error) {
    console.error("🔍 REDUX: Fetch error:", error)
    return rejectWithValue(error.message)
  }
})

export const updateBuyerProfile = createAsyncThunk(
  "buyerProfile/update",
  async (profileData: Partial<BuyerProfile>, { rejectWithValue }) => {
    try {
      console.log("🔍 REDUX: Updating buyer profile...", Object.keys(profileData))

      const response = await fetch("/api/buyer-profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("🔍 REDUX: Update error:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("🔍 REDUX: Profile updated successfully")

      return data.profile
    } catch (error) {
      console.error("🔍 REDUX: Update error:", error)
      return rejectWithValue(error.message)
    }
  },
)

export const createBuyerProfile = createAsyncThunk(
  "buyerProfile/create",
  async (profileData: Partial<BuyerProfile>, { rejectWithValue }) => {
    try {
      console.log("🔍 REDUX: Creating buyer profile...", Object.keys(profileData))

      const response = await fetch("/api/buyer-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("🔍 REDUX: Create error:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("🔍 REDUX: Profile created successfully")

      return data.profile
    } catch (error) {
      console.error("🔍 REDUX: Create error:", error)
      return rejectWithValue(error.message)
    }
  },
)

const buyerProfileSlice = createSlice({
  name: "buyerProfile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearProfile: (state) => {
      state.profile = null
      state.error = null
      state.lastFetch = null
    },
    setProfile: (state, action: PayloadAction<BuyerProfile>) => {
      state.profile = action.payload
      state.error = null
      state.lastFetch = Date.now()
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch buyer profile
      .addCase(fetchBuyerProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBuyerProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null
        state.lastFetch = Date.now()
      })
      .addCase(fetchBuyerProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update buyer profile
      .addCase(updateBuyerProfile.pending, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateBuyerProfile.fulfilled, (state, action) => {
        state.updateLoading = false
        state.profile = action.payload
        state.error = null
        state.lastFetch = Date.now()
      })
      .addCase(updateBuyerProfile.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

      // Create buyer profile
      .addCase(createBuyerProfile.pending, (state) => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createBuyerProfile.fulfilled, (state, action) => {
        state.createLoading = false
        state.profile = action.payload
        state.error = null
        state.lastFetch = Date.now()
      })
      .addCase(createBuyerProfile.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearProfile, setProfile } = buyerProfileSlice.actions
export default buyerProfileSlice.reducer
