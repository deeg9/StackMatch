// Centralized types for listing functionality

export interface DetailedNeed {
  id: string
  title: string
  description: string
}

export interface SuccessMetric {
  id: string
  label: string
  currentValue: string
  targetValue: string
  unit: string
}

export interface Challenge {
  id: string
  title: string
  description: string
}

export interface TimelinePhase {
  id: string
  title: string
  startDate: string
  endDate: string
  duration: string
}

export interface AttachmentFile {
  id: string
  name: string
  size: string
  url?: string // For existing attachments with URLs
}

export interface ListingFormData {
  title: string
  description?: string
  categoryId?: string
  budgetMin?: string
  budgetMax?: string
  bidDeadline?: string
  projectStartDate?: string
  projectDuration?: string
  requiredSkills?: string[]
  locationPreference?: string
  remotePreference?: string
  aboutBusiness?: string
  aboutCompany?: string
  successMetrics?: SuccessMetric[]
  currentChallenges?: Challenge[]
  timelinePhases?: TimelinePhase[]
  tags?: string[]
  detailedNeeds?: DetailedNeed[]
  attachments?: AttachmentFile[]
}

// Raw API response shape
export interface RawListingData {
  id: string
  title: string
  description: string
  category_id?: string
  status: string
  budget_min?: number
  budget_max?: number
  bid_deadline?: string
  required_skills?: string[]
  about_company?: string
  about_business?: string
  attachments?: Array<{ id: string; name: string; size: string; url?: string }>
  success_metrics?: Array<{ id: string; label: string; currentValue: string; targetValue: string; unit: string }>
  current_challenges?: Array<{ id: string; title: string; description: string }>
  timeline_phases?: Array<{ id: string; title: string; startDate: string; endDate: string; duration: string }>
  listing_requirements?: Array<{ id: string; requirement: string; title?: string; priority?: string }>
}

// API payload shape
export interface ApiListingData {
  id?: string
  title: string
  description?: string
  category_id?: string
  status: "DRAFT" | "ACTIVE"
  budget_min?: number
  budget_max?: number
  bid_deadline?: string
  project_start_date?: string
  project_duration?: string
  required_skills?: string[]
  location_preference?: string
  remote_preference?: string
  about_company?: string
  about_business?: string
  attachments?: any[]
  success_metrics?: any[]
  current_challenges?: any[]
  timeline_phases?: any[]
  detailedNeeds?: Array<{ title: string; description: string; priority?: string }>
}
