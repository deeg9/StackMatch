'use client'

import { CheckCircle2, XCircle, AlertCircle, Link2, FileText, MessageSquare } from 'lucide-react'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { AIGeneratedRFQ } from '@/types/ai-listing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SolutionAlignmentTabProps {
  proposal: AIGeneratedProposal
  buyerRequirements: AIGeneratedRFQ
}

export function SolutionAlignmentTab({ 
  proposal, 
  buyerRequirements 
}: SolutionAlignmentTabProps) {
  
  const getSupportLevelIcon = (level: string) => {
    switch (level) {
      case 'fully':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'not-supported':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'via-integration':
        return <Link2 className="w-5 h-5 text-blue-600" />
      default:
        return null
    }
  }

  const getSupportLevelBadge = (level: string) => {
    const variants = {
      'fully': 'bg-green-100 text-green-700',
      'partial': 'bg-yellow-100 text-yellow-700',
      'not-supported': 'bg-red-100 text-red-700',
      'via-integration': 'bg-blue-100 text-blue-700'
    }
    
    const labels = {
      'fully': 'Fully Supported',
      'partial': 'Partially Supported',
      'not-supported': 'Not Supported',
      'via-integration': 'Via Integration'
    }
    
    return (
      <Badge className={variants[level as keyof typeof variants] || ''}>
        {labels[level as keyof typeof labels] || level}
      </Badge>
    )
  }

  const getIntegrationTypeBadge = (type: string) => {
    const variants = {
      'pre-built': 'bg-green-100 text-green-700',
      'api-custom': 'bg-blue-100 text-blue-700',
      'third-party': 'bg-purple-100 text-purple-700',
      'not-supported': 'bg-red-100 text-red-700'
    }
    
    const labels = {
      'pre-built': 'Pre-Built',
      'api-custom': 'API/Custom',
      'third-party': 'Third-Party',
      'not-supported': 'Not Supported'
    }
    
    return (
      <Badge className={variants[type as keyof typeof variants] || ''}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Feature Alignment</TabsTrigger>
          <TabsTrigger value="integrations">Integration Capabilities</TabsTrigger>
          <TabsTrigger value="custom">Custom Responses</TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4 mt-6">
          <div className="space-y-4">
            {/* Map buyer requirements to vendor responses */}
            {buyerRequirements.coreRequirements.features.map((feature, index) => {
              const vendorResponse = proposal.solutionAlignment.features.find(
                f => f.featureName === feature
              ) || {
                featureName: feature,
                supportLevel: 'not-supported' as const,
                approach: 'Not addressed in proposal',
                benefits: 'N/A'
              }

              return (
                <Card key={index} className="overflow-hidden">
                  <div className="grid grid-cols-2 divide-x">
                    {/* Buyer's Requirement */}
                    <div className="p-6 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Buyer's Requirement</h4>
                        <Badge variant="outline">Required</Badge>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">{feature}</p>
                      <p className="text-sm text-gray-600">
                        Core feature requirement for the HR management system
                      </p>
                    </div>

                    {/* Seller's Response */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Seller's Response</h4>
                        {getSupportLevelBadge(vendorResponse.supportLevel)}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          {getSupportLevelIcon(vendorResponse.supportLevel)}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{vendorResponse.featureName}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Approach:</p>
                          <p className="text-sm text-gray-600">{vendorResponse.approach}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Key Benefits:</p>
                          <p className="text-sm text-gray-600">{vendorResponse.benefits}</p>
                        </div>

                        {vendorResponse.evidence && vendorResponse.evidence.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Evidence:</p>
                            <div className="flex gap-2">
                              {vendorResponse.evidence.map((ev, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {ev.type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4 mt-6">
          <div className="space-y-4">
            {buyerRequirements.coreRequirements.integrations.map((integration, index) => {
              const vendorResponse = proposal.solutionAlignment.integrations.find(
                i => i.integrationName === integration
              ) || {
                integrationName: integration,
                integrationType: 'not-supported' as const,
                details: 'Integration not addressed in proposal'
              }

              return (
                <Card key={index} className="overflow-hidden">
                  <div className="grid grid-cols-2 divide-x">
                    {/* Buyer's Requirement */}
                    <div className="p-6 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Required Integration</h4>
                        <Badge variant="outline">Required</Badge>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">{integration}</p>
                      <p className="text-sm text-gray-600">
                        Must integrate with existing system infrastructure
                      </p>
                    </div>

                    {/* Seller's Response */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Integration Capability</h4>
                        {getIntegrationTypeBadge(vendorResponse.integrationType)}
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-medium text-gray-900">{vendorResponse.integrationName}</p>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Implementation Details:</p>
                          <p className="text-sm text-gray-600">{vendorResponse.details}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Custom Responses Tab */}
        <TabsContent value="custom" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Responses to Additional Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {proposal.customResponses.responses.map((response) => (
                  <div key={response.questionId} className="border-b pb-4 last:border-0">
                    <h4 className="font-medium text-gray-900 mb-2">{response.question}</h4>
                    <div className="pl-4 border-l-2 border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{response.answer}</p>
                    </div>
                  </div>
                ))}

                {/* Evaluation Criteria Alignment */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Alignment with Evaluation Criteria
                  </h4>
                  <div className="pl-4 border-l-2 border-blue-500">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {proposal.customResponses.evaluationCriteriaAlignment}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-green-600">
                {proposal.solutionAlignment.features.filter(f => f.supportLevel === 'fully').length}
              </div>
              <p className="text-sm text-gray-600">Fully Supported</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-yellow-600">
                {proposal.solutionAlignment.features.filter(f => f.supportLevel === 'partial').length}
              </div>
              <p className="text-sm text-gray-600">Partially Supported</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-blue-600">
                {proposal.solutionAlignment.features.filter(f => f.supportLevel === 'via-integration').length}
              </div>
              <p className="text-sm text-gray-600">Via Integration</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-red-600">
                {proposal.solutionAlignment.features.filter(f => f.supportLevel === 'not-supported').length}
              </div>
              <p className="text-sm text-gray-600">Not Supported</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}