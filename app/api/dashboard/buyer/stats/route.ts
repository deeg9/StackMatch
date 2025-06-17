import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user (we'll simulate for now since auth is disabled)
    // In production, this would get user from session
    const mockUserId = '12345678-1234-1234-1234-123456789012'
    
    // Get active listings count
    const { data: activeListings, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .eq('buyer_id', mockUserId)
      .eq('status', 'ACTIVE')
    
    if (listingsError) {
      console.error('Error fetching active listings:', listingsError)
    }

    // Get total proposals count
    const { data: proposalsData, error: proposalsError } = await supabase
      .from('proposals')
      .select('id, listing_id')
      .in('listing_id', activeListings?.map(l => l.id) || [])
    
    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError)
    }

    // Get completed deal rooms count
    const { data: completedDeals, error: dealsError } = await supabase
      .from('deal_rooms')
      .select('id')
      .eq('buyer_id', mockUserId)
      .eq('status', 'COMPLETED')
    
    if (dealsError) {
      console.error('Error fetching completed deals:', dealsError)
    }

    // Calculate success rate (mock for now)
    const successRate = 85

    // Calculate total invested (mock for now)
    const totalInvested = 125000

    const stats = {
      activeListings: activeListings?.length || 0,
      totalProposals: proposalsData?.length || 0,
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