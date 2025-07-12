'use client'

import { 
  Shield, 
  Cloud, 
  TrendingUp, 
  Database, 
  Server, 
  Clock,
  Lock,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TechnicalSecurityTabProps {
  proposal: AIGeneratedProposal
}

export function TechnicalSecurityTab({ proposal }: TechnicalSecurityTabProps) {
  return (
    <div className="space-y-6">
      {/* Deployment Approach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            Deployment Approach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {proposal.technicalSecurity.deploymentApproach}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Scalability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Scalability & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {proposal.technicalSecurity.scalabilityResponse}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Security Features & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposal.technicalSecurity.securityFeatures.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{feature.feature}</h4>
                    <p className="text-sm text-gray-600">{feature.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Migration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-600" />
            Data Migration Approach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {proposal.technicalSecurity.dataMigrationApproach}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            System Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {proposal.technicalSecurity.architectureOverview}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SLA Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Service Level Agreement (SLA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {proposal.technicalSecurity.slaDetails}
            </p>
          </div>
          
          {proposal.technicalSecurity.slaUrl && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                asChild
              >
                <a
                  href={proposal.technicalSecurity.slaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full SLA Document
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Requirements Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Requirements Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Cloud-based (SaaS)</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">100% Growth Scalability</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">SSO/SAML Support</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Multi-Factor Authentication</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Role-based Access Control</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Data Encryption</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">SOC 2 Type II</p>
              <Badge variant="secondary" className="mt-1 text-xs">Verified</Badge>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">ISO 27001</p>
              <Badge variant="secondary" className="mt-1 text-xs">Verified</Badge>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">GDPR</p>
              <Badge variant="secondary" className="mt-1 text-xs">Compliant</Badge>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">HIPAA</p>
              <Badge variant="secondary" className="mt-1 text-xs">Available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}