import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client-wrapper"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const location = searchParams.get("location")
    const services = searchParams.get("services")?.split(",").filter(Boolean) || []
    const technologies = searchParams.get("technologies")?.split(",").filter(Boolean) || []
    const minRating = searchParams.get("minRating")
    const availability = searchParams.get("availability")
    const verified = searchParams.get("verified")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const sortBy = searchParams.get("sortBy") || "rating"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const supabase = createClient()

    // Start building the query - only select from provider_profiles for now
    let dbQuery = supabase.from("provider_profiles").select("*")

    // Text search
    if (query) {
      dbQuery = dbQuery.or(`
        company_name.ilike.%${query}%,
        description.ilike.%${query}%,
        tagline.ilike.%${query}%
      `)
    }

    // Location filter
    if (location && location !== "all") {
      dbQuery = dbQuery.ilike("location", `%${location}%`)
    }

    // Availability filter - only if the column exists
    if (availability === "true") {
      // We'll handle this in post-processing since we're not sure if the column exists
    }

    // Verified filter - only if the column exists
    if (verified === "true") {
      // We'll handle this in post-processing since we're not sure if the column exists
    }

    // Simple ordering by created_at or id
    dbQuery = dbQuery.order("created_at", { ascending: sortOrder === "asc" })

    // Pagination
    const offset = (page - 1) * limit
    dbQuery = dbQuery.range(offset, offset + limit - 1)

    const { data, error } = await dbQuery

    if (error) {
      console.error("Error searching providers:", error)
      return NextResponse.json({ error: "Failed to search providers" }, { status: 500 })
    }

    // Post-process the results for all filters
    let filteredData = data || []

    // Apply availability filter if the field exists
    if (availability === "true") {
      filteredData = filteredData.filter(
        (provider: any) => provider.is_accepting_projects === true || provider.available === true,
      )
    }

    // Apply verified filter if the field exists
    if (verified === "true") {
      filteredData = filteredData.filter((provider: any) => provider.verified === true || provider.is_verified === true)
    }

    // Apply services filter (mock data for now)
    if (services.length > 0) {
      // For now, we'll just return all providers since we don't have the services table
      // In a real implementation, you would join with provider_services table
    }

    // Apply technologies filter (mock data for now)
    if (technologies.length > 0) {
      // For now, we'll just return all providers since we don't have the technologies table
      // In a real implementation, you would join with provider_technologies table
    }

    // Apply rating filter (mock data for now)
    if (minRating) {
      // For now, we'll just return all providers since we don't have the metrics table
      // In a real implementation, you would filter by average_rating
    }

    // Sort the results manually based on the requested sort field
    if (sortBy === "rating") {
      // Mock sorting by rating - in real implementation, use provider_metrics
      filteredData.sort((a: any, b: any) => {
        const ratingA = Math.random() * 5 // Mock rating
        const ratingB = Math.random() * 5 // Mock rating
        return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA
      })
    } else if (sortBy === "projects") {
      // Mock sorting by projects completed
      filteredData.sort((a: any, b: any) => {
        const projectsA = Math.floor(Math.random() * 100) // Mock projects
        const projectsB = Math.floor(Math.random() * 100) // Mock projects
        return sortOrder === "asc" ? projectsA - projectsB : projectsB - projectsA
      })
    } else if (sortBy === "response_time") {
      // Mock sorting by response time
      filteredData.sort((a: any, b: any) => {
        const timeA = Math.random() * 24 // Mock response time in hours
        const timeB = Math.random() * 24 // Mock response time in hours
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA
      })
    }

    // Get total count for pagination
    const totalCount = filteredData.length

    // Apply pagination to the filtered data
    const paginatedData = filteredData.slice(0, limit) // Simple pagination for now

    return NextResponse.json({
      providers: paginatedData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Provider search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
