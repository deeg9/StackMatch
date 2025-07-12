'use client'

import { Building2, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { ProposalEvaluation } from '@/lib/mock-data/proposal-evaluation-data'

interface ProposalEvaluationHeaderProps {
  proposal: AIGeneratedProposal
  evaluation: ProposalEvaluation
}

export function ProposalEvaluationHeader({ 
  proposal, 
  evaluation 
}: ProposalEvaluationHeaderProps) {
  const getStatusColor = (status: ProposalEvaluation['status']) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-700',
      'under-review': 'bg-yellow-100 text-yellow-700',
      'shortlisted': 'bg-green-100 text-green-700',
      'awaiting-clarification': 'bg-orange-100 text-orange-700',
      'rejected': 'bg-red-100 text-red-700',
      'accepted': 'bg-emerald-100 text-emerald-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Top Section - Title and Status */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Proposal Evaluation Command Center
              </h1>
              <p className="text-gray-600">
                Review and evaluate vendor proposals for your RFQ
              </p>
            </div>
            <Badge className={getStatusColor(evaluation.status)}>
              {evaluation.status.charAt(0).toUpperCase() + 
               evaluation.status.slice(1).replace('-', ' ')}
            </Badge>
          </div>

          {/* Vendor Info Section */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Vendor Logo Placeholder */}
              <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              
              {/* Vendor Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {proposal.basicDetails.proposalTitle}
                </h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {/* Extract company name from proposal title */}
                    BambooHR
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Submitted {formatDate(proposal.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Match Score */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {proposal.overallMatchScore}%
              </div>
              <div className="text-sm text-gray-600">Match Score</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 mt-4">
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Accept Proposal
            </Button>
            <Button variant="outline">
              Start Negotiation
            </Button>
            <Button variant="outline">
              Schedule Meeting
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              Reject Proposal
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}