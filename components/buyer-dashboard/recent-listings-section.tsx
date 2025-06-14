"use client"

import { Eye, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-500"
    case "ACTIVE":
      return "bg-green-500"
    case "CLOSED":
      return "bg-red-500"
    case "AWARDED":
      return "bg-blue-500"
    case "CANCELLED":
      return "bg-orange-500"
    default:
      return "bg-gray-500"
  }
}

// Helper function to format currency
const formatCurrency = (min: number | null, max: number | null) => {
  if (min === null && max === null) return "Budget not specified"
  if (min === null) return `Up to $${max?.toLocaleString()}`
  if (max === null) return `From $${min?.toLocaleString()}`
  return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`
}

export function RecentListingsSection() {
  const router = useRouter()
  const [recentListings, setRecentListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentListings = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data: user } = await createClient().auth.getUser()

        if (!user || !user.user) {
          setError("User not authenticated")
          setIsLoading(false)
          return
        }

        const { data, error } = await createClient()
          .from("listings")
          .select(`
            *,
            project_categories(name)
          `)
          .eq("buyer_id", user.user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          console.error("Error fetching recent listings:", error)
          setError("Failed to fetch listings")
        } else {
          setRecentListings(data || [])
        }
      } catch (err) {
        console.error("Error in fetchRecentListings:", err)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentListings()
  }, [])

  const handleViewListing = (id: string) => {
    router.push(`/listings/${id}`)
  }

  const handleViewAllListings = () => {
    router.push("/dashboard/listings")
  }

  return (
    <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Your Recent Listings</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 animate-pulse h-24 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-4">{error}</div>
      ) : recentListings.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          <p>You haven't created any listings yet.</p>
          <button
            onClick={() => router.push("/create-listing")}
            className="mt-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-[#0f172a] rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-medium">{listing.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(listing.status)} text-white text-xs px-2 py-1`}>
                    {listing.status}
                  </Badge>
                  <button className="text-slate-400 hover:text-white" onClick={() => handleViewListing(listing.id)}>
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-slate-400">
                  <span>{listing.project_categories?.name || "Uncategorized"}</span>
                  <span>{formatCurrency(listing.budget_min, listing.budget_max)}</span>
                  <span>
                    {listing.created_at && `Created ${formatDistanceToNow(new Date(listing.created_at))} ago`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="w-full mt-6 text-slate-400 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        onClick={handleViewAllListings}
      >
        View All Listings
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
