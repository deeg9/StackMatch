import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ForumThread, ForumComment, ForumCategory, ForumNotification } from "@/types"

interface ForumState {
  threads: ForumThread[]
  currentThread: ForumThread | null
  categories: ForumCategory[]
  notifications: ForumNotification[]
  filters: {
    category: string
    tags: string[]
    sortBy: "newest" | "oldest" | "popular" | "trending"
    timeRange: "day" | "week" | "month" | "year" | "all"
  }
  searchTerm: string
  isLoading: boolean
  error: string | null
}

const initialState: ForumState = {
  threads: [],
  currentThread: null,
  categories: [],
  notifications: [],
  filters: {
    category: "all",
    tags: [],
    sortBy: "newest",
    timeRange: "all",
  },
  searchTerm: "",
  isLoading: false,
  error: null,
}

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setThreads: (state, action: PayloadAction<ForumThread[]>) => {
      state.threads = action.payload
    },
    addThread: (state, action: PayloadAction<ForumThread>) => {
      state.threads.unshift(action.payload)
    },
    updateThread: (state, action: PayloadAction<ForumThread>) => {
      const index = state.threads.findIndex((thread: any) => thread.id === action.payload.id)
      if (index !== -1) {
        state.threads[index] = action.payload
      }
      if (state.currentThread?.id === action.payload.id) {
        state.currentThread = action.payload
      }
    },
    setCurrentThread: (state, action: PayloadAction<ForumThread | null>) => {
      state.currentThread = action.payload
    },
    addComment: (state, action: PayloadAction<{ threadId: string; comment: ForumComment }>) => {
      const { threadId, comment } = action.payload
      const thread = state.threads.find((t: any) => t.id === threadId)
      if (thread) {
        thread.comments.push(comment)
        thread.commentCount = thread.comments.length
        thread.lastActivity = comment.createdAt
      }
      if (state.currentThread?.id === threadId) {
        state.currentThread.comments.push(comment)
        state.currentThread.commentCount = state.currentThread.comments.length
        state.currentThread.lastActivity = comment.createdAt
      }
    },
    updateComment: (state, action: PayloadAction<{ threadId: string; comment: ForumComment }>) => {
      const { threadId, comment } = action.payload
      const thread = state.threads.find((t: any) => t.id === threadId)
      if (thread) {
        const index = thread.comments.findIndex((c: any) => c.id === comment.id)
        if (index !== -1) {
          thread.comments[index] = comment
        }
      }
      if (state.currentThread?.id === threadId) {
        const index = state.currentThread.comments.findIndex((c: any) => c.id === comment.id)
        if (index !== -1) {
          state.currentThread.comments[index] = comment
        }
      }
    },
    voteThread: (state, action: PayloadAction<{ threadId: string; voteType: "up" | "down" }>) => {
      const { threadId, voteType } = action.payload
      const thread = state.threads.find((t: any) => t.id === threadId)
      if (thread) {
        if (voteType === "up") {
          thread.upvotes += 1
        } else {
          thread.downvotes += 1
        }
      }
      if (state.currentThread?.id === threadId) {
        if (voteType === "up") {
          state.currentThread.upvotes += 1
        } else {
          state.currentThread.downvotes += 1
        }
      }
    },
    voteComment: (state, action: PayloadAction<{ threadId: string; commentId: string; voteType: "up" | "down" }>) => {
      const { threadId, commentId, voteType } = action.payload
      const thread = state.threads.find((t: any) => t.id === threadId)
      if (thread) {
        const comment = thread.comments.find((c: any) => c.id === commentId)
        if (comment) {
          if (voteType === "up") {
            comment.upvotes += 1
          } else {
            comment.downvotes += 1
          }
        }
      }
      if (state.currentThread?.id === threadId) {
        const comment = state.currentThread.comments.find((c: any) => c.id === commentId)
        if (comment) {
          if (voteType === "up") {
            comment.upvotes += 1
          } else {
            comment.downvotes += 1
          }
        }
      }
    },
    setCategories: (state, action: PayloadAction<ForumCategory[]>) => {
      state.categories = action.payload
    },
    setNotifications: (state, action: PayloadAction<ForumNotification[]>) => {
      state.notifications = action.payload
    },
    addNotification: (state, action: PayloadAction<ForumNotification>) => {
      state.notifications.unshift(action.payload)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n: any) => n.id === action.payload)
      if (notification) {
        notification.isRead = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification: any) => {
        notification.isRead = true
      })
    },
    updateFilters: (state, action: PayloadAction<Partial<ForumState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  setThreads,
  addThread,
  updateThread,
  setCurrentThread,
  addComment,
  updateComment,
  voteThread,
  voteComment,
  setCategories,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  updateFilters,
  setSearchTerm,
} = forumSlice.actions

export default forumSlice.reducer
