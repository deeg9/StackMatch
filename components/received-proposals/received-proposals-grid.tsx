'use client'

import { useEffect, useState } from 'react'
import { ProposalCard } from './proposal-card'
import { MessageCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Proposal {
  id: string
  sellerName: string
  sellerAvatar?: string
  sellerCompany?: string
  proposedBudget: number
  proposedTimeline?: string
  listingTitle: string
  listingId: string
  status: string
  submittedAt: string
  sellerRating?: number
  isNew?: boolean
}

interface ReceivedProposalsGridProps {
  searchQuery: string
  statusFilter: string
  listingFilter: string
}

export function ReceivedProposalsGrid({ 
  searchQuery, 
  statusFilter, 
  listingFilter 
}: ReceivedProposalsGridProps) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (statusFilter !== 'all') params.append('status', statusFilter)
        if (listingFilter !== 'all') params.append('listing', listingFilter)

        const response = await fetch(`/api/received-proposals?${params.toString()}`)
        
        if (response.ok) {
          const data = await response.json()
          setProposals(data)
        } else {
          // Fallback to mock data if API fails
          console.warn('Received proposals API failed, using mock data')
          setProposals([
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
      } catch (error) {
        console.error('Error fetching received proposals:', error)
        // Fallback to mock data
        setProposals([
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
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [searchQuery, statusFilter, listingFilter])

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = searchQuery === '' || 
      proposal.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.sellerCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    const matchesListing = listingFilter === 'all' || proposal.listingId === listingFilter

    return matchesSearch && matchesStatus && matchesListing
  })

  const handleArchiveProposal = (proposalId: string) => {
    setProposals(prev => 
      prev.map(p => 
        p.id === proposalId 
          ? { ...p, status: 'archived' }
          : p
      )
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg border-2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="text-center">
                    <div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
                    <div className="h-5 bg-gray-200 rounded w-12 mx-auto"></div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredProposals.length === 0) {
    const hasFilters = searchQuery || statusFilter !== 'all' || listingFilter !== 'all'
    
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-light-gray rounded-full flex items-center justify-center mb-6">
          {hasFilters ? (
            <AlertCircle className="h-12 w-12 text-medium-gray" />
          ) : (
            <MessageCircle className="h-12 w-12 text-medium-gray" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-stackmatch-navy mb-2">
          {hasFilters ? 'No proposals found' : 'No proposals yet'}
        </h3>
        
        <p className="text-medium-gray mb-6 max-w-md mx-auto">
          {hasFilters 
            ? 'Try adjusting your search or filter criteria to find more proposals.'
            : 'Proposals will appear here when vendors respond to your listings. Make sure your listings are active and visible to attract quality proposals.'
          }
        </p>
        
        {!hasFilters && (
          <Link href="/my-listings">
            <Button className="bg-trust-green hover:bg-success-green text-white">
              View My Listings
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filteredProposals.map((proposal, index) => (
        <div
          key={proposal.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <ProposalCard 
            proposal={proposal} 
            onArchive={handleArchiveProposal}
          />
        </div>
      ))}
    </div>
  )
}