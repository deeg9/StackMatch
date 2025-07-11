'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { ProposalDetailHeader } from '@/components/proposals/proposal-detail-header'
import { ProposalDetailSidebar } from '@/components/proposals/proposal-detail-sidebar'
import { ProposalDetailContent } from '@/components/proposals/proposal-detail-content'
import { ProposalComparison } from '@/components/proposals/proposal-comparison'
import { createClient } from '@/lib/supabase/client'

interface ProposalDetail {
  id: string
  listing_id: string
  seller_id: string
  status: string
  cover_letter: string
  proposed_budget: number
  proposed_timeline: string | null
  technical_approach: string | null
  relevant_experience: string | null
  attachments: any
  submitted_at: string | null
  listing: {
    id: string
    title: string
    buyer_id: string
    category: string
    budget_min: number | null
    budget_max: number | null
    bid_deadline?: string | null
  }
  seller: {
    id: string
    full_name: string | null
    company_name: string | null
    avatar_url: string | null
    email: string
  }
}

export default function ProposalDetailPage() {
  const params = useParams()
  const proposalId = params.id as string
  const [proposal, setProposal] = useState<ProposalDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showComparison, setShowComparison] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const fetchProposalAndUser = async () => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }

      // Fetch proposal details
      const { data: proposalData, error } = await supabase
        .from('proposals')
        .select(`
          *,
          listings!proposals_listing_id_fkey (
            id,
            title,
            buyer_id,
            budget_min,
            budget_max,
            project_categories!listings_category_id_fkey (
              name
            )
          ),
          profiles!proposals_seller_id_fkey (
            id,
            full_name,
            company_name,
            avatar_url,
            email
          )
        `)
        .eq('id', proposalId)
        .single()

      if (error) {
        console.error('Error fetching proposal:', error)
        setIsLoading(false)
        return
      }

      // Transform the data
      const transformedProposal: ProposalDetail = {
        ...proposalData,
        status: proposalData.status || 'submitted',
        listing: {
          ...proposalData.listings,
          category: proposalData.listings.project_categories?.name || 'Uncategorized'
        },
        seller: proposalData.profiles
      }

      setProposal(transformedProposal)
      
      // Check if current user is the buyer who owns this listing
      if (user && proposalData.listings.buyer_id === user.id) {
        setIsOwner(true)
      }
      
      setIsLoading(false)
    }

    fetchProposalAndUser()
  }, [proposalId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <TickerBanner />
        <NavigationWrapper />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">Loading proposal details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <TickerBanner />
        <NavigationWrapper />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Proposal not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ProposalDetailHeader 
          proposal={proposal}
          isOwner={isOwner}
          onToggleComparison={() => setShowComparison(!showComparison)}
          showComparison={showComparison}
        />
        
        {/* Main Content */}
        <div className="flex gap-8 mt-8">
          {/* Proposal Content or Comparison View */}
          <div className="flex-1">
            {showComparison ? (
              <ProposalComparison 
                mainProposal={proposal}
                listingId={proposal.listing_id}
              />
            ) : (
              <ProposalDetailContent proposal={proposal} />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="w-80 hidden xl:block">
            <ProposalDetailSidebar 
              proposal={proposal}
              isOwner={isOwner}
            />
          </div>
        </div>
      </div>
    </div>
  )
}