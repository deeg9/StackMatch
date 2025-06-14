"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import ProgressIndicator from "./progress-indicator"
import QualificationQuestions from "./qualification-questions"
import ScopingQuestions from "./scoping-questions"
import ProjectLogistics from "./project-logistics"
import ListingReviewPanel from "./listing-review-panel"
import type { CategoryTemplate, GuidedListingFormData, FormStep } from "@/types/guided-listing-types"

interface GuidedFormContainerProps {
  selectedTemplate: CategoryTemplate
  onBackToCategories: () => void
}

export default function GuidedFormContainer({ selectedTemplate, onBackToCategories }: GuidedFormContainerProps) {
  const [formData, setFormData] = useState<GuidedListingFormData>({
    selectedCategory: selectedTemplate.value,
    currentStep: 1,
    completedSteps: new Set(),
    qualificationResponses: {},
    scopingResponses: {},
    projectDetails: {
      timeline: "",
      budgetRange: { min: 0, max: 0, currency: "USD" },
      locationPreference: "remote",
      preferredCommunication: [],
      additionalInfo: "",
      files: [],
    },
    aiSuggestions: {},
    completenessScore: 0,
    qualityScore: 0,
    startedAt: new Date().toISOString(),
    estimatedTimeRemaining: 0,
  })

  const steps: FormStep[] = [
    {
      id: 1,
      title: "Understanding Your Needs",
      description: "Help us understand your business situation and goals",
      component: "qualification",
      isCompleted: formData.completedSteps.has(1),
      isOptional: false,
      estimatedTime: "5-8 min",
    },
    {
      id: 2,
      title: "Technical Requirements",
      description: "Specify the technical details and scope",
      component: "scoping",
      isCompleted: formData.completedSteps.has(2),
      isOptional: false,
      estimatedTime: "8-12 min",
    },
    {
      id: 3,
      title: "Project Details",
      description: "Timeline, budget, and logistics",
      component: "logistics",
      isCompleted: formData.completedSteps.has(3),
      isOptional: false,
      estimatedTime: "3-5 min",
    },
    {
      id: 4,
      title: "Review & Submit",
      description: "Review your listing and publish",
      component: "review",
      isCompleted: formData.completedSteps.has(4),
      isOptional: false,
      estimatedTime: "2-3 min",
    },
  ]

  const currentStep = steps.find((step) => step.id === formData.currentStep)
  const canGoNext = formData.currentStep < steps.length
  const canGoPrevious = formData.currentStep > 1

  const handleNext = () => {
    if (canGoNext) {
      setFormData((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: new Set([...prev.completedSteps, prev.currentStep]),
      }))
    }
  }

  const handlePrevious = () => {
    if (canGoPrevious) {
      setFormData((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }))
    }
  }

  const handleQualificationUpdate = (responses: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      qualificationResponses: responses,
    }))
  }

  const handleScopingUpdate = (responses: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      scopingResponses: responses,
    }))
  }

  const handleSaveDraft = async () => {
    try {
      const response = await fetch("/api/listings/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      })
      if (response.ok) {
        console.log("Draft saved successfully")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
    }
  }

  const renderStepContent = () => {
    switch (currentStep?.component) {
      case "qualification":
        return (
          <QualificationQuestions
            template={selectedTemplate}
            responses={formData.qualificationResponses}
            onUpdate={handleQualificationUpdate}
          />
        )
      case "scoping":
        return (
          <ScopingQuestions
            template={selectedTemplate}
            responses={formData.scopingResponses}
            onUpdate={handleScopingUpdate}
          />
        )
      case "logistics":
        return <ProjectLogistics projectDetails={formData.projectDetails} onUpdate={() => {}} />
      case "review":
        return <ListingReviewPanel formData={formData} template={selectedTemplate} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Progress Sidebar */}
      <div className="w-80 bg-slate-900/50 border-r border-slate-800">
        <ProgressIndicator
          steps={steps}
          currentStep={formData.currentStep}
          completedSteps={formData.completedSteps}
          template={selectedTemplate}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/30 border-b border-slate-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToCategories}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
              <div className="w-px h-6 bg-slate-700" />
              <div>
                <h1 className="text-2xl font-bold text-white">Listing</h1>
                <p className="text-slate-400">
                  Step {formData.currentStep} of {steps.length}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSaveDraft} className="text-slate-300 border-slate-600">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-8 py-12">{renderStepContent()}</div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-900/30 border-t border-slate-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="text-slate-300 border-slate-600 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Step {formData.currentStep} of {steps.length}
              </span>
              <Button onClick={handleNext} disabled={!canGoNext} className="bg-blue-600 hover:bg-blue-700">
                {formData.currentStep === steps.length ? "Submit Listing" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
