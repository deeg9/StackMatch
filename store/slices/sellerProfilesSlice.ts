import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SellerProfile, PortfolioItem, TeamMember, Certification, Review } from "@/types"

interface SellerProfilesState {
  profiles: SellerProfile[]
  currentProfile: SellerProfile | null
  searchResults: SellerProfile[]
  filters: {
    skills: string[]
    location: string
    budgetRange: [number, number]
    rating: number
    availability: string
  }
  isLoading: boolean
  error: string | null
}

const initialState: SellerProfilesState = {
  profiles: [],
  currentProfile: null,
  searchResults: [],
  filters: {
    skills: [],
    location: "",
    budgetRange: [0, 1000000],
    rating: 0,
    availability: "",
  },
  isLoading: false,
  error: null,
}

const sellerProfilesSlice = createSlice({
  name: "sellerProfiles",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setProfiles: (state, action: PayloadAction<SellerProfile[]>) => {
      state.profiles = action.payload
    },
    addProfile: (state, action: PayloadAction<SellerProfile>) => {
      state.profiles.push(action.payload)
    },
    updateProfile: (state, action: PayloadAction<SellerProfile>) => {
      const index = state.profiles.findIndex((profile) => profile.id === action.payload.id)
      if (index !== -1) {
        state.profiles[index] = action.payload
      }
      if (state.currentProfile?.id === action.payload.id) {
        state.currentProfile = action.payload
      }
    },
    setCurrentProfile: (state, action: PayloadAction<SellerProfile | null>) => {
      state.currentProfile = action.payload
    },
    setSearchResults: (state, action: PayloadAction<SellerProfile[]>) => {
      state.searchResults = action.payload
    },
    updateFilters: (state, action: PayloadAction<Partial<SellerProfilesState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    addPortfolioItem: (state, action: PayloadAction<{ profileId: string; item: PortfolioItem }>) => {
      const { profileId, item } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        profile.portfolio.push(item)
      }
      if (state.currentProfile?.id === profileId) {
        state.currentProfile.portfolio.push(item)
      }
    },
    updatePortfolioItem: (state, action: PayloadAction<{ profileId: string; item: PortfolioItem }>) => {
      const { profileId, item } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        const index = profile.portfolio.findIndex((p: any) => p.id === item.id)
        if (index !== -1) {
          profile.portfolio[index] = item
        }
      }
      if (state.currentProfile?.id === profileId) {
        const index = state.currentProfile.portfolio.findIndex((p: any) => p.id === item.id)
        if (index !== -1) {
          state.currentProfile.portfolio[index] = item
        }
      }
    },
    removePortfolioItem: (state, action: PayloadAction<{ profileId: string; itemId: string }>) => {
      const { profileId, itemId } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        profile.portfolio = profile.portfolio.filter((item: any) => item.id !== itemId)
      }
      if (state.currentProfile?.id === profileId) {
        state.currentProfile.portfolio = state.currentProfile.portfolio.filter((item: any) => item.id !== itemId)
      }
    },
    addTeamMember: (state, action: PayloadAction<{ profileId: string; member: TeamMember }>) => {
      const { profileId, member } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        profile.team.push(member)
      }
      if (state.currentProfile?.id === profileId) {
        state.currentProfile.team.push(member)
      }
    },
    updateTeamMember: (state, action: PayloadAction<{ profileId: string; member: TeamMember }>) => {
      const { profileId, member } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        const index = profile.team.findIndex((m: any) => m.id === member.id)
        if (index !== -1) {
          profile.team[index] = member
        }
      }
      if (state.currentProfile?.id === profileId) {
        const index = state.currentProfile.team.findIndex((m: any) => m.id === member.id)
        if (index !== -1) {
          state.currentProfile.team[index] = member
        }
      }
    },
    removeTeamMember: (state, action: PayloadAction<{ profileId: string; memberId: string }>) => {
      const { profileId, memberId } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        profile.team = profile.team.filter((member: any) => member.id !== memberId)
      }
      if (state.currentProfile?.id === profileId) {
        state.currentProfile.team = state.currentProfile.team.filter((member: any) => member.id !== memberId)
      }
    },
    addCertification: (state, action: PayloadAction<{ profileId: string; certification: Certification }>) => {
      const { profileId, certification } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        profile.certifications.push(certification)
      }
      if (state.currentProfile?.id === profileId) {
        state.currentProfile.certifications.push(certification)
      }
    },
    updateCertification: (state, action: PayloadAction<{ profileId: string; certification: Certification }>) => {
      const { profileId, certification } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        const index = profile.certifications.findIndex((c: any) => c.id === certification.id)
        if (index !== -1) {
          profile.certifications[index] = certification
        }
      }
      if (state.currentProfile?.id === profileId) {
        const index = state.currentProfile.certifications.findIndex((c: any) => c.id === certification.id)
        if (index !== -1) {
          state.currentProfile.certifications[index] = certification
        }
      }
    },
    removeCertification: (state, action: PayloadAction<{ profileId: string; certificationId: string }>) => {
      const { profileId, certificationId } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        profile.certifications = profile.certifications.filter((cert: any) => cert.id !== certificationId)
      }
      if (state.currentProfile?.id === profileId) {
        state.currentProfile.certifications = state.currentProfile.certifications.filter(
          (cert: any) => cert.id !== certificationId,
        )
      }
    },
    addReview: (state, action: PayloadAction<{ profileId: string; review: Review }>) => {
      const { profileId, review } = action.payload
      const profile = state.profiles.find((p: any) => p.id === profileId)
      if (profile) {
        profile.reviews.push(review)
        // Recalculate average rating
        const totalRating = profile.reviews.reduce((sum: any, r: any) => sum + r.rating, 0)
        profile.rating = totalRating / profile.reviews.length
      }
      if (state.currentProfile?.id === profileId) {
        state.currentProfile.reviews.push(review)
        const totalRating = state.currentProfile.reviews.reduce((sum: any, r: any) => sum + r.rating, 0)
        state.currentProfile.rating = totalRating / state.currentProfile.reviews.length
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setProfiles,
  addProfile,
  updateProfile,
  setCurrentProfile,
  setSearchResults,
  updateFilters,
  addPortfolioItem,
  updatePortfolioItem,
  removePortfolioItem,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  addCertification,
  updateCertification,
  removeCertification,
  addReview,
} = sellerProfilesSlice.actions

export default sellerProfilesSlice.reducer
