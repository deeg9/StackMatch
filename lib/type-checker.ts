import type { User, Project, Bid, BusinessProfile, ProviderProfile, Message, Conversation } from "@/types"

// Type guards for runtime type checking
export const isUser = (obj: unknown): obj is User => {
  if (!obj || typeof obj !== "object") return false
  const user = obj as Record<string, unknown>

  return (
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.name === "string" &&
    ["BUSINESS", "PROVIDER", "ADMIN"].includes(user.userType as string)
  )
}

export const isProject = (obj: unknown): obj is Project => {
  if (!obj || typeof obj !== "object") return false
  const project = obj as Record<string, unknown>

  return (
    typeof project.id === "string" &&
    typeof project.title === "string" &&
    typeof project.description === "string" &&
    typeof project.businessId === "string" &&
    ["DRAFT", "OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(project.status as string)
  )
}

export const isBid = (obj: unknown): obj is Bid => {
  if (!obj || typeof obj !== "object") return false
  const bid = obj as Record<string, unknown>

  return (
    typeof bid.id === "string" &&
    typeof bid.listingId === "string" &&
    typeof bid.providerId === "string" &&
    typeof bid.title === "string" &&
    ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"].includes(
      bid.status as string,
    )
  )
}

export const isBusinessProfile = (obj: unknown): obj is BusinessProfile => {
  if (!obj || typeof obj !== "object") return false
  const profile = obj as Record<string, unknown>

  return typeof profile.id === "string" && typeof profile.userId === "string" && typeof profile.companyName === "string"
}

export const isProviderProfile = (obj: unknown): obj is ProviderProfile => {
  if (!obj || typeof obj !== "object") return false
  const profile = obj as Record<string, unknown>

  return (
    typeof profile.id === "string" &&
    typeof profile.userId === "string" &&
    typeof profile.businessName === "string" &&
    Array.isArray(profile.services)
  )
}

export const isMessage = (obj: unknown): obj is Message => {
  if (!obj || typeof obj !== "object") return false
  const message = obj as Record<string, unknown>

  return (
    typeof message.id === "string" &&
    typeof message.conversationId === "string" &&
    typeof message.senderId === "string" &&
    typeof message.content === "string" &&
    ["TEXT", "IMAGE", "FILE", "SYSTEM"].includes(message.type as string)
  )
}

export const isConversation = (obj: unknown): obj is Conversation => {
  if (!obj || typeof obj !== "object") return false
  const conversation = obj as Record<string, unknown>

  return (
    typeof conversation.id === "string" &&
    Array.isArray(conversation.participants) &&
    typeof conversation.unreadCount === "number"
  )
}

// Validation functions for API responses
export const validateApiResponse = <T>(
  data: unknown,
  validator: (obj: unknown) => obj is T,
  errorMessage: string
): T => {\
  if (!validator(data)) {\
    throw new Error(`${errorMessage}: Invalid data structure`)
  }
  return data
}

// Helper for validating arrays
export const validateArrayResponse = <T>(
  data: unknown,
  validator: (obj: unknown) => obj is T,
  errorMessage: string
): T[] => {\
  if (!Array.isArray(data)) {\
    throw new Error(`${errorMessage}: Expected array`)
  }
  
  return data.map((item, index) => {\
    if (!validator(item)) {\
      throw new Error(`${errorMessage}: Invalid item at index ${index}`)
    }
    return item
  })\
}
