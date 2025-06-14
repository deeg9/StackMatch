import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getErrorMessage } from "@/lib/utils/error-handler"

interface SavedSeller {
  id: string
  name: string
  company: string
  location: string
  rating: number
  specialties: string[]
  experience: string
  hourlyRate: string
  completedProjects: number
  responseTime: string
  avatar?: string
  savedAt: string
}

interface SavedSellersState {
  savedSellers: SavedSeller[]
  isLoading: boolean
  error: string | null
}

const initialState: SavedSellersState = {
  savedSellers: [],
  isLoading: false,
  error: null,
}

// Async thunk for saving a seller
export const saveSeller = createAsyncThunk("savedSellers/saveSeller", async (seller: Omit<SavedSeller, "savedAt">) => {
  try {
    // In a real app, this would be an API call
    const savedSeller: SavedSeller = {
      ...seller,
      savedAt: new Date().toISOString(),
    }

    // Save to localStorage for persistence
    const existingSaved = JSON.parse(localStorage.getItem("savedSellers") || "[]")
    const updatedSaved = [...existingSaved, savedSeller]
    localStorage.setItem("savedSellers", JSON.stringify(updatedSaved))

    return savedSeller
  } catch (error) {
    throw error
  }
})

// Async thunk for removing a saved seller
export const removeSavedSeller = createAsyncThunk("savedSellers/removeSavedSeller", async (sellerId: string) => {
  try {
    // Remove from localStorage
    const existingSaved = JSON.parse(localStorage.getItem("savedSellers") || "[]")
    const updatedSaved = existingSaved.filter((seller: SavedSeller) => seller.id !== sellerId)
    localStorage.setItem("savedSellers", JSON.stringify(updatedSaved))

    return sellerId
  } catch (error) {
    throw error
  }
})

// Async thunk for loading saved sellers from localStorage
export const loadSavedSellers = createAsyncThunk("savedSellers/loadSavedSellers", async () => {
  try {
    const savedSellers = JSON.parse(localStorage.getItem("savedSellers") || "[]")
    return savedSellers
  } catch (error) {
    return []
  }
})

const savedSellersSlice = createSlice({
  name: "savedSellers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Save seller
      .addCase(saveSeller.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(saveSeller.fulfilled, (state, action) => {
        state.savedSellers.push(action.payload)
        state.isLoading = false
        state.error = null
      })
      .addCase(saveSeller.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || "Failed to save seller"
      })
      // Remove saved seller
      .addCase(removeSavedSeller.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeSavedSeller.fulfilled, (state, action) => {
        state.savedSellers = state.savedSellers.filter((seller) => seller.id !== action.payload)
        state.isLoading = false
        state.error = null
      })
      .addCase(removeSavedSeller.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || "Failed to remove saved seller"
      })
      // Load saved sellers
      .addCase(loadSavedSellers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadSavedSellers.fulfilled, (state, action) => {
        state.savedSellers = action.payload
        state.isLoading = false
        state.error = null
      })
      .addCase(loadSavedSellers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || "Failed to load saved sellers"
      })
  },
})

export const { clearError } = savedSellersSlice.actions
export default savedSellersSlice.reducer
