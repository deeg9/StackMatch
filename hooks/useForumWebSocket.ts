"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { wsManager } from "@/lib/websocket"
import { addForumNotification } from "@/store/slices/forumSlice"

export function useForumWebSocket(threadId?: string, tags?: string[]) {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user) return

    // Subscribe to specific thread if provided
    if (threadId) {
      wsManager.subscribeToThread(threadId)
    }

    // Subscribe to tags if provided
    if (tags && tags.length > 0) {
      tags.forEach((tag: any) => wsManager.subscribeToTag(tag))
    }

    // Set up event listeners
    wsManager.onNewThread((thread) => {
      // Only notify if thread matches subscribed tags
      if (tags && tags.some((tag: any) => thread.tags.includes(tag))) {
        dispatch(
          addForumNotification({
            id: `notification-${Date.now()}`,
            type: "new_thread",
            threadId: thread.id,
            title: thread.title,
            category: thread.category,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        )
      }
    })

    wsManager.onNewComment((comment) => {
      // Only notify if comment is on the current thread
      if (threadId && comment.threadId === threadId) {
        dispatch(
          addForumNotification({
            id: `notification-${Date.now()}`,
            type: "new_comment",
            threadId: comment.threadId,
            commentId: comment.id,
            content: comment.content.substring(0, 50) + (comment.content.length > 50 ? "..." : ""),
            author: comment.author.name,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        )
      }
    })

    wsManager.onMention((data) => {
      dispatch(
        addForumNotification({
          id: `notification-${Date.now()}`,
          type: "mention",
          threadId: data.threadId,
          commentId: data.commentId,
          mentionedBy: data.mentionedBy,
          createdAt: new Date().toISOString(),
          read: false,
        }),
      )
    })

    wsManager.onThreadUpdate((data) => {
      // Only notify if update is for the current thread
      if (threadId && data.threadId === threadId) {
        // Handle thread updates if needed
      }
    })

    // Cleanup
    return () => {
      if (threadId) {
        wsManager.unsubscribeFromThread(threadId)
      }

      if (tags && tags.length > 0) {
        tags.forEach((tag: any) => wsManager.unsubscribeFromTag(tag))
      }

      wsManager.off("new_thread")
      wsManager.off("new_comment")
      wsManager.off("thread_update")
      wsManager.off("user_mention")
    }
  }, [user, threadId, tags, dispatch])
}
