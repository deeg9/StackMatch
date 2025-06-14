"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  Search,
  ArrowLeft,
  Paperclip,
  Send,
  ShieldCheck,
  Phone,
  Video,
  MoreVertical,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import {
  setActiveConversationId,
  fetchConversations,
  fetchMessages,
  sendMessage,
  setCurrentUserId,
  // Remove any addMessage imports if they exist
} from "@/store/slices/messagesSlice"
import type { AuthUser } from "@/types"

// Types
type User = {
  id: string
  name: string
  avatarUrl: string
  isOnline: boolean
  company?: string
}

type Message = {
  id: string
  senderId: string
  content: string
  timestamp: string
  isOwnMessage?: boolean
}

type Conversation = {
  id: string
  participants: User[]
  dealRoomName?: string
  lastMessage: Message
  unreadCount: number
  isEncrypted?: boolean
}

type ChatView = {
  conversationId: string
  participant: User
  messages: Message[]
  isEncrypted?: boolean
}

export function MessagePopover({ currentUserProfile }: { currentUserProfile: AuthUser | null }) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const {
    conversations,
    messages,
    activeConversationId,
    isLoadingConversations,
    isLoadingMessages,
    // currentUserId // from Redux store
  } = useSelector((state: RootState) => state.messages)
  const currentUserId = useSelector((state: RootState) => state.messages.currentUserId)

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [messageInput, setMessageInput] = useState("")

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentUserProfile?.id && isOpen) {
      if (currentUserId !== currentUserProfile.id) {
        dispatch(setCurrentUserId(currentUserProfile.id))
      }
      if (conversations.length === 0 && !isLoadingConversations) {
        dispatch(fetchConversations(currentUserProfile.id))
      }
    }
  }, [dispatch, currentUserProfile?.id, isOpen, conversations.length, isLoadingConversations, currentUserId])

  useEffect(() => {
    if (activeConversationId && isOpen) {
      if (!messages[activeConversationId] && !isLoadingMessages) {
        dispatch(fetchMessages(activeConversationId))
      }
    }
  }, [activeConversationId, isOpen, dispatch, messages, isLoadingMessages])

  useEffect(() => {
    if (activeConversationId && scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector("div[data-radix-scroll-area-viewport]")
      if (scrollViewport) {
        setTimeout(() => {
          scrollViewport.scrollTop = scrollViewport.scrollHeight
        }, 100) // Small delay to ensure DOM update
      }
    }
  }, [messages, activeConversationId]) // Rerun when messages for active chat change

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participants.some((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      conv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)

  const handleConversationSelect = (conversationId: string) => {
    dispatch(setActiveConversationId(conversationId))
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversationId) return

    dispatch(
      sendMessage({
        conversationId: activeConversationId,
        content: messageInput.trim(),
        // attachments: undefined, // Add attachment handling
        // is_encrypted: activeChatData?.encryptionEnabled
      }),
    )
    setMessageInput("")
  }

  const activeChatData = activeConversationId ? conversations.find((c) => c.id === activeConversationId) : null
  const activeChatMessages = activeConversationId ? messages[activeConversationId] || [] : []
  const otherParticipant = activeChatData?.participants.find((p) => p.user_id !== currentUserId)

  const popoverWidth = activeChatData ? "w-[700px]" : "w-[384px]"

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          dispatch(setActiveConversationId(null)) // Clear active chat when popover closes
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full w-9 h-9">
          <MessageSquare className="h-5 w-5" />
          {totalUnreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full"
            >
              {totalUnreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className={cn(
          "p-0 shadow-2xl rounded-lg bg-[#111827] text-white border-[#374151] overflow-hidden",
          "transition-all duration-300 ease-in-out",
          popoverWidth,
        )}
        style={{ height: "70vh", minHeight: "400px", maxHeight: "70vh" }}
      >
        <div className="flex h-full max-h-[70vh]">
          {/* Conversation List Panel */}
          <div
            className={cn(
              "w-[384px] border-r border-[#374151] flex flex-col h-full",
              activeChatData && "hidden md:flex",
            )}
          >
            <div className="p-4 border-b border-[#374151] flex items-center space-x-2">
              {activeChatData && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white md:hidden"
                  onClick={() => dispatch(setActiveConversationId(null))}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <MessageSquare className="h-6 w-6 text-gray-400" />
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-9 bg-[#1f2937] border-[#374151] focus:border-sky-500 text-sm rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {isLoadingConversations && <div className="p-4 text-center text-sm text-gray-400">Loading...</div>}
            <ScrollArea className="flex-1">
              {filteredConversations.length === 0 && !isLoadingConversations ? (
                <p className="p-4 text-center text-gray-500 text-sm">No conversations found.</p>
              ) : (
                filteredConversations.map((conv) => {
                  const participantDisplay =
                    conv.participants.find((p) => p.user_id !== currentUserId) || conv.participants[0]
                  return (
                    <div
                      key={conv.id}
                      className={cn(
                        "flex items-center p-3 space-x-3 cursor-pointer hover:bg-[#1f2937]/70",
                        activeConversationId === conv.id && "bg-[#1f2937]",
                      )}
                      onClick={() => handleConversationSelect(conv.id)}
                    >
                      <Avatar className="h-10 w-10 relative">
                        <AvatarImage
                          src={participantDisplay?.avatar || "/placeholder.svg"}
                          alt={participantDisplay?.name}
                        />
                        <AvatarFallback>{participantDisplay?.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
                        {participantDisplay?.isOnline && (
                          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#111827]" />
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold truncate">{participantDisplay?.name}</h3>
                          {conv.lastMessage && (
                            <time className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conv.lastMessage.timestamp), { addSuffix: true }).replace(
                                "about ",
                                "",
                              )}
                            </time>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {conv.projectTitle || participantDisplay?.company}
                        </p>
                        <div className="flex justify-between items-center">
                          <p
                            className={cn(
                              "text-xs text-gray-500 truncate",
                              conv.unreadCount && conv.unreadCount > 0 && "text-sky-400 font-medium",
                            )}
                          >
                            {conv.lastMessage?.encrypted && "🔒 "}
                            {conv.lastMessage?.content}
                          </p>
                          {conv.unreadCount && conv.unreadCount > 0 && (
                            <Badge className="ml-2 bg-sky-500 text-white px-1.5 py-0.5 text-[10px] rounded-full">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </ScrollArea>
            <div className="p-2 border-t border-[#374151] text-center">
              <Button
                variant="link"
                size="sm"
                className="text-sky-400 hover:text-sky-300 text-xs"
                onClick={() => {
                  router.push("/messages")
                  setIsOpen(false)
                }} // Assuming /messages is the full page
              >
                View All Messages
              </Button>
            </div>
          </div>

          {/* Chat View Panel */}
          {activeChatData && (
            <div className={cn("flex-1 flex flex-col h-full", !activeChatData && "hidden")}>
              {/* Chat Header */}
              <div className="p-3 border-b border-[#374151] flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white md:hidden"
                  onClick={() => dispatch(setActiveConversationId(null))}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10 relative">
                  <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} alt={otherParticipant?.name} />
                  <AvatarFallback>{otherParticipant?.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
                  {otherParticipant?.isOnline && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#111827]" />
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{otherParticipant?.name}</h3>
                  <p className="text-xs text-gray-400">{otherParticipant?.isOnline ? "Online" : "Offline"}</p>
                </div>
                {activeChatData.encryptionEnabled && (
                  <Badge
                    variant="outline"
                    className="ml-auto bg-green-500/10 border-green-500 text-green-400 text-xs px-2 py-0.5"
                  >
                    <ShieldCheck className="h-3 w-3 mr-1" /> Encrypted
                  </Badge>
                )}
                <div className="ml-auto flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" disabled>
                    {" "}
                    <Phone className="h-4 w-4" />{" "}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" disabled>
                    {" "}
                    <Video className="h-4 w-4" />{" "}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    {" "}
                    <MoreVertical className="h-4 w-4" />{" "}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {" "}
                    <X className="h-4 w-4" />{" "}
                  </Button>
                </div>
              </div>

              {isLoadingMessages && (
                <div className="flex-1 p-4 text-center text-sm text-gray-400">Loading messages...</div>
              )}
              <ScrollArea className="flex-1 bg-[#0d1117]" ref={scrollAreaRef}>
                <div className="p-4 space-y-3">
                  {activeChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn("flex", msg.sender_id === currentUserId ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] p-2.5 rounded-lg text-sm",
                          msg.sender_id === currentUserId
                            ? "bg-sky-600 text-white rounded-br-none"
                            : "bg-[#1f2937] text-gray-200 rounded-bl-none",
                        )}
                      >
                        <p>
                          {msg.is_encrypted && "🔒 "}
                          {msg.content}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            msg.sender_id === currentUserId ? "text-sky-200/80 text-right" : "text-gray-500 text-left",
                          )}
                        >
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activeChatMessages.length === 0 && !isLoadingMessages && (
                    <p className="text-center text-gray-500 text-sm py-10">No messages yet. Start the conversation!</p>
                  )}
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-[#374151] bg-[#111827]">
                <div className="flex items-center space-x-2 bg-[#1f2937] rounded-md p-1.5">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" disabled>
                    {" "}
                    <Paperclip className="h-5 w-5" />{" "}
                  </Button>
                  <Input
                    type="text"
                    placeholder={
                      activeChatData.encryptionEnabled ? "Type an encrypted message..." : "Type a message..."
                    }
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-500 px-0"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (handleSendMessage(), e.preventDefault())}
                  />
                  <Button
                    size="icon"
                    className="bg-sky-600 hover:bg-sky-500 rounded-md w-8 h-8"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
