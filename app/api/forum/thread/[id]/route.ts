import { type NextRequest, NextResponse } from "next/server"
import type { ForumThread, ForumComment } from "@/types/forum-types" // Assuming types are in this path
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// Mock database of threads (subset of what's in /api/forum/route.ts for simplicity)
const mockThreads: ForumThread[] = [
  {
    id: "thread-1",
    title: "What CRM do you recommend for a SaaS startup?",
    content: "We're a small SaaS startup looking for a CRM solution. Any recommendations?",
    category: "CRM Tools",
    tags: ["SaaS", "Startup", "CRM"],
    type: "QUESTION",
    isAnonymous: false,
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
    author: {
      id: "user-1",
      name: "John Doe",
      role: "BUSINESS",
      isVerified: true,
      reputation: 150,
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      views: 120,
      upvotes: 15,
      downvotes: 2,
      comments: 2,
    },
    hasBestAnswer: true,
  },
  {
    id: "thread-2",
    title: "Our NetSuite implementation took 4 months. AMA.",
    content: "We recently completed our NetSuite implementation. It took 4 months and cost us $50k. Ask me anything!",
    category: "ERP Systems",
    tags: ["NetSuite", "Implementation", "Case Study"],
    type: "DISCUSSION",
    isAnonymous: false,
    createdAt: "2023-05-10T14:20:00Z",
    updatedAt: "2023-05-12T09:15:00Z",
    author: {
      id: "user-2",
      name: "Jane Smith",
      role: "BUSINESS",
      isVerified: true,
      reputation: 280,
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      views: 250,
      upvotes: 32,
      downvotes: 0,
      comments: 1,
    },
    hasBestAnswer: false,
  },
]

// Mock database of comments
const mockComments: ForumComment[] = [
  {
    id: "comment-1",
    threadId: "thread-1",
    content: "We've had great success with HubSpot. It's user-friendly and scales well.",
    isAnonymous: false,
    createdAt: "2023-05-15T11:00:00Z",
    updatedAt: "2023-05-15T11:00:00Z",
    author: {
      id: "user-2",
      name: "Jane Smith",
      role: "PROVIDER",
      isVerified: true,
      reputation: 280,
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      upvotes: 10,
      downvotes: 1,
    },
    isBestAnswer: true,
    replies: [
      {
        id: "comment-3",
        threadId: "thread-1",
        parentId: "comment-1",
        content: "Thanks for the suggestion, Jane! We'll check it out.",
        isAnonymous: false,
        createdAt: "2023-05-15T11:30:00Z",
        updatedAt: "2023-05-15T11:30:00Z",
        author: {
          id: "user-1",
          name: "John Doe",
          role: "BUSINESS",
          isVerified: true,
          reputation: 150,
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
        stats: {
          upvotes: 2,
          downvotes: 0,
        },
        isBestAnswer: false,
      },
    ],
  },
  {
    id: "comment-2",
    threadId: "thread-1",
    content: "Consider Zoho CRM as well. It's quite feature-rich for its price.",
    isAnonymous: false,
    createdAt: "2023-05-15T11:15:00Z",
    updatedAt: "2023-05-15T11:15:00Z",
    author: {
      id: "user-3",
      name: "Mike Johnson",
      role: "BUSINESS",
      isVerified: false,
      reputation: 90,
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      upvotes: 5,
      downvotes: 0,
    },
    isBestAnswer: false,
  },
  {
    id: "comment-4",
    threadId: "thread-2",
    content: "Wow, $50k for 4 months sounds intense! What were the biggest challenges?",
    isAnonymous: false,
    createdAt: "2023-05-10T15:00:00Z",
    updatedAt: "2023-05-10T15:00:00Z",
    author: {
      id: "user-1",
      name: "John Doe",
      role: "BUSINESS",
      isVerified: true,
      reputation: 150,
      avatar_url: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      upvotes: 7,
      downvotes: 0,
    },
    isBestAnswer: false,
  },
]

// GET /api/forum/thread/[id] - Get a single thread by ID with its comments
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const threadId = params.id
    const thread = mockThreads.find((t: any) => t.id === threadId)

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Increment view count using RPC
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    const { error: rpcError } = await supabase.rpc("increment_view_count", {
      p_table_name: "forum_threads",
      p_record_id: threadId,
    })

    if (rpcError) {
      console.error("Error incrementing forum thread view count:", rpcError)
      // Decide if this error should block the response or just be logged
    }

    const threadComments = mockComments.filter((c: any) => c.threadId === threadId && !c.parentId)

    // Function to recursively fetch replies
    const fetchReplies = (commentId: string): ForumComment[] => {
      return mockComments
        .filter((c: any) => c.parentId === commentId)
        .map((reply: any) => ({ ...reply, replies: fetchReplies(reply.id) }))
    }

    const commentsWithReplies = threadComments.map((comment: any) => ({
      ...comment,
      replies: fetchReplies(comment.id),
    }))

    return NextResponse.json({ ...thread, comments: commentsWithReplies })
  } catch (error) {
    console.error(`Error fetching thread ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 })
  }
}

// PATCH /api/forum/thread/[id] - Update a thread
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const threadId = params.id
    const body = await request.json()
    const { title, content, category, tags, type, isAnonymous, isLocked, isPinned } = body // Add isLocked, isPinned

    const threadIndex = mockThreads.findIndex((t: any) => t.id === threadId)

    if (threadIndex === -1) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Mock updating the thread - in a real app, this would update the database
    // and ensure the user has permission
    const originalThread = mockThreads[threadIndex]
    const updatedThread = {
      ...originalThread,
      title: title ?? originalThread.title,
      content: content ?? originalThread.content,
      category: category ?? originalThread.category,
      tags: tags ?? originalThread.tags,
      type: type ?? originalThread.type,
      isAnonymous: isAnonymous ?? originalThread.isAnonymous,
      // Add isLocked and isPinned if your ForumThread type supports them
      // isLocked: isLocked ?? originalThread.isLocked,
      // isPinned: isPinned ?? originalThread.isPinned,
      updatedAt: new Date().toISOString(),
    }
    mockThreads[threadIndex] = updatedThread

    return NextResponse.json(updatedThread)
  } catch (error) {
    console.error(`Error updating thread ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update thread" }, { status: 500 })
  }
}

// DELETE /api/forum/thread/[id] - Delete a thread
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const threadId = params.id
    const threadIndex = mockThreads.findIndex((t: any) => t.id === threadId)

    if (threadIndex === -1) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Mock deleting the thread - in a real app, this would delete from the database
    // and ensure the user has permission
    mockThreads.splice(threadIndex, 1)
    // Also delete associated comments (simplified here)
    // mockComments = mockComments.filter(c => c.threadId !== threadId);

    return NextResponse.json({ success: true, message: `Thread ${threadId} deleted` })
  } catch (error) {
    console.error(`Error deleting thread ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete thread" }, { status: 500 })
  }
}
