"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EmojiPicker } from "./emoji-picker"

interface Reaction {
  emoji: string
  count: number
  users: string[]
  userIds: string[]
}

interface MessageReactionsProps {
  messageId: string
  reactions?: Reaction[]
  onReactionUpdate?: () => void
}

export function MessageReactions({ messageId, reactions = [], onReactionUpdate }: MessageReactionsProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const [localReactions, setLocalReactions] = useState<Reaction[]>(reactions)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setLocalReactions(reactions)
  }, [reactions])

  const handleEmojiSelect = async (emoji: string) => {
    if (!user?.id || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/messages/${messageId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emoji,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Optimistically update local state
        setLocalReactions((prev) => {
          const existingReactionIndex = prev.findIndex((r) => r.emoji === emoji)

          if (data.action === "removed") {
            if (existingReactionIndex >= 0) {
              const updated = [...prev]
              const reaction = updated[existingReactionIndex]
              reaction.count--
              reaction.userIds = reaction.userIds.filter((id) => id !== user.id)
              reaction.users = reaction.users.filter((_, index) => reaction.userIds[index] !== user.id)

              if (reaction.count === 0) {
                updated.splice(existingReactionIndex, 1)
              }
              return updated
            }
          } else {
            // Added reaction
            if (existingReactionIndex >= 0) {
              const updated = [...prev]
              updated[existingReactionIndex].count++
              updated[existingReactionIndex].userIds.push(user.id)
              updated[existingReactionIndex].users.push(user.name || "You")
              return updated
            } else {
              return [
                ...prev,
                {
                  emoji,
                  count: 1,
                  userIds: [user.id],
                  users: [user.name || "You"],
                },
              ]
            }
          }
          return prev
        })

        // Trigger parent update
        onReactionUpdate?.()
      }
    } catch (error) {
      console.error("Error updating reaction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReactionClick = (emoji: string) => {
    handleEmojiSelect(emoji)
  }

  if (localReactions.length === 0) {
    return (
      <div className="flex items-center mt-1">
        <EmojiPicker onEmojiSelect={handleEmojiSelect} disabled={isLoading} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {localReactions.map((reaction) => {
        const hasUserReacted = reaction.userIds.includes(user?.id || "")
        const tooltipText =
          reaction.users.length <= 3
            ? reaction.users.join(", ")
            : `${reaction.users.slice(0, 3).join(", ")} and ${reaction.users.length - 3} others`

        return (
          <TooltipProvider key={reaction.emoji}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={hasUserReacted ? "default" : "secondary"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleReactionClick(reaction.emoji)}
                  disabled={isLoading}
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
      <EmojiPicker onEmojiSelect={handleEmojiSelect} disabled={isLoading} />
    </div>
  )
}
