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
    
    // Get basic listing stats
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id, status, created_at')
      .eq('buyer_id', user.id)
    
    if (listingsError) {
      console.error('Error fetching listing stats:', listingsError)
      return NextResponse.json(
        { error: 'Failed to fetch listing statistics' },
        { status: 500 }
      )
    }

    // Get proposal stats (mock for now - would need proper proposals table)
    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .select('id, status, listing_id')
      .in('listing_id', listings?.map(l => l.id) || [])
    
    // Calculate stats
    const totalActiveListings = listings?.filter(l => l.status === 'ACTIVE').length || 0
    const totalProposalsReceived = proposals?.length || 12 // Mock data if proposals table doesn't exist
    const proposalsToReview = proposals?.filter(p => p.status === 'SUBMITTED').length || 5 // Mock data
    
    // Calculate average responses per listing
    const averageResponsesPerListing = totalActiveListings > 0 
      ? (totalProposalsReceived / totalActiveListings).toFixed(1)
      : '0'

    // Calculate trends (mock data for now)
    const currentMonth = new Date().getMonth()
    const lastMonthListings = listings?.filter(l => {
      if (!l.created_at) return false
      const createdDate = new Date(l.created_at)
      return createdDate.getMonth() === currentMonth - 1
    }).length || 0

    const thisMonthListings = listings?.filter(l => {
      if (!l.created_at) return false
      const createdDate = new Date(l.created_at)
      return createdDate.getMonth() === currentMonth
    }).length || 0

    const listingsTrend = lastMonthListings > 0 
      ? Math.round(((thisMonthListings - lastMonthListings) / lastMonthListings) * 100)
      : 100

    const stats = {
      totalActiveListings: {
        value: totalActiveListings,
        trend: listingsTrend,
        subtitle: `+${thisMonthListings} this month`
      },
      totalProposalsReceived: {
        value: totalProposalsReceived,
        trend: 50, // Mock trend
        subtitle: `Avg. ${averageResponsesPerListing} per listing`
      },
      averageResponsesPerListing: {
        value: averageResponsesPerListing,
        trend: 15, // Mock trend
        subtitle: '15% above platform avg'
      },
      proposalsToReview: {
        value: proposalsToReview,
        trend: 2, // Mock trend
        subtitle: '2 require urgent action'
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching listing stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing statistics' },
      { status: 500 }
    )
  }
}