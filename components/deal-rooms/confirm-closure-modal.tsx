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
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { ClosureOutcomeType } from "@/types/deal-room-types"

interface ConfirmClosureModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (outcomeType: ClosureOutcomeType) => Promise<boolean>
}

export function ConfirmClosureModal({ isOpen, onClose, onConfirm }: ConfirmClosureModalProps) {
  const [outcomeType, setOutcomeType] = useState<ClosureOutcomeType>(ClosureOutcomeType.SUCCESSFUL)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const success = await onConfirm(outcomeType)

      if (success) {
        // Reset form
        setOutcomeType(ClosureOutcomeType.SUCCESSFUL)
      }
    } catch (error) {
      console.error("Error confirming closure:", error)
      setError("Failed to confirm closure. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deal Room Closure</DialogTitle>
          <DialogDescription>
            The cooling period has ended. Please confirm the final outcome of this deal room.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Closure Outcome</h4>
              <RadioGroup
                value={outcomeType}
                onValueChange={(value) => setOutcomeType(value as ClosureOutcomeType)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value={ClosureOutcomeType.SUCCESSFUL} id="successful" className="mt-1" />
                  <div>
                    <Label htmlFor="successful" className="flex items-center gap-2 cursor-pointer">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Successful Closure</span>
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      The project was completed successfully and all parties are satisfied with the outcome.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value={ClosureOutcomeType.UNSUCCESSFUL} id="unsuccessful" className="mt-1" />
                  <div>
                    <Label htmlFor="unsuccessful" className="flex items-center gap-2 cursor-pointer">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Unsuccessful Closure</span>
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      The project was not completed successfully or was terminated early.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <DialogFooter>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Closure"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
