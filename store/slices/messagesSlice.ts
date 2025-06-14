import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { getErrorMessage } from "@/lib/utils/error-handler"
import type { Conversation, Message, TypingUser } from "@/types" // Ensure AuthUser is correctly typed

interface MessagesState {
  conversations: Conversation[]
  messages: Record<string, Message[]> // Keyed by conversationId
  activeConversationId: string | null
  typingUsers: TypingUser[] // Users currently typing in active conversation
  onlineUsers: string[] // IDs of users currently online
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  error: string | null
  currentUserId: string | null // Store current user ID for convenience
}

const initialState: MessagesState = {
  conversations: [],
  messages: {},
  activeConversationId: null,
  typingUsers: [],
  onlineUsers: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  error: null,
  currentUserId: null,
}

// Async thunk to fetch conversations
export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/conversations?userId=${userId}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch conversations")
      }
      const data = await response.json()
      return data.conversations as Conversation[]
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

// Async thunk to fetch messages for a conversation
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to fetch messages")
      }
      const data = await response.json()
      return { conversationId, messages: data.messages as Message[] }
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (
    payload: { conversationId: string; content: string; attachments?: any; is_encrypted?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/messages/${payload.conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: payload.content,
          attachments: payload.attachments,
          is_encrypted: payload.is_encrypted,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || "Failed to send message")
      }
      const data = await response.json()
      return data.message as Message // API should return the created message
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error) || "Network error")
    }
  },
)

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setCurrentUserId: (state, action: PayloadAction<string | null>) => {
      state.currentUserId = action.payload
    },
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload
      if (action.payload) {
        const conversation = state.conversations.find((c) => c.id === action.payload)
        if (conversation) conversation.unreadCount = 0 // Mark as read locally
      }
    },
    addRealtimeMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload
      const conversationId = message.conversation_id

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = []
      }
      // Avoid duplicates if message already added via optimistic update or REST
      if (!state.messages[conversationId].find((m) => m.id === message.id)) {
        state.messages[conversationId].push(message)
      }

      const conversation = state.conversations.find((c) => c.id === conversationId)
      if (conversation) {
        conversation.lastMessage = {
          id: message.id,
          content: message.content,
          timestamp: message.created_at,
          senderId: message.sender_id,
          encrypted: message.is_encrypted,
        }
        conversation.updated_at = message.created_at
        if (message.sender_id !== state.currentUserId && conversationId !== state.activeConversationId) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1
        }
      }
    },
    // For optimistic updates or direct addition if not using thunks for all
    _addMessageOptimistic: (state, action: PayloadAction<Message>) => {
      const message = action.payload
      const conversationId = message.conversation_id
      if (!state.messages[conversationId]) state.messages[conversationId] = []
      state.messages[conversationId].push(message)
      const conversation = state.conversations.find((c) => c.id === conversationId)
      if (conversation) {
        conversation.lastMessage = {
          id: message.id,
          content: message.content,
          timestamp: message.created_at,
          senderId: message.sender_id,
          encrypted: message.is_encrypted,
        }
        conversation.updated_at = message.created_at
      }
    },
    // Update an existing message
    updateMessage: (state, action: PayloadAction<Partial<Message> & { id: string; conversation_id: string }>) => {
      const { id, conversation_id, ...updates } = action.payload
      const conversationMessages = state.messages[conversation_id]

      if (conversationMessages) {
        const messageIndex = conversationMessages.findIndex((m) => m.id === id)
        if (messageIndex !== -1) {
          conversationMessages[messageIndex] = {
            ...conversationMessages[messageIndex],
            ...updates,
          }

          // Update last message in conversation if this was the last message
          const conversation = state.conversations.find((c) => c.id === conversation_id)
          if (conversation && conversation.lastMessage?.id === id) {
            conversation.lastMessage = {
              ...conversation.lastMessage,
              content: updates.content || conversation.lastMessage.content,
              encrypted: updates.is_encrypted ?? conversation.lastMessage.encrypted,
            }
          }
        }
      }
    },
    // Remove a message
    removeMessage: (state, action: PayloadAction<{ messageId: string; conversationId: string }>) => {
      const { messageId, conversationId } = action.payload
      const conversationMessages = state.messages[conversationId]

      if (conversationMessages) {
        state.messages[conversationId] = conversationMessages.filter((m) => m.id !== messageId)

        // Update last message in conversation if this was the last message
        const conversation = state.conversations.find((c) => c.id === conversationId)
        if (conversation && conversation.lastMessage?.id === messageId) {
          const remainingMessages = state.messages[conversationId]
          if (remainingMessages.length > 0) {
            const lastMessage = remainingMessages[remainingMessages.length - 1]
            conversation.lastMessage = {
              id: lastMessage.id,
              content: lastMessage.content,
              timestamp: lastMessage.created_at,
              senderId: lastMessage.sender_id,
              encrypted: lastMessage.is_encrypted,
            }
          } else {
            conversation.lastMessage = undefined
          }
        }
      }
    },
    updateConversationLastRead: (state, action: PayloadAction<{ conversationId: string; lastReadAt: string }>) => {
      const conv = state.conversations.find((c) => c.id === action.payload.conversationId)
      if (conv) {
        const participant = conv.participants.find((p) => p.user_id === state.currentUserId)
        if (participant) {
          participant.last_read_at = action.payload.lastReadAt
        }
        // Optionally re-calculate unread count based on new lastReadAt
      }
    },
    // Update conversation metadata
    updateConversation: (state, action: PayloadAction<Partial<Conversation> & { id: string }>) => {
      const { id, ...updates } = action.payload
      const conversationIndex = state.conversations.findIndex((c) => c.id === id)
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          ...updates,
        }
      }
    },
    // Add a new conversation
    addConversation: (state, action: PayloadAction<Conversation>) => {
      const newConversation = action.payload
      // Check if conversation already exists
      if (!state.conversations.find((c) => c.id === newConversation.id)) {
        state.conversations.unshift(newConversation) // Add to beginning
      }
    },
    // Remove a conversation
    removeConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload
      state.conversations = state.conversations.filter((c) => c.id !== conversationId)
      // Also remove messages for this conversation
      delete state.messages[conversationId]
      // Clear active conversation if it was the removed one
      if (state.activeConversationId === conversationId) {
        state.activeConversationId = null
      }
    },
    // Typing indicators
    addTypingUser: (state, action: PayloadAction<TypingUser>) => {
      if (
        !state.typingUsers.find(
          (tu) => tu.userId === action.payload.userId && tu.conversationId === action.payload.conversationId,
        )
      ) {
        state.typingUsers.push(action.payload)
      }
    },
    removeTypingUser: (state, action: PayloadAction<TypingUser>) => {
      state.typingUsers = state.typingUsers.filter(
        (tu) => !(tu.userId === action.payload.userId && tu.conversationId === action.payload.conversationId),
      )
    },
    // Online status - bulk update
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload
      state.conversations.forEach((c) => {
        c.participants.forEach((p) => {
          p.isOnline = action.payload.includes(p.user_id)
        })
      })
    },
    // Online status - individual user actions
    setUserOnline: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId)
      }
      // Update participant status in conversations
      state.conversations.forEach((c) => {
        c.participants.forEach((p) => {
          if (p.user_id === userId) {
            p.isOnline = true
          }
        })
      })
    },
    setUserOffline: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      state.onlineUsers = state.onlineUsers.filter((id) => id !== userId)
      // Update participant status in conversations
      state.conversations.forEach((c) => {
        c.participants.forEach((p) => {
          if (p.user_id === userId) {
            p.isOnline = false
          }
        })
      })
    },
    // Local encryption state (if needed, or handle per conversation)
    toggleConversationEncryption: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find((c) => c.id === action.payload)
      if (conv) {
        conv.encryptionEnabled = !conv.encryptionEnabled
      }
    },
    // Mark conversation as read
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find((c) => c.id === action.payload)
      if (conversation) {
        conversation.unreadCount = 0
      }
    },
    // Update unread count
    updateUnreadCount: (state, action: PayloadAction<{ conversationId: string; count: number }>) => {
      const conversation = state.conversations.find((c) => c.id === action.payload.conversationId)
      if (conversation) {
        conversation.unreadCount = action.payload.count
      }
    },
    // Message reactions
    addMessageReaction: (
      state,
      action: PayloadAction<{ messageId: string; conversationId: string; reaction: string; userId: string }>,
    ) => {
      const { messageId, conversationId, reaction, userId } = action.payload
      const conversationMessages = state.messages[conversationId]

      if (conversationMessages) {
        const message = conversationMessages.find((m) => m.id === messageId)
        if (message) {
          if (!message.reactions) {
            message.reactions = []
          }
          // Remove existing reaction from this user for this emoji
          message.reactions = message.reactions.filter((r) => !(r.emoji === reaction && r.user_id === userId))
          // Add new reaction
          message.reactions.push({
            emoji: reaction,
            user_id: userId,
            created_at: new Date().toISOString(),
          })
        }
      }
    },
    removeMessageReaction: (
      state,
      action: PayloadAction<{ messageId: string; conversationId: string; reaction: string; userId: string }>,
    ) => {
      const { messageId, conversationId, reaction, userId } = action.payload
      const conversationMessages = state.messages[conversationId]

      if (conversationMessages) {
        const message = conversationMessages.find((m) => m.id === messageId)
        if (message && message.reactions) {
          message.reactions = message.reactions.filter((r) => !(r.emoji === reaction && r.user_id === userId))
        }
      }
    },
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    // Reset messages state
    resetMessages: (state) => {
      state.conversations = []
      state.messages = {}
      state.activeConversationId = null
      state.typingUsers = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoadingConversations = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.isLoadingConversations = false
        state.conversations = action.payload.map((conv) => ({
          ...conv,
          participants: conv.participants.map((p) => ({ ...p, isOnline: state.onlineUsers.includes(p.user_id) })),
        }))
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoadingConversations = false
        state.error = action.payload as string
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true
        state.error = null
      })
      .addCase(
        fetchMessages.fulfilled,
        (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
          state.isLoadingMessages = false
          state.messages[action.payload.conversationId] = action.payload.messages
          // Mark conversation as read when messages are fetched for the active one
          if (state.activeConversationId === action.payload.conversationId) {
            const conversation = state.conversations.find((c) => c.id === action.payload.conversationId)
            if (conversation) conversation.unreadCount = 0
          }
        },
      )
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoadingMessages = false
        state.error = action.payload as string
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        // Message is added to the conversation by addRealtimeMessage or optimistic update
        // This thunk primarily handles API call and backend state update.
        // If not using optimistic updates or websockets for self-messages, add here:
        const message = action.payload
        const conversationId = message.conversation_id
        if (!state.messages[conversationId]) state.messages[conversationId] = []
        if (!state.messages[conversationId].find((m) => m.id === message.id)) {
          // Avoid duplicate if already added optimistically
          state.messages[conversationId].push(message)
        }
        const conversation = state.conversations.find((c) => c.id === conversationId)
        if (conversation) {
          conversation.lastMessage = {
            id: message.id,
            content: message.content,
            timestamp: message.created_at,
            senderId: message.sender_id,
            encrypted: message.is_encrypted,
          }
          conversation.updated_at = message.created_at
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = `Failed to send message: ${action.payload as string}`
        // Potentially remove optimistic message if it was added
      })
  },
})

export const {
  setCurrentUserId,
  setActiveConversationId,
  addRealtimeMessage,
  _addMessageOptimistic,
  updateMessage,
  removeMessage,
  updateConversationLastRead,
  updateConversation,
  addConversation,
  removeConversation,
  addTypingUser,
  removeTypingUser,
  setOnlineUsers,
  setUserOnline,
  setUserOffline,
  toggleConversationEncryption,
  markConversationAsRead,
  updateUnreadCount,
  addMessageReaction,
  removeMessageReaction,
  clearError,
  resetMessages,
} = messagesSlice.actions

// Add aliases for backward compatibility
export const addMessage = addRealtimeMessage

export default messagesSlice.reducer
