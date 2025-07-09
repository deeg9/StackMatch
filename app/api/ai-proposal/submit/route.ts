import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SubmitProposalRequest, SubmitProposalResponse } from '@/types/ai-proposal'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body: SubmitProposalRequest = await request.json()
    const { listingId, proposalData, coverLetter } = body
    
    // TODO: Implement actual database operations
    // For now, we'll simulate the submission process
    
    // 1. Create proposal record
    const proposalId = `prop_${Date.now()}`
    
    // 2. Create or get deal room
    const dealRoomId = `dr_${listingId}_${Date.now()}`
    
    // 3. Send notification to buyer
    // This would trigger email/in-app notifications
    
    // 4. Update listing stats (increment proposal count)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const response: SubmitProposalResponse = {
      success: true,
      proposalId,
      dealRoomId,
      message: 'Proposal submitted successfully'
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error submitting proposal:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit proposal' 
      },
      { status: 500 }
    )
  }
}

// Helper function to create proposal in database
async function createProposal(
  supabase: any,
  userId: string,
  listingId: string,
  proposalData: any,
  coverLetter?: string
) {
  const { data, error } = await supabase
    .from('proposals')
    .insert({
      seller_id: userId,
      listing_id: listingId,
      proposal_data: proposalData,
      cover_letter: coverLetter,
      status: 'submitted',
      created_at: new Date().toISOString()
    })
    .select()
    .single()
    
  if (error) throw error
  return data
}

// Helper function to create or get deal room
async function getOrCreateDealRoom(
  supabase: any,
  listingId: string,
  buyerId: string,
  sellerId: string
) {
  // Check if deal room already exists
  const { data: existingRoom } = await supabase
    .from('deal_rooms')
    .select('*')
    .eq('listing_id', listingId)
    .eq('seller_id', sellerId)
    .single()
    
  if (existingRoom) return existingRoom
  
  // Create new deal room
  const { data, error } = await supabase
    .from('deal_rooms')
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      status: 'active',
      created_at: new Date().toISOString()
    })
    .select()
    .single()
    
  if (error) throw error
  return data
}

// Helper function to send notifications
async function sendNotifications(
  supabase: any,
  buyerId: string,
  sellerId: string,
  listingTitle: string
) {
  // Create in-app notification
  await supabase
    .from('notifications')
    .insert({
      user_id: buyerId,
      type: 'new_proposal',
      title: 'New Proposal Received',
      message: `You have received a new proposal for "${listingTitle}"`,
      created_at: new Date().toISOString()
    })
    
  // TODO: Send email notification
  // This would integrate with an email service like SendGrid or AWS SES
}