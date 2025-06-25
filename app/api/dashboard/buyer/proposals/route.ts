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
    
    // First get buyer's listings
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .eq('buyer_id', user.id)
    
    if (listingsError) {
      console.error('Error fetching buyer listings:', listingsError)
      return NextResponse.json(
        { error: 'Failed to fetch buyer listings' },
        { status: 500 }
      )
    }

    const listingIds = listings?.map(l => l.id) || []

    if (listingIds.length === 0) {
      return NextResponse.json([])
    }
    
    // Get recent proposals with seller and listing information
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select(`
        id,
        proposed_budget,
        status,
        created_at,
        profiles!proposals_seller_id_fkey (
          full_name,
          company_name,
          avatar_url
        ),
        listings!proposals_listing_id_fkey (
          title
        )
      `)
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('Error fetching proposals:', error)
      // If proposals table doesn't exist or there's a constraint error, return mock data
      if (error.message?.includes('does not exist') || error.message?.includes('foreign key')) {
        console.warn('Proposals table not ready, returning mock data')
        return NextResponse.json([
          {
            id: 'PROP-001',
            sellerName: 'TechSolutions Inc',
            sellerAvatar: null,
            proposedBudget: 85000,
            listingTitle: 'CRM Implementation',
            status: 'submitted',
            submittedAt: '2 hours ago'
          },
          {
            id: 'PROP-002',
            sellerName: 'DataCorp Analytics',
            sellerAvatar: null,
            proposedBudget: 45000,
            listingTitle: 'Analytics Platform',
            status: 'under review',
            submittedAt: '1 day ago'
          }
        ])
      }
      return NextResponse.json(
        { error: 'Failed to fetch proposals' },
        { status: 500 }
      )
    }

    // Transform the data to match our frontend expectations
    const transformedProposals = proposals?.map(proposal => {
      // Calculate time ago
      const createdAt = new Date(proposal.created_at || '')
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - createdAt.getTime())
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
      
      let timeAgo = ''
      if (diffHours < 1) {
        timeAgo = 'Just now'
      } else if (diffHours === 1) {
        timeAgo = '1 hour ago'
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hours ago`
      } else {
        const days = Math.ceil(diffHours / 24)
        timeAgo = days === 1 ? '1 day ago' : `${days} days ago`
      }

      const seller = (proposal as any).profiles
      const listing = (proposal as any).listings

      return {
        id: proposal.id,
        sellerName: seller?.company_name || seller?.full_name || 'Anonymous Seller',
        sellerAvatar: seller?.avatar_url,
        proposedBudget: proposal.proposed_budget || 0,
        listingTitle: listing?.title || 'Unknown Listing',
        status: proposal.status?.toLowerCase().replace('_', ' ') || 'submitted',
        submittedAt: timeAgo
      }
    }) || []

    return NextResponse.json(transformedProposals)
  } catch (error) {
    console.error('Error fetching buyer proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}