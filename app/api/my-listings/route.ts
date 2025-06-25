import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get URL search params for filtering and sorting
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const sortBy = searchParams.get('sortBy') || 'recent'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Build the query
    let query = supabase
      .from('listings')
      .select(`
        id,
        title,
        status,
        budget_min,
        budget_max,
        created_at,
        project_categories!listings_category_id_fkey (
          name
        )
      `)
      .eq('buyer_id', user.id)

    // Apply status filter
    if (status && status !== 'all') {
      // Map frontend status to database enum
      const statusMap: { [key: string]: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'AWARDED' | 'CANCELLED' } = {
        'active': 'ACTIVE',
        'draft': 'DRAFT',
        'closed': 'CLOSED'
      }
      const dbStatus = statusMap[status] || 'DRAFT'
      query = query.eq('status', dbStatus)
    }

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'name':
        query = query.order('title', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    const { data: listings, error } = await query
    
    if (error) {
      console.error('Error fetching listings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    // Transform the data to match frontend expectations
    const transformedListings = listings?.map(listing => {
      // Calculate time ago
      const createdAt = new Date(listing.created_at || '')
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - createdAt.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let timeAgo = ''
      if (diffDays === 1) {
        timeAgo = '1 day ago'
      } else if (diffDays < 7) {
        timeAgo = `${diffDays} days ago`
      } else if (diffDays < 30) {
        const weeks = Math.ceil(diffDays / 7)
        timeAgo = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
      } else {
        const months = Math.ceil(diffDays / 30)
        timeAgo = months === 1 ? '1 month ago' : `${months} months ago`
      }

      // Calculate proposal deadline (example: 30 days from creation)
      const deadlineDate = new Date(createdAt)
      deadlineDate.setDate(deadlineDate.getDate() + 30)
      const deadline = deadlineDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })

      // Format budget range
      let budgetRange = 'Budget not specified'
      if (listing.budget_min && listing.budget_max) {
        budgetRange = `$${listing.budget_min.toLocaleString()} - $${listing.budget_max.toLocaleString()}`
      } else if (listing.budget_min) {
        budgetRange = `From $${listing.budget_min.toLocaleString()}`
      } else if (listing.budget_max) {
        budgetRange = `Up to $${listing.budget_max.toLocaleString()}`
      }

      return {
        id: listing.id,
        title: listing.title,
        status: listing.status?.toLowerCase() || 'draft',
        category: (listing as any).project_categories?.name || 'Uncategorized',
        datePosted: timeAgo,
        proposalDeadline: deadline,
        views: Math.floor(Math.random() * 200) + 50, // Mock data
        proposalsReceived: Math.floor(Math.random() * 10) + 1, // Mock data
        dealRoomsCreated: Math.floor(Math.random() * 5), // Mock data
        budgetRange,
        description: `Comprehensive ${(listing as any).project_categories?.name || 'software'} solution for mid-market company.` // Mock description
      }
    }) || []

    return NextResponse.json({
      listings: transformedListings,
      total: transformedListings.length,
      hasMore: transformedListings.length === limit
    })
  } catch (error) {
    console.error('Error fetching my listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}