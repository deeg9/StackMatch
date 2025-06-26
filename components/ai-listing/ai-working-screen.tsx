'use client'

import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Globe,
  FileText,
  Database,
  CheckCircle,
  Brain,
  Zap
} from "lucide-react"

interface AIWorkingScreenProps {
  onComplete: () => void
  duration?: number // Duration in milliseconds
}

interface ProcessingStep {
  id: string
  message: string
  icon: React.ReactNode
  duration: number
}

export default function AIWorkingScreen({ onComplete, duration = 8000 }: AIWorkingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const processingSteps: ProcessingStep[] = [
    {
      id: 'website',
      message: 'Analyzing your website to understand your business model...',
      icon: <Globe className="h-6 w-6" />,
      duration: 1500
    },
    {
      id: 'document',
      message: 'Scanning your document for key requirements...',
      icon: <FileText className="h-6 w-6" />,
      duration: 1500
    },
    {
      id: 'database',
      message: 'Cross-referencing with data from 500+ similar companies...',
      icon: <Database className="h-6 w-6" />,
      duration: 2000
    },
    {
      id: 'checklist',
      message: 'Populating your requirements checklist...',
      icon: <CheckCircle className="h-6 w-6" />,
      duration: 1500
    },
    {
      id: 'finalizing',
      message: 'Preparing your draft RFQ... this will just take a moment.',
      icon: <Zap className="h-6 w-6" />,
      duration: 1500
    }
  ]

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const processNextStep = () => {
      if (currentStep < processingSteps.length) {
        const step = processingSteps[currentStep]
        
        timeoutId = setTimeout(() => {
          setCompletedSteps(prev => [...prev, step.id])
          setCurrentStep(prev => prev + 1)
        }, step.duration)
      } else {
        // All steps completed, trigger completion after a short delay
        timeoutId = setTimeout(() => {
          onComplete()
        }, 500)
      }
    }

    processNextStep()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [currentStep, onComplete])

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-12">
        {/* Main AI Icon */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-r from-[#4A73CC] to-[#22C55E] rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Brain className="h-16 w-16 text-white" />
          </div>
          
          {/* Orbiting Elements */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
              <div className="w-6 h-6 bg-[#4A73CC] rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
              <div className="w-6 h-6 bg-[#F59E0B] rounded-full flex items-center justify-center">
                <FileText className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
              <div className="w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center">
                <Database className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#1A2B4C] animate-fade-in">
            AI is Analyzing Your Information
          </h2>
          <p className="text-lg text-[#6B7280] animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Creating a comprehensive, personalized RFQ draft based on your business context
          </p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-6">
          {processingSteps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = completedSteps.includes(step.id)
            const isPending = index > currentStep

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-green-50 border-2 border-[#4A73CC] animate-pulse' 
                    : isCompleted
                      ? 'bg-green-50 border-2 border-[#22C55E]'
                      : 'bg-gray-50 border-2 border-gray-200 opacity-50'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Step Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-[#22C55E] text-white scale-110' 
                    : isActive
                      ? 'bg-[#4A73CC] text-white animate-spin'
                      : 'bg-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step Message */}
                <div className="flex-1 text-left">
                  <p className={`text-lg font-medium transition-colors duration-300 ${
                    isCompleted 
                      ? 'text-[#22C55E]' 
                      : isActive
                        ? 'text-[#4A73CC]'
                        : 'text-gray-400'
                  }`}>
                    {step.message}
                  </p>
                </div>

                {/* Loading Indicator for Active Step */}
                {isActive && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#4A73CC] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#4A73CC] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#4A73CC] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}

                {/* Checkmark for Completed Step */}
                {isCompleted && (
                  <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#6B7280]">
            <span>Processing...</span>
            <span>{Math.round((completedSteps.length / processingSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#4A73CC] to-[#22C55E] rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${(completedSteps.length / processingSteps.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-6 rounded-lg border border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-3">
            <Sparkles className="h-5 w-5 text-[#4A73CC]" />
            <h3 className="font-semibold text-[#1A2B4C]">Did you know?</h3>
          </div>
          <p className="text-sm text-[#6B7280]">
            Companies using AI-assisted RFQ creation see 40% faster vendor response times and 
            60% more relevant proposals compared to traditional manual processes.
          </p>
        </div>
      </div>
    </div>
  )
}