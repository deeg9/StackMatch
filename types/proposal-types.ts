export interface ProposalMilestone {
  id: string
  proposal_id: string
  title: string
  description: string
  deliverables: string[]
  amount: number
  duration_days: number | null
  order_index: number
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  due_date: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Proposal {
  id: string
  listing_id: string
  seller_id: string
  cover_letter: string
  proposed_budget: number
  proposed_timeline: string | null
  technical_approach: string | null
  relevant_experience: string | null
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
  is_sealed: boolean
  submitted_at: string | null
  reviewed_at: string | null
  withdrawn_at: string | null
  withdrawal_reason: string | null
  created_at: string
  updated_at: string

  // Relations
  milestones?: ProposalMilestone[]
  seller_profile?: {
    id: string
    company_name: string
    full_name: string
    avatar_url: string | null
  }
  listing?: {
    id: string
    title: string
    budget_min: number | null
    budget_max: number | null
  }
}

export interface CreateProposalRequest {
  listing_id: string
  cover_letter: string
  proposed_budget: number
  proposed_timeline?: string | null
  technical_approach?: string | null
  relevant_experience?: string | null
  milestones?: {
    title: string
    description: string
    deliverables: string[]
    amount: number
    duration_days: number | null
    order_index: number
  }[]
  status: "DRAFT" | "SUBMITTED"
  is_sealed: boolean
}

export interface ProposalResponse {
  proposal: Proposal
  message: string
}

export interface ProposalsListResponse {
  proposals: Proposal[]
  total: number
  page: number
  limit: number
}
