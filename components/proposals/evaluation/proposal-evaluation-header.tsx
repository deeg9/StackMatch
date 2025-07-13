'use client'

import { Building2, Calendar, CheckCircle2, AlertCircle, ArrowLeft, DollarSign, Target, FileText, Clock, Plus, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { ProposalEvaluation } from '@/lib/mock-data/proposal-evaluation-data'
import { useRouter } from 'next/navigation'

interface ProposalEvaluationHeaderProps {
  proposal: AIGeneratedProposal
  evaluation: ProposalEvaluation
}

export function ProposalEvaluationHeader({ 
  proposal, 
  evaluation 
}: ProposalEvaluationHeaderProps) {
  const router = useRouter()
  
  const getStatusColor = (status: ProposalEvaluation['status']) => {
    const colors = {
      'new': 'bg-information-blue text-white',
      'under-review': 'bg-attention-orange text-white',
      'shortlisted': 'bg-trust-green text-white',
      'awaiting-clarification': 'bg-attention-orange text-white',
      'rejected': 'bg-error-red text-white',
      'accepted': 'bg-success-green text-white'
    }
    return colors[status] || 'bg-medium-gray text-white'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  // Extract vendor name from proposal title (e.g., "BambooHR - Complete HR Platform Proposal" -> "BambooHR")
  const vendorName = proposal.basicDetails.proposalTitle.split(' - ')[0] || 'Unknown Vendor'

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-light-gray p-6 mb-6">
      {/* Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-sm text-medium-gray">
          Received Proposals / {vendorName}
        </div>
      </div>

      {/* Main Header Content - RFQ Command Center Style */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          {/* Title and Status - More Prominent */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-stackmatch-navy mb-2">
              {proposal.basicDetails.proposalTitle}
            </h1>
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(evaluation.status)} text-base px-3 py-1`}>
                {evaluation.status.charAt(0).toUpperCase() + 
                 evaluation.status.slice(1).replace('-', ' ')}
              </Badge>
              <span className="text-lg text-charcoal font-medium">
                For: {/* Add listing title here */}HR Management System Upgrade
              </span>
            </div>
          </div>

          {/* Key Information Bar */}
          <div className="flex items-center gap-8 p-4 bg-light-gray/30 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-trust-green" />
              <div>
                <p className="text-xs text-medium-gray">Match Score</p>
                <p className="font-semibold text-charcoal text-lg">{proposal.overallMatchScore}%</p>
              </div>
            </div>
            <div className="border-l border-medium-gray/20 h-10"></div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-stackmatch-blue" />
              <div>
                <p className="text-xs text-medium-gray">Proposed Cost</p>
                <p className="font-semibold text-charcoal">${proposal.pricingScoping.annualLicenseFee.toLocaleString()} / Year</p>
              </div>
            </div>
            <div className="border-l border-medium-gray/20 h-10"></div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-stackmatch-blue" />
              <div>
                <p className="text-xs text-medium-gray">From</p>
                <p className="font-semibold text-charcoal">{vendorName}</p>
              </div>
            </div>
            <div className="border-l border-medium-gray/20 h-10"></div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-attention-orange" />
              <div>
                <p className="text-xs text-medium-gray">Submitted</p>
                <p className="font-semibold text-charcoal">{formatDate(proposal.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Context-Aware Action Bar */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <Button className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create StackSpace
          </Button>
          <Button variant="outline" className="w-full text-error-red hover:bg-red-50" size="lg">
            Reject Proposal
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <MessageSquare className="h-4 w-4 mr-2" />
            Request Clarification
          </Button>
        </div>
      </div>
    </div>
  )
}