"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { wsManager } from "@/lib/websocket"
import { addForumNotification, addReputationPoints } from "@/store/slices/forumSlice"

export function useForumNotifications() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { subscribedTags, subscribedThreads } = useSelector((state: RootState) => state.forum)

  useEffect(() => {
    if (!user) return

    // Set up WebSocket event listeners for forum notifications
    wsManager.onNewThread((thread) => {
      // Check if user is subscribed to any of the thread's tags
      const hasSubscribedTag = thread.tags.some((tag: string) => subscribedTags.includes(tag))

      if (hasSubscribedTag) {
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
      // Check if user is subscribed to this thread or if it's their thread
      if (subscribedThreads.includes(comment.threadId) || comment.threadAuthorId === user.id) {
        dispatch(
          addForumNotification({
            id: `notification-${Date.now()}`,
            type: "new_comment",
            threadId: comment.threadId,
            commentId: comment.id,
            content: comment.content.substring(0, 100),
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
          threadTitle: data.threadTitle,
          createdAt: new Date().toISOString(),
          read: false,
        }),
      )
    })

    // Listen for upvotes on user's posts
    wsManager.onThreadUpdate((data) => {
      if (data.type === "upvote" && data.authorId === user.id) {
        dispatch(
          addForumNotification({
            id: `notification-${Date.now()}`,
            type: "upvote",
            threadId: data.threadId,
            content: data.title,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        )

        // Add reputation points for upvote
        dispatch(
          addReputationPoints({
            points: 10,
            activity: {
              id: `activity-${Date.now()}`,
              type: "upvote_received",
              points: 10,
              threadId: data.threadId,
              createdAt: new Date().toISOString(),
            },
          }),
        )
      }

      if (data.type === "best_answer" && data.authorId === user.id) {
        dispatch(
          addForumNotification({
            id: `notification-${Date.now()}`,
            type: "best_answer",
            threadId: data.threadId,
            commentId: data.commentId,
            threadTitle: data.threadTitle,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        )

        // Add reputation points for best answer
        dispatch(
          addReputationPoints({
            points: 50,
            activity: {
              id: `activity-${Date.now()}`,
              type: "best_answer",
              points: 50,
              threadId: data.threadId,
              commentId: data.commentId,
              createdAt: new Date().toISOString(),
            },
          }),
        )
      }
    })

    // Cleanup
    return () => {
      wsManager.off("new_thread")
      wsManager.off("new_comment")
      wsManager.off("thread_update")
      wsManager.off("user_mention")
    }
  }, [user, subscribedTags, subscribedThreads, dispatch])

  // Auto-subscribe to threads when user participates
  const subscribeToThread = (threadId: string) => {
    wsManager.subscribeToThread(threadId)
  }

  // Subscribe to tags based on user interests
  const subscribeToTag = (tag: string) => {
    wsManager.subscribeToTag(tag)
  }

  return {
    subscribeToThread,
    subscribeToTag,
  }
}
