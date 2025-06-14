import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { getErrorMessage } from "@/lib/utils/error-handler"

export type ListingStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "AWARDED" | "CANCELLED"

interface Listing {
  id: string
  title: string
  description: string
  category_id: string
  status: ListingStatus
  budget_min: number | null
  budget_max: number | null
  bid_deadline: string | null
  project_start_date: string | null
  project_duration: string | null
  required_skills: string[] | null
  location_preference: string | null
  remote_preference: string | null
  created_at: string
  updated_at: string | null
  published_at: string | null
  view_count: number
  buyer_id: string
  project_categories: {
    name: string
    slug: string
    description: string | null
  }
  listing_requirements: Array<{
    id: string
    listing_id: string
    requirement: string
    priority: string | null
    order_index: number | null
  }>
}

interface ListingsFilters {
  search: string
  category: string | null
  status: ListingStatus | null
  budgetMin: number | null
  budgetMax: number | null
  sortBy: string
  sortOrder: "asc" | "desc"
  location: string | null
  skills: string[]
}

interface ListingsPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface ListingsState {
  listings: Listing[]
  isLoading: boolean
  error: string | null
  filters: ListingsFilters
  pagination: ListingsPagination
  categories: Array<{ name: string; slug: string; description: string | null }>
}

const initialFilters: ListingsFilters = {
  search: "",
  category: null,
  status: null,
  budgetMin: null,
  budgetMax: null,
  sortBy: "created_at",
  sortOrder: "desc",
  location: null,
  skills: [],
}

const initialPagination: ListingsPagination = {
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPreviousPage: false,
}

const initialState: ListingsState = {
  listings: [],
  isLoading: false,
  error: null,
  filters: initialFilters,
  pagination: initialPagination,
  categories: [],
}

// Async thunk for fetching listings
export const fetchListings = createAsyncThunk("listings/fetchListings", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { listings: ListingsState }
    const { filters, pagination } = state.listings

    // Build query params
    const params = new URLSearchParams()
    params.append("page", pagination.currentPage.toString())
    params.append("limit", pagination.itemsPerPage.toString())

    if (filters.search) params.append("search", filters.search)
    if (filters.category) params.append("category", filters.category)
    if (filters.status) params.append("status", filters.status)
    if (filters.budgetMin) params.append("budgetMin", filters.budgetMin.toString())
    if (filters.budgetMax) params.append("budgetMax", filters.budgetMax.toString())
    if (filters.sortBy) params.append("sortBy", filters.sortBy)
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder)
    if (filters.location) params.append("location", filters.location)
    if (filters.skills.length > 0) params.append("skills", filters.skills.join(","))

    const response = await fetch(`/api/listings?${params.toString()}`)

    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.error || "Failed to fetch listings")
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    return rejectWithValue(getErrorMessage(error) || "Failed to fetch listings")
  }
})

// Async thunk for fetching a single listing
export const fetchListingById = createAsyncThunk(
  "listings/fetchListingById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/listings/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch listing")
      }

      const data = await response.json()
      return data.listing
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Failed to fetch listing")
    }
  },
)

// Async thunk for creating a listing
export const createListing = createAsyncThunk(
  "listings/createListing",
  async (listingData: Partial<Listing>, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      })

      if (!response.ok) {
        let errorDetail = `Server responded with status: ${response.status}`
        try {
          // Try to get more details from the response body if it's text/html
          const textError = await response.text()
          // Avoid showing a huge HTML page as an error, summarize or look for common phrases
          if (textError.toLowerCase().includes("internal server error") || textError.length > 500) {
            errorDetail = `Internal Server Error. Please check server logs and ensure environment variables are set. (Status: ${response.status})`
          } else {
            errorDetail = textError
          }
        } catch (e) {
          // Failed to read response body as text
        }
        return rejectWithValue(errorDetail)
      }

      try {
        const data = await response.json()
        return data.listing
      } catch (jsonError: any) {
        // Handle cases where response is OK but not valid JSON
        return rejectWithValue(`Failed to parse JSON response: ${jsonError.message}. Response might not be valid JSON.`)
      }
    } catch (error: any) {
      // Network errors or other issues
      return rejectWithValue(getErrorMessage(error) || "Failed to create listing due to a network or unexpected error")
    }
  },
)

// Async thunk for updating a listing
export const updateListing = createAsyncThunk(
  "listings/updateListing",
  async ({ id, data }: { id: string; data: Partial<Listing> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to update listing")
      }

      const responseData = await response.json()
      return responseData.listing
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Failed to update listing")
    }
  },
)

// Async thunk for deleting a listing
export const deleteListing = createAsyncThunk("listings/deleteListing", async (id: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.error || "Failed to delete listing")
    }

    return id
  } catch (error: any) {
    return rejectWithValue(getErrorMessage(error) || "Failed to delete listing")
  }
})

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk("listings/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/categories")

    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.error || "Failed to fetch categories")
    }

    const data = await response.json()
    return data.categories
  } catch (error: any) {
    return rejectWithValue(getErrorMessage(error) || "Failed to fetch categories")
  }
})

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    updateFilters: (state, action: PayloadAction<Partial<ListingsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      // Only reset to page 1 if it's not a page change
      if (!action.payload.hasOwnProperty("page")) {
        state.pagination.currentPage = 1
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
    clearFilters: (state) => {
      state.filters = initialFilters
      state.pagination.currentPage = 1
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch listings
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.isLoading = false
        state.listings = action.payload.listings
        state.pagination = action.payload.pagination
        if (action.payload.metadata?.availableCategories) {
          state.categories = action.payload.metadata.availableCategories
        }
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Create listing
      .addCase(createListing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isLoading = false
        state.listings.unshift(action.payload)
        state.pagination.totalItems += 1
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Update listing
      .addCase(updateListing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.listings.findIndex((listing) => listing.id === action.payload.id)
        if (index !== -1) {
          state.listings[index] = action.payload
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete listing
      .addCase(deleteListing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.isLoading = false
        state.listings = state.listings.filter((listing) => listing.id !== action.payload)
        state.pagination.totalItems -= 1
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { updateFilters, setPage, clearFilters } = listingsSlice.actions

export default listingsSlice.reducer
