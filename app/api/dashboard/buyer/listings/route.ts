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
    
    // Get recent listings with category information
    const { data: listings, error } = await supabase
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
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('Error fetching listings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    // Transform the data to match our frontend expectations
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

      return {
        id: listing.id,
        title: listing.title,
        status: listing.status?.toLowerCase() || 'draft',
        category: (listing as any).project_categories?.name || 'Uncategorized',
        budgetMin: listing.budget_min,
        budgetMax: listing.budget_max,
        createdAt: timeAgo,
        proposalCount: 0 // We'll get this from a separate query if needed
      }
    }) || []

    return NextResponse.json(transformedListings)
  } catch (error) {
    console.error('Error fetching buyer listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}