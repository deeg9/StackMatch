export interface ForumUser {
  id: string // UUID
  name?: string | null
  avatar_url?: string | null
  role?: string // e.g., "BUSINESS", "PROVIDER"
  isVerified?: boolean
  reputation?: number
}

export interface ForumCategory {
  id: string
  name: string
  description?: string
  thread_count?: number
  color?: string
}

export interface ForumNotification {
  id: string
  user_id: string
  type: string
  message: string
  is_read: boolean
  created_at: string
  related_thread_id?: string
  related_comment_id?: string
  isRead?: boolean
  createdAt?: string
  threadId?: string
  commentId?: string
}

export type ForumThreadType = "DISCUSSION" | "QUESTION" | "ANNOUNCEMENT" | "POLL"

export interface ForumThread {
  id: string // UUID
  title: string
  content: string
  category: string // Category name (e.g., "CRM Tools")
  tags: string[] // Tag names (e.g., ["SaaS", "Startup"])
  type: ForumThreadType
  isAnonymous: boolean
  createdAt: string // ISO Date String
  updatedAt: string // ISO Date String
  author: ForumUser
  stats: {
    views: number
    upvotes: number
    downvotes: number
    comments: number
  }
  hasBestAnswer?: boolean
  pollOptions?: { id: string; text: string; votes: number }[] | null
  // comments?: ForumComment[] // Optionally populated for individual thread view
}

export interface ForumComment {
  id: string // UUID
  threadId: string // UUID
  parentId?: string | null // UUID, for nested replies
  content: string
  isAnonymous: boolean
  createdAt: string // ISO Date String
  updatedAt: string // ISO Date String
  author: ForumUser
  stats: {
    upvotes: number
    downvotes: number
  }
  isBestAnswer: boolean
  replies?: ForumComment[] // For nested comments, populated on fetch
}

// For API request payloads
export type CreateForumThreadPayload = {
  title: string
  content: string
  category_id?: string // Changed from category to category_id
  tag_names?: string[] // Changed from tags to tag_names
  thread_type: ForumThreadType // Changed from type to thread_type
  is_anonymous?: boolean // Changed from isAnonymous to is_anonymous
  poll_options?: string[] // Array of option texts if thread_type is 'POLL'
  poll_allow_multiple_choices?: boolean
  poll_ends_at?: string | null
  // authorId will be inferred from the session server-side
}

export type CreateForumCommentPayload = {
  content: string
  isAnonymous?: boolean
  parentId?: string | null
  // author_id and thread_id will be inferred server-side/from path
}

// Payloads for voting/actions might be needed later
// e.g., UpdateCommentPayload, VotePayload etc.
