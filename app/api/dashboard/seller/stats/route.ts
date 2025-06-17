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
    
    // Get active proposals count
    const { data: activeProposals, error: proposalsError } = await supabase
      .from('proposals')
      .select('id')
      .eq('seller_id', user.id)
      .in('status', ['SUBMITTED', 'UNDER_REVIEW'])
    
    if (proposalsError) {
      console.error('Error fetching active proposals:', proposalsError)
    }

    // Get won listings count
    const { data: wonProposals, error: wonError } = await supabase
      .from('proposals')
      .select('id')
      .eq('seller_id', user.id)
      .eq('status', 'ACCEPTED')
    
    if (wonError) {
      console.error('Error fetching won proposals:', wonError)
    }

    // Get all proposals for success rate calculation
    const { data: allProposals, error: allProposalsError } = await supabase
      .from('proposals')
      .select('id, status')
      .eq('seller_id', user.id)
    
    if (allProposalsError) {
      console.error('Error fetching all proposals:', allProposalsError)
    }

    // Calculate success rate
    const totalProposals = allProposals?.length || 0
    const wonCount = wonProposals?.length || 0
    const successRate = totalProposals > 0 ? Math.round((wonCount / totalProposals) * 100) : 0

    // Get completed deal rooms for earnings (mock calculation)
    const { data: completedDeals, error: dealsError } = await supabase
      .from('deal_rooms')
      .select('id')
      .eq('seller_id', user.id)
      .eq('status', 'COMPLETED')
    
    if (dealsError) {
      console.error('Error fetching completed deals:', dealsError)
    }

    // Mock earnings calculation (in production, this would come from contracts/payments)
    const totalEarned = (completedDeals?.length || 0) * 23750 // Average earnings per project

    // Mock profile rating and views (in production, this would come from reviews/analytics)
    const profileRating = 4.8
    const profileViews = 156

    const stats = {
      activeProposals: activeProposals?.length || 0,
      wonListings: wonCount,
      successRate,
      totalEarned,
      profileRating,
      profileViews
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching seller stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}