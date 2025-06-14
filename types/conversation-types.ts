// Conversation and messaging related types

export type ConversationType = "PROPOSAL_DISCUSSION" | "DEAL_ROOM" | "GENERAL" | "SUPPORT"

export interface Conversation {
  id: string
  type: ConversationType
  listing_id: string | null
  proposal_id: string | null
  created_at: string
  updated_at: string
  participants: Participant[]
  lastMessage: MessageSummary | null
  unreadCount?: number
  isArchived?: boolean
  // Related data
  listings?: {
    title: string
  } | null
  proposals?: {
    id: string
  } | null
}

export interface Participant {
  id: string
  user_id: string
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
    user_type: string | null
  }
  name: string
  avatar: string
  last_read_at: string | null
  is_archived: boolean
  joined_at: string
  isCurrentUser: boolean
}

export interface MessageSummary {
  id: string
  content: string
  timestamp: string
  senderId: string
  encrypted: boolean
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  last_read_at: string | null
  is_archived: boolean
  joined_at: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_encrypted: boolean
  message_type: "TEXT" | "FILE" | "SYSTEM"
  file_url: string | null
  file_name: string | null
  created_at: string
  updated_at: string
}

