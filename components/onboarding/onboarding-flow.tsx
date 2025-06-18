'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  User,
  FileText,
  Zap,
  Languages,
  GraduationCap,
  Briefcase,
  Phone,
  Clock,
  DollarSign,
  Folder,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Import step components
import BasicInformationStep from './steps/basic-information-step'
import AboutBioStep from './steps/about-bio-step'
import SkillsExpertiseStep from './steps/skills-expertise-step'
import LanguagesStep from './steps/languages-step'
import EducationCertificationsStep from './steps/education-certifications-step'
import WorkHistoryStep from './steps/work-history-step'
import ContactInformationStep from './steps/contact-information-step'
import AvailabilityPreferencesStep from './steps/availability-preferences-step'
import PricingInformationStep from './steps/pricing-information-step'
import PortfolioSetupStep from './steps/portfolio-setup-step'
import CompletionStep from './steps/completion-step'

interface OnboardingData {
  userType: 'buyer' | 'seller' | 'consultant'
  basicInfo: {
    fullName: string
    headline: string
    location: string
    avatar: string
    experienceYears: number
  }
  aboutBio: {
    bio: string
    specializations: string[]
    industries: string[]
  }
  skills: {
    skillsList: Array<{ name: string; level: 'Beginner' | 'Intermediate' | 'Expert'; isPrimary: boolean }>
    certifications: Array<{ name: string; issuer: string; year: string }>
  }
  languages: Array<{ language: string; proficiency: string; isNative: boolean }>
  education: Array<{ institution: string; degree: string; year: string }>
  workHistory: Array<{ company: string; role: string; startDate: string; endDate: string; description: string }>
  contact: {
    email: string
    phone: string
    website: string
    linkedin: string
    github: string
  }
  availability: {
    status: string
    workingHours: string
    timezone: string
    hoursPerWeek: number
  }
  pricing?: {
    hourlyRate: { min: number; max: number }
    projectMinimum: number
    pricingModel: string
    paymentTerms: string
  }
  portfolio: Array<{ title: string; description: string; category: string; link: string }>
}

const steps = [
  { id: 'basic', title: 'Basic Information', icon: User, description: 'Your name, title, and photo' },
  { id: 'about', title: 'About & Bio', icon: FileText, description: 'Professional summary and focus' },
  { id: 'skills', title: 'Skills & Expertise', icon: Zap, description: 'Your technical and professional skills' },
  { id: 'languages', title: 'Languages', icon: Languages, description: 'Languages you speak' },
  { id: 'education', title: 'Education & Certifications', icon: GraduationCap, description: 'Academic background and credentials' },
  { id: 'work', title: 'Work History', icon: Briefcase, description: 'Professional experience' },
  { id: 'contact', title: 'Contact Information', icon: Phone, description: 'How clients can reach you' },
  { id: 'availability', title: 'Availability & Preferences', icon: Clock, description: 'Working hours and availability' },
  { id: 'pricing', title: 'Pricing Information', icon: DollarSign, description: 'Your rates and pricing model' },
  { id: 'portfolio', title: 'Portfolio Setup', icon: Folder, description: 'Showcase your best work' },
  { id: 'complete', title: 'Complete', icon: Sparkles, description: 'Review and finish your profile' }
]

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: 'seller', // This would come from signup
    basicInfo: {
      fullName: '',
      headline: '',
      location: '',
      avatar: '',
      experienceYears: 0
    },
    aboutBio: {
      bio: '',
      specializations: [],
      industries: []
    },
    skills: {
      skillsList: [],
      certifications: []
    },
    languages: [],
    education: [],
    workHistory: [],
    contact: {
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      github: ''
    },
    availability: {
      status: 'Available',
      workingHours: '9:00 AM - 6:00 PM',
      timezone: 'UTC',
      hoursPerWeek: 40
    },
    pricing: {
      hourlyRate: { min: 50, max: 150 },
      projectMinimum: 1000,
      pricingModel: 'hourly',
      paymentTerms: 'Net 30'
    },
    portfolio: []
  })

  const getCurrentStepData = () => {
    const stepId = steps[currentStep].id
    switch (stepId) {
      case 'basic':
        return onboardingData.basicInfo
      case 'about':
        return onboardingData.aboutBio
      case 'skills':
        return onboardingData.skills
      case 'languages':
        return onboardingData.languages
      case 'education':
        return onboardingData.education
      case 'work':
        return onboardingData.workHistory
      case 'contact':
        return onboardingData.contact
      case 'availability':
        return onboardingData.availability
      case 'pricing':
        return onboardingData.pricing
      case 'portfolio':
        return onboardingData.portfolio
      case 'complete':
        return onboardingData
      default:
        return onboardingData.basicInfo
    }
  }

  const updateStepData = (stepId: string, data: any) => {
    setOnboardingData(prev => {
      switch (stepId) {
        case 'basic':
          return { ...prev, basicInfo: data }
        case 'about':
          return { ...prev, aboutBio: data }
        case 'skills':
          return { ...prev, skills: data }
        case 'languages':
          return { ...prev, languages: data }
        case 'education':
          return { ...prev, education: data }
        case 'work':
          return { ...prev, workHistory: data }
        case 'contact':
          return { ...prev, contact: data }
        case 'availability':
          return { ...prev, availability: data }
        case 'pricing':
          return { ...prev, pricing: data }
        case 'portfolio':
          return { ...prev, portfolio: data }
        default:
          return prev
      }
    })
  }

  const markStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId])
    }
  }

  const nextStep = () => {
    const currentStepId = steps[currentStep].id
    markStepComplete(currentStepId)
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const filteredSteps = onboardingData.userType === 'buyer' 
    ? steps.filter(step => step.id !== 'pricing' && step.id !== 'portfolio')
    : steps

  const progress = ((currentStep + 1) / filteredSteps.length) * 100

  const renderCurrentStep = () => {
    const stepId = steps[currentStep].id
    const stepData = getCurrentStepData()

    switch (stepId) {
      case 'basic':
        return (
          <BasicInformationStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'about':
        return (
          <AboutBioStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'skills':
        return (
          <SkillsExpertiseStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'languages':
        return (
          <LanguagesStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'education':
        return (
          <EducationCertificationsStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'work':
        return (
          <WorkHistoryStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'contact':
        return (
          <ContactInformationStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'availability':
        return (
          <AvailabilityPreferencesStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'pricing':
        return (
          <PricingInformationStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'portfolio':
        return (
          <PortfolioSetupStep
            data={stepData as any}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      case 'complete':
        return (
          <CompletionStep
            data={onboardingData}
            onUpdate={(data: any) => updateStepData(stepId, data)}
            onNext={nextStep}
            onPrev={prevStep}
            userType={onboardingData.userType}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1A2B4C]">Complete Your Profile</h1>
                <p className="text-gray-600">Help us personalize your StackMatch experience</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              Step {currentStep + 1} of {filteredSteps.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Profile Completion</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg text-[#1A2B4C]">Setup Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredSteps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isCompleted = completedSteps.includes(step.id)
                  const isAccessible = index <= currentStep || isCompleted

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer",
                        isActive && "bg-[#1A2B4C]/10 border-l-4 border-[#1A2B4C]",
                        isCompleted && !isActive && "bg-[#22C55E]/10",
                        !isAccessible && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => isAccessible && goToStep(index)}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        isCompleted ? "bg-[#22C55E] text-white" :
                        isActive ? "bg-[#1A2B4C] text-white" :
                        "bg-gray-200 text-gray-500"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-medium text-sm",
                          isActive ? "text-[#1A2B4C]" :
                          isCompleted ? "text-[#22C55E]" :
                          "text-gray-600"
                        )}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1A2B4C]/10 rounded-lg flex items-center justify-center">
                    {React.createElement(filteredSteps[currentStep].icon, { className: "w-5 h-5 text-[#1A2B4C]" })}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-[#1A2B4C]">
                      {filteredSteps[currentStep].title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      {filteredSteps[currentStep].description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                {renderCurrentStep()}
              </CardContent>
              
              {/* Navigation Footer */}
              <div className="border-t p-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} of {filteredSteps.length}
                  </span>
                  
                  {currentStep === filteredSteps.length - 1 ? (
                    <Button 
                      className="bg-[#22C55E] hover:bg-[#22C55E]/90 flex items-center gap-2"
                      onClick={nextStep}
                    >
                      Complete Profile
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      className="bg-[#1A2B4C] hover:bg-[#1A2B4C]/90 flex items-center gap-2"
                      onClick={nextStep}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}