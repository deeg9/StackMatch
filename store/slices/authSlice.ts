import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/types" // Import the extended User type

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
}

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    if (!response.ok) throw new Error("Login failed")
    return response.json()
  },
)

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName: string
    userType: "SELLER" | "BUYER"
  }) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error("Signup failed")
    return response.json()
  },
)

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async () => {
  const response = await fetch("/api/auth/me")
  if (!response.ok) throw new Error("Failed to fetch user")
  return response.json()
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user // action.payload.user will now be the extended User type
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Login failed"
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user // action.payload.user will now be the extended User type
        state.isAuthenticated = true
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Signup failed"
      })

      // Fetch current user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user // action.payload.user will now be the extended User type
        state.isAuthenticated = true
      })
  },
})

export const { setUser, clearUser, setLoading, setError, logout } = authSlice.actions
export default authSlice.reducer
