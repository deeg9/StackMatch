'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  GitCompare,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  Users,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  Plus,
  Filter,
  Search,
  TrendingUp,
  AlertCircle,
  CheckSquare,
  History,
  FileDown,
  Printer,
  Share2,
  Copy,
  Archive,
  RefreshCcw,
  Zap,
  Target,
  Clock3,
  Briefcase
} from 'lucide-react'

interface DealRoomProposalsProps {
  dealRoom: any
}

export function DealRoomProposals({ dealRoom }: DealRoomProposalsProps) {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(1)
  const [showComparison, setShowComparison] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Enhanced proposals data
  const proposals = [
    {
      id: 1,
      title: 'Enterprise CRM Implementation - Premium Package',
      version: '3.0',
      status: 'accepted',
      value: 175000,
      currency: 'USD',
      submittedBy: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/40/40',
        title: 'Solutions Architect',
        company: 'CRM Experts Inc'
      },
      submittedAt: '2024-01-15',
      updatedAt: '2024-01-28',
      acceptedAt: '2024-01-25',
      timeline: '6 months',
      paymentTerms: 'Milestone-based',
      description: 'Complete enterprise CRM implementation with advanced analytics, custom integrations, data migration, comprehensive training, and 12-month support.',
      deliverables: [
        'Custom CRM deployment and configuration',
        'Data migration from legacy systems (2.5M+ records)',
        'Third-party integrations (Slack, Salesforce, QuickBooks)',
        'Advanced analytics and reporting dashboard',
        'User training and documentation',
        '12-month premium support and maintenance'
      ],
      milestones: [
        { phase: 'Planning & Discovery', duration: '2 weeks', status: 'completed', payment: 25000 },
        { phase: 'System Setup & Integration', duration: '8 weeks', status: 'in-progress', payment: 75000 },
        { phase: 'Data Migration & Testing', duration: '6 weeks', status: 'pending', payment: 50000 },
        { phase: 'Training & Go-Live', duration: '4 weeks', status: 'pending', payment: 25000 }
      ],
      riskFactors: [
        'Legacy system data quality may require additional cleanup',
        'Third-party API changes could impact integration timeline',
        'User adoption training critical for success'
      ],
      successMetrics: [
        '99.9% system uptime',
        '<2 second page load times',
        '90% user adoption within 30 days',
        '50% reduction in manual data entry'
      ],
      feedback: [
        {
          user: 'Sarah Johnson',
          rating: 5,
          comment: 'Excellent comprehensive proposal. The phased approach and risk mitigation strategies are well thought out.',
          timestamp: '2024-01-20'
        },
        {
          user: 'David Kim',
          rating: 4,
          comment: 'Very detailed. Some concerns about the data migration timeline, but overall solid approach.',
          timestamp: '2024-01-22'
        }
      ],
      attachments: [
        { name: 'Technical_Architecture_v3.0.pdf', size: '3.2 MB', type: 'pdf' },
        { name: 'Project_Timeline.xlsx', size: '1.8 MB', type: 'excel' },
        { name: 'Cost_Breakdown.pdf', size: '892 KB', type: 'pdf' }
      ]
    },
    {
      id: 2,
      title: 'CRM Implementation - Standard Package',
      version: '2.1',
      status: 'under-review',
      value: 125000,
      currency: 'USD',
      submittedBy: {
        name: 'Elena Rodriguez',
        avatar: '/api/placeholder/40/40',
        title: 'Account Manager',
        company: 'CRM Experts Inc'
      },
      submittedAt: '2024-01-20',
      updatedAt: '2024-01-29',
      acceptedAt: null,
      timeline: '4 months',
      paymentTerms: 'Fixed monthly',
      description: 'Streamlined CRM implementation with essential features, basic integrations, and standard support package.',
      deliverables: [
        'Standard CRM deployment',
        'Basic data migration',
        'Essential integrations (Email, Calendar)',
        'Standard reporting features',
        'Basic user training',
        '6-month standard support'
      ],
      milestones: [
        { phase: 'Setup & Configuration', duration: '3 weeks', status: 'pending', payment: 31250 },
        { phase: 'Data Migration', duration: '4 weeks', status: 'pending', payment: 31250 },
        { phase: 'Integration & Testing', duration: '5 weeks', status: 'pending', payment: 31250 },
        { phase: 'Training & Launch', duration: '4 weeks', status: 'pending', payment: 31250 }
      ],
      riskFactors: [
        'Limited customization may not meet all requirements',
        'Basic support package may be insufficient',
        'Fewer integrations available'
      ],
      successMetrics: [
        '99.5% system uptime',
        '<3 second page load times',
        '80% user adoption within 45 days',
        '30% reduction in manual processes'
      ],
      feedback: [
        {
          user: 'Sarah Johnson',
          rating: 3,
          comment: 'More budget-friendly but concerned about limited features. Need to evaluate if this meets our long-term needs.',
          timestamp: '2024-01-25'
        }
      ],
      attachments: [
        { name: 'Standard_Implementation_Plan.pdf', size: '2.1 MB', type: 'pdf' },
        { name: 'Feature_Comparison.xlsx', size: '1.2 MB', type: 'excel' }
      ]
    },
    {
      id: 3,
      title: 'CRM Quick Start - Basic Package',
      version: '1.0',
      status: 'rejected',
      value: 85000,
      currency: 'USD',
      submittedBy: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/40/40',
        title: 'Solutions Architect',
        company: 'CRM Experts Inc'
      },
      submittedAt: '2024-01-10',
      updatedAt: '2024-01-12',
      acceptedAt: null,
      timeline: '2 months',
      paymentTerms: 'Upfront payment',
      description: 'Basic CRM setup with minimal customization and limited support.',
      deliverables: [
        'Basic CRM installation',
        'Limited data migration',
        'Minimal training',
        '3-month basic support'
      ],
      milestones: [
        { phase: 'Installation', duration: '1 week', status: 'rejected', payment: 42500 },
        { phase: 'Go-Live', duration: '3 weeks', status: 'rejected', payment: 42500 }
      ],
      riskFactors: [
        'Insufficient features for enterprise needs',
        'Limited support duration',
        'No advanced integrations'
      ],
      successMetrics: [
        'Basic system functionality',
        'Minimal user training'
      ],
      feedback: [
        {
          user: 'Sarah Johnson',
          rating: 2,
          comment: 'Too basic for our needs. Lacks essential features and adequate support duration.',
          timestamp: '2024-01-12'
        }
      ],
      attachments: [
        { name: 'Basic_Package_Overview.pdf', size: '1.5 MB', type: 'pdf' }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-trust-green text-white'
      case 'under-review':
        return 'bg-attention-orange text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      case 'draft':
        return 'bg-slate-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4" />
      case 'under-review':
        return <Clock className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'draft':
        return <Edit className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const selectedProposalData = proposals.find(p => p.id === selectedProposal)
  const activeProposal = proposals.find(p => p.status === 'accepted')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Proposals Header */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-stackmatch-blue" />
                <h2 className="text-xl font-semibold text-stackmatch-navy">Proposal Management</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-stackmatch-blue/10 text-stackmatch-blue">
                  {proposals.length} proposals
                </Badge>
                <Badge className="bg-trust-green text-white">
                  1 accepted
                </Badge>
                <Badge className="bg-attention-orange text-white">
                  1 under review
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
                <Input placeholder="Search proposals..." className="pl-10 w-64" />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Compare
              </Button>
              
              <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                <Plus className="w-4 h-4 mr-2" />
                Counter-Offer
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-trust-green">$175K</div>
              <div className="text-sm text-medium-gray">Accepted Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-stackmatch-blue">6</div>
              <div className="text-sm text-medium-gray">Months Timeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-attention-orange">4</div>
              <div className="text-sm text-medium-gray">Milestones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-information-blue">4.5</div>
              <div className="text-sm text-medium-gray">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposals List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-stackmatch-navy">All Proposals</h3>
          
          {proposals.map((proposal) => (
            <Card 
              key={proposal.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedProposal === proposal.id 
                  ? 'border-stackmatch-blue shadow-md' 
                  : 'border-slate-200'
              }`}
              onClick={() => setSelectedProposal(proposal.id)}
            >
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-stackmatch-navy truncate">
                          {proposal.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          v{proposal.version}
                        </Badge>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(proposal.status)}`}>
                        {getStatusIcon(proposal.status)}
                        <span className="ml-1">{proposal.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-medium-gray">Value:</span>
                      <span className="font-semibold text-trust-green">
                        ${proposal.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-medium-gray">Timeline:</span>
                      <span className="font-medium">{proposal.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-medium-gray">Updated:</span>
                      <span className="font-medium">{proposal.updatedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={proposal.submittedBy.avatar} />
                      <AvatarFallback>{proposal.submittedBy.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-medium-gray">
                      by {proposal.submittedBy.name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Proposal Details */}
        <div className="lg:col-span-2">
          {selectedProposalData && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3">
                      {selectedProposalData.title}
                      <Badge variant="outline">v{selectedProposalData.version}</Badge>
                      <Badge className={getStatusColor(selectedProposalData.status)}>
                        {getStatusIcon(selectedProposalData.status)}
                        <span className="ml-1">{selectedProposalData.status.replace('-', ' ')}</span>
                      </Badge>
                    </CardTitle>
                    <p className="text-medium-gray">{selectedProposalData.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-trust-green/5 rounded-lg">
                    <DollarSign className="w-6 h-6 text-trust-green mx-auto mb-2" />
                    <div className="text-xl font-bold text-trust-green">
                      ${selectedProposalData.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-medium-gray">Total Value</div>
                  </div>
                  
                  <div className="text-center p-4 bg-stackmatch-blue/5 rounded-lg">
                    <Calendar className="w-6 h-6 text-stackmatch-blue mx-auto mb-2" />
                    <div className="text-xl font-bold text-stackmatch-blue">
                      {selectedProposalData.timeline}
                    </div>
                    <div className="text-sm text-medium-gray">Timeline</div>
                  </div>
                  
                  <div className="text-center p-4 bg-attention-orange/5 rounded-lg">
                    <Target className="w-6 h-6 text-attention-orange mx-auto mb-2" />
                    <div className="text-xl font-bold text-attention-orange">
                      {selectedProposalData.milestones.length}
                    </div>
                    <div className="text-sm text-medium-gray">Milestones</div>
                  </div>
                  
                  <div className="text-center p-4 bg-information-blue/5 rounded-lg">
                    <Star className="w-6 h-6 text-information-blue mx-auto mb-2" />
                    <div className="text-xl font-bold text-information-blue">
                      {selectedProposalData.feedback.length > 0 
                        ? (selectedProposalData.feedback.reduce((acc, f) => acc + f.rating, 0) / selectedProposalData.feedback.length).toFixed(1)
                        : 'N/A'
                      }
                    </div>
                    <div className="text-sm text-medium-gray">Avg Rating</div>
                  </div>
                </div>

                <Separator />

                {/* Submitted By */}
                <div>
                  <h4 className="font-semibold text-stackmatch-navy mb-3">Submitted By</h4>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedProposalData.submittedBy.avatar} />
                      <AvatarFallback>{selectedProposalData.submittedBy.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-stackmatch-navy">
                        {selectedProposalData.submittedBy.name}
                      </div>
                      <div className="text-sm text-medium-gray">
                        {selectedProposalData.submittedBy.title}
                      </div>
                      <div className="text-sm text-medium-gray">
                        {selectedProposalData.submittedBy.company}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="font-semibold text-stackmatch-navy mb-3">Project Milestones</h4>
                  <div className="space-y-3">
                    {selectedProposalData.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.status === 'completed' 
                            ? 'bg-trust-green text-white' 
                            : milestone.status === 'in-progress'
                            ? 'bg-attention-orange text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}>
                          {milestone.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : milestone.status === 'in-progress' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <div className="w-2 h-2 bg-current rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium text-stackmatch-navy">
                            {milestone.phase}
                          </div>
                          <div className="text-sm text-medium-gray">
                            {milestone.duration} • ${milestone.payment.toLocaleString()}
                          </div>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className={
                            milestone.status === 'completed' 
                              ? 'border-trust-green text-trust-green'
                              : milestone.status === 'in-progress'
                              ? 'border-attention-orange text-attention-orange'
                              : 'border-slate-300 text-slate-600'
                          }
                        >
                          {milestone.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedProposalData.status === 'under-review' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <Button className="bg-trust-green hover:bg-success-green">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept Proposal
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Request Changes
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask Questions
                    </Button>
                  </div>
                )}

                {selectedProposalData.status === 'accepted' && (
                  <div className="p-4 bg-trust-green/5 border border-trust-green/20 rounded-lg">
                    <div className="flex items-center gap-2 text-trust-green mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Proposal Accepted</span>
                    </div>
                    <p className="text-sm text-medium-gray">
                      This proposal was accepted on {selectedProposalData.acceptedAt}. 
                      Project is now in progress.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}