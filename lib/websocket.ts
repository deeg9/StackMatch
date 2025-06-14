"use client"

import { io, type Socket } from "socket.io-client"

class WebSocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(userId: string, token: string) {
    if (this.socket?.connected) {
      return this.socket
    }

    // Only attempt connection if WebSocket URL is properly configured
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
    if (!wsUrl || wsUrl === "ws://localhost:3001") {
      console.warn("WebSocket server not configured or not available. Real-time features will be disabled.")
      return null
    }

    try {
      this.socket = io(wsUrl, {
        auth: {
          token,
          userId,
        },
        transports: ["websocket", "polling"],
        timeout: 5000,
        forceNew: true,
      })

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server")
        this.reconnectAttempts = 0
      })

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from WebSocket server:", reason)
        if (reason === "io server disconnect") {
          this.handleReconnect()
        }
      })

      this.socket.on("connect_error", (error) => {
        console.warn("WebSocket connection failed - continuing without real-time features:", error.message)
        // Don't attempt reconnection for initial connection failures
        if (this.reconnectAttempts === 0) {
          this.socket?.disconnect()
          this.socket = null
        }
      })

      return this.socket
    } catch (error) {
      console.warn("Failed to initialize WebSocket connection:", error)
      return null
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.socket?.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }

  // Message methods
  sendMessage(conversationId: string, content: string, type: "text" | "file" = "text") {
    if (!this.socket?.connected) {
      console.warn("WebSocket not connected - message not sent in real-time")
      return
    }
    this.socket.emit("send_message", {
      conversationId,
      content,
      type,
      timestamp: new Date().toISOString(),
    })
  }

  joinConversation(conversationId: string) {
    if (!this.socket?.connected) return
    this.socket.emit("join_conversation", conversationId)
  }

  leaveConversation(conversationId: string) {
    if (!this.socket?.connected) return
    this.socket.emit("leave_conversation", conversationId)
  }

  markAsRead(conversationId: string, messageId: string) {
    if (!this.socket?.connected) return
    this.socket.emit("mark_as_read", { conversationId, messageId })
  }

  startTyping(conversationId: string) {
    if (!this.socket?.connected) return
    this.socket.emit("typing_start", conversationId)
  }

  stopTyping(conversationId: string) {
    if (!this.socket?.connected) return
    this.socket.emit("typing_stop", conversationId)
  }

  // Forum methods
  subscribeToThread(threadId: string) {
    if (!this.socket?.connected) return
    this.socket.emit("subscribe_thread", threadId)
  }

  unsubscribeFromThread(threadId: string) {
    if (!this.socket?.connected) return
    this.socket.emit("unsubscribe_thread", threadId)
  }

  subscribeToTag(tag: string) {
    if (!this.socket?.connected) return
    this.socket.emit("subscribe_tag", tag)
  }

  unsubscribeFromTag(tag: string) {
    if (!this.socket?.connected) return
    this.socket.emit("unsubscribe_tag", tag)
  }

  // Event listeners
  onMessage(callback: (message: any) => void) {
    this.socket?.on("new_message", callback)
  }

  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    this.socket?.on("user_typing", callback)
  }

  onUserOnline(callback: (userId: string) => void) {
    this.socket?.on("user_online", callback)
  }

  onUserOffline(callback: (userId: string) => void) {
    this.socket?.on("user_offline", callback)
  }

  onMessageRead(callback: (data: { messageId: string; readBy: string }) => void) {
    this.socket?.on("message_read", callback)
  }

  // Event listeners for forum
  onNewThread(callback: (thread: any) => void) {
    this.socket?.on("new_thread", callback)
  }

  onNewComment(callback: (comment: any) => void) {
    this.socket?.on("new_comment", callback)
  }

  onThreadUpdate(callback: (data: { threadId: string; updates: any }) => void) {
    this.socket?.on("thread_update", callback)
  }

  onMention(callback: (data: { threadId: string; commentId: string; mentionedBy: string }) => void) {
    this.socket?.on("user_mention", callback)
  }

  // Remove event listeners
  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback)
  }
}

export const wsManager = new WebSocketManager()
