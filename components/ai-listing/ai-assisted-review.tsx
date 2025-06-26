'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Edit3,
  MessageCircle,
  Users,
  DollarSign,
  Calendar,
  Building2,
  Shield,
  Zap
} from "lucide-react"

interface AIAssistedReviewProps {
  categoryName: string
  aiGeneratedData: AIGeneratedRFQ
  onComplete: (finalData: AIGeneratedRFQ) => void
}

interface AIGeneratedRFQ {
  coreRequirements: {
    employeeCount: string
    features: string[]
    integrations: string[]
    complianceNeeds: string[]
  }
  technicalSpecs: {
    deployment: string
    scalability: string
    security: string[]
    dataRequirements: string
  }
  projectDetails: {
    timeline: string
    budget: {
      min: number
      max: number
    }
    priority: string
    successMetrics: string[]
  }
  businessContext: {
    industry: string
    currentPain: string
    expectedOutcomes: string
    stakeholders: string[]
  }
}

interface ChatMessage {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  actionButton?: {
    text: string
    onClick: () => void
  }
}

export default function AIAssistedReview({ categoryName, aiGeneratedData, onComplete }: AIAssistedReviewProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<AIGeneratedRFQ>(aiGeneratedData)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const sections = [
    {
      id: 'core',
      title: 'Core Requirements',
      icon: <Building2 className="h-5 w-5" />,
      description: 'Essential features and capabilities needed'
    },
    {
      id: 'technical',
      title: 'Technical Specifications',
      icon: <Zap className="h-5 w-5" />,
      description: 'Technical requirements and constraints'
    },
    {
      id: 'project',
      title: 'Project Details',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Timeline, budget, and success criteria'
    },
    {
      id: 'business',
      title: 'Business Context',
      icon: <Users className="h-5 w-5" />,
      description: 'Industry context and stakeholder information'
    }
  ]

  const aiMessages = [
    {
      section: 0,
      content: "Perfect! I've created a comprehensive draft based on your information. Let's review it together to make sure everything is accurate. First, let's look at the core requirements. Based on your company context, I've pre-selected these features. Does this look right to you?",
    },
    {
      section: 1,
      content: "Great! Now for the technical specifications. I've analyzed your current setup and suggested deployment preferences and security requirements. Please review these technical details and let me know if anything needs adjustment.",
    },
    {
      section: 2,
      content: "Excellent! Let's review the project details including timeline and budget. I've estimated these based on industry standards for companies your size. Feel free to adjust any of these parameters.",
    },
    {
      section: 3,
      content: "Almost done! Finally, let's confirm the business context and stakeholder information. This helps vendors understand your organizational structure and decision-making process.",
    }
  ]

  useEffect(() => {
    // Initialize with first AI message
    const firstMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: aiMessages[0].content,
      timestamp: new Date(),
      actionButton: {
        text: 'Looks Good, Next →',
        onClick: handleNextSection
      }
    }
    
    setMessages([firstMessage])
  }, [])

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      const nextSection = currentSection + 1
      setCurrentSection(nextSection)
      
      // Add user response
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: 'Looks good! Let\'s continue.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      
      // Show typing indicator
      setIsTyping(true)
      
      // Add AI response after delay
      setTimeout(() => {
        setIsTyping(false)
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: aiMessages[nextSection].content,
          timestamp: new Date(),
          actionButton: nextSection < sections.length - 1 ? {
            text: 'Looks Good, Next →',
            onClick: handleNextSection
          } : {
            text: 'Perfect, Let\'s Finalize →',
            onClick: handleComplete
          }
        }
        setMessages(prev => [...prev, aiMessage])
      }, 1500)
    }
  }

  const handleComplete = () => {
    const userMessage: ChatMessage = {
      id: `user-final-${Date.now()}`,
      type: 'user',
      content: 'Perfect! I\'m ready to submit this RFQ.',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    
    setTimeout(() => {
      onComplete(formData)
    }, 1000)
  }

  const updateFormData = (section: keyof AIGeneratedRFQ, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const toggleArrayItem = (section: keyof AIGeneratedRFQ, field: string, item: string) => {
    setFormData(prev => {
      const currentArray = (prev[section] as any)[field] as string[]
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item]
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      }
    })
  }

  const renderCurrentSection = () => {
    const section = sections[currentSection]
    
    switch (section.id) {
      case 'core':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Employee Count</Label>
              <Select 
                value={formData.coreRequirements.employeeCount} 
                onValueChange={(value) => updateFormData('coreRequirements', 'employeeCount', value)}
              >
                <SelectTrigger className="border-[#D1D5DB] focus:border-[#4A73CC]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Core HR Features Needed</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Employee Records Management',
                  'Payroll Processing',
                  'Benefits Administration',
                  'Time & Attendance',
                  'Recruitment & Hiring',
                  'Performance Management',
                  'Training & Development',
                  'Compliance Tracking'
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2 p-3 border border-[#E5E7EB] rounded-lg hover:border-[#4A73CC] transition-colors">
                    <Checkbox
                      id={feature}
                      checked={formData.coreRequirements.features.includes(feature)}
                      onCheckedChange={() => toggleArrayItem('coreRequirements', 'features', feature)}
                    />
                    <Label htmlFor={feature} className="text-sm font-medium cursor-pointer">{feature}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Required Integrations</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Existing Payroll System',
                  'Accounting Software',
                  'Email/Calendar (Outlook/Gmail)',
                  'Single Sign-On (SSO)',
                  'Background Check Services',
                  'Benefits Providers',
                  'Learning Management System',
                  'Applicant Tracking System'
                ].map((integration) => (
                  <div key={integration} className="flex items-center space-x-2 p-3 border border-[#E5E7EB] rounded-lg hover:border-[#4A73CC] transition-colors">
                    <Checkbox
                      id={integration}
                      checked={formData.coreRequirements.integrations.includes(integration)}
                      onCheckedChange={() => toggleArrayItem('coreRequirements', 'integrations', integration)}
                    />
                    <Label htmlFor={integration} className="text-sm font-medium cursor-pointer">{integration}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'technical':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Deployment Preference</Label>
              <Select 
                value={formData.technicalSpecs.deployment} 
                onValueChange={(value) => updateFormData('technicalSpecs', 'deployment', value)}
              >
                <SelectTrigger className="border-[#D1D5DB] focus:border-[#4A73CC]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Cloud-based (SaaS)</SelectItem>
                  <SelectItem value="on-premise">On-premise</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Cloud + On-premise)</SelectItem>
                  <SelectItem value="flexible">Flexible - will consider options</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Scalability Requirements</Label>
              <Textarea
                value={formData.technicalSpecs.scalability}
                onChange={(e) => updateFormData('technicalSpecs', 'scalability', e.target.value)}
                placeholder="Describe your expected growth and scalability needs..."
                className="border-[#D1D5DB] focus:border-[#4A73CC] min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Security Requirements</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'SOC 2 Compliance',
                  'GDPR Compliance',
                  'Two-Factor Authentication',
                  'Data Encryption',
                  'Regular Security Audits',
                  'Role-based Access Control',
                  'Audit Trails',
                  'Backup & Recovery'
                ].map((requirement) => (
                  <div key={requirement} className="flex items-center space-x-2 p-3 border border-[#E5E7EB] rounded-lg hover:border-[#4A73CC] transition-colors">
                    <Checkbox
                      id={requirement}
                      checked={formData.technicalSpecs.security.includes(requirement)}
                      onCheckedChange={() => toggleArrayItem('technicalSpecs', 'security', requirement)}
                    />
                    <Label htmlFor={requirement} className="text-sm font-medium cursor-pointer">{requirement}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Data Requirements</Label>
              <Textarea
                value={formData.technicalSpecs.dataRequirements}
                onChange={(e) => updateFormData('technicalSpecs', 'dataRequirements', e.target.value)}
                placeholder="Describe data migration needs, retention policies, etc..."
                className="border-[#D1D5DB] focus:border-[#4A73CC] min-h-[100px]"
              />
            </div>
          </div>
        )

      case 'project':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Implementation Timeline</Label>
              <Select 
                value={formData.projectDetails.timeline} 
                onValueChange={(value) => updateFormData('projectDetails', 'timeline', value)}
              >
                <SelectTrigger className="border-[#D1D5DB] focus:border-[#4A73CC]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (1-2 months)</SelectItem>
                  <SelectItem value="standard">Standard (3-6 months)</SelectItem>
                  <SelectItem value="flexible">Flexible (6-12 months)</SelectItem>
                  <SelectItem value="strategic">Strategic planning (12+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Budget Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-[#6B7280] mb-2 block">Minimum Budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                    <Input
                      type="number"
                      value={formData.projectDetails.budget.min}
                      onChange={(e) => updateFormData('projectDetails', 'budget', {
                        ...formData.projectDetails.budget,
                        min: parseInt(e.target.value) || 0
                      })}
                      className="pl-10 border-[#D1D5DB] focus:border-[#4A73CC]"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-[#6B7280] mb-2 block">Maximum Budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                    <Input
                      type="number"
                      value={formData.projectDetails.budget.max}
                      onChange={(e) => updateFormData('projectDetails', 'budget', {
                        ...formData.projectDetails.budget,
                        max: parseInt(e.target.value) || 0
                      })}
                      className="pl-10 border-[#D1D5DB] focus:border-[#4A73CC]"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Project Priority</Label>
              <Select 
                value={formData.projectDetails.priority} 
                onValueChange={(value) => updateFormData('projectDetails', 'priority', value)}
              >
                <SelectTrigger className="border-[#D1D5DB] focus:border-[#4A73CC]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical - Immediate need</SelectItem>
                  <SelectItem value="high">High - Important for business</SelectItem>
                  <SelectItem value="medium">Medium - Planned improvement</SelectItem>
                  <SelectItem value="low">Low - Nice to have</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Success Metrics</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Reduce manual HR tasks by 50%+',
                  'Improve employee satisfaction scores',
                  'Ensure 100% compliance with regulations',
                  'Streamline onboarding process',
                  'Better reporting and analytics',
                  'Reduce time-to-hire',
                  'Improve data accuracy',
                  'Cost savings on HR operations'
                ].map((metric) => (
                  <div key={metric} className="flex items-center space-x-2 p-3 border border-[#E5E7EB] rounded-lg hover:border-[#4A73CC] transition-colors">
                    <Checkbox
                      id={metric}
                      checked={formData.projectDetails.successMetrics.includes(metric)}
                      onCheckedChange={() => toggleArrayItem('projectDetails', 'successMetrics', metric)}
                    />
                    <Label htmlFor={metric} className="text-sm font-medium cursor-pointer">{metric}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Industry</Label>
              <Input
                value={formData.businessContext.industry}
                onChange={(e) => updateFormData('businessContext', 'industry', e.target.value)}
                placeholder="e.g., Technology, Healthcare, Manufacturing..."
                className="border-[#D1D5DB] focus:border-[#4A73CC]"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Current Pain Points</Label>
              <Textarea
                value={formData.businessContext.currentPain}
                onChange={(e) => updateFormData('businessContext', 'currentPain', e.target.value)}
                placeholder="Describe the main challenges with your current HR processes..."
                className="border-[#D1D5DB] focus:border-[#4A73CC] min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Expected Outcomes</Label>
              <Textarea
                value={formData.businessContext.expectedOutcomes}
                onChange={(e) => updateFormData('businessContext', 'expectedOutcomes', e.target.value)}
                placeholder="What specific outcomes do you expect from this solution..."
                className="border-[#D1D5DB] focus:border-[#4A73CC] min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] mb-4 block">Key Stakeholders</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'HR Director/Manager',
                  'IT Director',
                  'CEO/Executive Team',
                  'Finance/Accounting',
                  'Legal/Compliance',
                  'Department Managers',
                  'Employees (End Users)',
                  'External Consultants'
                ].map((stakeholder) => (
                  <div key={stakeholder} className="flex items-center space-x-2 p-3 border border-[#E5E7EB] rounded-lg hover:border-[#4A73CC] transition-colors">
                    <Checkbox
                      id={stakeholder}
                      checked={formData.businessContext.stakeholders.includes(stakeholder)}
                      onCheckedChange={() => toggleArrayItem('businessContext', 'stakeholders', stakeholder)}
                    />
                    <Label htmlFor={stakeholder} className="text-sm font-medium cursor-pointer">{stakeholder}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Left Column - Form */}
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#4A73CC] rounded-full flex items-center justify-center">
              {sections[currentSection].icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1A2B4C]">{sections[currentSection].title}</h2>
              <p className="text-[#6B7280]">{sections[currentSection].description}</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-2 mb-6">
            {sections.map((section, index) => (
              <div key={section.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  index === currentSection 
                    ? 'bg-[#4A73CC] text-white' 
                    : index < currentSection
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentSection ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                {index < sections.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${index < currentSection ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="border-2 border-[#E5E7EB]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#1A2B4C]">
                Review and Edit: {sections[currentSection].title}
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                <Edit3 className="h-4 w-4" />
                <span>Click to edit any field</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {renderCurrentSection()}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - AI Co-Pilot Chat */}
      <div className="w-96 bg-gradient-to-b from-[#F9FAFB] to-white border-l border-[#E5E7EB] flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#4A73CC] to-[#22C55E] rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A2B4C]">AI Co-Pilot</h3>
              <p className="text-sm text-[#6B7280]">Guiding your RFQ review</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-[#4A73CC] text-white ml-4' 
                  : 'bg-white border border-[#E5E7EB] mr-4'
              }`}>
                <p className="text-sm">{message.content}</p>
                {message.actionButton && (
                  <Button
                    onClick={message.actionButton.onClick}
                    size="sm"
                    className="mt-3 bg-[#22C55E] hover:bg-[#16A34A] text-white w-full"
                  >
                    {message.actionButton.text}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E5E7EB] p-4 rounded-lg mr-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Footer */}
        <div className="p-6 border-t border-[#E5E7EB]">
          <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
            <MessageCircle className="h-4 w-4" />
            <span>AI is helping you create the perfect RFQ</span>
          </div>
        </div>
      </div>
    </div>
  )
}