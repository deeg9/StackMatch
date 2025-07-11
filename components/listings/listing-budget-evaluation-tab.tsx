'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3, 
  FileText,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  FileQuestion,
  MessageCircle
} from 'lucide-react'

interface ListingBudgetEvaluationTabProps {
  listing: any
  isOwner: boolean
}

export function ListingBudgetEvaluationTab({ listing, isOwner }: ListingBudgetEvaluationTabProps) {
  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card className="border-2 hover:border-trust-green transition-all duration-300 bg-gradient-to-br from-trust-green/5 to-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-trust-green" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Budget Overview
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-trust-green/10 rounded-lg">
            <p className="text-sm text-medium-gray mb-2">Total Budget Range (Year 1)</p>
            <p className="text-4xl font-bold text-trust-green">
              {listing.budgetTimeline?.budgetRange || 'TBD'}
            </p>
          </div>

          {/* Budget Breakdown */}
          {listing.budgetTimeline?.budgetBreakdown && (
            <div className="space-y-4">
              <h4 className="font-semibold text-charcoal">Budget Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-light-gray/20 rounded-lg">
                  <span className="text-medium-gray">Implementation</span>
                  <span className="font-semibold text-charcoal">
                    {listing.budgetTimeline.budgetBreakdown.implementation}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-light-gray/20 rounded-lg">
                  <span className="text-medium-gray">Annual License</span>
                  <span className="font-semibold text-charcoal">
                    {listing.budgetTimeline.budgetBreakdown.annualLicense}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-light-gray/20 rounded-lg">
                  <span className="text-medium-gray">Training</span>
                  <span className="font-semibold text-charcoal">
                    {listing.budgetTimeline.budgetBreakdown.training}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-light-gray/20 rounded-lg">
                  <span className="text-medium-gray">Contingency</span>
                  <span className="font-semibold text-charcoal">
                    {listing.budgetTimeline.budgetBreakdown.contingency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline & Phases */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Project Timeline
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-stackmatch-blue/10 rounded-lg">
            <div>
              <p className="text-sm text-medium-gray">Target Go-Live Date</p>
              <p className="text-2xl font-bold text-stackmatch-blue">
                {listing.budgetTimeline?.targetGoLive || 'TBD'}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-stackmatch-blue/20" />
          </div>

          {/* Project Phases */}
          {listing.budgetTimeline?.phases && (
            <div className="space-y-4">
              <h4 className="font-semibold text-charcoal">Implementation Phases</h4>
              <div className="space-y-3">
                {listing.budgetTimeline.phases.map((phase: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-4 p-4 bg-light-gray/20 rounded-lg hover:bg-light-gray/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-stackmatch-blue flex items-center justify-center text-white font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-charcoal">{phase.phase}</h5>
                          <Badge variant="outline" className="ml-2">
                            {phase.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-medium-gray mt-1">
                          Start: {phase.startDate}
                        </p>
                      </div>
                    </div>
                    {index < listing.budgetTimeline.phases.length - 1 && (
                      <div className="absolute left-5 top-14 w-0.5 h-8 bg-stackmatch-blue/30"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Internal Resources */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Internal Resources Required
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {listing.budgetTimeline?.internalResources?.map((resource: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-light-gray/20 rounded-lg">
                <Users className="h-4 w-4 text-stackmatch-blue flex-shrink-0" />
                <span className="text-charcoal">{resource}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Criteria */}
      <Card className="border-2 hover:border-trust-green transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-trust-green" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Evaluation Criteria & Weighting
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {listing.additionalRequirements?.evaluationCriteria?.map((criterion: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-charcoal">{criterion.criteria}</span>
                <Badge className="bg-trust-green text-white">
                  {criterion.weight}
                </Badge>
              </div>
              <Progress 
                value={parseInt(criterion.weight)} 
                className="h-2 bg-light-gray"
              />
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-trust-green/10 rounded-lg border border-trust-green/20">
            <p className="text-sm text-charcoal">
              <strong>Note:</strong> Proposals will be evaluated based on these criteria. 
              Ensure your submission addresses each area comprehensively.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Requirements */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Additional Requirements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Open-Ended Questions */}
          <div>
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-attention-orange" />
              Questions to Address in Your Proposal
            </h4>
            <div className="space-y-3">
              {listing.additionalRequirements?.openEndedQuestions?.map((question: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-attention-orange/5 rounded-lg border border-attention-orange/20">
                  <span className="font-semibold text-attention-orange">{index + 1}.</span>
                  <p className="text-charcoal">{question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Required Proposal Sections */}
          <div>
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-stackmatch-blue" />
              Required Proposal Sections
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {listing.additionalRequirements?.requiredProposalSections?.map((section: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-light-gray/20 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-trust-green flex-shrink-0" />
                  <span className="text-charcoal">{section}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}