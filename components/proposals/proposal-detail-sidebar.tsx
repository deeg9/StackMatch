'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Star,
  Shield,
  Award,
  TrendingUp,
  Clock,
  Users,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface ProposalDetailSidebarProps {
  proposal: any
  isOwner: boolean
}

export function ProposalDetailSidebar({ proposal, isOwner }: ProposalDetailSidebarProps) {
  // Calculate proposal score (mock calculation)
  const calculateProposalScore = () => {
    let score = 70 // Base score
    
    // Budget alignment
    const budgetDiff = Math.abs(proposal.proposed_budget - ((proposal.listing.budget_min + proposal.listing.budget_max) / 2))
    const budgetRange = proposal.listing.budget_max - proposal.listing.budget_min
    if (budgetDiff < budgetRange * 0.2) score += 15
    
    // Timeline
    if (proposal.proposed_timeline) score += 10
    
    // Experience
    if (proposal.relevant_experience) score += 5
    
    return Math.min(score, 100)
  }

  const proposalScore = calculateProposalScore()

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      {isOwner && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-trust-green hover:bg-success-green text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Shortlist This Proposal
            </Button>
            <Link href={`/deal-rooms/new?proposal=${proposal.id}`} className="block">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
                <Users className="w-4 h-4" />
                Start Negotiation
              </button>
            </Link>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
              <MessageSquare className="w-4 h-4" />
              Message Vendor
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
              <Calendar className="w-4 h-4" />
              Schedule Meeting
            </button>
          </CardContent>
        </Card>
      )}

      {/* Proposal Score */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy">
            Proposal Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stackmatch-navy mb-2">
              {proposalScore}%
            </div>
            <Progress value={proposalScore} className="h-2 mb-2" />
            <p className="text-sm text-medium-gray">
              {proposalScore >= 85 ? 'Excellent Match' : 
               proposalScore >= 70 ? 'Good Match' : 
               'Fair Match'}
            </p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-medium-gray">Budget Alignment</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-light-gray" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-medium-gray">Technical Fit</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-medium-gray">Experience</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-attention-orange fill-attention-orange" />
                <Star className="h-3 w-3 text-light-gray" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Highlights */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy">
            Vendor Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-trust-green" />
            <div>
              <p className="text-sm font-medium text-charcoal">Verified Vendor</p>
              <p className="text-xs text-medium-gray">Background checked</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-attention-orange" />
            <div>
              <p className="text-sm font-medium text-charcoal">Top Performer</p>
              <p className="text-xs text-medium-gray">95% success rate</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-stackmatch-blue" />
            <div>
              <p className="text-sm font-medium text-charcoal">127 Projects</p>
              <p className="text-xs text-medium-gray">$12M+ delivered</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-information-blue" />
            <div>
              <p className="text-sm font-medium text-charcoal">Quick Response</p>
              <p className="text-xs text-medium-gray">Avg. 2hr response time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy">
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-charcoal">Proposal Submitted</p>
            <p className="text-sm text-medium-gray">
              {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Unknown'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-charcoal">Response Deadline</p>
            <p className="text-sm text-medium-gray">
              {proposal.listing.bid_deadline ? new Date(proposal.listing.bid_deadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Not specified'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-charcoal">Project Start</p>
            <p className="text-sm text-medium-gray">
              Available immediately
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Tip */}
      {isOwner && (
        <Card className="border-2 border-information-blue">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-information-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-charcoal mb-1">
                  Pro Tip
                </p>
                <p className="text-xs text-medium-gray">
                  Use the comparison view to evaluate this proposal against others for your listing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy">
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}