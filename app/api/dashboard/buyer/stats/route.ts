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
    
    // Get active listings count
    const { data: activeListings, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('status', 'ACTIVE')
    
    if (listingsError) {
      console.error('Error fetching active listings:', listingsError)
    }

    // Get proposals for this buyer's listings
    const listingIds = activeListings?.map(l => l.id) || []
    let proposalsData: any[] = []
    let proposalsError = null
    
    if (listingIds.length > 0) {
      const { data, error } = await supabase
        .from('proposals')
        .select('id, listing_id, status')
        .in('listing_id', listingIds)
      
      proposalsData = data || []
      proposalsError = error
    }
    
    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError)
    }

    // Get completed deal rooms count
    const { data: completedDeals, error: dealsError } = await supabase
      .from('deal_rooms')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('status', 'COMPLETED')
    
    if (dealsError) {
      console.error('Error fetching completed deals:', dealsError)
    }

    // Calculate success rate based on deal rooms
    const totalDealRooms = await supabase
      .from('deal_rooms')
      .select('id')
      .eq('buyer_id', user.id)
    
    const totalRooms = totalDealRooms.data?.length || 0
    const completedRooms = completedDeals?.length || 0
    const successRate = totalRooms > 0 ? Math.round((completedRooms / totalRooms) * 100) : 0

    // Calculate total invested based on active and awarded listings
    const allListings = await supabase
      .from('listings')
      .select('budget_min, budget_max')
      .eq('buyer_id', user.id)
      .in('status', ['ACTIVE', 'AWARDED'])
    
    const totalInvested = allListings.data?.reduce((sum, listing) => {
      const avgBudget = ((listing.budget_min || 0) + (listing.budget_max || 0)) / 2
      return sum + avgBudget
    }, 0) || 0

    const stats = {
      activeListings: activeListings?.length || 0,
      totalProposals: proposalsData.length,
      completedProjects: completedDeals?.length || 0,
      successRate,
      totalInvested
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching buyer stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}