'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Building2, Users, Target, Award, HelpCircle } from 'lucide-react'
import type { SellerContext, ListingContext } from '@/types/ai-proposal'

interface IntelligentAnalysisProps {
  listingContext: ListingContext
  onComplete: (context: SellerContext) => void
}

export function IntelligentAnalysis({ listingContext, onComplete }: IntelligentAnalysisProps) {
  const [formData, setFormData] = useState<SellerContext>({
    companyName: 'BiltLocal', // Pre-filled for demo
    industry: 'Construction Technology',
    teamSize: '50-100',
    specializations: ['Project Management', 'Real Estate', 'PropTech'],
    targetMarkets: ['Enterprise', 'Mid-Market'],
    existingClients: '',
    uniqueStrengths: ''
  })

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }))
  }

  const handleTargetMarketToggle = (market: string) => {
    setFormData(prev => ({
      ...prev,
      targetMarkets: prev.targetMarkets.includes(market)
        ? prev.targetMarkets.filter(m => m !== market)
        : [...prev.targetMarkets, market]
    }))
  }

  const handleSubmit = () => {
    onComplete(formData)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Let's Create Your Winning Proposal
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We'll help you craft a compelling response to {listingContext.companyName}'s {listingContext.category} request.
          First, tell us about your company.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <div className="space-y-6">
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Company Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Industry
                    </label>
                    <Input
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g., Software Development, Consulting"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Size
                    </label>
                    <select
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="50-100">50-100 employees</option>
                      <option value="100-500">100-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Areas of Specialization
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {[
                    'CRM Implementation', 'ERP Solutions', 'HR Tech', 'Marketing Automation',
                    'Sales Enablement', 'Data Analytics', 'Cloud Migration', 'Security',
                    'Project Management', 'Real Estate', 'PropTech', 'FinTech'
                  ].map((spec) => (
                    <Badge
                      key={spec}
                      variant={formData.specializations.includes(spec) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleSpecializationToggle(spec)}
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Target Markets */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Target Markets
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {['SMB', 'Mid-Market', 'Enterprise', 'Government', 'Non-Profit'].map((market) => (
                    <Badge
                      key={market}
                      variant={formData.targetMarkets.includes(market) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleTargetMarketToggle(market)}
                    >
                      {market}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Existing Clients */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  Notable Clients (Optional)
                </h3>
                
                <Textarea
                  value={formData.existingClients}
                  onChange={(e) => setFormData({ ...formData, existingClients: e.target.value })}
                  placeholder="List any notable clients or similar projects you've completed..."
                  rows={3}
                />
              </div>

              {/* Unique Strengths */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What makes your solution unique? (Optional)
                </label>
                <Textarea
                  value={formData.uniqueStrengths}
                  onChange={(e) => setFormData({ ...formData, uniqueStrengths: e.target.value })}
                  placeholder="Describe your unique value proposition, differentiators, or special expertise..."
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                Analyze & Create Proposal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar - RFQ Context */}
        <div className="lg:col-span-1 space-y-6">
          {/* RFQ Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Responding to:
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium text-gray-900">{listingContext.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <p className="font-medium text-gray-900">{listingContext.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{listingContext.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium text-gray-900">{listingContext.budget}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timeline</p>
                <p className="font-medium text-gray-900">{listingContext.timeline}</p>
              </div>
            </div>
          </Card>

          {/* AI Assistant Tips */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  AI Assistant Tips
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Be specific about your specializations - it helps us match your strengths to their needs</p>
                  <p>• Include any relevant certifications or partnerships</p>
                  <p>• Mention similar projects you've completed successfully</p>
                  <p>• We'll use this information to create a tailored proposal that highlights your best fit</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Indicator */}
          <Card className="p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Proposal Creation Process
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Intelligent Analysis</p>
                  <p className="text-xs text-gray-500">Tell us about your company</p>
                </div>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">AI Processing</p>
                  <p className="text-xs text-gray-500">Generate proposal framework</p>
                </div>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Review & Edit</p>
                  <p className="text-xs text-gray-500">Perfect your proposal</p>
                </div>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Submit</p>
                  <p className="text-xs text-gray-500">Send to buyer</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}