import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

interface SavedListing {
  id: string
  companyName: string
  title: string
  budget: string
  deadline: string
  location: string
  tags: string[]
  savedAt: string
}

interface SavedListingsState {
  savedListings: SavedListing[]
  isLoading: boolean
  error: string | null
}

const initialState: SavedListingsState = {
  savedListings: [],
  isLoading: false,
  error: null
}

// Async thunks
export const loadSavedListings = createAsyncThunk(
  'savedListings/loadSavedListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/saved-listings')
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || 'Failed to load saved listings')
      }
      const data = await response.json()
      return data.savedListings
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const saveListing = createAsyncThunk(
  'savedListings/saveListing',
  async (listing: Omit<SavedListing, 'savedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/saved-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listing.id })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || 'Failed to save listing')
      }
      
      return { ...listing, savedAt: new Date().toISOString() }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const removeSavedListing = createAsyncThunk(
  'savedListings/removeSavedListing',
  async (listingId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/saved-listings/${listingId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || 'Failed to remove saved listing')
      }
      
      return listingId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

const savedListingsSlice = createSlice({
  name: 'savedListings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Load saved listings
      .addCase(loadSavedListings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadSavedListings.fulfilled, (state, action: PayloadAction<SavedListing[]>) => {
        state.isLoading = false
        state.savedListings = action.payload
      })
      .addCase(loadSavedListings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Save listing
      .addCase(saveListing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(saveListing.fulfilled, (state, action: PayloadAction<SavedListing>) => {
        state.isLoading = false
        state.savedListings.unshift(action.payload)
      })
      .addCase(saveListing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Remove saved listing
      .addCase(removeSavedListing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeSavedListing.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.savedListings = state.savedListings.filter(listing => listing.id !== action.payload)
      })
      .addCase(removeSavedListing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError } = savedListingsSlice.actions
export default savedListingsSlice.reducer
