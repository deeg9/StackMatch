'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Target, Lightbulb, AlertCircle } from 'lucide-react'

interface ListingOverviewTabProps {
  listing: any
}

export function ListingOverviewTab({ listing }: ListingOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Project Description */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-stackmatch-navy">
            Project Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
            {listing.description || 'No description provided.'}
          </p>
        </CardContent>
      </Card>

      {/* About the Company */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
            <Building2 className="h-5 w-5 text-stackmatch-blue" />
            About Our Company
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
            {listing.about_company || 'No company information provided.'}
          </p>
        </CardContent>
      </Card>

      {/* Business Context */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
            <Target className="h-5 w-5 text-trust-green" />
            Business Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
            {listing.about_business || 'No business context provided.'}
          </p>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      {listing.success_metrics && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Lightbulb className="h-5 w-5 text-attention-orange" />
              Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(listing.success_metrics).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-stackmatch-blue mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-charcoal capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-medium-gray">
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Challenges */}
      {listing.current_challenges && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Current Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(listing.current_challenges) ? (
                listing.current_challenges.map((challenge: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <p className="text-charcoal">{challenge}</p>
                  </div>
                ))
              ) : (
                <p className="text-charcoal">
                  {typeof listing.current_challenges === 'object' 
                    ? JSON.stringify(listing.current_challenges) 
                    : listing.current_challenges}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {listing.tags && listing.tags.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-stackmatch-navy">
              Project Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-stackmatch-blue/10 text-stackmatch-blue border-stackmatch-blue"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}