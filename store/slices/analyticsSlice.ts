import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ProfileView {
  id: string
  viewerId?: string
  viewerType: "BUSINESS" | "PROVIDER" | "ANONYMOUS"
  viewerLocation?: string
  timestamp: string
  duration: number // seconds spent on profile
  referralSource: "SEARCH" | "DIRECT" | "LISTING" | "RECOMMENDATION" | "SOCIAL" | "OTHER"
  deviceType: "DESKTOP" | "MOBILE" | "TABLET"
  pageViewed: string
}

export interface EngagementEvent {
  id: string
  type: "MESSAGE_SENT" | "CONTACT_CLICKED" | "PORTFOLIO_VIEWED" | "REVIEW_READ" | "FOLLOW" | "UNFOLLOW" | "SHARE"
  userId?: string
  userType: "BUSINESS" | "PROVIDER" | "ANONYMOUS"
  timestamp: string
  metadata?: Record<string, any>
}

export interface ConversionEvent {
  id: string
  type: "BID_RECEIVED" | "PROJECT_AWARDED" | "CONTACT_FORM" | "QUOTE_REQUEST"
  value?: number
  projectId?: string
  timestamp: string
  source: string
}

export interface GeographicData {
  country: string
  region: string
  city: string
  views: number
  engagements: number
}

export interface TimeSeriesData {
  date: string
  views: number
  uniqueViews: number
  engagements: number
  conversions: number
  averageDuration: number
}

export interface AnalyticsMetrics {
  totalViews: number
  uniqueViews: number
  totalEngagements: number
  conversionRate: number
  averageSessionDuration: number
  bounceRate: number
  topReferralSources: { source: string; count: number; percentage: number }[]
  topPages: { page: string; views: number; percentage: number }[]
  deviceBreakdown: { device: string; count: number; percentage: number }[]
  peakHours: { hour: number; views: number }[]
}

export interface CompetitorBenchmark {
  metric: string
  yourValue: number
  industryAverage: number
  topPercentile: number
  rank: number
  totalCompetitors: number
}

export interface AnalyticsState {
  // Current period data
  metrics: AnalyticsMetrics | null
  timeSeriesData: TimeSeriesData[]
  geographicData: GeographicData[]
  recentViews: ProfileView[]
  recentEngagements: EngagementEvent[]
  conversions: ConversionEvent[]

  // Comparison data
  previousPeriodMetrics: AnalyticsMetrics | null
  competitorBenchmarks: CompetitorBenchmark[]

  // Settings
  selectedTimeRange: "7d" | "30d" | "90d" | "1y" | "all"
  selectedMetric: "views" | "engagements" | "conversions"
  autoRefresh: boolean

  // State
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: AnalyticsState = {
  metrics: null,
  timeSeriesData: [],
  geographicData: [],
  recentViews: [],
  recentEngagements: [],
  conversions: [],
  previousPeriodMetrics: null,
  competitorBenchmarks: [],
  selectedTimeRange: "30d",
  selectedMetric: "views",
  autoRefresh: true,
  isLoading: false,
  error: null,
  lastUpdated: null,
}

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMetrics: (state, action: PayloadAction<AnalyticsMetrics>) => {
      state.metrics = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    setTimeSeriesData: (state, action: PayloadAction<TimeSeriesData[]>) => {
      state.timeSeriesData = action.payload
    },
    setGeographicData: (state, action: PayloadAction<GeographicData[]>) => {
      state.geographicData = action.payload
    },
    setRecentViews: (state, action: PayloadAction<ProfileView[]>) => {
      state.recentViews = action.payload
    },
    setRecentEngagements: (state, action: PayloadAction<EngagementEvent[]>) => {
      state.recentEngagements = action.payload
    },
    setConversions: (state, action: PayloadAction<ConversionEvent[]>) => {
      state.conversions = action.payload
    },
    setPreviousPeriodMetrics: (state, action: PayloadAction<AnalyticsMetrics>) => {
      state.previousPeriodMetrics = action.payload
    },
    setCompetitorBenchmarks: (state, action: PayloadAction<CompetitorBenchmark[]>) => {
      state.competitorBenchmarks = action.payload
    },
    setTimeRange: (state, action: PayloadAction<AnalyticsState["selectedTimeRange"]>) => {
      state.selectedTimeRange = action.payload
    },
    setSelectedMetric: (state, action: PayloadAction<AnalyticsState["selectedMetric"]>) => {
      state.selectedMetric = action.payload
    },
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload
    },
    addProfileView: (state, action: PayloadAction<ProfileView>) => {
      state.recentViews.unshift(action.payload)
      if (state.recentViews.length > 100) {
        state.recentViews = state.recentViews.slice(0, 100)
      }
    },
    addEngagementEvent: (state, action: PayloadAction<EngagementEvent>) => {
      state.recentEngagements.unshift(action.payload)
      if (state.recentEngagements.length > 100) {
        state.recentEngagements = state.recentEngagements.slice(0, 100)
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setMetrics,
  setTimeSeriesData,
  setGeographicData,
  setRecentViews,
  setRecentEngagements,
  setConversions,
  setPreviousPeriodMetrics,
  setCompetitorBenchmarks,
  setTimeRange,
  setSelectedMetric,
  setAutoRefresh,
  addProfileView,
  addEngagementEvent,
} = analyticsSlice.actions

export default analyticsSlice.reducer
