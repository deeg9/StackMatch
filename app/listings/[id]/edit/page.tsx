"use client"

import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ListingForm } from "@/components/listings/listing-form"
import type {
  ListingFormData,
  DetailedNeed,
  SuccessMetric,
  Challenge,
  TimelinePhase,
  AttachmentFile,
  RawListingData,
} from "@/types/listing-types"
import { useListingManagement } from "@/hooks/use-listing-management"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"

export default function EditListingPage() {
  const params = useParams()
  const listingId = params.id as string

  const { manageListing, isLoading: isSubmitting, error: submissionError } = useListingManagement(listingId)
  const { toast } = useToast()

  const [initialData, setInitialData] = useState<Partial<ListingFormData> | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!listingId) return

    const fetchListingData = async () => {
      setIsLoadingData(true)
      setFetchError(null)
      try {
        const response = await fetch(`/api/listings/${listingId}`)
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.error || errData.details || "Failed to fetch listing data")
        }
        const result = await response.json()
        const rawData = result.listing as RawListingData

        // Transform rawData to ListingFormData shape
        const transformedData: Partial<ListingFormData> = {
          id: rawData.id,
          title: rawData.title,
          // description: rawData.description, // Form uses aboutBusiness/aboutCompany
          categoryId: rawData.category_id,
          budgetMin: rawData.budget_min?.toString(),
          budgetMax: rawData.budget_max?.toString(),
          bidDeadline: rawData.bid_deadline ? rawData.bid_deadline.split("T")[0] : undefined,
          tags: rawData.required_skills,
          aboutBusiness: rawData.about_business,
          aboutCompany: rawData.about_company,
          attachments: rawData.attachments?.map((a) => ({ id: a.id, name: a.name, size: a.size })) as AttachmentFile[],
          successMetrics: rawData.success_metrics as SuccessMetric[],
          currentChallenges: rawData.current_challenges as Challenge[],
          timelinePhases: rawData.timeline_phases?.map((p) => ({
            id: p.id,
            title: p.title,
            startDate: p.startDate ? p.startDate.split("T")[0] : "",
            endDate: p.endDate ? p.endDate.split("T")[0] : "",
            duration: p.duration,
          })) as TimelinePhase[],
          detailedNeeds: rawData.listing_requirements?.map((lr) => ({
            id: lr.id,
            title: lr.title || lr.requirement.substring(0, 50), // Fallback for title
            description: lr.requirement,
          })) as DetailedNeed[],
        }
        setInitialData(transformedData)
      } catch (err: any) {
        setFetchError(err.message)
        toast({ title: "Error", description: `Failed to load listing: ${err.message}`, variant: "destructive" })
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchListingData()
  }, [listingId, toast])

  const handleSubmit = async (data: ListingFormData, isDraft: boolean) => {
    try {
      await manageListing(data, isDraft)
      // Redirection is handled by the hook
    } catch (err: any) {
      // Error is already toasted by the hook
      console.error("Edit listing page error:", err)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg">Loading listing data...</p>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-slate-950 text-red-400 flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
        <p className="text-sm">{fetchError}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <p className="text-lg">Listing not found or could not be loaded.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Listing</h1>
          <p className="text-slate-400">Update the details for your project listing.</p>
        </div>

        <ListingForm initialData={initialData} onSubmit={handleSubmit} isLoading={isSubmitting} mode="edit" />

        {submissionError && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400">{submissionError}</p>
          </div>
        )}
      </div>
    </div>
  )
}
