import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address")
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters")
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number")

// User validation schemas
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  user_type: z.enum(["buyer", "seller"]),
  company_name: z.string().optional(),
  phone: phoneSchema.optional(),
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

// Listing validation schemas
export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  budget_min: z.number().min(0, "Minimum budget must be 0 or greater"),
  budget_max: z.number().min(0, "Maximum budget must be 0 or greater"),
  timeline: z.string().min(1, "Timeline is required"),
  category: z.string().min(1, "Category is required"),
  required_skills: z.array(z.string()).min(1, "At least one skill is required"),
  project_type: z.enum(["fixed", "hourly", "milestone"]),
  remote_ok: z.boolean().default(false),
  location: z.string().optional(),
})

// Proposal validation schemas
export const proposalSchema = z.object({
  listing_id: z.string().uuid("Invalid listing ID"),
  proposal_text: z.string().min(100, "Proposal must be at least 100 characters"),
  technical_approach: z.string().optional(),
  proposed_budget: z.number().min(1, "Budget must be greater than 0"),
  proposed_timeline: z.string().min(1, "Timeline is required"),
  portfolio_items: z.array(z.string()).optional(),
  additional_notes: z.string().optional(),
})

// Deal room validation schemas
export const dealRoomSchema = z.object({
  listing_id: z.string().uuid("Invalid listing ID"),
  proposal_id: z.string().uuid("Invalid proposal ID"),
  room_name: z.string().min(1, "Room name is required"),
})

// Message validation schemas
export const messageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  message_type: z.enum(["text", "file", "system"]).default("text"),
  file_url: z.string().url().optional(),
  file_name: z.string().optional(),
})

// File validation schemas
export const fileUploadSchema = z.object({
  file_name: z.string().min(1, "File name is required"),
  file_type: z.string().min(1, "File type is required"),
  file_size: z.number().max(10485760, "File size must be less than 10MB"), // 10MB
})

// Profile validation schemas
export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  company_name: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid website URL").optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  github: z.string().url("Invalid GitHub URL").optional(),
  skills: z.array(z.string()).optional(),
  hourly_rate: z.number().min(0, "Hourly rate must be 0 or greater").optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
})

// Export types
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>
export type UserLoginData = z.infer<typeof userLoginSchema>
export type ListingData = z.infer<typeof listingSchema>
export type ProposalData = z.infer<typeof proposalSchema>
export type DealRoomData = z.infer<typeof dealRoomSchema>
export type MessageData = z.infer<typeof messageSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>