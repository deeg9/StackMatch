"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { ListingFormData, ApiListingData } from "@/types/listing-types"

export function useListingManagement(listingId?: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const manageListing = async (formData: ListingFormData, isDraft: boolean) => {
    setIsLoading(true)
    setError(null)

    try {
      // Transform form data to API payload
      const apiPayload: ApiListingData = {
        title: formData.title,
        description: formData.description || formData.aboutBusiness || "",
        category_id: formData.categoryId,
        status: isDraft ? "DRAFT" : "ACTIVE",
        budget_min: formData.budgetMin ? Number.parseFloat(formData.budgetMin) : undefined,
        budget_max: formData.budgetMax ? Number.parseFloat(formData.budgetMax) : undefined,
        bid_deadline: formData.bidDeadline ? new Date(formData.bidDeadline).toISOString() : undefined,
        project_start_date: formData.projectStartDate ? new Date(formData.projectStartDate).toISOString() : undefined,
        project_duration: formData.projectDuration,
        required_skills: formData.tags || formData.requiredSkills || [],
        location_preference: formData.locationPreference,
        remote_preference: formData.remotePreference,
        about_company: formData.aboutCompany,
        about_business: formData.aboutBusiness,
        attachments: formData.attachments || [],
        success_metrics: formData.successMetrics || [],
        current_challenges: formData.currentChallenges || [],
        timeline_phases: formData.timelinePhases || [],
        detailedNeeds:
          formData.detailedNeeds?.map((need: any) => ({
            title: need.title,
            description: need.description,
            priority: "medium", // Default priority
          })) || [],
      }

      // Determine if this is create or update
      const isUpdate = !!listingId
      const url = isUpdate ? `/api/listings/${listingId}` : "/api/listings"
      const method = isUpdate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.details || `Failed to ${isUpdate ? "update" : "create"} listing`)
      }

      const result = await response.json()
      const resultListingId = result.listing?.id || result.id

      // Show success message
      toast({
        title: "Success",
        description: isUpdate
          ? `Listing updated successfully${isDraft ? " as draft" : ""}!`
          : `Listing ${isDraft ? "saved as draft" : "published"} successfully!`,
      })

      // Redirect to the listing detail page
      if (resultListingId) {
        router.push(`/listings/${resultListingId}`)
      } else if (isUpdate) {
        router.push(`/listings/${listingId}`)
      } else {
        router.push("/buyer-dashboard")
      }
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err // Re-throw so the calling component can handle it if needed
    } finally {
      setIsLoading(false)
    }
  }

  return {
    manageListing,
    isLoading,
    error,
  }
}
