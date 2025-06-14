"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SaveListingButton } from "@/components/shared/save-listing-button"
import { SubmitProposalModal } from "@/components/proposals/submit-proposal-modal"
import { useAppSelector } from "@/hooks/useAppSelector"
import { createClient } from "@/utils/supabase/client"
import { getValidToken } from "@/lib/auth/token-utils"
import {
  MapPin,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Download,
  Building,
  Globe,
  Target,
  AlertTriangle,
  CalendarIcon,
  FileText,
  Briefcase,
  Info,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { SubmittedProposalCard } from "@/components/proposals/submitted-proposal-card"
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime"
import type { Proposal } from "@/types/proposal-types"
import { WithdrawnProposalCard } from "@/components/proposals/withdrawn-proposal-card"

interface DetailedNeed {
  id?: string
  title: string
  content: string
}

interface AttachmentFile {
  id?: string
  name: string
  size: string
  type?: string
  url?: string
}

interface SuccessMetric {
  id?: string
  label: string
  currentValue: string
  targetValue: string
  unit?: string
}

interface Challenge {
  id?: string
  title: string
  description: string
  icon?: string
}

interface TimelinePhase {
  id?: string
  phase: number
  title: string
  duration: string
  dates: string
}

interface CompanyProfile {
  name: string
  location: string
  employees: string
  industry: string
  founded: string
  headquarters: string
  website: string
  description: string
  avatarUrl?: string
}

interface ListingDetail {
  id: string
  buyer_id: string
  company: CompanyProfile
  title: string
  description: string
  tags: string[]
  budget: string
  deadline: string
  views: number
  status: string[]
  businessDescription: string
  detailedNeeds: DetailedNeed[]
  attachments: AttachmentFile[]
  successMetrics: SuccessMetric[]
  challenges: Challenge[]
  timeline: TimelinePhase[]
}

export default function ListingDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string

  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // New state for proposal management
  const [submittedProposal, setSubmittedProposal] = useState<Proposal | null>(null)
  const [withdrawnProposal, setWithdrawnProposal] = useState<Proposal | null>(null)
  const [withdrawnCount, setWithdrawnCount] = useState(0)
  const [loadingProposal, setLoadingProposal] = useState(false)
  const [proposalError, setProposalError] = useState<string | null>(null)

  const [userType, setUserType] = useState<string | null>(null)
  const [sellerProfile, setSellerProfile] = useState<any>(null)
  const [fromDealRoom, setFromDealRoom] = useState(false)
  const [dealRoomId, setDealRoomId] = useState<string | null>(null)

  const authUser = useAppSelector((state) => state.auth.user)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const supabase = createClient()

  useEffect(() => {
    // Check if we came from a deal room
    const from = searchParams.get("from")
    const dealRoomParam = searchParams.get("dealRoomId")

    if (from === "dealRoom" && dealRoomParam) {
      setFromDealRoom(true)
      setDealRoomId(dealRoomParam)
    }
  }, [searchParams])

  const handleBackToDealRoom = () => {
    if (dealRoomId) {
      router.push(`/deal-rooms/${dealRoomId}`)
    }
  }

  // Check user type and profile
  useEffect(() => {
    const checkUserType = async () => {
      if (!isAuthenticated || !authUser) {
        console.log("🔍 CLIENT DEBUG: No authenticated user")
        setUserType(null)
        return
      }

      console.log("🔍 CLIENT DEBUG: Checking user type for:", authUser.id)

      try {
        // Check if user has seller profile
        const { data: sellerData, error: sellerError } = await supabase
          .from("seller_profiles")
          .select("*")
          .eq("user_id", authUser.id)
          .single()

        console.log("🔍 CLIENT DEBUG: Seller profile check:", {
          sellerData,
          sellerError: sellerError?.message,
        })

        if (sellerData && !sellerError) {
          setUserType("SELLER")
          setSellerProfile(sellerData)
          console.log("🔍 CLIENT DEBUG: User is a SELLER with profile:", sellerData.id)
        } else {
          // Check if user has buyer profile
          const { data: buyerData, error: buyerError } = await supabase
            .from("buyer_profiles")
            .select("*")
            .eq("user_id", authUser.id)
            .single()

          console.log("🔍 CLIENT DEBUG: Buyer profile check:", {
            buyerData,
            buyerError: buyerError?.message,
          })

          if (buyerData && !buyerError) {
            setUserType("BUYER")
            console.log("🔍 CLIENT DEBUG: User is a BUYER")
          } else {
            setUserType(null)
            console.log("🔍 CLIENT DEBUG: User has no profile")
          }
        }
      } catch (error) {
        console.error("🔍 CLIENT DEBUG: Error checking user type:", error)
        setUserType(null)
      }
    }

    checkUserType()
  }, [isAuthenticated, authUser, supabase])

  // Enhanced function to fetch the seller's proposals
  const fetchSellerProposals = async (listingId: string, sellerId: string) => {
    console.log("🔍 CLIENT DEBUG: Fetching proposals for listing:", listingId, "seller:", sellerId)

    try {
      setLoadingProposal(true)
      setProposalError(null)

      // Fetch ALL proposals for this seller and listing
      const allResponse = await fetch(`/api/proposals?listing_id=${listingId}&seller_id=${sellerId}`)
      console.log("🔍 CLIENT DEBUG: All proposals response status:", allResponse.status)

      if (allResponse.ok) {
        const allData = await allResponse.json()
        console.log("🔍 CLIENT DEBUG: All proposals data:", allData)

        const allProposals = allData.proposals || []

        // Filter active proposals (non-withdrawn)
        const activeProposals = allProposals.filter((p: Proposal) => p.status !== "WITHDRAWN")
        const withdrawnProposals = allProposals.filter((p: Proposal) => p.status === "WITHDRAWN")

        console.log("🔍 CLIENT DEBUG: Filtered proposals:", {
          total: allProposals.length,
          active: activeProposals.length,
          withdrawn: withdrawnProposals.length,
        })

        // Set active proposal (should be only one)
        setSubmittedProposal(activeProposals.length > 0 ? activeProposals[0] : null)

        // Set withdrawn proposals
        setWithdrawnCount(withdrawnProposals.length)
        if (withdrawnProposals.length > 0) {
          // Sort by withdrawal date and get the most recent
          const mostRecent = withdrawnProposals.sort(
            (a: Proposal, b: Proposal) =>
              new Date(b.withdrawn_at || 0).getTime() - new Date(a.withdrawn_at || 0).getTime(),
          )[0]
          setWithdrawnProposal(mostRecent)
        } else {
          setWithdrawnProposal(null)
        }
      } else if (allResponse.status !== 404) {
        console.error("🔍 CLIENT DEBUG: Error fetching proposals:", allResponse.status)
        const errorText = await allResponse.text()
        console.error("🔍 CLIENT DEBUG: Error response:", errorText)
        setProposalError(`Failed to fetch proposals: ${allResponse.status}`)
      }
    } catch (error: any) {
      console.error("🔍 CLIENT DEBUG: Error fetching seller proposals:", error)
      setProposalError(getErrorMessage(error))
      setSubmittedProposal(null)
      setWithdrawnProposal(null)
      setWithdrawnCount(0)
    } finally {
      setLoadingProposal(false)
    }
  }

  // Replace the checkProposalStatus function with this enhanced version:
  const checkProposalStatus = async (listingId: string, sellerId: string) => {
    console.log("🔍 CLIENT DEBUG: Checking proposal status for listing:", listingId, "seller:", sellerId)
    await fetchSellerProposals(listingId, sellerId)
  }

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.id
      if (!listingId) {
        setError("Listing ID is missing.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log("🔍 LISTING PAGE: Starting fetch for listing:", listingId)

        // Get the authentication token
        const token = await getValidToken()
        if (!token) {
          setError("Authentication required to view listing details.")
          setListing(null)
          setLoading(false)
          return
        }

        console.log("🔍 LISTING PAGE: Token obtained, making API request")

        const response = await fetch(`/api/listings/${listingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("🔍 LISTING PAGE: API response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("🔍 LISTING PAGE: API error response:", errorText)

          try {
            const errorData = JSON.parse(errorText)
            setError(errorData.details || errorData.error || `Failed to fetch listing. Status: ${response.status}`)
          } catch {
            setError(`Failed to fetch listing. Status: ${response.status}`)
          }
          setListing(null)
          return
        }

        const data = await response.json()
        console.log("🔍 LISTING PAGE: API response data:", data)

        // The API now returns the listing data directly, not wrapped in a "listing" property
        const raw = data

        const transformed: ListingDetail = {
          id: raw.id,
          buyer_id: raw.buyer_id || raw.buyer_profile?.id,
          title: raw.title || "Untitled Project",
          description: raw.description || "No main description provided.",
          tags: raw.skills || raw.required_skills || [],
          budget:
            raw.budget_min && raw.budget_max
              ? `$${raw.budget_min.toLocaleString()}-$${raw.budget_max.toLocaleString()}`
              : raw.budget_min
                ? `$${raw.budget_min.toLocaleString()}+`
                : "Budget Not Specified",
          deadline: raw.bid_deadline
            ? new Date(raw.bid_deadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "No Deadline Set",
          views: raw.view_count || 0,
          status: raw.status ? [raw.status] : ["UNKNOWN"],
          company: {
            name: raw.buyer_profile?.company_name || raw.buyer_profile?.full_name || "Company Name Not Set",
            location: raw.location_preference || "Location Not Specified",
            employees: raw.buyer_profile?.company_size || "Size Not Specified",
            industry: raw.buyer_profile?.industry || "Industry Not Specified",
            founded: "Founded Date Not Set",
            headquarters: raw.location_preference || "HQ Not Specified",
            website: raw.buyer_profile?.website || "website-not-set.com",
            description: raw.about_company || raw.buyer_profile?.company_description || "Company details not provided.",
            avatarUrl: raw.buyer_profile?.avatar_url,
          },
          businessDescription: raw.about_business || "Business overview not provided.",
          detailedNeeds: (raw.listing_requirements || []).map((req: any) => ({
            id: req.id,
            title: req.requirement || "Requirement",
            content: req.priority ? `Priority: ${req.priority}` : "Details not specified.",
          })),
          attachments: (raw.attachments || []).map((att: any) => ({
            id: att.id,
            name: att.name || "Unnamed File",
            size: att.size || "Unknown size",
            type: att.type,
            url: att.url,
          })),
          successMetrics: (raw.success_metrics || []).map((metric: any) => ({
            id: metric.id,
            label: metric.label || metric.title || "Metric",
            currentValue: metric.currentValue || metric.current || "N/A",
            targetValue: metric.targetValue || metric.target || "N/A",
            unit: metric.unit || metric.type,
          })),
          challenges: (raw.current_challenges || []).map((chal: any) => ({
            id: chal.id,
            title: chal.title || "Challenge",
            description: chal.description || "No description.",
            icon: chal.icon || "AlertTriangle",
          })),
          timeline: (raw.timeline_phases || []).map((phase: any, index: number) => ({
            id: phase.id,
            phase: phase.phase || index + 1,
            title: phase.title || `Phase ${index + 1}`,
            duration: phase.duration || "TBD",
            dates:
              phase.dates ||
              `${phase.startDate ? new Date(phase.startDate).toLocaleDateString() : "TBD"} - ${phase.endDate ? new Date(phase.endDate).toLocaleDateString() : "TBD"}`,
          })),
        }

        console.log("🔍 LISTING PAGE: Transformed listing data:", transformed)
        setListing(transformed)
      } catch (err: any) {
        console.error("🔍 LISTING PAGE: Error fetching listing:", err)
        setError(err.message || "An unexpected error occurred while loading listing details.")
        setListing(null)
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [params.id])

  // Check proposal status when we have all the data
  useEffect(() => {
    console.log("🔍 CLIENT DEBUG: Checking if should fetch proposals:", {
      hasListing: !!listing,
      userType,
      hasSellerProfile: !!sellerProfile,
      hasAuthUser: !!authUser,
      isOwner: authUser && listing && authUser.id === listing.buyer_id,
    })

    if (listing && userType === "SELLER" && sellerProfile && authUser && authUser.id !== listing.buyer_id) {
      console.log("🔍 CLIENT DEBUG: All conditions met, checking proposal status")
      checkProposalStatus(listing.id, sellerProfile.id)
    }
  }, [listing, userType, sellerProfile, authUser])

  // Add real-time updates for proposals
  useSupabaseRealtime({
    table: "proposals",
    event: "*",
    callback: (payload) => {
      console.log("🔍 CLIENT DEBUG: Proposal realtime update:", payload)

      // If this is an update to our seller's proposal for this listing
      if (
        sellerProfile &&
        listing &&
        payload.new?.listing_id === listing.id &&
        payload.new?.seller_id === sellerProfile.id
      ) {
        console.log("🔍 CLIENT DEBUG: Realtime update matches our proposal, refetching")
        // Refetch all proposals to get complete data
        fetchSellerProposals(listing.id, sellerProfile.id)
      }
    },
    filter: "listing_id",
    filterValue: listing?.id,
  })

  // Add success handler for proposal submission
  const handleProposalSuccess = (proposal: Proposal) => {
    console.log("🔍 CLIENT DEBUG: Proposal submitted successfully:", proposal)
    setSubmittedProposal(proposal)
    setIsProposalModalOpen(false)
  }

  const handleProposalUpdate = (updatedProposal: Proposal) => {
    console.log("🔍 CLIENT DEBUG: Proposal updated:", updatedProposal)
    setSubmittedProposal(updatedProposal)
  }

  const handleProposalWithdraw = (withdrawnProposal: Proposal) => {
    console.log("🔍 CLIENT DEBUG: Proposal withdrawn:", withdrawnProposal)
    // Move from active to withdrawn
    setSubmittedProposal(null)
    setWithdrawnProposal(withdrawnProposal)
    setWithdrawnCount((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg">Loading listing details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-red-400 flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Listing</h2>
        <p className="text-sm">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center">
        <Info className="w-16 h-16 text-slate-500 mb-4" />
        <p className="text-lg">Listing not found.</p>
      </div>
    )
  }

  // Determine user permissions
  const isOwner = isAuthenticated && authUser && listing && authUser.id === listing.buyer_id
  const isEligibleSeller = isAuthenticated && authUser && userType === "SELLER" && !isOwner

  console.log("🔍 CLIENT DEBUG: Render state:", {
    isEligibleSeller,
    hasSubmittedProposal: !!submittedProposal,
    hasWithdrawnProposal: !!withdrawnProposal,
    withdrawnCount,
    loadingProposal,
    proposalError,
    sellerProfileId: sellerProfile?.id,
  })

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fromDealRoom && dealRoomId && (
          <Button
            onClick={handleBackToDealRoom}
            variant="outline"
            className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Deal Room
          </Button>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                    {listing.company.avatarUrl ? (
                      <img
                        src={listing.company.avatarUrl || "/placeholder.svg?width=64&height=64&query=company+logo"}
                        alt={listing.company.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Briefcase className="w-8 h-8 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h1 className="text-2xl font-bold text-white">{listing.title}</h1>
                      {listing.status.map((s) => (
                        <Badge key={s} className={`${s === "ACTIVE" ? "bg-green-600" : "bg-sky-600"} text-white`}>
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-slate-400 text-sm">Posted by: {listing.company.name}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 self-start sm:self-center mt-4 sm:mt-0">
                  {/* Buyer (Owner) Buttons */}
                  {isOwner && (
                    <>
                      <Link href={`/listings/${listing.id}/edit`} passHref>
                        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Edit Listing
                        </Button>
                      </Link>
                      <Link href={`/dashboard/listings/${listing.id}/proposals`} passHref>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          View Proposals
                        </Button>
                      </Link>
                    </>
                  )}

                  {/* Seller Buttons */}
                  {isEligibleSeller && (
                    <>
                      {/* Submit Proposal Button - Only show when no active proposal */}
                      {!submittedProposal && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => setIsProposalModalOpen(true)}
                          disabled={loadingProposal}
                        >
                          {loadingProposal ? (
                            <ArrowLeft className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <ArrowLeft className="w-4 h-4 mr-2" />
                          )}
                          {loadingProposal ? "Loading..." : "Submit Proposal"}
                        </Button>
                      )}

                      {/* Proposal Submitted Button - Only show when active proposal exists */}
                      {submittedProposal && (
                        <Button className="bg-green-600 hover:bg-green-700 text-white" disabled>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Proposal Submitted
                        </Button>
                      )}

                      {/* Save Listing Button */}
                      <SaveListingButton
                        listing={{
                          id: listing.id,
                          companyName: listing.company.name,
                          title: listing.title,
                          budget: listing.budget,
                          deadline: listing.deadline,
                          location: listing.company.location,
                          tags: listing.tags,
                        }}
                      />
                    </>
                  )}

                  {/* Unauthenticated User */}
                  {!isAuthenticated && (
                    <div className="text-slate-400 text-sm">
                      <Link href="/login" className="text-blue-400 hover:underline">
                        Login
                      </Link>{" "}
                      to submit proposals
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300 mb-4 whitespace-pre-wrap">{listing.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-slate-400">Budget</div>
                      <div className="text-white font-semibold">{listing.budget}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="text-slate-400">Deadline</div>
                      <div className="text-white font-semibold">{listing.deadline}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    <div>
                      <div className="text-slate-400">Views</div>
                      <div className="text-white font-semibold">{listing.views}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {listing.businessDescription && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-400" /> RFP Overview
                </h3>
                <h4 className="text-lg font-medium text-slate-300 mb-2">About the Business</h4>
                <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{listing.businessDescription}</p>
              </div>
            )}

            {listing.detailedNeeds && listing.detailedNeeds.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-400" /> Detailed Needs
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {listing.detailedNeeds.map((need, index) => (
                    <AccordionItem
                      key={need.id || `need-${index}`}
                      value={`need-${index}`}
                      className="border-slate-700"
                    >
                      <AccordionTrigger className="text-slate-200 hover:text-white py-3 text-left">
                        {need.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-400 pt-1 pb-3 whitespace-pre-wrap">
                        {need.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {listing.attachments && listing.attachments.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-green-400" /> Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.attachments.map((file, index) => (
                    <a
                      href={file.url || "#"}
                      key={file.id || `file-${index}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-slate-800 border border-slate-700 rounded-lg p-3 hover:bg-slate-700 transition-colors group ${file.url ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                        <div>
                          <div className="text-slate-200 font-medium text-sm truncate">{file.name}</div>
                          <div className="text-slate-500 text-xs">{file.size}</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {listing.successMetrics && listing.successMetrics.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-teal-400" /> Success Looks Like...
                </h3>
                <div className="space-y-4">
                  {listing.successMetrics.map((metric, index) => (
                    <div
                      key={metric.id || `metric-${index}`}
                      className="bg-slate-800 p-3 rounded-md border border-slate-700"
                    >
                      <div className="font-medium text-slate-200 mb-1">{metric.label}</div>
                      <div className="text-xs text-slate-400">
                        Current: <span className="text-slate-300">{metric.currentValue}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Target: <span className="text-slate-300">{metric.targetValue}</span>
                        {metric.unit && ` (${metric.unit})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.challenges && listing.challenges.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" /> Current Challenges
                </h3>
                <div className="space-y-3">
                  {listing.challenges.map((challenge, index) => (
                    <div
                      key={challenge.id || `challenge-${index}`}
                      className="bg-slate-800 p-3 rounded-md border border-slate-700"
                    >
                      <div className="font-medium text-slate-200">{challenge.title}</div>
                      <p className="text-sm text-slate-400 whitespace-pre-wrap">{challenge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.timeline && listing.timeline.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-indigo-400" /> Project Timeline
                </h3>
                <div className="space-y-4">
                  {listing.timeline.map((phase, index) => (
                    <div
                      key={phase.id || `phase-${index}`}
                      className="flex items-start space-x-3 bg-slate-800 p-3 rounded-md border border-slate-700"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm font-semibold text-blue-400">
                        {phase.phase}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{phase.title}</div>
                        <div className="text-xs text-slate-400">
                          {phase.dates} ({phase.duration})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Building className="w-5 h-5 mr-2 text-slate-400" /> About {listing.company.name}
              </h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                {listing.company.description}
              </p>
              <div className="space-y-2 text-sm">
                {[
                  { icon: Briefcase, label: "Industry", value: listing.company.industry },
                  { icon: Users, label: "Company Size", value: listing.company.employees },
                  { icon: MapPin, label: "Headquarters", value: listing.company.headquarters },
                ].map(
                  (item, idx) =>
                    item.value &&
                    item.value !== "Not Specified" && (
                      <div key={idx} className="flex items-center space-x-2">
                        <item.icon className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">{item.label}:</span>
                        <span className="text-slate-200">{item.value}</span>
                      </div>
                    ),
                )}
                {listing.company.website && listing.company.website !== "website-not-set.com" && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400">Website:</span>
                    <a
                      href={
                        listing.company.website.startsWith("http")
                          ? listing.company.website
                          : `//${listing.company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline truncate"
                    >
                      {listing.company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Your Proposal Section - Only show for sellers with submitted proposals */}
            {isEligibleSeller && submittedProposal && (
              <SubmittedProposalCard
                proposal={submittedProposal}
                listingBudget={listing.budget}
                onEdit={handleProposalUpdate}
                onWithdraw={handleProposalWithdraw}
                onViewFull={() => {
                  console.log("View full proposal:", submittedProposal.id)
                }}
              />
            )}

            {/* Withdrawn Proposal Section - Always show for sellers with withdrawn proposals */}
            {isEligibleSeller && withdrawnProposal && (
              <WithdrawnProposalCard
                proposal={withdrawnProposal}
                listingBudget={listing.budget}
                withdrawnCount={withdrawnCount}
                listingId={listing.id}
                sellerId={sellerProfile?.id || ""}
                onViewAll={() => {
                  console.log("View all withdrawn proposals")
                }}
              />
            )}

            {/* Debug info for development */}
            {process.env.NODE_ENV === "development" && isEligibleSeller && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2">Debug Info</h4>
                <div className="text-xs text-red-300 space-y-1">
                  <div>User Type: {userType}</div>
                  <div>Seller Profile ID: {sellerProfile?.id}</div>
                  <div>Has Active Proposal: {submittedProposal ? "Yes" : "No"}</div>
                  <div>Has Withdrawn Proposal: {withdrawnProposal ? "Yes" : "No"}</div>
                  <div>Withdrawn Count: {withdrawnCount}</div>
                  <div>Loading Proposal: {loadingProposal ? "Yes" : "No"}</div>
                  <div>Proposal Error: {proposalError || "None"}</div>
                </div>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Related Discussions</h3>
              <p className="text-slate-400 text-sm mb-3">No related discussions found for this listing yet.</p>
              <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 text-sm">
                Start a discussion in the forum →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Proposal Modal */}
      {isProposalModalOpen && isEligibleSeller && (
        <SubmitProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          listingId={listing.id}
          listingTitle={listing.title}
          companyName={listing.company.name}
          budget={listing.budget}
          onSuccess={handleProposalSuccess}
        />
      )}
    </div>
  )
}
