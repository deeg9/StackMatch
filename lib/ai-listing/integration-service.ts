import type { ListingFormData } from "@/types/listing-types"
import type { ConversationSession } from "@/types/ai-listing-types"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/server"
import { sanitizeFieldValue, validateFieldValue } from "./response-parser"

/**
 * Service to handle integration between AI-generated content and the listing system
 */
export class ListingIntegrationService {
  /**
   * Convert AI conversation data to a valid listing form
   */
  static convertToListingForm(session: ConversationSession): {
    listingData: ListingFormData
    validationErrors: string[]
    completionPercentage: number
  } {
    const formState = session.formState
    const validationErrors: string[] = []

    // Validate and sanitize each field
    const sanitizedData: Record<string, any> = {}

    // Process required fields
    const requiredFields = ["title", "categoryId", "budgetMin", "bidDeadline", "aboutBusiness"]
    requiredFields.forEach((field) => {
      if (!formState[field]) {
        validationErrors.push(`Missing required field: ${field}`)
      } else {
        const { isValid, error } = validateFieldValue(field, formState[field])
        if (!isValid) {
          validationErrors.push(error || `Invalid value for ${field}`)
        }
        sanitizedData[field] = sanitizeFieldValue(field, formState[field])
      }
    })

    // Process optional fields
    const optionalFields = [
      "budgetMax",
      "aboutCompany",
      "tags",
      "detailedNeeds",
      "successMetrics",
      "currentChallenges",
      "timelinePhases",
    ]

    optionalFields.forEach((field) => {
      if (formState[field]) {
        sanitizedData[field] = sanitizeFieldValue(field, formState[field])
      }
    })

    // Calculate completion percentage
    const totalFields = requiredFields.length + optionalFields.length
    let completedFields = 0

    requiredFields.forEach((field) => {
      if (sanitizedData[field]) completedFields += 1
    })

    optionalFields.forEach((field) => {
      if (sanitizedData[field]) completedFields += 0.5 // Optional fields count as half
    })

    const completionPercentage = Math.round((completedFields / totalFields) * 100)

    // Convert to ListingFormData
    const listingData: ListingFormData = {
      title: sanitizedData.title || "",
      description: sanitizedData.aboutBusiness || "",
      categoryId: sanitizedData.categoryId,
      budgetMin: sanitizedData.budgetMin,
      budgetMax: sanitizedData.budgetMax,
      bidDeadline: sanitizedData.bidDeadline,
      aboutBusiness: sanitizedData.aboutBusiness || "",
      aboutCompany: sanitizedData.aboutCompany || "",
      tags: sanitizedData.tags || [],
      detailedNeeds: sanitizedData.detailedNeeds || [],
      successMetrics: sanitizedData.successMetrics || [],
      currentChallenges: sanitizedData.currentChallenges || [],
      timelinePhases: sanitizedData.timelinePhases || [],
      attachments: sanitizedData.attachments || [],
    }

    return {
      listingData,
      validationErrors,
      completionPercentage,
    }
  }

  /**
   * Save AI-generated listing to the database
   */
  static async saveToDatabase(
    userId: string,
    listingData: ListingFormData,
    isDraft = true,
    conversationId?: string,
  ): Promise<{ success: boolean; listingId?: string; error?: string }> {
    try {
      const supabase = createClient()

      // Prepare listing data
      const listingRecord = {
        user_id: userId,
        title: listingData.title,
        description: listingData.description || listingData.aboutBusiness,
        category_id: listingData.categoryId,
        budget_min: listingData.budgetMin,
        budget_max: listingData.budgetMax || listingData.budgetMin,
        bid_deadline: listingData.bidDeadline,
        status: isDraft ? "draft" : "published",
        requirements: JSON.stringify({
          aboutBusiness: listingData.aboutBusiness,
          aboutCompany: listingData.aboutCompany,
          detailedNeeds: listingData.detailedNeeds,
          successMetrics: listingData.successMetrics,
          currentChallenges: listingData.currentChallenges,
          timelinePhases: listingData.timelinePhases,
        }),
        tags: listingData.tags,
        attachments: listingData.attachments,
        ai_generated: true,
        conversation_id: conversationId,
      }

      // Insert into database
      const { data, error } = await supabase.from("listings").insert(listingRecord).select("id").single()

      if (error) {
        console.error("Error saving listing:", error)
        return { success: false, error: getErrorMessage(error) }
      }

      return { success: true, listingId: data.id }
    } catch (error) {
      console.error("Exception saving listing:", error)
      return {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error saving listing",
      }
    }
  }

  /**
   * Load existing listing data to continue with AI assistance
   */
  static async loadExistingListing(
    listingId: string,
  ): Promise<{ success: boolean; formData?: Partial<ListingFormData>; error?: string }> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.from("listings").select("*").eq("id", listingId).single()

      if (error || !data) {
        return { success: false, error: error?.message || "Listing not found" }
      }

      // Parse requirements JSON
      let requirements = {}
      try {
        requirements = data.requirements ? JSON.parse(data.requirements) : {}
      } catch (e) {
        console.warn("Failed to parse requirements JSON:", e)
      }

      // Convert to form data format
      const formData: Partial<ListingFormData> = {
        title: data.title,
        description: data.description,
        categoryId: data.category_id,
        budgetMin: data.budget_min,
        budgetMax: data.budget_max,
        bidDeadline: data.bid_deadline,
        aboutBusiness: requirements.aboutBusiness || data.description,
        aboutCompany: requirements.aboutCompany,
        tags: data.tags || [],
        detailedNeeds: requirements.detailedNeeds || [],
        successMetrics: requirements.successMetrics || [],
        currentChallenges: requirements.currentChallenges || [],
        timelinePhases: requirements.timelinePhases || [],
        attachments: data.attachments || [],
      }

      return { success: true, formData }
    } catch (error) {
      console.error("Exception loading listing:", error)
      return {
        success: false,
        error: error instanceof Error ? getErrorMessage(error) : "Unknown error loading listing",
      }
    }
  }

  /**
   * Track AI usage metrics
   */
  static async trackAIUsage(
    userId: string,
    sessionId: string,
    metrics: {
      messagesCount: number
      tokensUsed: number
      fieldsPopulated: number
      completionPercentage: number
      durationSeconds: number
    },
  ): Promise<void> {
    try {
      const supabase = createClient()

      await supabase.from("ai_usage_metrics").insert({
        user_id: userId,
        session_id: sessionId,
        messages_count: metrics.messagesCount,
        tokens_used: metrics.tokensUsed,
        fields_populated: metrics.fieldsPopulated,
        completion_percentage: metrics.completionPercentage,
        duration_seconds: metrics.durationSeconds,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to track AI usage:", error)
      // Non-critical, so we just log the error
    }
  }
}
