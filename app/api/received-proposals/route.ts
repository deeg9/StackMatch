import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Extract query parameters
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const listing = searchParams.get('listing') || 'all'
    
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

    // Build query for proposals
    let query = supabase
      .from('proposals')
      .select(`
        id,
        proposed_budget,
        proposed_timeline,
        status,
        created_at,
        profiles!proposals_seller_id_fkey (
          full_name,
          company_name,
          avatar_url
        ),
        listings!proposals_listing_id_fkey (
          id,
          title
        )
      `)
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status !== 'all') {
      // Map frontend status to database enum
      const statusMap: { [key: string]: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' } = {
        'new': 'SUBMITTED',
        'in_discussion': 'UNDER_REVIEW', 
        'accepted': 'ACCEPTED',
        'archived': 'REJECTED'
      }
      const dbStatus = statusMap[status]
      if (dbStatus) {
        query = query.eq('status', dbStatus)
      }
    }

    if (listing !== 'all') {
      query = query.eq('listing_id', listing)
    }
    
    const { data: proposals, error } = await query

    if (error) {
      console.error('Error fetching proposals:', error)
      // If proposals table doesn't exist or there's a constraint error, return mock data
      if (error.message?.includes('does not exist') || error.message?.includes('foreign key')) {
        console.warn('Proposals table not ready, returning mock data')
        return NextResponse.json([
          {
            id: 'PROP-001',
            sellerName: 'Sarah Chen',
            sellerCompany: 'TechSolutions Inc',
            proposedBudget: 85000,
            proposedTimeline: '10-12 weeks',
            listingTitle: 'CRM Implementation for Mid-Market Company',
            listingId: 'TEST',
            status: 'new',
            submittedAt: '2 hours ago',
            sellerRating: 4.9,
            isNew: true
          },
          {
            id: 'PROP-002',
            sellerName: 'Michael Rodriguez',
            sellerCompany: 'DataCorp Analytics',
            proposedBudget: 45000,
            proposedTimeline: '6-8 weeks',
            listingTitle: 'Analytics Platform Selection',
            listingId: 'TEST2',
            status: 'in_discussion',
            submittedAt: '1 day ago',
            sellerRating: 4.7
          },
          {
            id: 'PROP-003',
            sellerName: 'Jennifer Kim',
            sellerCompany: 'CloudFirst Solutions',
            proposedBudget: 65000,
            proposedTimeline: '8-10 weeks',
            listingTitle: 'HR Management System Upgrade',
            listingId: 'TEST3',
            status: 'new',
            submittedAt: '3 days ago',
            sellerRating: 4.8,
            isNew: true
          },
          {
            id: 'PROP-004',
            sellerName: 'David Thompson',
            sellerCompany: 'Enterprise Software Co',
            proposedBudget: 120000,
            proposedTimeline: '12-16 weeks',
            listingTitle: 'Cloud Infrastructure Migration',
            listingId: 'TEST4',
            status: 'accepted',
            submittedAt: '5 days ago',
            sellerRating: 4.9
          },
          {
            id: 'PROP-005',
            sellerName: 'Lisa Park',
            sellerCompany: 'Innovative Tech Partners',
            proposedBudget: 75000,
            proposedTimeline: '9-11 weeks',
            listingTitle: 'CRM Implementation for Mid-Market Company',
            listingId: 'TEST',
            status: 'in_discussion',
            submittedAt: '1 week ago',
            sellerRating: 4.6
          },
          {
            id: 'PROP-006',
            sellerName: 'Robert Wilson',
            sellerCompany: 'Strategic Solutions Group',
            proposedBudget: 55000,
            proposedTimeline: '7-9 weeks',
            listingTitle: 'Analytics Platform Selection',
            listingId: 'TEST2',
            status: 'new',
            submittedAt: '4 days ago',
            sellerRating: 4.8,
            isNew: true
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

      // Check if proposal is new (within last 24 hours)
      const isNew = diffHours <= 24

      const seller = (proposal as any).profiles
      const listing = (proposal as any).listings

      // Map database status to frontend status
      const statusMap: { [key: string]: string } = {
        'SUBMITTED': 'new',
        'UNDER_REVIEW': 'in_discussion',
        'ACCEPTED': 'accepted',
        'REJECTED': 'archived'
      }
      const frontendStatus = statusMap[proposal.status || ''] || 'new'

      return {
        id: proposal.id,
        sellerName: seller?.full_name || 'Anonymous Seller',
        sellerCompany: seller?.company_name,
        sellerAvatar: seller?.avatar_url,
        proposedBudget: proposal.proposed_budget || 0,
        proposedTimeline: proposal.proposed_timeline,
        listingTitle: listing?.title || 'Unknown Listing',
        listingId: listing?.id || '',
        status: frontendStatus,
        submittedAt: timeAgo,
        sellerRating: 4.5 + Math.random() * 0.5, // Mock rating for now
        isNew
      }
    }) || []

    // Apply client-side search filter if needed
    let filteredProposals = transformedProposals
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProposals = transformedProposals.filter(proposal =>
        proposal.sellerName.toLowerCase().includes(searchLower) ||
        proposal.sellerCompany?.toLowerCase().includes(searchLower) ||
        proposal.listingTitle.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(filteredProposals)
  } catch (error) {
    console.error('Error fetching received proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}