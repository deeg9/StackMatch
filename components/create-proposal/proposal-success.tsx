'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  Clock, 
  MessageSquare, 
  FileText,
  Building2,
  Calendar,
  Users,
  Home,
  Copy,
  Share2,
  Sparkles
} from 'lucide-react'
import type { AIGeneratedProposal, ListingContext } from '@/types/ai-proposal'

interface ProposalSuccessProps {
  proposalData: AIGeneratedProposal
  listingContext: ListingContext
}

export function ProposalSuccess({ proposalData, listingContext }: ProposalSuccessProps) {
  const router = useRouter()
  
  const nextSteps = [
    {
      icon: Clock,
      title: 'Wait for Buyer Response',
      description: `${listingContext.companyName} typically responds within 2-3 business days`,
      timing: '2-3 days'
    },
    {
      icon: MessageSquare,
      title: 'Check Your Messages',
      description: 'The buyer may reach out with clarifying questions',
      timing: 'Ongoing'
    },
    {
      icon: Calendar,
      title: 'Schedule Initial Meeting',
      description: 'Be prepared for a discovery call if selected',
      timing: '1 week'
    },
    {
      icon: FileText,
      title: 'Prepare Supporting Materials',
      description: 'Have demos, case studies, and references ready',
      timing: 'As needed'
    }
  ]

  const handleGoToDashboard = () => {
    router.push('/seller/dashboard')
  }

  const handleViewProposal = () => {
    // Would navigate to proposal view page
    console.log('View proposal:', proposalData.id)
  }

  const handleCreateAnother = () => {
    router.push('/browse-listings')
  }

  const handleShare = () => {
    // Share functionality
    navigator.clipboard.writeText(`Proposal submitted for ${listingContext.title}`)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Proposal Successfully Submitted!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Your proposal has been sent to {listingContext.companyName}. They'll review it and get back to you soon.
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">Match Score: <strong className="text-gray-900">{proposalData.overallMatchScore}%</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Sent to: <strong className="text-gray-900">{listingContext.companyName}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Submitted: <strong className="text-gray-900">Just now</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Proposal Summary Card */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">
                {proposalData.basicDetails?.proposalTitle}
              </h2>
              <div className="flex items-center space-x-4 text-green-100">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Proposal #{proposalData.id.slice(-6).toUpperCase()}
                </Badge>
                <span className="flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  {listingContext.companyName}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What Happens Next?
              </h3>
              
              <div className="space-y-4">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{step.title}</h4>
                          <span className="text-sm text-gray-500">{step.timing}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-4">
                  💡 <strong>Pro Tip:</strong> While you wait, make sure your team is aligned on the proposed solution and pricing. The buyer may have follow-up questions.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Primary Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Actions
            </h3>
            <div className="space-y-3">
              <Button 
                onClick={handleViewProposal}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Full Proposal
              </Button>
              
              <Button 
                onClick={handleShare}
                variant="outline"
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share with Team
              </Button>
              
              <Button 
                onClick={handleGoToDashboard}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </Card>

          {/* Proposal Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Proposal Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Proposal ID</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-mono text-sm text-gray-900">
                    #{proposalData.id.slice(-6).toUpperCase()}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(proposalData.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Submitted to</p>
                <p className="font-medium text-gray-900">{listingContext.companyName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <p className="font-medium text-gray-900">{listingContext.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Your Contact</p>
                <p className="font-medium text-gray-900">{proposalData.basicDetails?.contactPerson.name}</p>
                <p className="text-sm text-gray-600">{proposalData.basicDetails?.contactPerson.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Proposed Budget</p>
                <p className="font-medium text-gray-900">
                  ${(proposalData.pricingScoping?.totalProposedCost || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Success Tips */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Increase Your Success Rate
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Respond to buyer messages within 2 hours</li>
                  <li>• Have a demo environment ready to show</li>
                  <li>• Prepare customer references in advance</li>
                  <li>• Follow up if you don't hear back in 5 days</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ready to Submit More Proposals?
        </h3>
        <p className="text-gray-600 mb-4">
          Browse other opportunities that match your expertise
        </p>
        <Button 
          onClick={handleCreateAnother}
          variant="outline"
          className="inline-flex items-center"
        >
          Browse More Listings
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}