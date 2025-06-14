"use client"

import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { wsManager } from "@/lib/websocket"
import {
  addMessage,
  setTypingUser,
  removeTypingUser,
  setUserOnline,
  setUserOffline,
  updateMessage,
  incrementUnreadCount,
} from "@/store/slices/messagesSlice"

export function useWebSocket() {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state: RootState) => state.auth)
  const { activeConversation } = useSelector((state: RootState) => state.messages)
  const isConnected = useRef(false)

  useEffect(() => {
    if (user && token && !isConnected.current) {
      const socket = wsManager.connect(user.id, token)

      // Only set up event listeners if connection was successful
      if (socket) {
        isConnected.current = true

        // Set up event listeners
        wsManager.onMessage((message) => {
          dispatch(addMessage(message))

          // Increment unread count if not in active conversation
          if (message.conversationId !== activeConversation && message.senderId !== user.id) {
            dispatch(incrementUnreadCount(message.conversationId))
          }
        })

        wsManager.onTyping((data) => {
          if (data.isTyping) {
            dispatch(
              setTypingUser({
                userId: data.userId,
                userName: data.userName || "User",
                conversationId: data.conversationId,
              }),
            )
          } else {
            dispatch(
              removeTypingUser({
                userId: data.userId,
                conversationId: data.conversationId,
              }),
            )
          }
        })

        wsManager.onUserOnline((userId) => {
          dispatch(setUserOnline(userId))
        })

        wsManager.onUserOffline((userId) => {
          dispatch(setUserOffline(userId))
        })

        wsManager.onMessageRead((data) => {
          dispatch(
            updateMessage({
              id: data.messageId,
              readBy: [...(data.readBy || []), data.readBy],
            }),
          )
        })

        return () => {
          wsManager.disconnect()
          isConnected.current = false
        }
      } else {
        console.log("WebSocket connection not available - using polling for messages")
      }
    }
  }, [user, token, dispatch, activeConversation])

  return {
    sendMessage: wsManager.sendMessage.bind(wsManager),
    joinConversation: wsManager.joinConversation.bind(wsManager),
    leaveConversation: wsManager.leaveConversation.bind(wsManager),
    markAsRead: wsManager.markAsRead.bind(wsManager),
    startTyping: wsManager.startTyping.bind(wsManager),
    stopTyping: wsManager.stopTyping.bind(wsManager),
    isConnected: wsManager.getSocket()?.connected || false,
  }
}
