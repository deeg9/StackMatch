import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user (mock for now)
    const mockUserId = '1cae22cb-1311-48ca-9caa-47d474c0a20e' // Christopher's user ID
    
    // Get recent proposals with listing information
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select(`
        id,
        proposed_budget,
        status,
        created_at,
        listings!proposals_listing_id_fkey (
          title,
          deadline,
          buyer_profiles!listings_buyer_id_fkey (
            company_name,
            profiles!buyer_profiles_id_fkey (
              full_name
            )
          )
        )
      `)
      .eq('seller_id', mockUserId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('Error fetching proposals:', error)
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

      const listing = (proposal as any).listings
      const buyerProfile = listing?.buyer_profiles
      const clientCompany = buyerProfile?.company_name || 
                           buyerProfile?.profiles?.full_name || 
                           'Confidential Client'

      // Format due date
      const dueDate = listing?.deadline ? 
        new Date(listing.deadline).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) : 'TBD'

      return {
        id: proposal.id,
        title: listing?.title || 'Project Proposal',
        clientCompany,
        proposalAmount: proposal.proposed_budget || 0,
        dueDate,
        status: proposal.status?.toLowerCase().replace('_', ' ') || 'submitted',
        submittedAt: timeAgo
      }
    }) || []

    return NextResponse.json(transformedProposals)
  } catch (error) {
    console.error('Error fetching seller proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}