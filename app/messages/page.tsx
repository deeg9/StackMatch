"use client"
import { Navigation } from "@/components/navigation"
import { MessagingInterface } from "@/components/chat/messaging-interface"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MessagingInterface 
          dealRoomId="general-messages" 
          currentUserId="current-user"
        />
      </div>
    </div>
  )
}
