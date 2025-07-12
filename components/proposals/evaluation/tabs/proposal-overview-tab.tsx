'use client'

import { Award, Users, Target, Briefcase, CheckCircle, Building2 } from 'lucide-react'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProposalOverviewTabProps {
  proposal: AIGeneratedProposal
}

export function ProposalOverviewTab({ proposal }: ProposalOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Personalized Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Personalized Message for Buyer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">
              {proposal.corporateOverview.personalizedMessage}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Project Understanding</h4>
            <p className="text-gray-700">{proposal.executiveSummary.projectUnderstanding}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Proposed Value</h4>
            <p className="text-gray-700">{proposal.executiveSummary.proposedValue}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Key Benefits</h4>
            <ul className="space-y-2">
              {proposal.executiveSummary.keyBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Company Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Mission</h4>
              <p className="text-gray-900">{proposal.corporateOverview.companyProfile.mission}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Company Size</h4>
              <p className="text-gray-900">{proposal.corporateOverview.companyProfile.size}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Key Differentiators</h4>
            <div className="grid grid-cols-1 gap-2">
              {proposal.corporateOverview.companyProfile.keyDifferentiators.map((diff, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  <span className="text-gray-700">{diff}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Industry Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {proposal.corporateOverview.companyProfile.industryExpertise.map((industry, index) => (
                  <Badge key={index} variant="secondary">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {proposal.corporateOverview.companyProfile.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Awards & Recognition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Awards & Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposal.corporateOverview.companyProfile.awards.map((award, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{award}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Testimonials */}
      {proposal.corporateOverview.companyProfile.clientTestimonials && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Client Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.corporateOverview.companyProfile.clientTestimonials.map((testimonial, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                  <p className="text-gray-700 italic">"{testimonial}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Case Studies */}
      {proposal.corporateOverview.caseStudies && proposal.corporateOverview.caseStudies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Relevant Case Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.corporateOverview.caseStudies.map((study) => (
                <a
                  key={study.id}
                  href={study.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{study.title}</p>
                  <p className="text-sm text-blue-600 mt-1">View Case Study →</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}