"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { createDealRoomFromProposal } from "@/store/slices/proposalRequestsSlice"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building, Users, FileText, DollarSign, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ProposalRequest, ProposalResponse } from "@/types/proposal-request-types"

interface CreateDealRoomButtonProps {
  request: ProposalRequest
  response: ProposalResponse
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function CreateDealRoomButton({
  request,
  response,
  variant = "default",
  size = "default",
  className,
}: CreateDealRoomButtonProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateDealRoom = async () => {
    setIsCreating(true)

    try {
      const result = await dispatch(
        createDealRoomFromProposal({
          requestId: request.id,
          responseId: response.id,
        }),
      ).unwrap()

      toast({
        title: "Deal Room Created! 🎉",
        description: "Your collaboration space is ready. Redirecting...",
      })

      // Redirect to the new deal room
      setTimeout(() => {
        router.push(`/deal-rooms/${result.id}`)
      }, 1500)
    } catch (error: any) {
      toast({
        title: "Failed to Create Deal Room",
        description: error || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Building className="w-4 h-4 mr-2" />
          Create Deal Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Create Deal Room
          </DialogTitle>
          <DialogDescription>
            This will create a secure collaboration space for you and the {request.buyer?.full_name || "buyer"} to work
            together on this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Deal Room will include:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Project files and documents</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Real-time messaging and collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Milestone tracking and progress updates</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Payment milestone management</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Project Summary:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>
                <span className="font-medium">Project:</span> {request.title}
              </div>
              <div>
                <span className="font-medium">Budget:</span> ${response.price.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Timeline:</span> {response.timeline_days} days
              </div>
              {response.milestones && response.milestones.length > 0 && (
                <div>
                  <span className="font-medium">Milestones:</span> {response.milestones.length} planned
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreateDealRoom} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Deal Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
