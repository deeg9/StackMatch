"use client"

import { useState, useEffect } from "react"
import { X, Clock, FileText, Award, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define ticker item type
interface TickerItem {
  id: string
  message: string
  type: "deadline" | "new" | "award" | "milestone" | "trending"
}

export function TickerBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Initial ticker items - duplicated to ensure continuous flow
    const initialItems: TickerItem[] = [
      { id: "1", message: "ERP Implementation for Manufacturing due in 24 hours", type: "deadline" },
      { id: "2", message: "47 new projects submitted in the last hour", type: "new" },
      { id: "3", message: "TechSolutions just won a $50K CRM project with GlobalCorp", type: "award" },
      { id: "4", message: "StackMatch just reached 1,000 successful matches worth $2.5M", type: "milestone" },
      {
        id: "5",
        message: "AI and Machine Learning projects are trending this week with 40% increase",
        type: "trending",
      },
      { id: "6", message: "High-priority cybersecurity project bids close in 6 hours", type: "deadline" },
      { id: "7", message: "New blockchain integration project posted by FinTech startup", type: "new" },
      { id: "8", message: "Enterprise AWS migration project awarded to CloudExperts", type: "award" },
      // Duplicate items to ensure continuous flow
      { id: "9", message: "ERP Implementation for Manufacturing due in 24 hours", type: "deadline" },
      { id: "10", message: "47 new projects submitted in the last hour", type: "new" },
      { id: "11", message: "TechSolutions just won a $50K CRM project with GlobalCorp", type: "award" },
      { id: "12", message: "StackMatch just reached 1,000 successful matches worth $2.5M", type: "milestone" },
      {
        id: "13",
        message: "AI and Machine Learning projects are trending this week with 40% increase",
        type: "trending",
      },
      { id: "14", message: "High-priority cybersecurity project bids close in 6 hours", type: "deadline" },
      { id: "15", message: "New blockchain integration project posted by FinTech startup", type: "new" },
      { id: "16", message: "Enterprise AWS migration project awarded to CloudExperts", type: "award" },
    ]

    setTickerItems(initialItems)

    // In a real app, you would fetch ticker items from an API
    // and potentially set up WebSocket for real-time updates
  }, [])

  // Function to get the appropriate icon based on item type
  const getIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Clock className="h-4 w-4 mr-2 inline-block" />
      case "new":
        return <FileText className="h-4 w-4 mr-2 inline-block" />
      case "award":
        return <Award className="h-4 w-4 mr-2 inline-block" />
      case "milestone":
        return <Zap className="h-4 w-4 mr-2 inline-block" />
      case "trending":
        return <TrendingUp className="h-4 w-4 mr-2 inline-block" />
      default:
        return null
    }
  }

  if (dismissed) return null

  return (
    <div
      className="bg-primary text-primary-foreground py-2 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="ticker-container overflow-hidden whitespace-nowrap relative">
        <div className={`ticker-content ${isPaused ? "paused" : ""}`}>
          {tickerItems.map((item) => (
            <span key={item.id} className="inline-block mx-8 text-sm font-medium">
              {getIcon(item.type)}
              {item.message}
            </span>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-foreground hover:bg-primary/90"
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </div>
  )
}
