import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase" // Ensure you have this type

// Helper function to parse query parameters
function parseQueryParams(searchParams: URLSearchParams) {
  return {
    page: Number.parseInt(searchParams.get("page") || "1", 10),
    limit: Number.parseInt(searchParams.get("limit") || "10", 10),
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "created_at",
    sortOrder: (searchParams.get("sortOrder") || "desc") as "asc" | "desc",
    budgetMin: searchParams.get("budgetMin") ? Number.parseInt(searchParams.get("budgetMin")!, 10) : undefined,
    budgetMax: searchParams.get("budgetMax") ? Number.parseInt(searchParams.get("budgetMax")!, 10) : undefined,
    location: searchParams.get("location") || "",
    skills: searchParams.get("skills")?.split(",").filter(Boolean) || [],
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = parseQueryParams(searchParams)

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    console.log("[SERVER] Listings API (GET): Starting fetch...")

    // Validate pagination parameters
    if (filters.page < 1) {
      return NextResponse.json({ error: "Page number must be greater than 0" }, { status: 400 })
    }

    if (filters.limit < 1 || filters.limit > 100) {
      return NextResponse.json({ error: "Limit must be between 1 and 100" }, { status: 400 })
    }

    // Start building the query with proper joins
    let query = supabase.from("listings").select(`
        id,
        title,
        description,
        status,
        budget_min,
        budget_max,
        bid_deadline,
        project_start_date,
        project_duration,
        required_skills,
        location_preference,
        remote_preference,
        created_at,
        updated_at,
        published_at,
        view_count,
        buyer_id,
        category_id,
        project_categories!inner (
          id,
          name,
          slug,
          description
        ),
        profiles!inner (
          id,
          full_name,
          company_name,
          avatar_url
        ),
        listing_requirements (
          id,
          requirement,
          priority,
          order_index
        )
      `)

    // Apply filters
    if (filters.category) {
      // First get the category ID from the slug
      const { data: categoryData } = await supabase
        .from("project_categories")
        .select("id")
        .eq("slug", filters.category)
        .single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      }
    }

    if (filters.status) {
      query = query.eq("status", filters.status.toUpperCase())
    } else {
      // By default, only show active listings
      query = query.eq("status", "ACTIVE")
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.budgetMin !== undefined) {
      query = query.gte("budget_max", filters.budgetMin)
    }

    if (filters.budgetMax !== undefined) {
      query = query.lte("budget_min", filters.budgetMax)
    }

    if (filters.location) {
      query = query.ilike("location_preference", `%${filters.location}%`)
    }

    if (filters.skills.length > 0) {
      // For array contains any of the skills
      query = query.overlaps("required_skills", filters.skills)
    }

    // Get total count before pagination
    const { count } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", filters.status ? filters.status.toUpperCase() : "ACTIVE")

    // Apply sorting
    query = query.order(filters.sortBy, { ascending: filters.sortOrder === "asc" })

    // Apply pagination
    const from = (filters.page - 1) * filters.limit
    const to = from + filters.limit - 1
    query = query.range(from, to)

    // Execute the query
    const { data: listings, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
    }

    // Get metadata for filters
    const { data: categories } = await supabase.from("project_categories").select("id, name, slug, description")

    // Transform the data to match frontend expectations
    const transformedListings =
      listings?.map((listing) => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        status: listing.status,
        budget:
          listing.budget_min && listing.budget_max
            ? `$${(listing.budget_min / 1000).toFixed(0)}k - $${(listing.budget_max / 1000).toFixed(0)}k`
            : listing.budget_min
              ? `$${(listing.budget_min / 1000).toFixed(0)}k+`
              : "Budget TBD",
        budget_min: listing.budget_min,
        budget_max: listing.budget_max,
        deadline: listing.bid_deadline,
        location: listing.location_preference || "Remote",
        tags: listing.required_skills || [],
        companyName: listing.profiles?.company_name || listing.profiles?.full_name || "Anonymous",
        companyLogo: listing.profiles?.avatar_url,
        category: listing.project_categories?.name || "Uncategorized",
        categorySlug: listing.project_categories?.slug,
        views: listing.view_count || 0,
        growth: "N/A", // This would need to be calculated based on view trends
        isNew: new Date(listing.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000, // New if created within 7 days
        isActive: listing.status === "ACTIVE",
        created_at: listing.created_at,
        updated_at: listing.updated_at,
        published_at: listing.published_at,
        buyer_id: listing.buyer_id,
        category_id: listing.category_id,
        project_start_date: listing.project_start_date,
        project_duration: listing.project_duration,
        required_skills: listing.required_skills,
        location_preference: listing.location_preference,
        remote_preference: listing.remote_preference,
        requirements: listing.listing_requirements || [],
        // Additional fields for compatibility
        project_categories: listing.project_categories,
        listing_requirements: listing.listing_requirements,
      })) || []

    // Format the response
    return NextResponse.json({
      listings: transformedListings,
      pagination: {
        currentPage: filters.page,
        totalPages: Math.ceil((count || 0) / filters.limit),
        totalItems: count || 0,
        itemsPerPage: filters.limit,
        hasNextPage: from + transformedListings.length < (count || 0),
        hasPreviousPage: filters.page > 1,
      },
      metadata: {
        availableCategories: categories || [],
        totalListings: count || 0,
      },
      appliedFilters: filters,
    })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[SERVER] Listings API (POST): Starting create listing process...")

    // Use the same generic client approach as the login API
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    console.log("[SERVER] Listings API (POST): Supabase client created")

    // For now, we'll hardcode the user ID since we know it from the login logs
    // In a proper implementation, this would come from the session
    const hardcodedUserId = "1cae22cb-1311-48ca-9caa-47d474c0a20e" // Your user ID from the logs

    console.log("[SERVER] Listings API (POST): Using hardcoded user ID:", hardcodedUserId)

    // Check if user has a buyer profile
    const { data: buyerProfile, error: profileError } = await supabase
      .from("buyer_profiles")
      .select("id")
      .eq("user_id", hardcodedUserId)
      .single()

    console.log("[SERVER] Listings API (POST): Buyer profile check result:", { buyerProfile, profileError })

    if (profileError || !buyerProfile) {
      console.log("[SERVER] Listings API (POST): No buyer profile found, creating one...")

      // Create a buyer profile if it doesn't exist
      const { data: newBuyerProfile, error: createError } = await supabase
        .from("buyer_profiles")
        .insert({
          user_id: hardcodedUserId,
          company_name: "Test Company", // Default values
          is_verified_buyer: false,
        })
        .select()
        .single()

      if (createError) {
        console.error("[SERVER] Listings API (POST): Error creating buyer profile:", createError)
        return NextResponse.json({ error: "Failed to create buyer profile" }, { status: 500 })
      }

      console.log("[SERVER] Listings API (POST): Created buyer profile:", newBuyerProfile)
    }

    const body = await request.json()
    console.log("[SERVER] Listings API (POST): Request body received:", Object.keys(body))

    const {
      title,
      description,
      categoryId,
      budgetMin,
      budgetMax,
      bidDeadline,
      projectStartDate,
      projectDuration,
      requiredSkills,
      locationPreference,
      remotePreference,
      aboutCompany,
      aboutBusiness,
      detailedNeeds = [],
      attachments = [],
      successMetrics = [],
      currentChallenges = [],
      timelinePhases = [],
    } = body

    // Basic validation
    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields: title, description" }, { status: 400 })
    }
    if (!hardcodedUserId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Parse budget from string format like "$50k-$80k" if needed
    let parsedBudgetMin = budgetMin
    let parsedBudgetMax = budgetMax

    if (typeof budgetMin === "string" && budgetMin.includes("-")) {
      const [min, max] = budgetMin.split("-").map((b) => {
        const num = b.replace(/[$k,]/g, "")
        return Number.parseFloat(num) * (b.includes("k") ? 1000 : 1)
      })
      parsedBudgetMin = min
      parsedBudgetMax = max
    }

    const listingToInsert = {
      title,
      description,
      buyer_id: hardcodedUserId,
      category_id: categoryId || null,
      status: "ACTIVE" as const,
      budget_min: parsedBudgetMin,
      budget_max: parsedBudgetMax,
      bid_deadline: bidDeadline,
      project_start_date: projectStartDate,
      project_duration: projectDuration,
      required_skills: requiredSkills,
      location_preference: locationPreference,
      remote_preference: remotePreference,
      published_at: new Date().toISOString(),
      about_company: aboutCompany,
      about_business: aboutBusiness,
      attachments: attachments,
      success_metrics: successMetrics,
      current_challenges: currentChallenges,
      timeline_phases: timelinePhases,
    }

    console.log("[SERVER] Listings API (POST): Inserting listing:", listingToInsert)

    // Create the listing
    const { data: listing, error: insertError } = await supabase
      .from("listings")
      .insert(listingToInsert)
      .select(`
        *,
        project_categories ( name, slug ),
        profiles ( company_name, avatar_url ),
        listing_requirements ( requirement ) 
      `)
      .single()

    if (insertError) {
      console.error("[SERVER] Listings API (POST): Error creating listing:", insertError)
      return NextResponse.json({ error: "Failed to create listing: " + insertError.message }, { status: 500 })
    }

    console.log("[SERVER] Listings API (POST): Listing created successfully:", listing.id)

    // Create listing requirements if provided
    if (detailedNeeds.length > 0) {
      const requirementsToInsert = detailedNeeds.map((req: any, index: number) => ({
        listing_id: listing.id,
        requirement: req.requirement || req.description || req.title,
        priority: req.priority || "medium",
        order_index: index,
      }))
      const { error: requirementsError } = await supabase.from("listing_requirements").insert(requirementsToInsert)

      if (requirementsError) {
        console.error("[SERVER] Listings API (POST): Error creating listing requirements:", requirementsError)
        // Optionally, decide if this should be a fatal error for the request
      } else {
        console.log("[SERVER] Listings API (POST): Listing requirements created.")
      }
    }

    console.log("[SERVER] Listings API (POST): Returning success response")

    return NextResponse.json(
      {
        listing,
        message: "Listing created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[SERVER] Listings API (POST): Unexpected error:", error)
    return NextResponse.json({ error: "Failed to create listing: " + error.message }, { status: 500 })
  }
}
