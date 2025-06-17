'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Sparkles, 
  HelpCircle, 
  Lightbulb,
  Building2,
  Target,
  AlertTriangle,
  Calendar
} from "lucide-react"

interface Step1Props {
  data: {
    businessSituation: string
    goals: string
    challenges: string
    timeline: string
  }
  onUpdate: (data: any) => void
  categoryName: string
}

export default function Step1UnderstandingNeeds({ data, onUpdate, categoryName }: Step1Props) {
  const [enhancing, setEnhancing] = useState<string | null>(null)

  const handleFieldUpdate = (field: string, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    })
  }

  const handleAIEnhance = async (field: string) => {
    setEnhancing(field)
    // Simulate AI enhancement
    setTimeout(() => {
      setEnhancing(null)
    }, 2000)
  }

  const timelineOptions = [
    { value: 'urgent', label: 'Urgent (Within 1 month)', icon: '🚨' },
    { value: 'standard', label: 'Standard (1-3 months)', icon: '📅' },
    { value: 'flexible', label: 'Flexible (3-6 months)', icon: '🕐' },
    { value: 'strategic', label: 'Strategic (6+ months)', icon: '📊' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#1A2B4C]">Understanding Your Needs</h2>
        </div>
        <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
          Help us understand your business situation and goals for this {categoryName.toLowerCase()} project
        </p>
      </div>

      {/* Business Situation */}
      <Card className="border-2 border-[#E5E7EB] hover:border-[#4A73CC] transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#1A2B4C]">
            <Building2 className="h-5 w-5" />
            <span>Current Business Situation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="business-situation" className="text-[#374151] font-medium">
            Describe your current business situation and why you need this project *
          </Label>
          <div className="relative">
            <Textarea
              id="business-situation"
              placeholder="e.g., We're a growing company with 50+ employees and our current HR processes are manual and time-consuming..."
              value={data.businessSituation}
              onChange={(e) => handleFieldUpdate('businessSituation', e.target.value)}
              className="min-h-[120px] border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] resize-none"
            />
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2 text-[#6B7280] hover:text-[#4A73CC] border-[#D1D5DB]"
              onClick={() => handleAIEnhance('businessSituation')}
              disabled={enhancing === 'businessSituation'}
            >
              {enhancing === 'businessSituation' ? (
                <div className="w-4 h-4 border-2 border-[#4A73CC] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span className="ml-1">AI Enhance</span>
            </Button>
          </div>
          <div className="flex items-start space-x-2 text-sm text-[#6B7280]">
            <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              Include details about your company size, current challenges, and what prompted this project
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Goals & Objectives */}
      <Card className="border-2 border-[#E5E7EB] hover:border-[#4A73CC] transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#1A2B4C]">
            <Target className="h-5 w-5" />
            <span>Project Goals & Objectives</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="goals" className="text-[#374151] font-medium">
            What are your primary goals and expected outcomes? *
          </Label>
          <div className="relative">
            <Textarea
              id="goals"
              placeholder="e.g., Streamline our hiring process, reduce manual data entry by 80%, improve employee experience..."
              value={data.goals}
              onChange={(e) => handleFieldUpdate('goals', e.target.value)}
              className="min-h-[120px] border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] resize-none"
            />
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2 text-[#6B7280] hover:text-[#4A73CC] border-[#D1D5DB]"
              onClick={() => handleAIEnhance('goals')}
              disabled={enhancing === 'goals'}
            >
              {enhancing === 'goals' ? (
                <div className="w-4 h-4 border-2 border-[#4A73CC] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span className="ml-1">AI Enhance</span>
            </Button>
          </div>
          <div className="flex items-start space-x-2 text-sm text-[#6B7280]">
            <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              Be specific about measurable outcomes and success criteria
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Challenges */}
      <Card className="border-2 border-[#E5E7EB] hover:border-[#4A73CC] transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#1A2B4C]">
            <AlertTriangle className="h-5 w-5" />
            <span>Key Challenges & Constraints</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="challenges" className="text-[#374151] font-medium">
            What challenges or constraints should vendors be aware of?
          </Label>
          <div className="relative">
            <Textarea
              id="challenges"
              placeholder="e.g., Limited budget, tight deadline, need to integrate with legacy systems, compliance requirements..."
              value={data.challenges}
              onChange={(e) => handleFieldUpdate('challenges', e.target.value)}
              className="min-h-[100px] border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] resize-none"
            />
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2 text-[#6B7280] hover:text-[#4A73CC] border-[#D1D5DB]"
              onClick={() => handleAIEnhance('challenges')}
              disabled={enhancing === 'challenges'}
            >
              {enhancing === 'challenges' ? (
                <div className="w-4 h-4 border-2 border-[#4A73CC] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span className="ml-1">AI Enhance</span>
            </Button>
          </div>
          <div className="flex items-start space-x-2 text-sm text-[#6B7280]">
            <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              Optional but helpful for vendors to provide accurate proposals
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Priority */}
      <Card className="border-2 border-[#E5E7EB] hover:border-[#4A73CC] transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#1A2B4C]">
            <Calendar className="h-5 w-5" />
            <span>Timeline Priority</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="text-[#374151] font-medium">
            How urgent is this project? *
          </Label>
          <RadioGroup 
            value={data.timeline} 
            onValueChange={(value) => handleFieldUpdate('timeline', value)}
            className="space-y-3"
          >
            {timelineOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-4 border border-[#E5E7EB] rounded-lg hover:border-[#4A73CC] transition-colors">
                <RadioGroupItem value={option.value} id={option.value} className="border-[#D1D5DB]" />
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-2xl">{option.icon}</span>
                  <Label htmlFor={option.value} className="font-medium text-[#1A2B4C] cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-2 border-[#22C55E] bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5]">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1A2B4C] mb-2">AI Insights</h4>
              <p className="text-[#6B7280] text-sm">
                Based on your {categoryName.toLowerCase()} project description, our AI suggests focusing on scalability and integration capabilities. Consider mentioning your employee count and current systems for better vendor matching.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}