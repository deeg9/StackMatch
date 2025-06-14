"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { DealRoomDetails } from "@/components/deal-rooms/deal-room-details"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getCurrentToken } from "@/lib/auth/token-utils"
import { AddParticipantModal } from "@/components/deal-rooms/add-participant-modal"
import { RemoveParticipantDialog } from "@/components/deal-rooms/remove-participant-dialog"
import { ViewListingModal } from "@/components/deal-rooms/view-listing-modal"
import { ViewProposalModal } from "@/components/deal-rooms/view-proposal-modal"

// Add this helper function at the top of the component, after the imports
const safeFormatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Unknown"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Unknown"
    return dateString // formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return "Unknown"
  }
}

interface DealRoomData {
  id: string
  room_name: string
  status: string
  created_at: string
  updated_at?: string
  last_activity_at?: string
  listing_id: string
  proposal_id: string
  listing?: {
    id: string
    title: string
    description: string
    budget_min?: number
    budget_max?: number
    timeline?: string
    buyer_profile?: {
      company_name: string
      company_logo_url?: string
    }
  }
  proposal?: {
    id: string
    proposal_text?: string
    technical_approach?: string
    proposed_budget?: number
    proposed_timeline?: string
    seller_profile?: {
      company_name: string
      logo_url?: string
    }
  }
  deal_room_participants?: Array<{
    id: string
    user_id: string
    role: "BUYER" | "SELLER"
    joined_at: string
    user: {
      first_name?: string
      last_name?: string
      email: string
      avatar_url?: string
      full_name?: string
    }
  }>
  deal_room_messages?: Array<{
    id: string
    content: string
    created_at: string
    sender_id: string
    message_type: string
    file_url?: string
    sender?: {
      first_name?: string
      last_name?: string
      avatar_url?: string
      full_name?: string
    }
  }>
  deal_room_files?: Array<{
    id: string
    file_name: string
    file_size: number
    file_type: string
    file_url: string
    uploaded_at: string
    uploader?: {
      first_name?: string
      last_name?: string
    }
  }>
  deal_room_milestones?: Array<{
    id: string
    title: string
    description: string
    due_date: string
    status: "completed" | "in_progress" | "not_started"
    deliverables?: string[]
  }>
  deal_room_activities?: Array<{
    id: string
    activity_type: string
    description: string
    created_at: string
    user?: {
      first_name?: string
      last_name?: string
    }
  }>
}

export default function DealRoomPage() {
  // Add logging at the very start
  console.log("🔍 DEAL ROOM PAGE: Component rendering started at", new Date().toISOString())

  const params = useParams()
  const dealRoomId = params.id as string
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [dealRoom, setDealRoom] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false)
  const [showRemoveParticipantDialog, setShowRemoveParticipantDialog] = useState(false)
  const [participantToRemove, setParticipantToRemove] = useState<any>(null)

  // Modal states for quick actions
  const [isListingModalOpen, setIsListingModalOpen] = useState(false)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)

  // Fetch deal room data with token
  const fetchDealRoom = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔍 DEAL ROOM PAGE: Starting fetch for deal room:", dealRoomId)

      // Get token from Supabase session
      const { token, success } = await getCurrentToken()

      if (!success || !token) {
        console.error("🔍 DEAL ROOM PAGE: No token available")
        setError("Failed to get authentication token")
        setDebugInfo({
          hasToken: false,
          tokenError: "No token returned from getCurrentToken()",
        })
        setLoading(false)
        return
      }

      console.log("🔍 DEAL ROOM PAGE: Token retrieved successfully, length:", token.length)
      console.log("🔍 DEAL ROOM PAGE: Token preview:", token.substring(0, 20) + "...")

      // Make fetch request with token in header
      console.log("🔍 DEAL ROOM PAGE: Making API request to:", `/api/deal-rooms/${dealRoomId}`)

      const response = await fetch(`/api/deal-rooms/${dealRoomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      })

      console.log("🔍 DEAL ROOM PAGE: Response received:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      })

      // Handle response
      if (!response.ok) {
        const errorText = await response.text()
        console.error("🔍 DEAL ROOM PAGE: Error response:", errorText)

        let errorMessage = "Failed to fetch deal room"
        try {
          // Try to parse as JSON if possible
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
          setDebugInfo({
            hasToken: !!token,
            responseStatus: response.status,
            responseText: errorText,
            parsedError: errorJson,
          })
        } catch {
          // If not JSON, return the text
          errorMessage = errorText || errorMessage
          setDebugInfo({
            hasToken: !!token,
            responseStatus: response.status,
            responseText: errorText,
          })
        }

        setError(errorMessage)
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log("🔍 DEAL ROOM PAGE: Data received successfully:", {
        hasData: !!data,
        hasDealRoom: !!data.dealRoom,
        userRole: data.userRole,
      })

      if (!data.dealRoom) {
        console.error("🔍 DEAL ROOM PAGE: No deal room data in response")
        setError("No deal room data found")
        setDebugInfo({
          responseData: data,
        })
        setLoading(false)
        return
      }

      setDealRoom(data.dealRoom)
      setDebugInfo({
        hasToken: !!token,
        responseStatus: response.status,
        dealRoomId: data.dealRoom?.id,
      })
    } catch (error) {
      console.error("🔍 DEAL ROOM PAGE: Error fetching deal room:", error)
      setError(String(error))
      setDebugInfo({
        fetchError: String(error),
        errorStack: error instanceof Error ? getErrorStack(error) : "No stack trace",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch deal room data on mount
  useEffect(() => {
    console.log("🔍 DEAL ROOM PAGE: useEffect triggered with id:", dealRoomId)
    if (dealRoomId) {
      fetchDealRoom()
    }
  }, [dealRoomId])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!dealRoom) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>The requested deal room could not be found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <DealRoomDetails dealRoom={dealRoom} currentUserId={user?.id || ""} onRefresh={fetchDealRoom} />
      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={showAddParticipantModal}
        onClose={() => setShowAddParticipantModal(false)}
        dealRoomId={dealRoomId}
        onParticipantAdded={(newParticipant: any) => {
          if (dealRoom) {
            setDealRoom({
              ...dealRoom,
              deal_room_participants: [...(dealRoom.deal_room_participants || []), newParticipant],
            })
          }
        }}
      />

      {/* Remove Participant Dialog */}
      <RemoveParticipantDialog
        isOpen={showRemoveParticipantDialog}
        onClose={() => setShowRemoveParticipantDialog(false)}
        participant={participantToRemove}
        dealRoomId={dealRoomId}
        onParticipantRemoved={(participantId: string) => {
          if (dealRoom) {
            setDealRoom({
              ...dealRoom,
              deal_room_participants: dealRoom.deal_room_participants?.filter((p) => p.id !== participantId) || [],
            })
          }
        }}
        currentUserId={user?.id}
      />

      {/* Listing Modal */}
      <ViewListingModal
        isOpen={isListingModalOpen}
        onClose={() => {
          console.log("🔍 DEAL ROOM: Closing listing modal")
          setIsListingModalOpen(false)
        }}
        listingId={dealRoom.listing_id}
        dealRoomId={dealRoomId}
      />

      {/* Proposal Modal */}
      <ViewProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => {
          console.log("🔍 DEAL ROOM: Closing proposal modal")
          setIsProposalModalOpen(false)
        }}
        proposalId={dealRoom.proposal_id}
        dealRoomId={dealRoomId}
      />
    </div>
  )
}
