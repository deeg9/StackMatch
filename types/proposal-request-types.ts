export interface ProposalRequest {
  id: string
  buyer_id: string
  seller_id: string
  title: string
  description: string
  budget_min?: number
  budget_max?: number
  timeline_days?: number
  deadline?: string
  urgency_level: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  required_skills?: string[]
  status: "PENDING" | "RESPONDED" | "ACCEPTED" | "DECLINED" | "EXPIRED"
  created_at: string
  updated_at: string

  // Populated relations
  buyer?: {
    id: string
    full_name?: string
    email: string
    avatar_url?: string
  }
  seller?: {
    user_id: string
    company_name?: string
    expertise?: string[]
  }
  responses?: ProposalResponse[]
  files?: ProposalRequestFile[]
}

export interface ProposalResponse {
  id: string
  request_id: string
  price: number
  timeline_days: number
  scope_description: string
  terms_conditions?: string
  validity_period_days: number
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "REVISED"
  created_at: string
  updated_at: string

  // Relations
  milestones?: ProposalResponseMilestone[]
  files?: ProposalResponseFile[]
}

export interface ProposalResponseMilestone {
  id: string
  response_id: string
  title: string
  description: string
  amount: number
  duration_days: number
  order_index: number
  created_at: string
  updated_at: string
}

export interface ProposalRequestFile {
  id: string
  request_id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  uploaded_by: string
  created_at: string
}

export interface ProposalResponseFile {
  id: string
  response_id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  uploaded_by: string
  created_at: string
}

export interface CreateProposalRequestData {
  seller_id: string
  title: string
  description: string
  budget_min?: number
  budget_max?: number
  timeline_days?: number
  deadline?: string
  urgency_level?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  required_skills?: string[]
}

export interface CreateProposalResponseData {
  request_id: string
  price: number
  timeline_days: number
  scope_description: string
  terms_conditions?: string
  validity_period_days?: number
  milestones?: Omit<ProposalResponseMilestone, "id" | "response_id" | "created_at" | "updated_at">[]
}
