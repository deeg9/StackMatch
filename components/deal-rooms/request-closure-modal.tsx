"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { ClosureReasonCategory } from "@/types/deal-room-types"

interface RequestClosureModalProps {
  isOpen: boolean
  onClose: () => void
  onRequest: (reasonCategory: ClosureReasonCategory, reasonDescription?: string) => Promise<boolean>
}

export function RequestClosureModal({ isOpen, onClose, onRequest }: RequestClosureModalProps) {
  const [reasonCategory, setReasonCategory] = useState<ClosureReasonCategory>(ClosureReasonCategory.PROJECT_COMPLETED)
  const [reasonDescription, setReasonDescription] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const success = await onRequest(reasonCategory, reasonDescription)

      if (success) {
        // Reset form
        setReasonCategory(ClosureReasonCategory.PROJECT_COMPLETED)
        setReasonDescription("")
      }
    } catch (error) {
      console.error("Error requesting closure:", error)
      setError("Failed to request closure. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get reason label
  const getReasonLabel = (reason: ClosureReasonCategory) => {
    switch (reason) {
      case ClosureReasonCategory.PROJECT_COMPLETED:
        return "Project Completed Successfully"
      case ClosureReasonCategory.PROJECT_CANCELLED:
        return "Project Cancelled"
      case ClosureReasonCategory.MOVED_ELSEWHERE:
        return "Project Moved Elsewhere"
      case ClosureReasonCategory.NO_LONGER_NEEDED:
        return "Project No Longer Needed"
      case ClosureReasonCategory.DISPUTE:
        return "Dispute or Disagreement"
      case ClosureReasonCategory.OTHER:
        return "Other Reason"
      default:
        return reason
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Deal Room Closure</DialogTitle>
          <DialogDescription>
            Requesting closure will initiate a 3-day cooling period before the deal room is permanently closed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Reason for Closure</h4>
              <RadioGroup
                value={reasonCategory}
                onValueChange={(value) => setReasonCategory(value as ClosureReasonCategory)}
                className="space-y-2"
              >
                {Object.values(ClosureReasonCategory).map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason} id={reason} />
                    <Label htmlFor={reason} className="cursor-pointer">
                      {getReasonLabel(reason)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason-description">Additional Details (Optional)</Label>
              <Textarea
                id="reason-description"
                value={reasonDescription}
                onChange={(e) => setReasonDescription(e.target.value)}
                placeholder="Provide any additional context or details..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <DialogFooter className="sm:justify-between">
            <div className="text-xs text-gray-500">You can cancel this request during the cooling period.</div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  "Request Closure"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
