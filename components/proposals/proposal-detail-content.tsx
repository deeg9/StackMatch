'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Target, 
  Clock, 
  DollarSign, 
  Users, 
  Shield,
  Award,
  Briefcase,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Zap
} from 'lucide-react'
import { ProposalAttachments } from './proposal-attachments'
import { ProposalVendorInfo } from './proposal-vendor-info'

interface ProposalDetailContentProps {
  proposal: any
}

export function ProposalDetailContent({ proposal }: ProposalDetailContentProps) {
  // Parse proposal data - in real app this would come structured from AI
  const proposalSections = {
    coverLetter: proposal.cover_letter,
    technicalApproach: proposal.technical_approach,
    relevantExperience: proposal.relevant_experience,
    // These would be parsed from the proposal data
    executiveSummary: `We are excited to partner with ${proposal.listing.title} to deliver a comprehensive solution...`,
    implementationPlan: {
      phases: [
        { name: 'Discovery & Planning', duration: '2 weeks', deliverables: ['Requirements document', 'Project plan'] },
        { name: 'Design & Architecture', duration: '3 weeks', deliverables: ['System design', 'UI/UX mockups'] },
        { name: 'Development', duration: '6 weeks', deliverables: ['Core features', 'Integration'] },
        { name: 'Testing & Deployment', duration: '2 weeks', deliverables: ['UAT', 'Go-live'] }
      ]
    },
    pricing: {
      breakdown: [
        { item: 'Software Licenses', cost: 25000 },
        { item: 'Implementation Services', cost: 45000 },
        { item: 'Training & Support', cost: 15000 },
        { item: 'Customization', cost: proposal.proposed_budget - 85000 }
      ]
    },
    team: [
      { name: 'Michael Chen', role: 'Project Lead', experience: '10+ years' },
      { name: 'Sarah Williams', role: 'Technical Architect', experience: '8+ years' },
      { name: 'David Park', role: 'Senior Developer', experience: '6+ years' }
    ]
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-5 w-full mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="technical">Technical Approach</TabsTrigger>
        <TabsTrigger value="pricing">Pricing & Timeline</TabsTrigger>
        <TabsTrigger value="team">Team & Experience</TabsTrigger>
        <TabsTrigger value="vendor">Vendor Info</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        {/* Executive Summary */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <FileText className="h-5 w-5 text-stackmatch-blue" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-charcoal leading-relaxed">
              {proposalSections.executiveSummary}
            </p>
          </CardContent>
        </Card>

        {/* Cover Letter */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Target className="h-5 w-5 text-trust-green" />
              Why Choose Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
              {proposalSections.coverLetter}
            </p>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Lightbulb className="h-5 w-5 text-attention-orange" />
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, title: 'ROI Focused', desc: 'Average 3x ROI within first year' },
                { icon: Zap, title: 'Fast Implementation', desc: 'Go-live in 12 weeks or less' },
                { icon: Shield, title: 'Enterprise Security', desc: 'SOC2, GDPR, HIPAA compliant' },
                { icon: Users, title: '24/7 Support', desc: 'Dedicated success team' }
              ].map((benefit, index) => (
                <div key={index} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                  <benefit.icon className="h-5 w-5 text-stackmatch-blue mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-charcoal">{benefit.title}</h4>
                    <p className="text-sm text-medium-gray">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Technical Approach Tab */}
      <TabsContent value="technical" className="space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Zap className="h-5 w-5 text-stackmatch-blue" />
              Technical Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-charcoal leading-relaxed whitespace-pre-wrap mb-6">
              {proposalSections.technicalApproach || 'Our technical approach focuses on scalability, security, and seamless integration...'}
            </p>

            {/* Implementation Phases */}
            <h4 className="font-semibold text-charcoal mb-4">Implementation Roadmap</h4>
            <div className="space-y-4">
              {proposalSections.implementationPlan.phases.map((phase, index) => (
                <div key={index} className="flex gap-4 p-4 border-2 border-light-gray rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-stackmatch-blue text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-charcoal">{phase.name}</h5>
                      <Badge variant="outline" className="text-stackmatch-blue border-stackmatch-blue">
                        {phase.duration}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.deliverables.map((deliverable, i) => (
                        <span key={i} className="text-sm text-medium-gray flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-trust-green" />
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Pricing & Timeline Tab */}
      <TabsContent value="pricing" className="space-y-6">
        {/* Pricing Breakdown */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <DollarSign className="h-5 w-5 text-trust-green" />
              Investment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {proposalSections.pricing.breakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-charcoal">{item.item}</span>
                  <span className="font-semibold text-charcoal">
                    ${item.cost.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t-2 border-light-gray">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-charcoal">Total Investment</span>
                <span className="text-2xl font-bold text-trust-green">
                  ${proposal.proposed_budget.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mt-6 p-4 bg-information-blue/10 rounded-lg">
              <h4 className="font-semibold text-charcoal mb-2">Payment Terms</h4>
              <ul className="space-y-1 text-sm text-charcoal">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-trust-green" />
                  30% upon contract signing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-trust-green" />
                  40% at project midpoint
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-trust-green" />
                  30% upon successful go-live
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Clock className="h-5 w-5 text-stackmatch-blue" />
              Project Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-light-gray"></div>
              {proposalSections.implementationPlan.phases.map((phase, index) => (
                <div key={index} className="flex gap-4 mb-6 relative">
                  <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-stackmatch-blue rounded-full flex items-center justify-center font-bold text-stackmatch-blue z-10">
                    {index + 1}
                  </div>
                  <div className="flex-1 pb-2">
                    <h5 className="font-semibold text-charcoal">{phase.name}</h5>
                    <p className="text-sm text-medium-gray">{phase.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Team & Experience Tab */}
      <TabsContent value="team" className="space-y-6">
        {/* Team Members */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Users className="h-5 w-5 text-stackmatch-blue" />
              Your Project Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposalSections.team.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-4 border-2 border-light-gray rounded-lg">
                  <div className="w-12 h-12 bg-stackmatch-blue text-white rounded-full flex items-center justify-center font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="font-semibold text-charcoal">{member.name}</h5>
                    <p className="text-sm text-medium-gray">{member.role}</p>
                    <p className="text-xs text-stackmatch-blue">{member.experience}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relevant Experience */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Briefcase className="h-5 w-5 text-trust-green" />
              Relevant Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
              {proposalSections.relevantExperience || 'We have successfully delivered similar solutions for Fortune 500 companies...'}
            </p>
          </CardContent>
        </Card>

        {/* Case Studies */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
              <Award className="h-5 w-5 text-attention-orange" />
              Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { client: 'TechCorp Industries', result: '45% efficiency improvement', industry: 'Technology' },
                { client: 'HealthFirst Solutions', result: '3.2x ROI in 8 months', industry: 'Healthcare' },
                { client: 'Global Finance Inc', result: '$2.3M cost savings', industry: 'Finance' }
              ].map((story, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-charcoal">{story.client}</h5>
                    <Badge variant="outline">{story.industry}</Badge>
                  </div>
                  <p className="text-trust-green font-semibold">{story.result}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Vendor Info Tab */}
      <TabsContent value="vendor">
        <ProposalVendorInfo vendor={proposal.seller} />
        <ProposalAttachments attachments={proposal.attachments} />
      </TabsContent>
    </Tabs>
  )
}