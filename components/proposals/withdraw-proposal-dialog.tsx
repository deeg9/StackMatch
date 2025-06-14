"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WithdrawProposalDialogProps {
  isOpen: boolean
  onClose: () => void
  proposalId: string
  listingTitle: string
  onSuccess: () => void
}

export function WithdrawProposalDialog({
  isOpen,
  onClose,
  proposalId,
  listingTitle,
  onSuccess,
}: WithdrawProposalDialogProps) {
  const [withdrawalReason, setWithdrawalReason] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { toast } = useToast()

  const handleWithdraw = async () => {
    console.log("🔍 CLIENT DEBUG: Starting withdrawal for proposal:", proposalId)
    setIsWithdrawing(true)

    try {
      // First run debug endpoint
      console.log("🔍 CLIENT DEBUG: Running debug endpoint...")
      const debugResponse = await fetch(`/api/proposals/${proposalId}/debug`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "debug" }),
      })

      const debugData = await debugResponse.json()
      console.log("🔍 CLIENT DEBUG: Debug response:", debugData)

      if (!debugData.canAccess) {
        throw new Error("You don't have permission to withdraw this proposal")
      }

      // Now try the actual withdrawal
      console.log("🔍 CLIENT DEBUG: Attempting withdrawal...")
      const response = await fetch(`/api/proposals/${proposalId}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          withdrawal_reason: withdrawalReason.trim() || null,
        }),
      })

      console.log("🔍 CLIENT DEBUG: Withdrawal response status:", response.status)

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = "Unknown error"

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          console.log("🔍 CLIENT DEBUG: Error response data:", errorData)
          errorMessage = errorData.error || errorData.details || "Unknown error"
        } else {
          const errorText = await response.text()
          console.log("🔍 CLIENT DEBUG: Non-JSON response:", errorText)
          errorMessage = `Server error: ${errorText.substring(0, 100)}...`
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("🔍 CLIENT DEBUG: Withdrawal successful:", data)

      toast({
        title: "Proposal withdrawn",
        description: "Your proposal has been successfully withdrawn.",
      })

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("🔍 CLIENT DEBUG: Error withdrawing proposal:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Withdraw Proposal
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to withdraw your proposal for "{listingTitle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for withdrawal (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for withdrawing your proposal..."
              value={withdrawalReason}
              onChange={(e) => setWithdrawalReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isWithdrawing}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleWithdraw} disabled={isWithdrawing}>
            {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isWithdrawing ? "Withdrawing..." : "Withdraw Proposal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
