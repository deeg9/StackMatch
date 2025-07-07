'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  ArrowRight,
  Save,
  Users,
  Globe,
  Smartphone,
  Palette,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
  FileText,
  Upload,
  Eye
} from "lucide-react"
import Link from "next/link"
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import IntelligentIngestion from '@/components/ai-listing/intelligent-ingestion'
import AIWorkingScreen from '@/components/ai-listing/ai-working-screen'
import AIAssistedReview from '@/components/ai-listing/ai-assisted-review'
import FinalApproval from '@/components/ai-listing/final-approval'

// Types
interface Category {
  id: string
  name: string
  icon: string
  description: string
  isPopular?: boolean
  estimatedTime: string
  color: string
}

interface FormData {
  category?: Category
  needs: {
    businessSituation: string
    goals: string
    challenges: string
    timeline: string
  }
  technical: {
    requirements: string
    features: string[]
    integrations: string
    platforms: string[]
  }
  project: {
    budgetMin: number
    budgetMax: number
    timelineType: string
    location: string
    communicationMethods: string[]
    files: File[]
  }
}

interface IngestionData {
  companyWebsite: string
  linkedinPage: string
  uploadedFiles: File[]
}

interface AIGeneratedRFQ {
  // NEW: Project Overview & Business Context
  projectOverview: {
    projectTitle: string
    primaryChallenges: string
    desiredOutcomes: string
    timelineExpectation: string
  }
  // NEW: Organizational & Operational Details
  organizationalDetails: {
    subsidiaries: string
    locations: string
    geographicScope: string[]
    departments: string
    currentSystems: string
    businessProcesses: string[]
  }
  // NEW: Budget & Timeline Expectations
  budgetTimeline: {
    budgetRange: string
    targetGoLive: string
    internalResources: string[]
  }
  // Existing sections
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
  // NEW: Additional Questions & Evaluation Criteria
  additionalQuestions: {
    openEndedQuestions: string
    evaluationCriteria: string[]
  }
  // Modified existing sections
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

type AIWorkflowStep = 'category' | 'ingestion' | 'processing' | 'review' | 'approval' | 'submitted'

const categories: Category[] = [
  {
    id: 'hr-payroll',
    name: 'HR & Payroll',
    icon: '👥',
    description: 'Human resources and payroll management solutions',
    isPopular: true,
    estimatedTime: '10-15 min',
    color: 'bg-[#3B82F6]'
  },
  {
    id: 'web-development',
    name: 'Web Development',
    icon: '🌐',
    description: 'Custom websites, web applications, and digital platforms',
    isPopular: true,
    estimatedTime: '12-18 min',
    color: 'bg-[#22C55E]'
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    icon: '📱',
    description: 'iOS and Android mobile applications',
    estimatedTime: '15-20 min',
    color: 'bg-[#F59E0B]'
  },
  {
    id: 'design-creative',
    name: 'Design & Creative',
    icon: '🎨',
    description: 'UI/UX design, branding, and creative services',
    estimatedTime: '8-12 min',
    color: 'bg-[#8B5CF6]'
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: '📊',
    description: 'Analytics, machine learning, and data visualization',
    estimatedTime: '10-15 min',
    color: 'bg-[#EF4444]'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    icon: '📈',
    description: 'SEO, social media, content marketing, and advertising',
    isPopular: true,
    estimatedTime: '8-12 min',
    color: 'bg-[#06B6D4]'
  }
]

const steps = [
  {
    id: 1,
    title: 'Understanding Your Needs',
    description: 'Help us understand your business situation and goals',
    estimatedTime: '5-8 min'
  },
  {
    id: 2,
    title: 'Technical Requirements',
    description: 'Specify the technical details and scope',
    estimatedTime: '8-12 min'
  },
  {
    id: 3,
    title: 'Project Details',
    description: 'Timeline, budget, and logistics',
    estimatedTime: '3-5 min'
  },
  {
    id: 4,
    title: 'Review & Submit',
    description: 'Review your listing and publish',
    estimatedTime: '2-3 min'
  }
]

export default function CreateListingPage() {
  // AI Workflow State
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<AIWorkflowStep>('category')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [ingestionData, setIngestionData] = useState<IngestionData | null>(null)
  const [aiGeneratedRFQ, setAiGeneratedRFQ] = useState<AIGeneratedRFQ | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Legacy form state (kept for compatibility)
  const [currentView, setCurrentView] = useState<'category' | 'form'>('category')
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    needs: {
      businessSituation: '',
      goals: '',
      challenges: '',
      timeline: ''
    },
    technical: {
      requirements: '',
      features: [],
      integrations: '',
      platforms: []
    },
    project: {
      budgetMin: 0,
      budgetMax: 0,
      timelineType: '',
      location: '',
      communicationMethods: [],
      files: []
    }
  })

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setFormData(prev => ({ ...prev, category }))
    // Start AI workflow instead of traditional form
    setCurrentWorkflowStep('ingestion')
  }

  const handleIngestionAnalyze = async (data: IngestionData) => {
    setIngestionData(data)
    setIsProcessing(true)
    setCurrentWorkflowStep('processing')
    
    try {
      const response = await fetch('/api/ai-listing/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          categoryName: selectedCategory?.name || ''
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setAiGeneratedRFQ(result.data)
        setCurrentWorkflowStep('review')
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      // For now, fall back to a default RFQ
      setAiGeneratedRFQ(getDefaultRFQ())
      setCurrentWorkflowStep('review')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAIProcessingComplete = () => {
    setCurrentWorkflowStep('review')
  }

  const handleReviewComplete = (finalData: AIGeneratedRFQ) => {
    setAiGeneratedRFQ(finalData)
    setCurrentWorkflowStep('approval')
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/ai-listing/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName: selectedCategory?.name || '',
          rfqData: aiGeneratedRFQ
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCurrentWorkflowStep('submitted')
        // Redirect to dashboard after a delay
        setTimeout(() => {
          window.location.href = '/dashboard/buyer'
        }, 3000)
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToReview = () => {
    setCurrentWorkflowStep('review')
  }

  const getDefaultRFQ = (): AIGeneratedRFQ => {
    return {
      // NEW sections
      projectOverview: {
        projectTitle: `New ${selectedCategory?.name || 'Software'} Implementation`,
        primaryChallenges: 'Manual processes are causing inefficiencies and errors. Limited visibility into operations. Compliance tracking is time-consuming and prone to mistakes.',
        desiredOutcomes: 'Automate key business processes. Improve data accuracy and reporting. Ensure compliance with industry regulations. Reduce operational costs by 30%.',
        timelineExpectation: '6-9 months'
      },
      organizationalDetails: {
        subsidiaries: '2-5',
        locations: '2-5',
        geographicScope: ['North America'],
        departments: '6-15',
        currentSystems: 'Excel spreadsheets, QuickBooks for accounting, manual paper-based processes',
        businessProcesses: selectedCategory?.id === 'hr-payroll' 
          ? ['Employee Onboarding Automation', 'Time-off Request & Approval', 'Performance Review Tracking']
          : ['Lead Generation & Capture', 'Customer Journey Mapping', 'Analytics & Reporting']
      },
      budgetTimeline: {
        budgetRange: '$100K-$250K',
        targetGoLive: 'Within 6 months',
        internalResources: ['Dedicated Project Manager', 'Subject Matter Experts (SMEs) from each relevant department']
      },
      // Existing sections
      coreRequirements: {
        employeeCount: '51-200',
        features: ['Employee Records Management', 'Payroll Processing', 'Time & Attendance'],
        integrations: ['Email/Calendar (Outlook/Gmail)', 'Accounting Software'],
        complianceNeeds: ['GDPR Compliance', 'SOC 2 Compliance']
      },
      technicalSpecs: {
        deployment: 'cloud',
        scalability: 'Support growth to 300+ employees over next 2 years',
        security: ['Two-Factor Authentication', 'Data Encryption', 'Role-based Access Control'],
        dataRequirements: 'Secure data migration with backup and recovery'
      },
      // NEW section
      additionalQuestions: {
        openEndedQuestions: 'What is your approach to post-implementation support? How do you handle change management and user adoption? What makes your solution different from competitors?',
        evaluationCriteria: ['Feature Set & Functionality Match', 'Vendor Reputation & Experience', 'Implementation Methodology & Support', 'Overall Cost (Licensing + Implementation)']
      },
      // Modified existing sections
      projectDetails: {
        timeline: 'standard',
        budget: { min: 100000, max: 250000 },
        priority: 'high',
        successMetrics: ['Reduce manual tasks by 50%+', 'Improve compliance', 'Better reporting']
      },
      businessContext: {
        industry: 'Technology',
        currentPain: 'Manual processes causing inefficiencies',
        expectedOutcomes: 'Streamlined operations and better compliance',
        stakeholders: ['HR Director/Manager', 'IT Director', 'CEO/Executive Team']
      }
    }
  }

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleBackToCategories = () => {
    setCurrentView('category')
    setSelectedCategory(null)
    setCurrentStep(1)
    setCompletedSteps([])
  }

  // Render AI Workflow Steps
  if (currentWorkflowStep === 'ingestion') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
        <TickerBanner />
        <NavigationWrapper />
        
        <div className="py-16">
          <IntelligentIngestion 
            categoryName={selectedCategory?.name || ''}
            onAnalyze={handleIngestionAnalyze}
            isLoading={isProcessing}
          />
        </div>
      </div>
    )
  }

  if (currentWorkflowStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
        <TickerBanner />
        <NavigationWrapper />
        
        <div className="py-16">
          <AIWorkingScreen onComplete={handleAIProcessingComplete} />
        </div>
      </div>
    )
  }

  if (currentWorkflowStep === 'review' && aiGeneratedRFQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
        <TickerBanner />
        <NavigationWrapper />
        
        <AIAssistedReview 
          categoryName={selectedCategory?.name || ''}
          aiGeneratedData={aiGeneratedRFQ}
          onComplete={handleReviewComplete}
        />
      </div>
    )
  }

  if (currentWorkflowStep === 'approval' && aiGeneratedRFQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
        <TickerBanner />
        <NavigationWrapper />
        
        <div className="py-16">
          <FinalApproval 
            rfqData={aiGeneratedRFQ}
            categoryName={selectedCategory?.name || ''}
            onSubmit={handleFinalSubmit}
            onBack={handleBackToReview}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    )
  }

  if (currentWorkflowStep === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB] flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-[#1A2B4C]">Listing Submitted Successfully!</h1>
            <p className="text-xl text-[#6B7280]">
              Your RFQ has been published to the StackMatch marketplace. You'll start receiving proposals within 48-72 hours.
            </p>
            <p className="text-sm text-[#6B7280]">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Category Selection (unchanged)
  if (currentWorkflowStep === 'category') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
        {/* Global Navigation */}
        <TickerBanner />
        <NavigationWrapper />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1A2B4C] to-[#4A73CC] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-5xl font-bold">Create a New Listing</h1>
              </div>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Choose a category to get started with our revolutionary AI-powered RFQ creation. Our intelligent system will analyze your business and create a comprehensive listing in minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={category.id}
                className="group border-2 border-[#D1D5DB] hover:border-[#4A73CC] transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-xl animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCategorySelect(category)}
              >
                <CardContent className="p-8 text-center space-y-6">
                  {/* Category Icon */}
                  <div className="relative">
                    <div className={`w-20 h-20 ${category.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    {category.isPopular && (
                      <Badge className="absolute -top-2 -right-2 bg-[#F59E0B] text-white px-2 py-1 text-xs animate-pulse">
                        Popular
                      </Badge>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center justify-center space-x-2 text-[#6B7280]">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{category.estimatedTime}</span>
                  </div>

                  {/* Hover Effect */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-center space-x-2 text-[#22C55E]">
                      <ArrowRight className="h-4 w-4" />
                      <span className="text-sm font-semibold">Get Started</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto border-2 border-[#E5E7EB] bg-gradient-to-r from-[#F9FAFB] to-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2B4C]">Need Help Choosing?</h3>
                </div>
                <p className="text-[#6B7280] mb-6">
                  Not sure which category fits your project? Our AI can analyze your requirements and suggest the best category for optimal results.
                </p>
                <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Recommendation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Form View - Guided Multi-Step Process
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
      {/* Global Navigation */}
      <TickerBanner />
      <NavigationWrapper />

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Sidebar - Progress Indicator */}
        <div className="w-80 bg-white border-r border-[#E5E7EB] p-8 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          {/* Category Info */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 ${selectedCategory?.color} rounded-full flex items-center justify-center`}>
                <span className="text-2xl">{selectedCategory?.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-[#1A2B4C]">{selectedCategory?.name}</h3>
                <p className="text-sm text-[#6B7280]">Template Selected</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToCategories}
              className="w-full border-[#D1D5DB] text-[#6B7280] hover:text-[#4A73CC] hover:border-[#4A73CC]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#1A2B4C] mb-6">Progress</h4>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                {/* Step Indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    completedSteps.includes(step.id) 
                      ? 'bg-[#22C55E] text-white' 
                      : currentStep === step.id 
                        ? 'bg-[#4A73CC] text-white' 
                        : 'bg-[#F3F4F6] text-[#6B7280]'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 transition-colors duration-300 ${
                      completedSteps.includes(step.id) ? 'bg-[#22C55E]' : 'bg-[#E5E7EB]'
                    }`} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <h5 className={`font-medium transition-colors duration-300 ${
                    currentStep === step.id ? 'text-[#4A73CC]' : 'text-[#1A2B4C]'
                  }`}>
                    {step.title}
                  </h5>
                  <p className="text-sm text-[#6B7280] mt-1">{step.description}</p>
                  <div className="flex items-center space-x-1 mt-2 text-xs text-[#6B7280]">
                    <Clock className="h-3 w-3" />
                    <span>{step.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Completion Progress */}
          <div className="mt-8 p-4 bg-[#F9FAFB] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#1A2B4C]">Overall Progress</span>
              <span className="text-sm text-[#6B7280]">{Math.round((completedSteps.length / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-[#E5E7EB] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#4A73CC] to-[#22C55E] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="bg-white border-b border-[#E5E7EB] px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#1A2B4C]">
                  {steps[currentStep - 1]?.title}
                </h2>
                <p className="text-[#6B7280] mt-1">
                  {steps[currentStep - 1]?.description}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-[#6B7280]">
                  Step {currentStep} of {steps.length}
                </div>
                <div className="flex items-center space-x-1 text-sm text-[#6B7280]">
                  <Clock className="h-4 w-4" />
                  <span>{steps[currentStep - 1]?.estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 px-8 py-8 overflow-y-auto">
            {currentStep === 1 && (
              <div className="max-w-4xl mx-auto">
                <div className="space-y-8">
                  {/* Placeholder for Step 1 Component */}
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-[#1A2B4C] mb-4">
                      Step 1: Understanding Your Needs
                    </h3>
                    <p className="text-[#6B7280]">
                      Form component will be implemented here
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-[#1A2B4C] mb-4">
                    Step 2: Technical Requirements
                  </h3>
                  <p className="text-[#6B7280]">
                    Technical requirements form coming soon
                  </p>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-[#1A2B4C] mb-4">
                    Step 3: Project Details
                  </h3>
                  <p className="text-[#6B7280]">
                    Project logistics form coming soon
                  </p>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-[#1A2B4C] mb-4">
                    Step 4: Review & Submit
                  </h3>
                  <p className="text-[#6B7280]">
                    Review panel coming soon
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="bg-white border-t border-[#E5E7EB] px-8 py-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className="border-[#D1D5DB] text-[#6B7280] hover:text-[#4A73CC] hover:border-[#4A73CC] disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-[#6B7280]">
                Step {currentStep} of {steps.length}
              </div>

              <Button
                onClick={handleNextStep}
                disabled={currentStep === steps.length}
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white"
              >
                {currentStep === steps.length ? 'Submit Listing' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}