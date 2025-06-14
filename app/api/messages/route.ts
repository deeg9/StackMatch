import { type NextRequest, NextResponse } from "next/server"

// Mock API for message operations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversationId")

  if (conversationId) {
    // Return messages for specific conversation
    const mockMessages = [
      {
        id: "msg-1",
        conversationId,
        senderId: "user-1",
        senderName: "Emily Davila",
        content: "Hi! I'd like to discuss the project requirements.",
        type: "text",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        readBy: [],
      },
    ]

    return NextResponse.json({ messages: mockMessages })
  }

  // Return all conversations
  const mockConversations = [
    {
      id: "conv-1",
      participants: [
        {
          id: "user-1",
          name: "Emily Davila",
          avatar: "/placeholder.svg?height=40&width=40",
          userType: "BUSINESS",
          company: "TechStartup Inc.",
          isOnline: true,
        },
      ],
      lastMessage: {
        id: "msg-1",
        content: "Hi! I'd like to discuss the project requirements.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      unreadCount: 2,
      projectId: "1",
      projectTitle: "Integrated Business Solutions",
    },
  ]

  return NextResponse.json({ conversations: mockConversations })
}

export async function POST(request: NextRequest) {
  const { conversationId, content, type = "text" } = await request.json()

  // Mock sending a message
  const newMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId: "current-user",
    senderName: "Current User",
    content,
    type,
    timestamp: new Date().toISOString(),
    readBy: [],
  }

  return NextResponse.json({ message: newMessage })
}
