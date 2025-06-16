"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/store" // Assuming AppDispatch is exported from store
import { useWebSocket } from "@/hooks/useWebSocket" // Assuming this hook is set up
// import { useEncryption } from "@/hooks/useEncryption"; // Assuming this hook is set up
import {
  setActiveConversationId,
  fetchConversations,
  fetchMessages,
  sendMessage,
  addRealtimeMessage,
  setCurrentUserId,
  addTypingUser,
  removeTypingUser,
  setUserOnline,
  setUserOffline,
  toggleConversationEncryption,
  updateConversationLastRead,
} from "@/store/slices/messagesSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { EncryptionIndicator } from "@/components/chat/encryption-indicator"; // Assuming this component exists
import {
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Search,
  X,
  Circle,
  MessageSquare,
  Users,
  Shield,
  ShieldOff,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { AuthUser, Message as MessageType, TypingUser } from "@/types" // Use correct types

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  initialConversationId?: string
  currentUserProfile: AuthUser | null // Pass current user profile
}

export function ChatInterface({ isOpen, onClose, initialConversationId, currentUserProfile }: ChatInterfaceProps) {
  const dispatch = useDispatch<AppDispatch>()
  // const { user: authUser } = useSelector((state: RootState) => state.auth); // Assuming auth state
  const {
    conversations,
    messages,
    activeConversationId,
    typingUsers,
    onlineUsers,
    isLoadingConversations,
    isLoadingMessages,
    error,
  } = useSelector((state: RootState) => state.messages)

  const wsManager = useWebSocket() // Get the wsManager instance
  // const { encryptMessage, decryptMessage, generateConversationKey, isEncryptionSupported } = useEncryption();

  const [messageInput, setMessageInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const [localIsTyping, setLocalIsTyping] = useState(false)

  useEffect(() => {
    if (currentUserProfile?.id) {
      dispatch(setCurrentUserId(currentUserProfile.id))
      dispatch(fetchConversations(currentUserProfile.id))
    }
  }, [dispatch, currentUserProfile?.id])

  useEffect(() => {
    if (initialConversationId && conversations.find((c) => c.id === initialConversationId)) {
      dispatch(setActiveConversationId(initialConversationId))
    } else if (!activeConversationId && conversations.length > 0) {
      dispatch(setActiveConversationId(conversations[0].id))
    }
  }, [initialConversationId, conversations, activeConversationId, dispatch])

  useEffect(() => {
    if (activeConversationId) {
      dispatch(fetchMessages(activeConversationId))
      wsManager?.joinConversation(activeConversationId) // Use wsManager from hook
      // Mark conversation as read on backend when messages are fetched
      // This could also be done via a specific API call or WebSocket event
    }
    return () => {
      if (activeConversationId) {
        wsManager?.leaveConversation(activeConversationId)
      }
    }
  }, [activeConversationId, dispatch, wsManager])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeConversationId])

  // WebSocket event listeners
  useEffect(() => {
    if (!wsManager) return

    const handleNewMessage = (message: MessageType) => {
      dispatch(addRealtimeMessage(message))
      if (message.conversation_id === activeConversationId && message.sender_id !== currentUserProfile?.id) {
        wsManager.markAsRead(message.conversation_id, message.id) // Inform server message is read
        dispatch(
          updateConversationLastRead({ conversationId: message.conversation_id, lastReadAt: new Date().toISOString() }),
        )
      }
    }
    const handleUserTyping = (data: TypingUser) => {
      if (data.isTyping) dispatch(addTypingUser(data))
      else dispatch(removeTypingUser(data))
    }
    const handleUserOnline = (userId: string) => dispatch(setUserOnline(userId))
    const handleUserOffline = (userId: string) => dispatch(setUserOffline(userId))

    // WebSocket event handlers temporarily disabled for build
    // wsManager.onMessage(handleNewMessage)
    // wsManager.onTyping(handleUserTyping)
    // wsManager.onUserOnline(handleUserOnline)
    // wsManager.onUserOffline(handleUserOffline)

    return () => {
      // WebSocket cleanup temporarily disabled for build
      // wsManager.off("new_message", handleNewMessage)
      // wsManager.off("user_typing", handleUserTyping)
      // wsManager.off("user_online", handleUserOnline)
      // wsManager.off("user_offline", handleUserOffline)
    }
  }, [wsManager, dispatch, activeConversationId, currentUserProfile?.id])

  const handleConversationSelect = (conversationId: string) => {
    dispatch(setActiveConversationId(conversationId))
    // Mark as read locally, backend update happens when messages are fetched or via explicit API
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv && conv.unreadCount && conv.unreadCount > 0) {
      // dispatch(markConversationAsReadOnServer(conversationId)); // Example thunk
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversationId || !currentUserProfile?.id) return

    // Optimistic update (optional, but good for UX)
    // const optimisticMessage: MessageType = { /* ... create optimistic message ... */ };
    // dispatch(_addMessageOptimistic(optimisticMessage));

    dispatch(
      sendMessage({
        conversationId: activeConversationId,
        content: messageInput.trim(),
        // attachments: undefined, // Add attachment handling
        // is_encrypted: activeConversationData?.encryptionEnabled
      }),
    )

    setMessageInput("")
    setLocalIsTyping(false)
    wsManager?.stopTyping(activeConversationId) // Use wsManager from hook
  }

  const handleInputChange = (value: string) => {
    setMessageInput(value)
    if (!activeConversationId || !wsManager) return

    if (value.trim() && !localIsTyping) {
      setLocalIsTyping(true)
      wsManager.startTyping(activeConversationId)
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    typingTimeoutRef.current = setTimeout(() => {
      setLocalIsTyping(false)
      wsManager.stopTyping(activeConversationId)
    }, 2000) // Stop typing after 2s of inactivity
  }

  const handleToggleEncryption = async () => {
    if (!activeConversationId) return
    dispatch(toggleConversationEncryption(activeConversationId))
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participants.some((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (conv as any).projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeConversationData = conversations.find((c) => c.id === activeConversationId)
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : []

  const otherParticipant = activeConversationData?.participants.find((p: any) => p.user_id !== currentUserProfile?.id)

  const conversationTypingUsers = typingUsers.filter(
    (tu) => tu.conversationId === activeConversationId && tu.userId !== currentUserProfile?.id,
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Messages
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex min-h-0 p-0">
          {/* Conversations List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {isLoadingConversations && <div className="p-4 text-center">Loading conversations...</div>}
            {error && <div className="p-4 text-center text-red-500">Error: {error}</div>}
            {!isLoadingConversations && (
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredConversations.map((conversation) => {
                    const otherUserDisplay =
                      conversation.participants.find((p: any) => p.user_id !== currentUserProfile?.id) ||
                      conversation.participants[0]
                    const isActive = conversation.id === activeConversationId

                    return (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleConversationSelect(conversation.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={otherUserDisplay?.avatar || "/placeholder.svg"}
                                alt={otherUserDisplay?.name}
                              />
                              <AvatarFallback>{otherUserDisplay?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {(otherUserDisplay as any)?.isOnline && ( // Assuming isOnline is part of Participant type
                              <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-sm truncate">{otherUserDisplay?.name}</p>
                                {(conversation as any).encryptionEnabled && <Shield className="h-3 w-3 text-green-600" />}
                              </div>
                              {conversation.unreadCount && conversation.unreadCount > 0 && (
                                <Badge
                                  variant="default"
                                  className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                                >
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {(otherUserDisplay as any)?.company || "Personal Chat"}
                            </p>
                            {(conversation as any).projectTitle && (
                              <p className="text-xs text-blue-600 truncate">{(conversation as any).projectTitle}</p>
                            )}
                            {conversation.lastMessage && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {conversation.lastMessage.encrypted ? "🔒 " : ""}
                                {conversation.lastMessage.content}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {conversation.lastMessage &&
                                formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConversationData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={otherParticipant?.avatar || "/placeholder.svg"}
                          alt={otherParticipant?.name}
                        />
                        <AvatarFallback>{otherParticipant?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {(otherParticipant as any)?.isOnline && (
                        <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{otherParticipant?.name}</p>
                        {(activeConversationData as any).encryptionEnabled && <Shield className="h-4 w-4 text-green-600" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(otherParticipant as any)?.isOnline
                          ? "Online"
                          : (otherParticipant as any)?.lastSeen
                            ? `Last seen ${formatDistanceToNow(new Date((otherParticipant as any).lastSeen), { addSuffix: true })}`
                            : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" disabled>
                      {" "}
                      <Phone className="h-4 w-4" />{" "}
                    </Button>
                    <Button variant="ghost" size="sm" disabled>
                      {" "}
                      <Video className="h-4 w-4" />{" "}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {" "}
                          <MoreVertical className="h-4 w-4" />{" "}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        {activeConversationData.listing_id && <DropdownMenuItem>View Listing</DropdownMenuItem>}
                        <DropdownMenuItem onClick={handleToggleEncryption}>
                          {(activeConversationData as any).encryptionEnabled ? (
                            <>
                              {" "}
                              <ShieldOff className="h-4 w-4 mr-2" /> Disable Encryption{" "}
                            </>
                          ) : (
                            <>
                              {" "}
                              <Shield className="h-4 w-4 mr-2" /> Enable Encryption{" "}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {isLoadingMessages && <div className="flex-1 p-4 text-center">Loading messages...</div>}
                {!isLoadingMessages && (
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {activeMessages.map((message) => {
                        const isOwn = message.sender_id === currentUserProfile?.id
                        const senderProfile = activeConversationData.participants.find(
                          (p) => p.user_id === message.sender_id,
                        )

                        return (
                          <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`flex items-start space-x-2 max-w-[70%] ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                            >
                              {!isOwn && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={senderProfile?.avatar || "/placeholder.svg"}
                                    alt={senderProfile?.name}
                                  />
                                  <AvatarFallback>{senderProfile?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`rounded-lg p-3 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                              >
                                <div className="flex items-start space-x-2">
                                  {message.is_encrypted && (
                                    <Shield className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  )}
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <p
                                  className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                                >
                                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      {conversationTypingUsers.length > 0 && (
                        <div className="flex justify-start">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={otherParticipant?.avatar || "/placeholder.svg"}
                                alt={otherParticipant?.name}
                              />
                              <AvatarFallback>{otherParticipant?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                <div
                                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                />
                                <div
                                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                )}

                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" disabled>
                      {" "}
                      <Paperclip className="h-4 w-4" />{" "}
                    </Button>
                    <Input
                      placeholder={
                        (activeConversationData as any).encryptionEnabled ? "Type an encrypted message..." : "Type a message..."
                      }
                      value={messageInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
