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
  ContractFile,
  ContractFileVersion,
  DealRoomParticipant,
  // Add Approval if/when you define it
} from "./deal-room-types"

// Conversation and messaging types
export type {
  Conversation,
  ConversationType,
  Participant,
  MessageSummary,
  ConversationParticipant,
  Message,
} from "./conversation-types"

// Forum types
export type {
  ForumThread,
  ForumComment,
  ForumCategory,
  ForumNotification,
  ForumUser,
  ForumThreadType,
  CreateForumThreadPayload,
  CreateForumCommentPayload,
} from "./forum-types"

// Additional missing types
export interface AuthUser {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  user_type: string | null
}

export interface TypingUser {
  userId: string
  conversationId: string
  isTyping: boolean
  timestamp: string
}

export interface Reaction {
  id: string
  message_id: string
  user_id: string
  emoji: string
  created_at: string
  user?: {
    id: string
    full_name: string
  }
}

// Add other exports from this file if necessary
// ...

export interface UserProfile {
  id: string // Corresponds to auth.users.id
  full_name: string | null
  avatar_url: string | null
  user_type: string | null
  // other user-specific details not related to buyer/seller role
}

export interface SellerProfile {
  id: string // Primary key for seller_profiles table
  user_id: string // Foreign key to auth.users.id
  company_name?: string | null
  contact_name?: string | null // Or use UserProfile.full_name
  // ... other seller-specific business details
  
  // Extended properties to match usage patterns
  portfolio: PortfolioItem[]
  team: TeamMember[]
  certifications: Certification[]
  reviews: Review[]
  rating: number
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
  // Extended properties for UI compatibility
  companyLogo?: string | null
  companyName?: string | null
  location?: string | null
  isNew?: boolean
  isActive?: boolean
  tags?: string[] | null
  budget?: number | string | null
  deadline?: string | null
  growth?: number | null
  views?: number | null
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

// User type
export interface User {
  id: string
  email: string
  name: string
  userType: "BUSINESS" | "PROVIDER" | "ADMIN"
  createdAt: string
  updatedAt: string
  company?: string
  full_name?: string
}

// Project type  
export interface Project {
  id: string
  title: string
  description: string
  businessId: string
  status: "DRAFT" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  createdAt: string
  updatedAt: string
}

// Bid type
export interface Bid {
  id: string
  listingId: string
  providerId: string
  title: string
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
  createdAt: string
  updatedAt: string
}

// Business Profile type
export interface BusinessProfile {
  id: string
  userId: string
  companyName: string
  createdAt: string
  updatedAt: string
}


// Portfolio Item type
export interface PortfolioItem {
  id: string
  sellerId: string
  title: string
  description: string
  projectType?: string
  clientIndustry?: string
  technologiesUsed: string[]
  projectUrl?: string
  completionDate?: string
  isPublic: boolean
  isFeatured?: boolean
  createdAt: string
  updatedAt: string
  portfolio_images?: PortfolioImage[]
}

export interface PortfolioImage {
  id: string
  portfolioItemId: string
  imageUrl: string
  caption?: string
  sortOrder: number
  createdAt: string
}

// Team Member type
export interface TeamMember {
  id: string
  sellerId: string
  name: string
  role: string
  bio?: string
  avatarUrl?: string
  yearsExperience?: number
  specializations?: string[]
  email?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Certification type
export interface Certification {
  id: string
  sellerId: string
  certificationName: string
  issuingOrganization: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  verificationUrl?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// Provider Profile type (comprehensive seller profile)
export interface ProviderProfile {
  id: string
  userId: string
  businessName: string // Used by type checker
  companyName?: string // Alternative property name
  description: string
  industry: string
  companySize: string
  foundingYear?: number
  location: string
  logoUrl?: string
  bannerImageUrl?: string
  websiteUrl?: string
  isVerified: boolean
  isAcceptingProjects: boolean
  nextAvailableDate?: string
  healthScore: number
  createdAt: string
  updatedAt: string
  
  // Related data - used by type checker
  services?: SellerService[] // Used by type checker
  seller_metrics?: SellerMetrics
  seller_services?: SellerService[]
  seller_technologies?: SellerTechnology[]
  seller_portfolio?: PortfolioItem[]
  seller_team_members?: TeamMember[]
  seller_certifications?: Certification[]
  seller_badges?: SellerBadge[]
  portfolio?: PortfolioItem[]
  team?: TeamMember[]
  certifications?: Certification[]
  reviews?: Review[]
  rating?: number
}

// Supporting types for ProviderProfile
export interface SellerMetrics {
  id: string
  sellerId: string
  totalProjects: number
  completedProjects: number
  averageRating: number
  totalReviews: number
  responseTimeHours: number
  completionRate: number
  onTimeDeliveryRate: number
  repeatClientRate: number
  winRate: number
  totalEarnings: number
  averageProjectValue: number
  createdAt: string
  updatedAt: string
}

export interface SellerService {
  id: string
  sellerId: string
  serviceName: string
  description: string
  category: string
  startingPrice: number
  deliveryTimeWeeks: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SellerTechnology {
  id: string
  sellerId: string
  technologyName: string
  experienceYears: number
  proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
  createdAt: string
}

export interface SellerBadge {
  id: string
  sellerId: string
  badgeName: string
  description: string
  iconUrl?: string
  earnedAt: string
  createdAt: string
}


// Seller type
export interface Seller {
  id: string
  name: string
  email: string
  company_name?: string
  skills: string[]
  rating: number
  completedProjects: number
  location: string
  hourlyRate: number
  availability: string
  profile_image?: string
  bio?: string
  is_top_rated?: boolean
  average_rating?: number
  total_reviews?: number
  projects_count?: number
  description?: string
  expertise?: string[]
  response_time?: string
  experience?: string
  hourly_rate?: number
}

// Contract File Category type
export type ContractFileCategory = "main" | "addendum" | "supporting" | "amendment"
