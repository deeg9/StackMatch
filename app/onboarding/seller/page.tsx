"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import step components
import BasicInformationStep from "@/components/onboarding/seller/basic-information-step"
import ServicesExpertiseStep from "@/components/onboarding/seller/services-expertise-step"
import ExperiencePortfolioStep from "@/components/onboarding/seller/experience-portfolio-step"
import BusinessPreferencesStep from "@/components/onboarding/seller/business-preferences-step"
import ReviewSubmitStep from "@/components/onboarding/seller/review-submit-step"

const steps = [
  { id: "basic", label: "Basic Info" },
  { id: "services", label: "Services & Expertise" },
  { id: "experience", label: "Experience & Portfolio" },
  { id: "business", label: "Business Preferences" },
  { id: "review", label: "Review & Submit" },
]

export default function SellerOnboardingPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)

  const [currentStep, setCurrentStep] = useState("basic")
  const [formData, setFormData] = useState({
    // Basic Information
    business_name: "",
    business_description: "",
    website_url: "",
    location: "",
    business_type: "",
    founded_year: "",
    team_size: "",

    // Services & Expertise
    primary_services: [],
    secondary_services: [],
    industries_served: [],
    technologies: [],
    certifications: [],

    // Experience & Portfolio
    years_experience: "",
    portfolio_projects: [],
    case_studies: [],
    client_testimonials: [],

    // Business Preferences
    project_size_preference: "",
    budget_range_preference: "",
    availability: "",
    preferred_communication: [],
    notification_preferences: {
      email: true,
      in_app: true,
      project_updates: true,
      marketing: false,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<null | "success" | "error">(null)

  // Calculate progress percentage
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = (currentStepIndex / (steps.length - 1)) * 100

  // Handle form updates
  const updateFormData = (stepData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  // Save progress
  const saveProgress = async () => {
    if (!auth?.user?.id) return

    setSaveStatus(null)
    setIsSubmitting(true)

    try {
      // Save seller profile data
      const profileData = {
        user_id: auth.user.id,
        business_name: formData.business_name,
        business_description: formData.business_description,
        website_url: formData.website_url,
        location: formData.location,
        business_type: formData.business_type,
        founded_year: formData.founded_year ? Number(formData.founded_year) : undefined,
        team_size: formData.team_size,
        years_experience: formData.years_experience ? Number(formData.years_experience) : undefined,
      }

      // Here you would dispatch to seller profile slice
      // await dispatch(updateSellerProfile(profileData) as any)

      setSaveStatus("success")

      // Save additional preferences
      try {
        await fetch("/api/user/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            primary_services: formData.primary_services,
            secondary_services: formData.secondary_services,
            industries_served: formData.industries_served,
            technologies: formData.technologies,
            project_size_preference: formData.project_size_preference,
            budget_range_preference: formData.budget_range_preference,
            availability: formData.availability,
            preferred_communication: formData.preferred_communication,
            notification_preferences: formData.notification_preferences,
          }),
        })
      } catch (error) {
        console.error("Failed to save preferences:", error)
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
      setSaveStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle step navigation
  const goToNextStep = async () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      await saveProgress()
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const goToPrevStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await saveProgress()

      // Mark onboarding as complete
      await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType: "SELLER" }),
      })

      // MODIFIED: Redirect to personal details page instead of seller dashboard
      router.push("/onboarding/seller/personal-details")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
      setSaveStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Complete Your Company Profile</h1>
        <p className="text-slate-400">
          Set up your company's presence on StackMatch to connect with potential clients.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="hidden sm:block">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${index <= currentStepIndex ? "text-blue-500" : "text-slate-500"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  index < currentStepIndex
                    ? "bg-blue-500 border-blue-500 text-white"
                    : index === currentStepIndex
                      ? "border-blue-500 text-blue-500"
                      : "border-slate-700 text-slate-500"
                }`}
              >
                {index < currentStepIndex ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </div>
              <span className="mt-2 text-xs">{step.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-700" />
          <div
            className="absolute top-0 left-0 h-0.5 bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          {saveStatus === "success" && (
            <Alert className="mb-4 bg-green-900/20 text-green-400 border-green-900">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Progress saved successfully!</AlertDescription>
            </Alert>
          )}

          {saveStatus === "error" && (
            <Alert className="mb-4 bg-red-900/20 text-red-400 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to save progress. Please try again.</AlertDescription>
            </Alert>
          )}

          <Tabs value={currentStep} className="mt-2">
            <TabsContent value="basic" className="m-0 pt-4">
              <BasicInformationStep formData={formData} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="services" className="m-0 pt-4">
              <ServicesExpertiseStep formData={formData} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="experience" className="m-0 pt-4">
              <ExperiencePortfolioStep formData={formData} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="business" className="m-0 pt-4">
              <BusinessPreferencesStep formData={formData} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="review" className="m-0 pt-4">
              <ReviewSubmitStep formData={formData} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === "basic" || isSubmitting}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Previous
            </Button>

            {currentStep !== "review" ? (
              <Button
                onClick={goToNextStep}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  "Complete Company Profile"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
