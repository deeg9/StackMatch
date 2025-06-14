// Enum definitions that exactly match the PostgreSQL enum definitions

export enum DealRoomStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  TERMINATED = "TERMINATED",
  ON_HOLD = "ON_HOLD",
  PENDING_CLOSURE = "PENDING_CLOSURE",
  CLOSED_SUCCESSFULLY = "CLOSED_SUCCESSFULLY",
  CLOSED_UNSUCCESSFULLY = "CLOSED_UNSUCCESSFULLY",
}

export enum ContractStatus {
  DRAFT = "DRAFT",
  PENDING_SIGNATURES = "PENDING_SIGNATURES",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  TERMINATED = "TERMINATED",
}

// These are the actual values from the database inspection
export enum MilestoneStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export enum FileType {
  CONTRACT = "CONTRACT",
  SCOPE_DOCUMENT = "SCOPE_DOCUMENT",
  INVOICE = "INVOICE",
  DELIVERABLE = "DELIVERABLE",
  OTHER = "OTHER",
}

// New enum for closure reason categories
export enum ClosureReasonCategory {
  PROJECT_COMPLETED = "PROJECT_COMPLETED",
  PROJECT_CANCELLED = "PROJECT_CANCELLED",
  MOVED_ELSEWHERE = "MOVED_ELSEWHERE",
  NO_LONGER_NEEDED = "NO_LONGER_NEEDED",
  DISPUTE = "DISPUTE",
  OTHER = "OTHER",
}

// New enum for closure outcome types
export enum ClosureOutcomeType {
  SUCCESSFUL = "SUCCESSFUL",
  UNSUCCESSFUL = "UNSUCCESSFUL",
  CANCELLED = "CANCELLED",
}

// Core interfaces that match our database tables exactly

export interface DealRoom {
  id: string
  listing_id: string | null
  proposal_id: string | null
  buyer_id: string
  seller_id: string
  status: DealRoomStatus
  room_name?: string
  created_at: string
  completed_at: string | null
  last_activity_at: string | null
}

export interface Contract {
  id: string
  deal_room_id: string
  title: string
  description: string | null
  value: number | null
  status: ContractStatus
  start_date: string | null
  end_date: string | null
  signed_at: string | null
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: string
  contract_id: string
  title: string
  description: string | null
  due_date: string | null
  status: MilestoneStatus
  amount: number | null
  is_payment_milestone: boolean
  submitted_at: string | null
  approved_at: string | null
  rejected_at: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface DealRoomFile {
  id: string
  deal_room_id: string
  uploader_id: string | null
  contract_id: string | null
  milestone_id: string | null
  file_name: string
  file_path: string
  file_size_bytes: number | null
  mime_type: string | null
  type: FileType
  description: string | null
  version: number
  parent_file_id: string | null
  is_latest: boolean
  created_at: string
  updated_at: string
}

export interface DealRoomMessage {
  id: string
  deal_room_id: string
  sender_id: string | null
  sender_type: "BUYER" | "SELLER" | "SYSTEM"
  content: string
  created_at: string
  updated_at: string | null
  is_read: boolean
}

export interface DealRoomDocument {
  id: string
  deal_room_id: string
  title: string
  content: string | null
  document_type: "SCOPE" | "PROPOSAL" | "CONTRACT" | "INVOICE" | "OTHER"
  created_at: string
  updated_at: string | null
  created_by_id: string | null
}

// New interface for deal room closures
export interface DealRoomClosure {
  id: string
  deal_room_id: string
  initiator_id: string
  initiator_type: "BUYER" | "SELLER"
  reason_category: ClosureReasonCategory
  reason_description?: string
  outcome_type: ClosureOutcomeType
  requested_at: string
  finalized_at?: string
  cooling_period_ends_at: string
  feedback_buyer_rating?: number
  feedback_buyer_comment?: string
  feedback_seller_rating?: number
  feedback_seller_comment?: string
  created_at: string
  updated_at: string
}

export interface ContractFile {
  id: string
  contract_id: string
  title: string
  description: string | null
  file_type: string | null
  is_active: boolean
  current_version_id: string | null
  uploaded_by: string
  created_at: string
  updated_at: string
}

export interface ContractFileVersion {
  id: string
  contract_file_id: string
  version_number: number
  blob_url: string
  file_type: string | null
  file_size_bytes: number | null
  change_description: string | null
  uploaded_by: string
  created_at: string
  updated_at: string
}
