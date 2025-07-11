'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, AlertCircle, CheckCircle2, Calendar, DollarSign, Building2, Users, Globe, Zap } from 'lucide-react'

interface ListingProjectSummaryTabProps {
  listing: any
}

export function ListingProjectSummaryTab({ listing }: ListingProjectSummaryTabProps) {
  return (
    <div className="space-y-6">
      {/* Project Goals & Overview */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Project Goals & Overview
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-attention-orange" />
              Primary Challenges
            </h4>
            <p className="text-medium-gray leading-relaxed">
              {listing.projectOverview?.primaryChallenges || 'No challenges specified'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-trust-green" />
              Desired Outcomes
            </h4>
            <p className="text-medium-gray leading-relaxed">
              {listing.projectOverview?.desiredOutcomes || 'No outcomes specified'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-stackmatch-blue" />
              Timeline Expectation
            </h4>
            <p className="text-medium-gray leading-relaxed">
              {listing.projectOverview?.timelineExpectation || 'No timeline specified'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* At-a-Glance Details */}
      <Card className="border-2 hover:border-trust-green transition-all duration-300 bg-gradient-to-br from-white to-light-gray/10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-stackmatch-navy">
            At-a-Glance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-medium-gray">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Budget Range</span>
              </div>
              <p className="font-bold text-xl text-trust-green">
                {listing.budgetTimeline?.budgetRange || 'TBD'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-medium-gray">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Target Go-Live</span>
              </div>
              <p className="font-bold text-xl text-charcoal">
                {listing.budgetTimeline?.targetGoLive || 'TBD'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-medium-gray">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Industry</span>
              </div>
              <p className="font-bold text-xl text-charcoal">
                {listing.businessContext?.industry || 'Not specified'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-medium-gray">
                <Users className="h-4 w-4" />
                <span className="text-sm">Company Size</span>
              </div>
              <p className="font-bold text-xl text-charcoal">
                {listing.coreRequirements?.employeeCount || 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout for Requirements and Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Requirements */}
        <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-attention-orange" />
              <CardTitle className="text-xl font-semibold text-stackmatch-navy">
                Key Requirements
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {listing.coreRequirements?.features?.slice(0, 6).map((feature: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stackmatch-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-stackmatch-blue">{index + 1}</span>
                  </div>
                  <p className="text-charcoal">{feature}</p>
                </div>
              ))}
            </div>
            {listing.coreRequirements?.features?.length > 6 && (
              <p className="text-sm text-medium-gray mt-4 text-center">
                +{listing.coreRequirements.features.length - 6} more requirements in Full Requirements tab
              </p>
            )}
          </CardContent>
        </Card>

        {/* Key Evaluation Criteria */}
        <Card className="border-2 hover:border-trust-green transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-trust-green" />
              <CardTitle className="text-xl font-semibold text-stackmatch-navy">
                Key Evaluation Criteria
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listing.additionalRequirements?.evaluationCriteria?.map((criterion: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-light-gray/30 rounded-lg">
                  <span className="font-medium text-charcoal">{criterion.criteria}</span>
                  <Badge className="bg-stackmatch-blue text-white">
                    {criterion.weight}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="border-2 border-light-gray bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-around flex-wrap gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-stackmatch-blue">{listing.proposals_count || 0}</p>
              <p className="text-sm text-medium-gray">Proposals Received</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-trust-green">{listing.view_count || 0}</p>
              <p className="text-sm text-medium-gray">Views</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-attention-orange">
                {listing.organizationalDetails?.geographicScope?.length || 0}
              </p>
              <p className="text-sm text-medium-gray">Geographic Regions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-charcoal">
                {listing.coreRequirements?.integrations?.length || 0}
              </p>
              <p className="text-sm text-medium-gray">Required Integrations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}