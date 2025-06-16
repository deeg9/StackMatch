"use client"

import type React from "react"
import type { ConversationMessage } from "@/types/ai-listing-types-clean"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { useState, useEffect, useRef } from "react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import {
  sendMessage,
  addMessage,
  initializeSession,
  setCurrentSession,
  saveDraft,
  selectCurrentSession,
  selectIsLoading,
  selectError,
  selectAllSessions,
} from "@/store/slices/aiListingSlice"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AIConversationPanelProps {
  formState?: Record<string, any>
  onFormStateUpdate?: (updates: Record<string, any>) => void
  className?: string
}

export function AIConversationPanel({ formState = {}, onFormStateUpdate, className }: AIConversationPanelProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  // Use a ref to ensure the session ID remains constant
  const sessionIdRef = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const sessionId = sessionIdRef.current

  const currentSession = useAppSelector(selectCurrentSession)
  const allSessions = useAppSelector(selectAllSessions)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)

  const [message, setMessage] = useState("")
  const [initialized, setInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize session only once on component mount
  useEffect(() => {
    if (!initialized) {
      console.log("🔍 UI: Initializing session with ID:", sessionId)

      // Only initialize if this exact session doesn't exist
      if (!allSessions[sessionId]) {
        console.log("🔍 UI: Creating new session:", sessionId)
        dispatch(initializeSession(sessionId))
      } else {
        console.log("🔍 UI: Session already exists, setting as current:", sessionId)
        dispatch(setCurrentSession(sessionId))
      }

      setInitialized(true)
    }
  }, [dispatch, sessionId, initialized, allSessions])

  // Force the current session to match our session ID if it doesn't
  useEffect(() => {
    if (initialized && currentSession?.sessionId !== sessionId && allSessions[sessionId]) {
      console.log("🔍 UI: Forcing session sync - setting current session to:", sessionId)
      dispatch(setCurrentSession(sessionId))
    }
  }, [dispatch, sessionId, currentSession, allSessions, initialized])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  // Auto-save draft periodically
  useEffect(() => {
    if (!currentSession) return

    const autoSaveInterval = setInterval(() => {
      handleSaveDraft()
    }, 30000) // Save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [currentSession])

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  // Debug logging for session state
  useEffect(() => {
    console.log("🔍 UI: Session state update:", {
      mySessionId: sessionId,
      currentSessionId: currentSession?.sessionId,
      hasSession: !!currentSession,
      messageCount: currentSession?.messages?.length || 0,
      allSessionIds: Object.keys(allSessions || {}),
      isLoading,
      error,
    })
  }, [currentSession, allSessions, isLoading, error, sessionId])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = {
      role: "user" as const,
      content: message.trim(),
      timestamp: new Date(),
    }

    console.log("🔍 UI: Adding user message to session:", sessionId)

    // Add user message immediately to show it in the UI
    dispatch(
      addMessage({
        sessionId: sessionId,
        message: userMessage,
      }),
    )

    // Clear input immediately
    const messageToSend = message.trim()
    setMessage("")

    try {
      console.log("🔍 UI: Sending message:", messageToSend)

      // Send to AI
      dispatch(
        sendMessage({
          sessionId: sessionId,
          message: messageToSend,
          currentFormState: formState,
          stage: "introduction",
        }),
      )

      console.log("✅ UI: Message dispatch sent")
    } catch (error) {
      console.error("❌ UI: Failed to send message:", error)
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? getErrorMessage(error) : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleSaveDraft = () => {
    if (!currentSession) return

    dispatch(
      saveDraft({
        sessionId: sessionId,
        formState,
        conversationData: currentSession.messages,
      }),
    )

    console.log("✅ Draft save dispatched")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Get messages from the current session
  const messages = currentSession?.messages || []

  if (!initialized || !currentSession) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Initializing conversation...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Assistant</span>
          <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <ScrollArea className="h-96 w-full border rounded-md p-4">
          <div className="space-y-4">
            {messages.map((msg: ConversationMessage, index: number) => (
              <div
                key={`${msg.id || index}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1"
            rows={2}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={!message.trim() || isLoading} size="sm">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
      </CardContent>
    </Card>
  )
}
