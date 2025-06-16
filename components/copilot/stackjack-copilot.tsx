"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, X, MessageSquare, UserIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
}

export function StackJackCopilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      text: "Hi! I'm StackJack. How can I help you navigate StackMatch or answer your questions today?",
      sender: "ai",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const auth = useSelector((state: RootState) => state.auth)
  const pathname = usePathname()

  const shouldRender =
    auth.isAuthenticated && (auth.user?.userType === "BUSINESS" || auth.user?.userType === "PROVIDER") && pathname !== "/"

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        text: data.reply,
        sender: "ai",
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("StackJack error:", error)
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "ai",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!shouldRender) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-card border shadow-xl rounded-lg z-50 flex flex-col h-96 max-h-[70vh]"
          >
            <header className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?width=32&height=32" alt="StackJack" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">StackJack</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </header>
            <ScrollArea className="flex-1 p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4 min-h-0">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "ai" && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src="/placeholder.svg?width=24&height=24" alt="StackJack" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[75%] p-3 rounded-lg ${
                        msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.sender === "user" && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start gap-2 items-center">
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?width=24&height=24" alt="StackJack Typing" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg flex items-center space-x-1">
                      <span className="text-sm">StackJack is thinking</span>
                      <span className="animate-bounce delay-75">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask StackJack..."
                  disabled={isLoading}
                  className="flex-grow"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div // Use motion.div to wrap the Button to avoid re-styling
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          variant="default"
          size="lg"
          className="rounded-full shadow-lg w-14 h-14 p-0"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close StackJack" : "Open StackJack"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </motion.div>
    </>
  )
}
