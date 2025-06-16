"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface MessageNotificationProps {
  onOpenChat: (conversationId?: string) => void
}

export function MessageNotification({ onOpenChat }: MessageNotificationProps) {
  const { conversations } = useSelector((state: RootState) => state.messages)
  const [notifications, setNotifications] = useState<string[]>([])

  const unreadConversations = conversations.filter((conv) => (conv.unreadCount || 0) > 0)

  useEffect(() => {
    // Show notification for new unread conversations
    unreadConversations.forEach((conv) => {
      if (!notifications.includes(conv.id) && conv.lastMessage) {
        setNotifications((prev) => [...prev, conv.id])

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((id) => id !== conv.id))
        }, 5000)
      }
    })
  }, [unreadConversations, notifications])

  const handleDismiss = (conversationId: string) => {
    setNotifications((prev) => prev.filter((id) => id !== conversationId))
  }

  const visibleNotifications = notifications
    .map((id) => unreadConversations.find((conv) => conv.id === id))
    .filter(Boolean)
    .slice(0, 3) // Show max 3 notifications

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map((conversation) => {
        if (!conversation) return null

        const otherUser = conversation.participants.find((p) => p.id !== conversation.participants[0].id)

        return (
          <Card key={conversation.id} className="w-80 shadow-lg border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherUser?.avatar || "/placeholder.svg"} alt={otherUser?.name} />
                  <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{otherUser?.name}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(conversation.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{(otherUser as any)?.company}</p>
                  {conversation.lastMessage && (
                    <>
                      <p className="text-sm mt-1 truncate">{conversation.lastMessage.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                      </p>
                    </>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        onOpenChat(conversation.id)
                        handleDismiss(conversation.id)
                      }}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    {(conversation.unreadCount || 0) > 1 && (
                      <span className="text-xs text-muted-foreground">
                        +{(conversation.unreadCount || 0) - 1} more messages
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
