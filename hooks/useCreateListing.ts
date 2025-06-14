"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface CreateListingData {
  title: string
  description?: string
  categoryId?: string
  budgetMin?: string
  budgetMax?: string
  bidDeadline?: string
  projectStartDate?: string
  projectDuration?: string
  requiredSkills?: string[]
  locationPreference?: string
  remotePreference?: string
  aboutBusiness?: string
  aboutCompany?: string
  successMetrics?: any[]
  currentChallenges?: any[]
  timelinePhases?: any[]
  tags?: string[]
  detailedNeeds?: any[]
  attachments?: any[]
}

export function useCreateListing() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createListing = async (data: CreateListingData, isDraft = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: isDraft ? "DRAFT" : "ACTIVE",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create listing")
      }

      const result = await response.json()

      // Redirect to the listing or dashboard
      if (isDraft) {
        router.push("/dashboard?tab=drafts")
      } else {
        router.push(`/listings/${result.listing.id}`)
      }

      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createListing,
    isLoading,
    error,
  }
}
