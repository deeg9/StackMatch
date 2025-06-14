"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createClient } from "@/utils/supabase/client"
import {
  addMessage,
  updateConversation,
  setUserOnline,
  setUserOffline,
  updateMessage,
} from "@/store/slices/messagesSlice"
import type { RootState } from "@/store"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface UseSupabaseRealtimeProps {
  table: string
  event?: "INSERT" | "UPDATE" | "DELETE" | "*"
  callback: (payload: any) => void
  filter?: string
  filterValue?: any
}

export function useSupabaseRealtime({ table, event = "*", callback, filter, filterValue }: UseSupabaseRealtimeProps) {
  useEffect(() => {
    const supabase = createClient()

    // Set up the subscription
    const subscription = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table,
          ...(filter && filterValue ? { filter: `${filter}=eq.${filterValue}` } : {}),
        },
        (payload) => {
          console.log(`Realtime update for ${table}:`, payload)
          callback(payload)
        },
      )
      .subscribe()

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [table, event, callback, filter, filterValue])
}

export function useSupabaseRealtimeMessages() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { activeConversation } = useSelector((state: RootState) => state.messages)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const presenceChannelRef = useRef<RealtimeChannel | null>(null)
  const reactionsChannelRef = useRef<RealtimeChannel | null>(null)

  // Subscribe to messages and reactions in real-time
  const handleNewMessage = async (payload) => {
    console.log("New message received:", payload)

    // Fetch the complete message with user data
    const { data: messageData, error } = await createClient()
      .from("messages")
      .select(`
        id,
        content,
        message_type,
        file_url,
        file_name,
        created_at,
        sender_id,
        conversation_id,
        users!inner (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("id", payload.new.id)
      .single()

    if (messageData && !error) {
      const formattedMessage = {
        id: messageData.id,
        conversationId: messageData.conversation_id,
        senderId: messageData.sender_id,
        senderName: `${messageData.users.first_name} ${messageData.users.last_name}`.trim(),
        senderAvatar: messageData.users.avatar_url || "/placeholder.svg?height=32&width=32",
        content: messageData.content,
        type: messageData.message_type,
        timestamp: messageData.created_at,
        encrypted: false,
        readBy: [],
        reactions: [],
      }

      dispatch(addMessage(formattedMessage))

      // Update conversation's last message and timestamp
      dispatch(
        updateConversation({
          id: messageData.conversation_id,
          lastMessage: formattedMessage,
          updatedAt: messageData.created_at,
        }),
      )
    }
  }

  const handleConversationUpdate = (payload) => {
    console.log("Conversation updated:", payload)
    dispatch(
      updateConversation({
        id: payload.new.id,
        updatedAt: payload.new.updated_at,
      }),
    )
  }

  const handleReactionUpdate = async (payload) => {
    console.log("Reaction updated:", payload)

    // Fetch updated reactions for the message
    const messageId = payload.new?.message_id || payload.old?.message_id
    if (messageId) {
      try {
        const response = await fetch(`/api/messages/${messageId}/reactions`)
        const data = await response.json()

        if (data.reactions) {
          // Update the message with new reactions
          dispatch(
            updateMessage({
              id: messageId,
              reactions: data.reactions,
            }),
          )
        }
      } catch (error) {
        console.error("Error fetching updated reactions:", error)
      }
    }
  }

  useEffect(() => {
    if (!user?.id) return

    useSupabaseRealtime({
      table: "messages",
      event: "INSERT",
      callback: handleNewMessage,
    })

    useSupabaseRealtime({
      table: "conversations",
      event: "UPDATE",
      callback: handleConversationUpdate,
    })

    useSupabaseRealtime({
      table: "message_reactions",
      event: "*",
      callback: handleReactionUpdate,
    })

    // Subscribe to user presence
    const presenceChannel = createClient()
      .channel("online-users")
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState()
        console.log("Presence sync:", state)

        // Update online users
        Object.keys(state).forEach((userId) => {
          if (userId !== user.id) {
            dispatch(setUserOnline(userId))
          }
        })
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences)
        if (key !== user.id) {
          dispatch(setUserOnline(key))
        }
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences)
        if (key !== user.id) {
          dispatch(setUserOffline(key))
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track this user's presence
          await presenceChannel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    presenceChannelRef.current = presenceChannel

    return () => {
      if (presenceChannelRef.current) {
        createClient().removeChannel(presenceChannelRef.current)
      }
    }
  }, [user?.id, dispatch])

  // Subscribe to typing indicators for active conversation
  useEffect(() => {
    if (!activeConversation || !user?.id) return

    const typingChannel = createClient()
      .channel(`typing:${activeConversation}`)
      .on("broadcast", { event: "typing" }, (payload) => {
        console.log("Typing event:", payload)
        // Handle typing indicators here if needed
      })
      .subscribe()

    return () => {
      createClient().removeChannel(typingChannel)
    }
  }, [activeConversation, user?.id])

  // Functions to broadcast typing events
  const startTyping = async (conversationId: string) => {
    if (!user?.id) return

    const channel = createClient().channel(`typing:${conversationId}`)
    await channel.send({
      type: "broadcast",
      event: "typing",
      payload: {
        user_id: user.id,
        user_name: user.name,
        typing: true,
      },
    })
  }

  const stopTyping = async (conversationId: string) => {
    if (!user?.id) return

    const channel = createClient().channel(`typing:${conversationId}`)
    await channel.send({
      type: "broadcast",
      event: "typing",
      payload: {
        user_id: user.id,
        user_name: user.name,
        typing: false,
      },
    })
  }

  return {
    startTyping,
    stopTyping,
  }
}
