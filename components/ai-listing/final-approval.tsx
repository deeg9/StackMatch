'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Send,
  CheckCircle,
  Clock,
  Users,
  Building2,
  Zap,
  Shield,
  DollarSign,
  Calendar,
  ArrowLeft,
  FileText,
  Globe
} from "lucide-react"

interface FinalApprovalProps {
  rfqData: any
  categoryName: string
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
}

export default function FinalApproval({ rfqData, categoryName, onSubmit, onBack, isSubmitting = false }: FinalApprovalProps) {
  const [showPreview, setShowPreview] = useState(false)

  const getCompletionStats = () => {
    let totalFields = 0
    let completedFields = 0

    // Count core requirements
    if (rfqData.coreRequirements) {
      totalFields += 3
      if (rfqData.coreRequirements.employeeCount) completedFields++
      if (rfqData.coreRequirements.features?.length > 0) completedFields++
      if (rfqData.coreRequirements.integrations?.length > 0) completedFields++
    }

    // Count technical specs
    if (rfqData.technicalSpecs) {
      totalFields += 4
      if (rfqData.technicalSpecs.deployment) completedFields++
      if (rfqData.technicalSpecs.scalability) completedFields++
      if (rfqData.technicalSpecs.security?.length > 0) completedFields++
      if (rfqData.technicalSpecs.dataRequirements) completedFields++
    }

    // Count project details
    if (rfqData.projectDetails) {
      totalFields += 4
      if (rfqData.projectDetails.timeline) completedFields++
      if (rfqData.projectDetails.budget?.min > 0) completedFields++
      if (rfqData.projectDetails.priority) completedFields++
      if (rfqData.projectDetails.successMetrics?.length > 0) completedFields++
    }

    // Count business context
    if (rfqData.businessContext) {
      totalFields += 4
      if (rfqData.businessContext.industry) completedFields++
      if (rfqData.businessContext.currentPain) completedFields++
      if (rfqData.businessContext.expectedOutcomes) completedFields++
      if (rfqData.businessContext.stakeholders?.length > 0) completedFields++
    }

    return { totalFields, completedFields, percentage: Math.round((completedFields / totalFields) * 100) }
  }

  const stats = getCompletionStats()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* AI Confirmation Message */}
      <div className="text-center space-y-6 animate-fade-in">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-[#1A2B4C]">Perfect! Your RFQ is Complete</h1>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Your professional {categoryName.toLowerCase()} RFQ is ready to be sent to our network of verified vendors. 
            This comprehensive document will help you receive the most relevant and competitive proposals.
          </p>
        </div>

        {/* Completion Stats */}
        <div className="flex items-center justify-center space-x-8 py-6 px-8 bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] rounded-lg border border-[#22C55E]">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#22C55E]">{stats.percentage}%</div>
            <div className="text-sm text-[#6B7280]">Complete</div>
          </div>
          <div className="w-px h-12 bg-[#D1D5DB]"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#22C55E]">{stats.completedFields}</div>
            <div className="text-sm text-[#6B7280]">of {stats.totalFields} sections</div>
          </div>
          <div className="w-px h-12 bg-[#D1D5DB]"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#22C55E]">5-10</div>
            <div className="text-sm text-[#6B7280]">Expected proposals</div>
          </div>
        </div>
      </div>

      {/* RFQ Summary */}
      <Card className="border-2 border-[#E5E7EB] animate-slide-up" style={{animationDelay: '0.1s'}}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#1A2B4C]">
            <FileText className="h-5 w-5 text-[#4A73CC]" />
            <span>RFQ Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Requirements */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-[#4A73CC]" />
                <h4 className="font-semibold text-[#1A2B4C]">Core Requirements</h4>
              </div>
              <div className="space-y-2 text-sm text-[#6B7280]">
                <p><span className="font-medium">Company Size:</span> {rfqData.coreRequirements?.employeeCount}</p>
                <p><span className="font-medium">Features:</span> {rfqData.coreRequirements?.features?.length || 0} selected</p>
                <p><span className="font-medium">Integrations:</span> {rfqData.coreRequirements?.integrations?.length || 0} required</p>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-[#4A73CC]" />
                <h4 className="font-semibold text-[#1A2B4C]">Technical Specs</h4>
              </div>
              <div className="space-y-2 text-sm text-[#6B7280]">
                <p><span className="font-medium">Deployment:</span> {rfqData.technicalSpecs?.deployment}</p>
                <p><span className="font-medium">Security:</span> {rfqData.technicalSpecs?.security?.length || 0} requirements</p>
                <p><span className="font-medium">Data Needs:</span> {rfqData.technicalSpecs?.dataRequirements ? 'Specified' : 'Not specified'}</p>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-[#4A73CC]" />
                <h4 className="font-semibold text-[#1A2B4C]">Project Details</h4>
              </div>
              <div className="space-y-2 text-sm text-[#6B7280]">
                <p><span className="font-medium">Timeline:</span> {rfqData.projectDetails?.timeline}</p>
                <p><span className="font-medium">Budget:</span> ${rfqData.projectDetails?.budget?.min?.toLocaleString()} - ${rfqData.projectDetails?.budget?.max?.toLocaleString()}</p>
                <p><span className="font-medium">Priority:</span> {rfqData.projectDetails?.priority}</p>
              </div>
            </div>

            {/* Business Context */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-[#4A73CC]" />
                <h4 className="font-semibold text-[#1A2B4C]">Business Context</h4>
              </div>
              <div className="space-y-2 text-sm text-[#6B7280]">
                <p><span className="font-medium">Industry:</span> {rfqData.businessContext?.industry}</p>
                <p><span className="font-medium">Stakeholders:</span> {rfqData.businessContext?.stakeholders?.length || 0} identified</p>
                <p><span className="font-medium">Pain Points:</span> {rfqData.businessContext?.currentPain ? 'Documented' : 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Preview Button */}
          <div className="pt-4 border-t border-[#E5E7EB]">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="border-[#D1D5DB] text-[#6B7280] hover:text-[#4A73CC] hover:border-[#4A73CC]"
            >
              <FileText className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide' : 'Preview'} Full RFQ Document
            </Button>
          </div>

          {/* Full Preview */}
          {showPreview && (
            <div className="bg-[#F9FAFB] p-6 rounded-lg border border-[#E5E7EB] space-y-4 mt-4">
              <h5 className="font-semibold text-[#1A2B4C] mb-4">Complete RFQ Document Preview</h5>
              
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <h6 className="font-medium text-[#1A2B4C] mb-2">Selected Features:</h6>
                  <div className="flex flex-wrap gap-2">
                    {rfqData.coreRequirements?.features?.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-[#E5E7EB] text-[#374151]">
                        {feature}
                      </Badge>
                    )) || <span className="text-[#6B7280]">None selected</span>}
                  </div>
                </div>

                <div>
                  <h6 className="font-medium text-[#1A2B4C] mb-2">Required Integrations:</h6>
                  <div className="flex flex-wrap gap-2">
                    {rfqData.coreRequirements?.integrations?.map((integration: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-[#E5E7EB] text-[#374151]">
                        {integration}
                      </Badge>
                    )) || <span className="text-[#6B7280]">None specified</span>}
                  </div>
                </div>

                <div>
                  <h6 className="font-medium text-[#1A2B4C] mb-2">Security Requirements:</h6>
                  <div className="flex flex-wrap gap-2">
                    {rfqData.technicalSpecs?.security?.map((requirement: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-[#E5E7EB] text-[#374151]">
                        {requirement}
                      </Badge>
                    )) || <span className="text-[#6B7280]">None specified</span>}
                  </div>
                </div>

                <div>
                  <h6 className="font-medium text-[#1A2B4C] mb-2">Success Metrics:</h6>
                  <div className="flex flex-wrap gap-2">
                    {rfqData.projectDetails?.successMetrics?.map((metric: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-[#E5E7EB] text-[#374151]">
                        {metric}
                      </Badge>
                    )) || <span className="text-[#6B7280]">None defined</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="border-2 border-[#3B82F6] bg-gradient-to-r from-[#EFF6FF] to-[#F0F9FF] animate-slide-up" style={{animationDelay: '0.2s'}}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-[#1A2B4C]">What happens next?</h4>
              <div className="space-y-3 text-sm text-[#6B7280]">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A2B4C]">Immediate Distribution</p>
                    <p>Your RFQ will be instantly distributed to our network of pre-verified {categoryName.toLowerCase()} vendors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A2B4C]">Smart Vendor Matching</p>
                    <p>Our AI will prioritize vendors who best match your specific requirements and company profile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A2B4C]">Quality Proposals</p>
                    <p>Expect 5-10 detailed, relevant proposals within 48-72 hours from qualified vendors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A2B4C]">Easy Comparison</p>
                    <p>Review and compare all proposals in your StackMatch dashboard with AI-powered insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="border-[#D1D5DB] text-[#6B7280] hover:text-[#4A73CC] hover:border-[#4A73CC]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Review
        </Button>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white px-12 py-4 text-lg font-semibold disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Publishing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Submit Listing to Marketplace</span>
            </div>
          )}
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
        <Card className="border border-[#E5E7EB] text-center p-4">
          <Shield className="h-8 w-8 text-[#22C55E] mx-auto mb-2" />
          <h5 className="font-semibold text-[#1A2B4C] mb-1">Verified Vendors</h5>
          <p className="text-sm text-[#6B7280]">All vendors are pre-screened and verified</p>
        </Card>
        
        <Card className="border border-[#E5E7EB] text-center p-4">
          <Clock className="h-8 w-8 text-[#3B82F6] mx-auto mb-2" />
          <h5 className="font-semibold text-[#1A2B4C] mb-1">Fast Response</h5>
          <p className="text-sm text-[#6B7280]">Receive proposals within 48-72 hours</p>
        </Card>
        
        <Card className="border border-[#E5E7EB] text-center p-4">
          <Sparkles className="h-8 w-8 text-[#F59E0B] mx-auto mb-2" />
          <h5 className="font-semibold text-[#1A2B4C] mb-1">AI-Powered</h5>
          <p className="text-sm text-[#6B7280]">Smart matching for better proposals</p>
        </Card>
      </div>
    </div>
  )
}