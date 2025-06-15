import type { AIResponse, FieldMapping } from "@/types/ai-listing-types"
import type { ListingFormData } from "@/types/listing-types"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

export interface ParsedAIResponse {
  success: boolean
  response?: AIResponse
  fieldMappings?: FieldMapping[]
  error?: string
}

export function parseAIResponse(rawResponse: string): ParsedAIResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      // If no JSON found, treat as plain text message
      return {
        success: true,
        response: {
          message: rawResponse,
          confidence: 0.5,
          requiresUserInput: true,
        },
        fieldMappings: [],
      }
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Validate required fields
    if (!parsed.message) {
      throw new Error("Response missing required 'message' field")
    }

    // Build field mappings from fieldUpdates
    const fieldMappings: FieldMapping[] = []
    if (parsed.fieldUpdates && typeof parsed.fieldUpdates === "object") {
      Object.entries(parsed.fieldUpdates).forEach(([fieldName, value]) => {
        if (isValidFormField(fieldName) && value !== null && value !== undefined) {
          fieldMappings.push({
            fieldName: fieldName as keyof ListingFormData,
            aiValue: value,
            confidence: parsed.confidence || 0.8,
            requiresValidation: shouldValidateField(fieldName, value),
          })
        }
      })
    }

    const response: AIResponse = {
      message: parsed.message,
      fieldUpdates: parsed.fieldUpdates || {},
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      nextQuestions: Array.isArray(parsed.nextQuestions) ? parsed.nextQuestions : [],
      stage: parsed.stage,
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0.8)),
      requiresUserInput: parsed.requiresUserInput !== false,
    }

    return {
      success: true,
      response,
      fieldMappings,
    }
  } catch (error) {
    console.error("Failed to parse AI response:", error)
    return {
      success: false,
      error: `Failed to parse AI response: ${error instanceof Error ? getErrorMessage(error) : "Unknown error"}`,
    }
  }
}

export function validateFieldValue(fieldName: string, value: any): { isValid: boolean; error?: string } {
  switch (fieldName) {
    case "title":
      if (typeof value !== "string" || value.length < 5) {
        return { isValid: false, error: "Title must be at least 5 characters long" }
      }
      if (value.length > 200) {
        return { isValid: false, error: "Title must be less than 200 characters" }
      }
      break

    case "categoryId":
      if (typeof value !== "string" || !value.trim()) {
        return { isValid: false, error: "Category is required" }
      }
      break

    case "budgetMin":
    case "budgetMax":
      if (typeof value !== "number" || value < 0) {
        return { isValid: false, error: "Budget must be a positive number" }
      }
      break

    case "bidDeadline":
      if (typeof value !== "string") {
        return { isValid: false, error: "Deadline must be a valid date" }
      }
      const date = new Date(value)
      if (isNaN(date.getTime()) || date < new Date()) {
        return { isValid: false, error: "Deadline must be a future date" }
      }
      break

    case "aboutBusiness":
    case "aboutCompany":
      if (typeof value !== "string" || value.length < 10) {
        return { isValid: false, error: "Description must be at least 10 characters long" }
      }
      break

    case "tags":
    case "detailedNeeds":
    case "successMetrics":
    case "currentChallenges":
    case "timelinePhases":
      if (!Array.isArray(value)) {
        return { isValid: false, error: "Must be an array" }
      }
      if (value.some((item: any) => typeof item !== "string" || !item.trim())) {
        return { isValid: false, error: "All items must be non-empty strings" }
      }
      break
  }

  return { isValid: true }
}

export function sanitizeFieldValue(fieldName: string, value: any): any {
  switch (fieldName) {
    case "title":
    case "aboutBusiness":
    case "aboutCompany":
      return typeof value === "string" ? value.trim() : ""

    case "categoryId":
      return typeof value === "string" ? value.trim().toLowerCase() : ""

    case "budgetMin":
    case "budgetMax":
      const num = Number(value)
      return isNaN(num) ? 0 : Math.max(0, Math.round(num))

    case "bidDeadline":
      if (typeof value === "string") {
        const date = new Date(value)
        return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0]
      }
      return ""

    case "tags":
    case "detailedNeeds":
    case "successMetrics":
    case "currentChallenges":
    case "timelinePhases":
      if (Array.isArray(value)) {
        return value
          .filter((item: any) => typeof item === "string" && item.trim())
          .map((item: any) => item.trim())
          .slice(0, 20) // Limit array size
      }
      return []

    default:
      return value
  }
}

function isValidFormField(fieldName: string): boolean {
  const validFields = [
    "title",
    "categoryId",
    "aboutBusiness",
    "aboutCompany",
    "budgetMin",
    "budgetMax",
    "bidDeadline",
    "tags",
    "detailedNeeds",
    "successMetrics",
    "currentChallenges",
    "timelinePhases",
  ]
  return validFields.includes(fieldName)
}

function shouldValidateField(fieldName: string, value: any): boolean {
  // Always validate required fields and complex data types
  const alwaysValidate = ["title", "categoryId", "budgetMin", "bidDeadline", "aboutBusiness"]
  const isArray = Array.isArray(value)
  const isComplexValue = typeof value === "object" && value !== null

  return alwaysValidate.includes(fieldName) || isArray || isComplexValue
}

export function extractKeywords(text: string): string[] {
  if (!text || typeof text !== "string") return []

  // Simple keyword extraction - in production, use more sophisticated NLP
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)

  // Remove common stop words
  const stopWords = new Set([
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "this",
    "that",
    "these",
    "those",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "have",
    "has",
    "had",
    "been",
    "being",
    "were",
    "was",
    "are",
    "is",
    "am",
  ])

  return Array.from(new Set(words.filter((word) => !stopWords.has(word)))).slice(0, 10)
}

export function generateFormSummary(formData: Partial<ListingFormData>): string {
  const sections = []

  if (formData.title) {
    sections.push(`Project: ${formData.title}`)
  }

  if (formData.categoryId) {
    sections.push(`Category: ${formData.categoryId}`)
  }

  if (formData.budgetMin || formData.budgetMax) {
    const budget = `$${formData.budgetMin?.toLocaleString() || "0"} - $${formData.budgetMax?.toLocaleString() || "TBD"}`
    sections.push(`Budget: ${budget}`)
  }

  if (formData.bidDeadline) {
    sections.push(`Deadline: ${new Date(formData.bidDeadline).toLocaleDateString()}`)
  }

  if (formData.tags && formData.tags.length > 0) {
    sections.push(`Technologies: ${formData.tags.slice(0, 5).join(", ")}`)
  }

  return sections.join(" | ")
}
