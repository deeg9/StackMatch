import { NextResponse } from "next/server"

// This would be connected to your database in a real implementation
const SAMPLE_TICKER_ITEMS = [
  {
    id: "1",
    type: "deadline",
    message: 'Project "ERP Implementation" due in 24 hours',
    link: "/projects/123",
    timestamp: Date.now(),
  },
  {
    id: "2",
    type: "new_projects",
    message: "37 new projects submitted in the last hour",
    link: "/projects",
    timestamp: Date.now(),
  },
  {
    id: "3",
    type: "award",
    message: "TechSolutions just won a project with GlobalCorp",
    link: "/projects/456",
    timestamp: Date.now(),
  },
  {
    id: "4",
    type: "milestone",
    message: "StackMatch just reached 1,000 successful matches!",
    timestamp: Date.now(),
  },
  {
    id: "5",
    type: "trending",
    message: "AI Integration projects are trending this week",
    link: "/projects?category=ai",
    timestamp: Date.now(),
  },
]

export async function GET() {
  return NextResponse.json(SAMPLE_TICKER_ITEMS)
}

export async function POST(request: Request) {
  const data = await request.json()

  // In a real implementation, you would:
  // 1. Validate the data
  // 2. Save to database
  // 3. Broadcast via WebSocket

  return NextResponse.json({ success: true, message: "Ticker item created" })
}
