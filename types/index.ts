// Ensure all new/updated types from deal-room-types.ts are exported.
// For example, if they weren't already:

export type {
  DealRoom,
  DealRoomStatus,
  Contract,
  ContractStatus,
  Milestone,
  MilestoneStatus,
  DealRoomFile,
  FileType,
  ContractFileVersion,
  // Add Approval if/when you define it
} from "./deal-room-types"

// Add other exports from this file if necessary
// ...

export interface UserProfile {
  id: string // Corresponds to auth.users.id
  full_name?: string | null
  avatar_url?: string | null
  // other user-specific details not related to buyer/seller role
}

export interface SellerProfile {
  id: string // Primary key for seller_profiles table
  user_id: string // Foreign key to auth.users.id
  company_name?: string | null
  contact_name?: string | null // Or use UserProfile.full_name
  // ... other seller-specific business details
}

export interface BuyerProfile {
  id: string
  user_id: string
  company_name?: string | null
  // ... other buyer-specific details
}

export interface Proposal {
  id: string
  title: string
  seller_profile_id: string
  listing_id?: string | null
  amount?: number | null
  status?: string | null // e.g., 'SUBMITTED', 'ACCEPTED', 'REJECTED'
  created_at: string
  due_date?: string | null // Or submission_deadline
  // ... other proposal fields
  listings?: {
    // Example for joined data
    buyers?: {
      company_name?: string | null
    } | null
  } | null
}

export interface Listing {
  id: string
  title: string
  description?: string | null
  buyer_profile_id?: string | null // The user/company who created the listing
  winning_seller_profile_id?: string | null
  status?: string | null // e.g., 'OPEN', 'AWARDED', 'COMPLETED'
  created_at: string
  budget_min?: number | null
  budget_max?: number | null
  // ... other listing fields
}

export interface Project {
  // Example table for tracking awarded/completed work
  id: string
  listing_id: string
  seller_profile_id: string
  status: string // e.g., 'IN_PROGRESS', 'COMPLETED_PAID'
  amount_earned?: number | null
}

export interface Review {
  id: string
  seller_profile_id: string
  buyer_profile_id: string
  listing_id: string
  rating: number // e.g., 1-5
  comment?: string | null
  created_at: string
}
