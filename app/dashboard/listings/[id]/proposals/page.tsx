"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/hooks/useAppSelector"
import { createClient } from "@/utils/supabase/client"
import { ArrowLeft, DollarSign, AlertCircle, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import { ListingProposalsView } from "@/components/buyer-dashboard/listing-proposals-view"

interface ListingInfo {
  id: string
  title: string
  budget_min?: number
  budget_max?: number
  status: string
  created_at: string
  buyer_id: string
}

export default function ListingProposalsPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id as string

  const [listing, setListing] = useState<ListingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const authState = useAppSelector((state) => state.auth)
  const user = authState?.user
  const isAuthenticated = authState?.isAuthenticated

  const supabase = createClient()

  useEffect(() => {
    const fetchListing = async () => {
      if (!isAuthenticated || !user) {
        console.log("🔍 CLIENT DEBUG: No authenticated user, redirecting to login")
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log("🔍 CLIENT DEBUG: Fetching listing details for ID:", listingId)

        // Fetch listing details to verify ownership
        const { data: listingData, error: listingError } = await supabase
          .from("listings")
          .select("id, title, budget_min, budget_max, status, created_at, buyer_id")
          .eq("id", listingId)
          .single()

        if (listingError) {
          console.error("🔍 CLIENT DEBUG: Error fetching listing:", listingError)
          setError("Failed to load listing details")
          return
        }

        if (!listingData) {
          console.log("🔍 CLIENT DEBUG: Listing not found")
          setError("Listing not found")
          return
        }

        console.log("🔍 CLIENT DEBUG: Listing found:", listingData.title)
        console.log("🔍 CLIENT DEBUG: Listing buyer_id:", listingData.buyer_id)
        console.log("🔍 CLIENT DEBUG: Current user ID:", user.id)

        // Verify user owns this listing
        if (listingData.buyer_id !== user.id) {
          console.log("🔍 CLIENT DEBUG: User is not the owner of this listing")
          setError("You don't have permission to view proposals for this listing")
          return
        }

        console.log("🔍 CLIENT DEBUG: User is the owner, setting listing data")
        setListing(listingData)
      } catch (err: any) {
        console.error("🔍 CLIENT DEBUG: Error:", err)
        setError(err.message || "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [listingId, user, isAuthenticated, router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading listing details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Listing Not Found</h2>
          <p className="text-muted-foreground mb-4">The listing you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const budgetDisplay =
    listing.budget_min && listing.budget_max
      ? `$${listing.budget_min.toLocaleString()} - $${listing.budget_max.toLocaleString()}`
      : listing.budget_min
        ? `$${listing.budget_min.toLocaleString()}+`
        : "Budget not specified"

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listing
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-muted-foreground">Manage proposals for this listing</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={listing.status === "ACTIVE" ? "default" : "secondary"}>{listing.status}</Badge>
          <Link href={`/listings/${listing.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Listing Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Listing Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Budget Range</p>
              <p className="font-semibold">{budgetDisplay}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={listing.status === "ACTIVE" ? "default" : "secondary"}>{listing.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posted</p>
              <p className="font-semibold">{new Date(listing.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals View Component */}
      <ListingProposalsView listingId={listingId} />
    </div>
  )
}
