'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Briefcase,
  CheckCircle,
  Settings,
  Shield,
  Zap
} from 'lucide-react'

interface ListingRequirementsTabProps {
  listing: any
}

export function ListingRequirementsTab({ listing }: ListingRequirementsTabProps) {
  const formatBudget = () => {
    if (listing.budget_min && listing.budget_max) {
      return `$${listing.budget_min.toLocaleString()} - $${listing.budget_max.toLocaleString()}`
    } else if (listing.budget_min) {
      return `From $${listing.budget_min.toLocaleString()}`
    } else if (listing.budget_max) {
      return `Up to $${listing.budget_max.toLocaleString()}`
    }
    return 'Budget not specified'
  }

  return (
    <div className="space-y-6">
      {/* Key Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Budget */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-trust-green/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-trust-green" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-1">Budget Range</h3>
                <p className="text-2xl font-bold text-trust-green">{formatBudget()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-stackmatch-blue/10 rounded-lg">
                <Clock className="h-6 w-6 text-stackmatch-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-1">Project Duration</h3>
                <p className="text-2xl font-bold text-stackmatch-blue">
                  {listing.project_duration || 'Not specified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-information-blue/10 rounded-lg">
                <MapPin className="h-6 w-6 text-information-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-1">Location Preference</h3>
                <p className="text-lg font-semibold text-charcoal">
                  {listing.location_preference || 'No preference'}
                </p>
                <p className="text-sm text-medium-gray">
                  Remote: {listing.remote_preference || 'Not specified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Date */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-attention-orange/10 rounded-lg">
                <Calendar className="h-6 w-6 text-attention-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-1">Project Start Date</h3>
                <p className="text-lg font-semibold text-charcoal">
                  {listing.project_start_date 
                    ? new Date(listing.project_start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Flexible'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Required Skills */}
      {listing.required_skills && listing.required_skills.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Zap className="h-5 w-5 text-attention-orange" />
              Required Skills & Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {listing.required_skills.map((skill: string, index: number) => (
                <Badge 
                  key={index}
                  className="bg-stackmatch-blue text-white"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Phases */}
      {listing.timeline_phases && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Settings className="h-5 w-5 text-stackmatch-blue" />
              Project Timeline & Phases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(listing.timeline_phases) ? (
                listing.timeline_phases.map((phase: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-stackmatch-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-charcoal">
                        {phase.name || `Phase ${index + 1}`}
                      </h4>
                      <p className="text-medium-gray text-sm mt-1">
                        {phase.duration || 'Duration not specified'}
                      </p>
                      {phase.deliverables && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-charcoal mb-1">Deliverables:</p>
                          <ul className="list-disc list-inside text-sm text-medium-gray">
                            {phase.deliverables.map((deliverable: string, i: number) => (
                              <li key={i}>{deliverable}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-medium-gray">
                  {typeof listing.timeline_phases === 'object' 
                    ? JSON.stringify(listing.timeline_phases, null, 2) 
                    : listing.timeline_phases}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Requirements */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
            <Shield className="h-5 w-5 text-trust-green" />
            Additional Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-trust-green" />
              <span className="text-charcoal">Vendor must have proven experience in {listing.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-trust-green" />
              <span className="text-charcoal">Regular progress updates and communication required</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-trust-green" />
              <span className="text-charcoal">Must comply with data security and privacy standards</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-trust-green" />
              <span className="text-charcoal">Post-implementation support required</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}