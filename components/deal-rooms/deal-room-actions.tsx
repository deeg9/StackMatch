"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RequestClosureModal } from "@/components/deal-rooms/request-closure-modal"
import { ConfirmClosureModal } from "@/components/deal-rooms/confirm-closure-modal"
import { useDealRoomClosure } from "@/hooks/useDealRoomClosure"
import { DealRoomStatus, type ClosureReasonCategory, type ClosureOutcomeType } from "@/types/deal-room-types"
import { Archive, MoreHorizontal, CheckCircle2, XCircle, Clock } from "lucide-react"

interface DealRoomActionsProps {
  dealRoomId: string
  status: DealRoomStatus
  isInitiator?: boolean
  coolingPeriodEnded?: boolean
  userRole: "buyer" | "seller" | "participant"
}

export function DealRoomActions({
  dealRoomId,
  status,
  isInitiator = false,
  coolingPeriodEnded = false,
  userRole,
}: DealRoomActionsProps) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const { requestClosure, confirmClosure, cancelClosure, loading } = useDealRoomClosure(dealRoomId)

  // Handle request closure
  const handleRequestClosure = async (reasonCategory: ClosureReasonCategory, reasonDescription?: string) => {
    const success = await requestClosure(reasonCategory, reasonDescription)

    if (success) {
      setIsRequestModalOpen(false)
    }

    return success
  }

  // Handle confirm closure
  const handleConfirmClosure = async (outcomeType: ClosureOutcomeType) => {
    const success = await confirmClosure(outcomeType)

    if (success) {
      setIsConfirmModalOpen(false)
    }

    return success
  }

  // Handle cancel closure
  const handleCancelClosure = async () => {
    return await cancelClosure()
  }

  // Render actions based on status
  const renderActions = () => {
    // Only buyers and sellers can request closure
    const canRequestClosure = (userRole === "buyer" || userRole === "seller") && status === DealRoomStatus.ACTIVE

    // Only the initiator can confirm or cancel closure
    const canConfirmClosure = isInitiator && status === DealRoomStatus.PENDING_CLOSURE && coolingPeriodEnded

    const canCancelClosure = isInitiator && status === DealRoomStatus.PENDING_CLOSURE && !coolingPeriodEnded

    // Deal room is already closed
    const isClosed = status === DealRoomStatus.CLOSED_SUCCESSFULLY || status === DealRoomStatus.CLOSED_UNSUCCESSFULLY

    if (isClosed) {
      return (
        <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
          <Archive className="h-4 w-4" />
          <span>Archived</span>
        </Button>
      )
    }

    if (canConfirmClosure) {
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsConfirmModalOpen(true)}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Confirm Closure</span>
        </Button>
      )
    }

    if (canCancelClosure) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancelClosure}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <XCircle className="h-4 w-4" />
          <span>Cancel Closure</span>
        </Button>
      )
    }

    if (status === DealRoomStatus.PENDING_CLOSURE) {
      return (
        <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Closure Pending</span>
        </Button>
      )
    }

    if (canRequestClosure) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MoreHorizontal className="h-4 w-4" />
              <span>Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRequestModalOpen(true)}>
              <Archive className="h-4 w-4 mr-2" />
              <span>Request Closure</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
        <MoreHorizontal className="h-4 w-4" />
        <span>Actions</span>
      </Button>
    )
  }

  return (
    <>
      {renderActions()}

      <RequestClosureModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequest={handleRequestClosure}
      />

      <ConfirmClosureModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmClosure}
      />
    </>
  )
}
