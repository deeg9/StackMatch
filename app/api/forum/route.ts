import { type NextRequest, NextResponse } from "next/server"

// GET /api/forum - Get all threads with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const sort = searchParams.get("sort") || "recent"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Mock data - in a real app, this would query a database
    const threads = getMockThreads(category, tag, sort, page, limit)

    return NextResponse.json({
      threads,
      pagination: {
        total: 100, // Mock total count
        page,
        limit,
        pages: Math.ceil(100 / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching forum threads:", error)
    return NextResponse.json({ error: "Failed to fetch forum threads" }, { status: 500 })
  }
}

// POST /api/forum - Create a new thread
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, tags, type, isAnonymous, pollOptions } = body

    // Validate required fields
    if (!title || !content || !category || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock creating a new thread - in a real app, this would save to a database
    const newThread = {
      id: `thread-${Date.now()}`,
      title,
      content,
      category,
      tags: tags || [],
      type,
      isAnonymous: isAnonymous || false,
      pollOptions: pollOptions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: "user-1",
        name: isAnonymous ? "Anonymous User" : "John Doe",
        role: "BUSINESS",
        isVerified: true,
      },
      stats: {
        views: 0,
        upvotes: 0,
        downvotes: 0,
        comments: 0,
      },
    }

    return NextResponse.json(newThread, { status: 201 })
  } catch (error) {
    console.error("Error creating forum thread:", error)
    return NextResponse.json({ error: "Failed to create forum thread" }, { status: 500 })
  }
}

// Helper function to generate mock threads
function getMockThreads(category?: string | null, tag?: string | null, sort?: string, page = 1, limit = 20) {
  // Mock data - in a real app, this would be filtered from a database
  const allThreads = [
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
      },
      stats: {
        views: 120,
        upvotes: 15,
        downvotes: 2,
        comments: 8,
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
      },
      stats: {
        views: 250,
        upvotes: 32,
        downvotes: 0,
        comments: 15,
      },
      hasBestAnswer: false,
    },
    {
      id: "thread-3",
      title: "Which inventory management system integrates best with Shopify?",
      content: "We're running a Shopify store and need a robust inventory management system. What do you recommend?",
      category: "Inventory Management",
      tags: ["Shopify", "Inventory", "E-commerce"],
      type: "QUESTION",
      isAnonymous: false,
      createdAt: "2023-05-08T08:45:00Z",
      updatedAt: "2023-05-08T08:45:00Z",
      author: {
        id: "user-3",
        name: "Mike Johnson",
        role: "BUSINESS",
        isVerified: false,
      },
      stats: {
        views: 180,
        upvotes: 12,
        downvotes: 1,
        comments: 10,
      },
      hasBestAnswer: true,
    },
    {
      id: "thread-4",
      title: "Announcing our new Salesforce connector!",
      content: "We're excited to announce our new Salesforce connector that simplifies data integration.",
      category: "CRM Tools",
      tags: ["Salesforce", "Integration", "Announcement"],
      type: "ANNOUNCEMENT",
      isAnonymous: false,
      createdAt: "2023-05-05T16:10:00Z",
      updatedAt: "2023-05-05T16:10:00Z",
      author: {
        id: "user-4",
        name: "Sarah Williams",
        role: "PROVIDER",
        isVerified: true,
      },
      stats: {
        views: 320,
        upvotes: 45,
        downvotes: 3,
        comments: 12,
      },
      hasBestAnswer: false,
    },
    {
      id: "thread-5",
      title: "Which payment processor has the lowest fees?",
      content: "We're evaluating payment processors for our platform. Which one has the lowest fees?",
      category: "Payment Solutions",
      tags: ["Payments", "Fees", "Stripe", "PayPal"],
      type: "POLL",
      isAnonymous: false,
      createdAt: "2023-05-03T11:25:00Z",
      updatedAt: "2023-05-03T11:25:00Z",
      author: {
        id: "user-5",
        name: "Alex Brown",
        role: "BUSINESS",
        isVerified: true,
      },
      stats: {
        views: 210,
        upvotes: 18,
        downvotes: 0,
        comments: 25,
      },
      hasBestAnswer: false,
      pollOptions: [
        { id: "option-1", text: "Stripe", votes: 12 },
        { id: "option-2", text: "PayPal", votes: 8 },
        { id: "option-3", text: "Square", votes: 5 },
        { id: "option-4", text: "Braintree", votes: 3 },
      ],
    },
  ]

  // Filter by category if provided
  let filteredThreads = allThreads
  if (category) {
    filteredThreads = filteredThreads.filter((thread: any) => thread.category === category)
  }

  // Filter by tag if provided
  if (tag) {
    filteredThreads = filteredThreads.filter((thread: any) => thread.tags.includes(tag))
  }

  // Sort threads
  if (sort === "popular") {
    filteredThreads.sort((a, b) => b.stats.upvotes - a.stats.upvotes)
  } else if (sort === "controversial") {
    filteredThreads.sort((a, b) => b.stats.downvotes - a.stats.downvotes)
  } else if (sort === "commented") {
    filteredThreads.sort((a, b) => b.stats.comments - a.stats.comments)
  } else {
    // Default: sort by recent
    filteredThreads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Paginate
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  return filteredThreads.slice(startIndex, endIndex)
}
