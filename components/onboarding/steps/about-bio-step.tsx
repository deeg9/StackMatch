'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Plus, X, Target, Building2 } from 'lucide-react'

interface AboutBioData {
  bio: string
  specializations: string[]
  industries: string[]
}

interface AboutBioStepProps {
  data: AboutBioData
  onUpdate: (data: AboutBioData) => void
  onNext: () => void
  onPrev: () => void
  userType: 'buyer' | 'seller' | 'consultant'
}

const commonSpecializations = {
  buyer: [
    'Software Procurement', 'Vendor Management', 'Technology Strategy', 'Digital Transformation',
    'Budget Planning', 'Contract Negotiation', 'Compliance Management', 'Risk Assessment'
  ],
  seller: [
    'Web Development', 'Mobile Development', 'Cloud Solutions', 'Data Analytics',
    'CRM Implementation', 'E-commerce', 'API Development', 'DevOps', 'UI/UX Design',
    'Cybersecurity', 'AI/Machine Learning', 'Blockchain'
  ],
  consultant: [
    'Technology Advisory', 'Digital Strategy', 'Change Management', 'Process Optimization',
    'Vendor Selection', 'Implementation Planning', 'Training & Support', 'Risk Management'
  ]
}

const commonIndustries = [
  'Technology', 'Healthcare', 'Financial Services', 'E-commerce', 'Manufacturing',
  'Education', 'Real Estate', 'Media & Entertainment', 'Government', 'Non-profit',
  'Retail', 'Transportation', 'Energy', 'Agriculture', 'Hospitality'
]

export default function AboutBioStep({ 
  data, 
  onUpdate, 
  onNext, 
  onPrev, 
  userType 
}: AboutBioStepProps) {
  const [formData, setFormData] = useState<AboutBioData>(data)
  const [newSpecialization, setNewSpecialization] = useState('')
  const [newIndustry, setNewIndustry] = useState('')

  const handleChange = (field: keyof AboutBioData, value: string | string[]) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onUpdate(newData)
  }

  const addSpecialization = (spec: string) => {
    if (spec.trim() && !formData.specializations.includes(spec.trim())) {
      const newSpecs = [...formData.specializations, spec.trim()]
      handleChange('specializations', newSpecs)
      setNewSpecialization('')
    }
  }

  const removeSpecialization = (spec: string) => {
    const newSpecs = formData.specializations.filter(s => s !== spec)
    handleChange('specializations', newSpecs)
  }

  const addIndustry = (industry: string) => {
    if (industry.trim() && !formData.industries.includes(industry.trim())) {
      const newIndustries = [...formData.industries, industry.trim()]
      handleChange('industries', newIndustries)
      setNewIndustry('')
    }
  }

  const removeIndustry = (industry: string) => {
    const newIndustries = formData.industries.filter(i => i !== industry)
    handleChange('industries', newIndustries)
  }

  const getBioPlaceholder = () => {
    switch (userType) {
      case 'buyer':
        return "Share your background in technology procurement, your company's needs, and what you're looking for in service providers. For example: 'I lead technology initiatives at a growing fintech company. I specialize in evaluating and implementing SaaS solutions that drive operational efficiency and support our scaling business needs.'"
      case 'seller':
        return "Describe your expertise, experience, and what makes you unique. Highlight your key skills and the value you bring to clients. For example: 'I'm a full-stack developer with 8 years of experience building scalable web applications. I specialize in React, Node.js, and cloud infrastructure, helping startups and enterprises launch and scale their digital products.'"
      case 'consultant':
        return "Explain your consulting expertise and how you help businesses succeed. Share your approach and unique perspective. For example: 'I help mid-market companies navigate complex technology decisions. With 10+ years in both corporate IT and consulting, I bridge the gap between business needs and technical solutions.'"
      default:
        return "Tell us about your professional background and expertise..."
    }
  }

  const getSpecializationLabel = () => {
    switch (userType) {
      case 'buyer': return 'Your Areas of Focus'
      case 'seller': return 'Your Service Specializations'
      case 'consultant': return 'Your Consulting Specializations'
      default: return 'Your Specializations'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] rounded-lg flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#1A2B4C]">Tell us about yourself</h2>
        <p className="text-gray-600">
          Help others understand your background and expertise
        </p>
      </div>

      <div className="space-y-8">
        {/* Professional Bio */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="bio" className="text-lg font-semibold text-[#1A2B4C] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Professional Bio
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Write a compelling summary that showcases your experience and expertise
              </p>
            </div>

            <Textarea
              id="bio"
              placeholder={getBioPlaceholder()}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={6}
              className="resize-none"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>Tip: Aim for 2-3 sentences that highlight your key strengths</span>
              <span>{formData.bio.length}/500 characters</span>
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] flex items-center gap-2">
                <Target className="w-5 h-5" />
                {getSpecializationLabel()}
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select or add the areas where you have expertise
              </p>
            </div>

            {/* Current Specializations */}
            {formData.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.specializations.map((spec, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#4A73CC]/10 text-[#4A73CC] pr-1 flex items-center gap-1"
                  >
                    {spec}
                    <button
                      onClick={() => removeSpecialization(spec)}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Common Specializations */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Popular options:</p>
              <div className="flex flex-wrap gap-2">
                {commonSpecializations[userType]
                  .filter(spec => !formData.specializations.includes(spec))
                  .slice(0, 8)
                  .map((spec, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-[#4A73CC]/10 hover:text-[#4A73CC] hover:border-[#4A73CC]"
                      onClick={() => addSpecialization(spec)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {spec}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Add Custom Specialization */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom specialization..."
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSpecialization(newSpecialization)
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => addSpecialization(newSpecialization)}
                disabled={!newSpecialization.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Industry Focus */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Industry Focus
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                {userType === 'buyer' 
                  ? 'What industries does your company operate in?'
                  : 'Which industries do you have experience working with?'
                }
              </p>
            </div>

            {/* Current Industries */}
            {formData.industries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.industries.map((industry, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#22C55E]/10 text-[#22C55E] pr-1 flex items-center gap-1"
                  >
                    {industry}
                    <button
                      onClick={() => removeIndustry(industry)}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Common Industries */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Select relevant industries:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonIndustries
                  .filter(industry => !formData.industries.includes(industry))
                  .map((industry, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-[#22C55E]/10 hover:text-[#22C55E] hover:border-[#22C55E] text-center justify-center"
                      onClick={() => addIndustry(industry)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {industry}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Add Custom Industry */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom industry..."
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addIndustry(newIndustry)
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => addIndustry(newIndustry)}
                disabled={!newIndustry.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-0 bg-gradient-to-r from-[#4A73CC]/10 to-[#22C55E]/10">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[#1A2B4C] mb-3 flex items-center gap-2">
              <div className="w-5 h-5 bg-[#4A73CC] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">💡</span>
              </div>
              Writing tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <p className="font-medium">Professional Bio:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Focus on your key achievements and expertise</li>
                  <li>• Mention specific technologies or methodologies</li>
                  <li>• Keep it conversational but professional</li>
                  <li>• Highlight what makes you unique</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Specializations & Industries:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Be specific rather than generic</li>
                  <li>• Include both technical and business areas</li>
                  <li>• Think about your ideal clients or projects</li>
                  <li>• You can always add more later</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}