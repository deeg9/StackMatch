"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentToken } from "@/lib/auth/token-utils"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Participant {
  id: string
  user_id: string
  role: string
  user: {
    first_name: string
    last_name: string
    email: string
  }
}

interface RemoveParticipantDialogProps {
  isOpen: boolean
  onClose: () => void
  participant: Participant | null
  dealRoomId: string
  onParticipantRemoved: (participantId: string) => void
  currentUserId?: string
}

export function RemoveParticipantDialog({
  isOpen,
  onClose,
  participant,
  dealRoomId,
  onParticipantRemoved,
  currentUserId,
}: RemoveParticipantDialogProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const { toast } = useToast()

  const handleRemove = async () => {
    if (!participant) return

    try {
      setIsRemoving(true)
      const { token } = await getCurrentToken()

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication failed",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/deal-rooms/${dealRoomId}/participants/${participant.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to remove participant")
      }

      const participantName =
        `${participant.user.first_name} ${participant.user.last_name}`.trim() || participant.user.email
      const isSelf = participant.user_id === currentUserId

      toast({
        title: "Success",
        description: isSelf ? "You have left the deal room" : `${participantName} has been removed from the deal room`,
      })

      onParticipantRemoved(participant.id)
      onClose()
    } catch (error) {
      console.error("Error removing participant:", error)
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  if (!participant) return null

  const participantName =
    `${participant.user.first_name} ${participant.user.last_name}`.trim() || participant.user.email
  const isSelf = participant.user_id === currentUserId

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-100">
            {isSelf ? "Leave Deal Room" : "Remove Participant"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            {isSelf
              ? "Are you sure you want to leave this deal room? You won't be able to access it unless someone adds you back."
              : `Are you sure you want to remove ${participantName} from this deal room? They will lose access immediately.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700" disabled={isRemoving}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={isRemoving}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isRemoving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isSelf ? "Leaving..." : "Removing..."}
              </>
            ) : isSelf ? (
              "Leave"
            ) : (
              "Remove"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
