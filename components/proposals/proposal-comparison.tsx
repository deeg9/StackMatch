'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  Clock, 
  Star, 
  Building2,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProposalComparisonProps {
  mainProposal: any
  listingId: string
}

export function ProposalComparison({ mainProposal, listingId }: ProposalComparisonProps) {
  const [otherProposals, setOtherProposals] = useState<any[]>([])
  const [selectedProposals, setSelectedProposals] = useState<string[]>([mainProposal.id])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOtherProposals = async () => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          profiles!proposals_seller_id_fkey (
            id,
            full_name,
            company_name,
            avatar_url
          )
        `)
        .eq('listing_id', listingId)
        .neq('id', mainProposal.id)
        .limit(3)

      if (!error && data) {
        setOtherProposals(data)
      }
      setIsLoading(false)
    }

    fetchOtherProposals()
  }, [listingId, mainProposal.id])

  const toggleProposal = (proposalId: string) => {
    setSelectedProposals(prev => 
      prev.includes(proposalId) 
        ? prev.filter(id => id !== proposalId)
        : [...prev, proposalId].slice(0, 3) // Max 3 proposals
    )
  }

  const getComparisonProposals = () => {
    const allProposals = [mainProposal, ...otherProposals]
    return allProposals.filter(p => selectedProposals.includes(p.id))
  }

  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`
    } else if (budget >= 1000) {
      return `$${(budget / 1000).toLocaleString()}K`
    }
    return `$${budget.toLocaleString()}`
  }

  const compareProposals = getComparisonProposals()

  return (
    <div className="space-y-6">
      {/* Proposal Selector */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy">
            Select Proposals to Compare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[mainProposal, ...otherProposals].map((proposal) => (
              <Button
                key={proposal.id}
                variant={selectedProposals.includes(proposal.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleProposal(proposal.id)}
                disabled={proposal.id === mainProposal.id}
                className={proposal.id === mainProposal.id ? 'bg-stackmatch-blue text-white' : ''}
              >
                {proposal.profiles.company_name}
              </Button>
            ))}
          </div>
          <p className="text-xs text-medium-gray mt-2">
            Compare up to 3 proposals side by side
          </p>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 bg-slate-50 border-2 border-light-gray">
                <span className="font-semibold text-stackmatch-navy">Criteria</span>
              </th>
              {compareProposals.map((proposal) => (
                <th key={proposal.id} className="p-4 bg-slate-50 border-2 border-light-gray">
                  <div className="text-center">
                    <h3 className="font-semibold text-stackmatch-navy">
                      {proposal.profiles.company_name}
                    </h3>
                    <p className="text-sm text-medium-gray">
                      {proposal.profiles.full_name}
                    </p>
                    {proposal.id === mainProposal.id && (
                      <Badge className="mt-1 bg-stackmatch-blue text-white">
                        Current
                      </Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Proposed Budget */}
            <tr>
              <td className="p-4 border-2 border-light-gray font-medium">
                Proposed Budget
              </td>
              {compareProposals.map((proposal) => (
                <td key={proposal.id} className="p-4 border-2 border-light-gray text-center">
                  <span className="text-xl font-bold text-trust-green">
                    {formatBudget(proposal.proposed_budget)}
                  </span>
                </td>
              ))}
            </tr>

            {/* Timeline */}
            <tr className="bg-slate-50">
              <td className="p-4 border-2 border-light-gray font-medium">
                Timeline
              </td>
              {compareProposals.map((proposal) => (
                <td key={proposal.id} className="p-4 border-2 border-light-gray text-center">
                  <span className="font-semibold text-charcoal">
                    {proposal.proposed_timeline || '8-12 weeks'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Vendor Rating */}
            <tr>
              <td className="p-4 border-2 border-light-gray font-medium">
                Vendor Rating
              </td>
              {compareProposals.map((proposal) => (
                <td key={proposal.id} className="p-4 border-2 border-light-gray text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-attention-orange fill-attention-orange" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Experience */}
            <tr className="bg-slate-50">
              <td className="p-4 border-2 border-light-gray font-medium">
                Years of Experience
              </td>
              {compareProposals.map((proposal) => (
                <td key={proposal.id} className="p-4 border-2 border-light-gray text-center">
                  <span className="font-semibold">10+</span>
                </td>
              ))}
            </tr>

            {/* Key Features Comparison */}
            {[
              '24/7 Support',
              'Implementation Team',
              'Training Included',
              'Custom Integration',
              'Post-Launch Support',
              'Security Compliance'
            ].map((feature, index) => (
              <tr key={feature} className={index % 2 === 0 ? '' : 'bg-slate-50'}>
                <td className="p-4 border-2 border-light-gray font-medium">
                  {feature}
                </td>
                {compareProposals.map((proposal) => (
                  <td key={proposal.id} className="p-4 border-2 border-light-gray text-center">
                    {Math.random() > 0.3 ? (
                      <CheckCircle className="h-5 w-5 text-trust-green mx-auto" />
                    ) : Math.random() > 0.5 ? (
                      <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                    ) : (
                      <Minus className="h-5 w-5 text-medium-gray mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Status */}
            <tr>
              <td className="p-4 border-2 border-light-gray font-medium">
                Status
              </td>
              {compareProposals.map((proposal) => (
                <td key={proposal.id} className="p-4 border-2 border-light-gray text-center">
                  <Badge className="bg-information-blue text-white">
                    {proposal.status?.replace('_', ' ')}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-stackmatch-blue/5">
              <td className="p-4 border-2 border-light-gray font-medium">
                Actions
              </td>
              {compareProposals.map((proposal) => (
                <td key={proposal.id} className="p-4 border-2 border-light-gray text-center">
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      className="bg-trust-green hover:bg-success-green text-white"
                    >
                      Select Winner
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comparison Summary */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy">
            Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-trust-green" />
              <span className="text-sm text-charcoal">
                <strong>Best Value:</strong> {compareProposals.reduce((best, p) => 
                  p.proposed_budget < best.proposed_budget ? p : best
                ).profiles.company_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-stackmatch-blue" />
              <span className="text-sm text-charcoal">
                <strong>Fastest Delivery:</strong> {compareProposals[0].profiles.company_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-attention-orange" />
              <span className="text-sm text-charcoal">
                <strong>Highest Rated:</strong> All vendors rated 4.8/5
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}