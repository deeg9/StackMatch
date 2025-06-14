import { type NextRequest, NextResponse } from "next/server"

// POST /api/forum/thread/[id]/comment - Add a comment to a thread
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const threadId = params.id
    const body = await request.json()
    const { content, isAnonymous, parentId } = body

    // Validate required fields
    if (!content) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Mock creating a new comment - in a real app, this would save to a database
    const newComment = {
      id: `comment-${Date.now()}`,
      threadId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: "user-1",
        name: isAnonymous ? "Anonymous User" : "John Doe",
        role: "BUSINESS",
        isVerified: true,
        reputation: 120,
      },
      stats: {
        upvotes: 0,
        downvotes: 0,
      },
      isBestAnswer: false,
      parentId: parentId || null,
      replies: [],
    }

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}

// PATCH /api/forum/thread/[id]/comment - Update a comment (edit, vote, mark as best answer)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const threadId = params.id
    const body = await request.json()
    const { commentId, action, content } = body

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
    }

    // Mock updating a comment - in a real app, this would update a database
    const updatedComment = {
      id: commentId,
      threadId,
      content: action === "edit" ? content : "This is a comment",
      createdAt: "2023-05-15T11:15:00Z",
      updatedAt: new Date().toISOString(),
      author: {
        id: "user-2",
        name: "Jane Smith",
        role: "PROVIDER",
        isVerified: true,
        reputation: 350,
      },
      stats: {
        upvotes: action === "upvote" ? 9 : 8,
        downvotes: action === "downvote" ? 1 : 0,
      },
      isBestAnswer: action === "markBest" ? true : false,
      replies: [],
    }

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

// DELETE /api/forum/thread/[id]/comment - Delete a comment
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const threadId = params.id
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get("commentId")

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
    }

    // Mock deleting a comment - in a real app, this would delete from a database
    // Here we just return a success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
