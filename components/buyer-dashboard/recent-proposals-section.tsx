"use client"
import Link from "next/link"
import { Eye, ArrowRight, Briefcase, AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Proposal {
  id: string
  status: string
  proposed_budget: number
  created_at: string
  seller_profiles: {
    business_type?: string
    profiles?: {
      full_name?: string
      company_name?: string
      avatar_url?: string
    }
  } | null
  listings: {
    title: string
  } | null
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "SUBMITTED":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "UNDER_REVIEW":
      return "bg-blue-600 hover:bg-blue-700"
    case "ACCEPTED":
      return "bg-green-600 hover:bg-green-700"
    case "REJECTED":
      return "bg-red-600 hover:bg-red-700"
    case "WITHDRAWN":
      return "bg-slate-500 hover:bg-slate-600"
    case "DRAFT":
      return "bg-gray-400 hover:bg-gray-500"
    default:
      return "bg-slate-700 hover:bg-slate-800"
  }
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "N/A"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

export function RecentProposalsSection() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("🔍 PROPOSALS: Fetching proposals for current user...")

        const { data: user } = await createClient().auth.getUser()

        if (!user || !user.user) {
          setError("User not authenticated")
          setIsLoading(false)
          return
        }

        console.log("🔍 PROPOSALS: User ID:", user.user.id)

        // Fetch proposals for listings owned by the current user
        const { data, error } = await createClient()
          .from("proposals")
          .select(`
            id,
            status,
            proposed_budget,
            created_at,
            listing_id,
            seller_id,
            listings!inner (
              id,
              title,
              buyer_id
            ),
            seller_profiles (
              id,
              business_type,
              profiles (
                full_name,
                company_name,
                avatar_url
              )
            )
          `)
          .eq("listings.buyer_id", user.user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          console.error("🔍 PROPOSALS: Database error:", error)
          setError("Failed to fetch proposals")
        } else {
          console.log("🔍 PROPOSALS: Fetched proposals:", data?.length || 0)
          console.log("🔍 PROPOSALS: Sample data:", data?.[0])
          setProposals(data || [])
        }
      } catch (err) {
        console.error("🔍 PROPOSALS: Unexpected error:", err)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProposals()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-700 min-h-[200px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-slate-400">Loading recent proposals...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-50 rounded-xl p-6 border border-red-700 min-h-[200px] flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
        <h3 className="text-lg font-semibold text-white mb-1">Error Loading Proposals</h3>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    )
  }

  if (!proposals || proposals.length === 0) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-700 min-h-[200px] flex flex-col items-center justify-center text-center">
        <Briefcase className="h-10 w-10 text-slate-500 mb-3" />
        <h3 className="text-lg font-semibold text-white mb-1">No Recent Proposals</h3>
        <p className="text-slate-400 text-sm">There are no new proposals for your listings at the moment.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent Proposals Received</h2>
          <p className="text-slate-400 text-sm">Latest proposals submitted to your listings</p>
        </div>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => {
          // Handle case where seller_profiles, profiles, or listings might be arrays
          const sellerProfile = proposal.seller_profiles ? (Array.isArray(proposal.seller_profiles) ? proposal.seller_profiles[0] : proposal.seller_profiles) : null;
          const profile = sellerProfile?.profiles ? (Array.isArray(sellerProfile.profiles) ? sellerProfile.profiles[0] : sellerProfile.profiles) : null;
          const listing = proposal.listings ? (Array.isArray(proposal.listings) ? proposal.listings[0] : proposal.listings) : null;
          
          const sellerName =
            profile?.company_name ||
            profile?.full_name ||
            `${sellerProfile?.business_type || "Unknown"} Provider`

          return (
            <div
              key={proposal.id}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-slate-700 text-white">
                      {sellerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="text-white font-medium text-sm sm:text-base">{sellerName}</h3>
                    <p
                      className="text-slate-400 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-xs"
                      title={`For listing: ${listing?.title || "N/A"}`}
                    >
                      For: {listing?.title || "N/A"}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-base font-semibold text-white">
                        {formatCurrency(proposal.proposed_budget)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                  <Badge className={`${getStatusColor(proposal.status)} text-white text-xs px-2 py-1`}>
                    {proposal.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Link href={`/proposals/${proposal.id}`} passHref>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 hover:bg-slate-700 hover:text-white text-slate-300"
                    >
                      <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {proposals.length > 0 && (
        <Link href="/proposals" passHref>
          <Button
            variant="ghost"
            className="w-full mt-6 text-slate-400 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            View All My Proposals
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}
