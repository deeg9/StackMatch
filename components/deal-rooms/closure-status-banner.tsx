"use client"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { DealRoomStatus, type ClosureOutcomeType } from "@/types/deal-room-types"
import { formatDistanceToNow } from "date-fns"

interface ClosureStatusBannerProps {
  status: DealRoomStatus
  outcomeType?: ClosureOutcomeType
  coolingPeriodEndsAt?: string
  initiatorType?: "BUYER" | "SELLER"
  isInitiator?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

export function ClosureStatusBanner({
  status,
  outcomeType,
  coolingPeriodEndsAt,
  initiatorType,
  isInitiator,
  onConfirm,
  onCancel,
}: ClosureStatusBannerProps) {
  // Calculate time remaining in cooling period
  const getTimeRemaining = () => {
    if (!coolingPeriodEndsAt) return ""

    const endDate = new Date(coolingPeriodEndsAt)
    return formatDistanceToNow(endDate, { addSuffix: true })
  }

  // Render banner based on status
  if (status === DealRoomStatus.PENDING_CLOSURE && coolingPeriodEndsAt) {
    const now = new Date()
    const endDate = new Date(coolingPeriodEndsAt)
    const coolingPeriodEnded = now >= endDate

    if (coolingPeriodEnded && isInitiator) {
      // Cooling period ended, initiator needs to confirm
      return (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Action Required</AlertTitle>
          <AlertDescription className="text-amber-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>The cooling period has ended. Please confirm the closure of this deal room.</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={onConfirm}>
                  Confirm Closure
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )
    } else if (coolingPeriodEnded) {
      // Cooling period ended, waiting for initiator
      return (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Closure Pending</AlertTitle>
          <AlertDescription className="text-amber-700">
            The cooling period has ended. Waiting for the {initiatorType?.toLowerCase()} to confirm the closure.
          </AlertDescription>
        </Alert>
      )
    } else if (isInitiator) {
      // In cooling period, initiator can cancel
      return (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Closure Requested</AlertTitle>
          <AlertDescription className="text-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>You requested to close this deal room. Cooling period ends {getTimeRemaining()}.</div>
              <Button size="sm" variant="outline" onClick={onCancel}>
                Cancel Request
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )
    } else {
      // In cooling period, non-initiator view
      return (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Closure Requested</AlertTitle>
          <AlertDescription className="text-blue-700">
            The {initiatorType?.toLowerCase()} has requested to close this deal room. Cooling period ends{" "}
            {getTimeRemaining()}.
          </AlertDescription>
        </Alert>
      )
    }
  } else if (status === DealRoomStatus.CLOSED_SUCCESSFULLY) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Successfully Closed</AlertTitle>
        <AlertDescription className="text-green-700">
          This deal room has been successfully closed. All parties have completed their obligations.
        </AlertDescription>
      </Alert>
    )
  } else if (status === DealRoomStatus.CLOSED_UNSUCCESSFULLY) {
    return (
      <Alert variant="default" className="bg-red-50 border-red-200">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Unsuccessfully Closed</AlertTitle>
        <AlertDescription className="text-red-700">
          This deal room has been closed unsuccessfully. The project was not completed as planned.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
