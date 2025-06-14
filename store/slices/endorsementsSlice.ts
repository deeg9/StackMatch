import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface PartnerPlatform {
  id: string
  name: string
  logo: string
  website: string
  description: string
  category: "crm" | "erp" | "cloud" | "analytics" | "ecommerce" | "other"
  isActive: boolean
  endorsementCriteria: {
    minimumCertifications: number
    minimumProjects: number
    minimumRating: number
    requiredTraining: string[]
  }
}

export interface Endorsement {
  id: string
  providerId: string
  platformId: string
  platformName: string
  platformLogo: string
  badgeType: "certified_partner" | "premier_partner" | "elite_partner" | "implementation_specialist" | "custom"
  badgeLevel: "bronze" | "silver" | "gold" | "platinum"
  title: string
  description: string
  issuedDate: string
  expiryDate?: string
  isActive: boolean
  isVerified: boolean
  verificationDate?: string
  verifiedBy?: string

  // Endorsement details
  endorsementDetails: {
    projectsCompleted: number
    clientSatisfactionScore: number
    certificationLevel: string
    specializations: string[]
    endorsementQuote?: string
    endorsedBy: {
      name: string
      title: string
      company: string
      avatar?: string
    }
  }

  // Supporting evidence
  evidence: {
    certificationIds: string[]
    projectReferences: string[]
    testimonials: Array<{
      id: string
      clientName: string
      projectTitle: string
      quote: string
      rating: number
    }>
  }

  // Display settings
  displaySettings: {
    showOnProfile: boolean
    showInSearch: boolean
    priority: number
  }
}

export interface EndorsementApplication {
  id: string
  providerId: string
  platformId: string
  requestedBadgeType: string
  requestedLevel: string
  applicationDate: string
  status: "pending" | "under_review" | "approved" | "rejected" | "requires_info"
  submittedEvidence: {
    certifications: string[]
    projectPortfolio: string[]
    clientReferences: string[]
    additionalDocuments: string[]
  }
  reviewNotes?: string
  reviewedBy?: string
  reviewedDate?: string
}

interface EndorsementsState {
  // Platform partners
  platforms: PartnerPlatform[]

  // Provider endorsements
  endorsements: Endorsement[]
  providerEndorsements: Record<string, Endorsement[]>

  // Applications
  applications: EndorsementApplication[]

  // UI state
  isLoading: boolean
  error: string | null
  selectedPlatform: PartnerPlatform | null

  // Filters
  filters: {
    platform: string
    badgeType: string
    level: string
    category: string
  }
}

const initialState: EndorsementsState = {
  platforms: [],
  endorsements: [],
  providerEndorsements: {},
  applications: [],
  isLoading: false,
  error: null,
  selectedPlatform: null,
  filters: {
    platform: "all",
    badgeType: "all",
    level: "all",
    category: "all",
  },
}

const endorsementsSlice = createSlice({
  name: "endorsements",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setPlatforms: (state, action: PayloadAction<PartnerPlatform[]>) => {
      state.platforms = action.payload
    },
    setEndorsements: (state, action: PayloadAction<Endorsement[]>) => {
      state.endorsements = action.payload
    },
    setProviderEndorsements: (state, action: PayloadAction<{ providerId: string; endorsements: Endorsement[] }>) => {
      state.providerEndorsements[action.payload.providerId] = action.payload.endorsements
    },
    addEndorsement: (state, action: PayloadAction<Endorsement>) => {
      state.endorsements.push(action.payload)
      const providerId = action.payload.providerId
      if (!state.providerEndorsements[providerId]) {
        state.providerEndorsements[providerId] = []
      }
      state.providerEndorsements[providerId].push(action.payload)
    },
    updateEndorsement: (state, action: PayloadAction<Endorsement>) => {
      const index = state.endorsements.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state.endorsements[index] = action.payload
      }

      // Update in provider endorsements
      const providerId = action.payload.providerId
      if (state.providerEndorsements[providerId]) {
        const providerIndex = state.providerEndorsements[providerId].findIndex((e) => e.id === action.payload.id)
        if (providerIndex !== -1) {
          state.providerEndorsements[providerId][providerIndex] = action.payload
        }
      }
    },
    setApplications: (state, action: PayloadAction<EndorsementApplication[]>) => {
      state.applications = action.payload
    },
    addApplication: (state, action: PayloadAction<EndorsementApplication>) => {
      state.applications.push(action.payload)
    },
    updateApplication: (state, action: PayloadAction<EndorsementApplication>) => {
      const index = state.applications.findIndex((a) => a.id === action.payload.id)
      if (index !== -1) {
        state.applications[index] = action.payload
      }
    },
    setSelectedPlatform: (state, action: PayloadAction<PartnerPlatform | null>) => {
      state.selectedPlatform = action.payload
    },
    updateFilters: (state, action: PayloadAction<Partial<EndorsementsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        platform: "all",
        badgeType: "all",
        level: "all",
        category: "all",
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setPlatforms,
  setEndorsements,
  setProviderEndorsements,
  addEndorsement,
  updateEndorsement,
  setApplications,
  addApplication,
  updateApplication,
  setSelectedPlatform,
  updateFilters,
  clearFilters,
} = endorsementsSlice.actions

export default endorsementsSlice.reducer
