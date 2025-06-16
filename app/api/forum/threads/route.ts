import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "created_at"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Build the query
    let query = supabase.from("forum_threads").select(`
        *,
        profiles!inner (id, full_name, avatar_url, user_type),
        forum_categories!inner (id, name, slug),
        forum_comments (id),
        forum_votes (id, vote_type)
      `)

    // Apply category filter if provided
    if (category) {
      const { data: categoryData } = await supabase.from("forum_categories").select("id").eq("slug", category).single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      }
    }

    // Get total count
    const { count } = await supabase.from("forum_threads").select("*", { count: "exact", head: true })

    // Apply sorting and pagination
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute the query
    const { data: threads, error } = await query

    if (error) {
      console.error("Error fetching forum threads:", error)
      return NextResponse.json({ error: "Failed to fetch forum threads" }, { status: 500 })
    }

    // Transform the data
    const transformedThreads =
      threads?.map((thread: any) => {
        // Calculate vote count
        const upvotes = thread.forum_votes?.filter((vote: any) => vote.vote_type === "UP").length || 0
        const downvotes = thread.forum_votes?.filter((vote: any) => vote.vote_type === "DOWN").length || 0
        const voteScore = upvotes - downvotes

        return {
          id: thread.id,
          title: thread.title,
          content: thread.content,
          authorName: thread.is_anonymous ? "Anonymous" : thread.profiles.full_name,
          authorAvatar: thread.is_anonymous ? null : thread.profiles.avatar_url,
          authorType: thread.is_anonymous ? null : thread.profiles.user_type,
          category: thread.forum_categories.name,
          categorySlug: thread.forum_categories.slug,
          createdAt: thread.created_at,
          updatedAt: thread.updated_at,
          isPinned: thread.is_pinned,
          isLocked: thread.is_locked,
          viewCount: thread.view_count,
          commentCount: thread.forum_comments?.length || 0,
          voteScore,
          lastActivityAt: thread.last_activity_at,
          isAnonymous: thread.is_anonymous,
        }
      }) || []

    return NextResponse.json({
      threads: transformedThreads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
      },
    })
  } catch (error) {
    console.error("Error in forum threads API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, categoryId, isAnonymous = false } = body

    // Basic validation
    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the thread
    const { data: thread, error } = await supabase
      .from("forum_threads")
      .insert({
        title,
        content,
        author_id: user.id,
        category_id: categoryId,
        is_anonymous: isAnonymous,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        view_count: 0,
        is_pinned: false,
        is_locked: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating forum thread:", error)
      return NextResponse.json({ error: "Failed to create forum thread" }, { status: 500 })
    }

    return NextResponse.json(
      {
        thread,
        message: "Thread created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in forum threads API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
