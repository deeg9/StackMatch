'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Building2, 
  Globe, 
  MapPin, 
  TrendingUp, 
  Users, 
  Briefcase,
  AlertCircle,
  Target,
  BarChart3,
  Building,
  Workflow,
  UserCheck
} from 'lucide-react'

interface ListingBusinessContextTabProps {
  listing: any
}

export function ListingBusinessContextTab({ listing }: ListingBusinessContextTabProps) {
  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Company Overview
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-medium-gray mb-1">Industry</p>
                <p className="text-lg font-semibold text-charcoal">
                  {listing.businessContext?.industry || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-medium-gray mb-1">Company Size</p>
                <p className="text-lg font-semibold text-charcoal">
                  {listing.businessContext?.companySize || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-medium-gray mb-1">Employee Count</p>
                <p className="text-lg font-semibold text-charcoal">
                  {listing.coreRequirements?.employeeCount || 'Not specified'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-medium-gray mb-1">Growth Rate</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-trust-green" />
                  <p className="text-lg font-semibold text-trust-green">
                    {listing.businessContext?.growthRate || 'Not specified'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-medium-gray mb-1">Subsidiaries</p>
                <p className="text-lg font-semibold text-charcoal">
                  {listing.organizationalDetails?.subsidiaries || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-medium-gray mb-1">Departments</p>
                <p className="text-lg font-semibold text-charcoal">
                  {listing.organizationalDetails?.departments || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Presence */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Geographic Presence
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-attention-orange" />
              Office Locations
            </h4>
            <p className="text-medium-gray bg-light-gray/30 p-4 rounded-lg">
              {listing.organizationalDetails?.locations || 'Not specified'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-charcoal mb-3">Geographic Scope</h4>
            <div className="flex flex-wrap gap-2">
              {listing.organizationalDetails?.geographicScope?.map((region: string, index: number) => (
                <Badge key={index} className="bg-stackmatch-blue/10 text-stackmatch-blue border border-stackmatch-blue/20 px-4 py-2">
                  <Globe className="h-3 w-3 mr-2" />
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current State & Challenges */}
      <Card className="border-2 hover:border-attention-orange transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-attention-orange" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Current State & Challenges
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-charcoal mb-2">Current Systems</h4>
            <p className="text-medium-gray bg-light-gray/30 p-4 rounded-lg">
              {listing.organizationalDetails?.currentSystems || 'Not specified'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-charcoal mb-2">Pain Points</h4>
            <p className="text-medium-gray bg-attention-orange/10 p-4 rounded-lg border border-attention-orange/20">
              {listing.businessContext?.currentPain || 'Not specified'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Processes & Success Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Processes */}
        <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-stackmatch-blue" />
              <CardTitle className="text-lg font-semibold text-stackmatch-navy">
                Key Business Processes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {listing.organizationalDetails?.businessProcesses?.map((process: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-light-gray/20 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-stackmatch-blue/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-stackmatch-blue">{index + 1}</span>
                  </div>
                  <span className="text-charcoal">{process}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className="border-2 hover:border-trust-green transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-trust-green" />
              <CardTitle className="text-lg font-semibold text-stackmatch-navy">
                Success Metrics
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {listing.businessContext?.successMetrics?.map((metric: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-trust-green/5 rounded-lg border border-trust-green/20">
                  <BarChart3 className="h-4 w-4 text-trust-green flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal text-sm">{metric}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Stakeholders */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Key Stakeholders
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listing.keyStakeholders?.map((stakeholder: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-light-gray/20 rounded-lg hover:bg-light-gray/30 transition-colors">
                <Avatar className="h-12 w-12 border-2 border-stackmatch-blue/20">
                  <AvatarFallback className="bg-stackmatch-blue text-white text-sm">
                    {stakeholder.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-charcoal">{stakeholder.name}</p>
                  <p className="text-sm text-medium-gray">{stakeholder.role}</p>
                  <Badge className="mt-1 text-xs" variant="outline">
                    {stakeholder.involvement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expected Outcomes */}
      <Card className="border-2 hover:border-trust-green transition-all duration-300 bg-gradient-to-br from-trust-green/5 to-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-trust-green" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Expected Business Outcomes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-medium-gray leading-relaxed">
            {listing.businessContext?.expectedOutcomes || 'Not specified'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}