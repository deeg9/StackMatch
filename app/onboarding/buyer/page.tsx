"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchBuyerProfile, updateBuyerProfile } from "@/store/slices/buyerProfileSlice"

// Import step components
import CompanyInformationStep from "@/components/onboarding/buyer/company-information-step"
import IndustryDetailsStep from "@/components/onboarding/buyer/industry-details-step"
import ProjectPreferencesStep from "@/components/onboarding/buyer/project-preferences-step"
import CommunicationPreferencesStep from "@/components/onboarding/buyer/communication-preferences-step"
import ReviewSubmitStep from "@/components/onboarding/buyer/review-submit-step"

const steps = [
  { id: "company", label: "Company Info" },
  { id: "industry", label: "Industry Details" },
  { id: "preferences", label: "Project Preferences" },
  { id: "communication", label: "Communication" },
  { id: "review", label: "Review & Submit" },
]

export default function BuyerOnboardingPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)

  // Fix: Add null check and default values for buyerProfile
  const buyerProfileState = useSelector((state: RootState) => state.buyerProfile) || {
    profile: null,
    loading: false,
    error: null,
  }
  const { profile, loading, error } = buyerProfileState

  const [currentStep, setCurrentStep] = useState("company")
  const [formData, setFormData] = useState({
    company_name: "",
    company_description: "",
    industry: "",
    company_size: "",
    founded_year: "",
    headquarters_location: "",
    website_url: "",
    annual_revenue_range: "",
    project_types: [],
    typical_budget_range: "",
    decision_timeline: "",
    preferred_communication: [],
    notification_preferences: {
      email: true,
      in_app: true,
      proposal_updates: true,
      marketing: false,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<null | "success" | "error">(null)

  // Calculate progress percentage
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = (currentStepIndex / (steps.length - 1)) * 100

  // Load existing profile data if available
  useEffect(() => {
    if (auth?.user?.id) {
      dispatch(fetchBuyerProfile(auth.user.id) as any)
    }
  }, [dispatch, auth?.user?.id])

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData((prevData) => ({
        ...prevData,
        company_name: profile.company_name || prevData.company_name,
        company_description: profile.company_description || prevData.company_description,
        industry: profile.industry || prevData.industry,
        company_size: profile.company_size || prevData.company_size,
        founded_year: profile.founded_year ? profile.founded_year.toString() : prevData.founded_year,
        headquarters_location: profile.headquarters_location || prevData.headquarters_location,
        website_url: profile.website_url || prevData.website_url,
        annual_revenue_range: profile.annual_revenue_range || prevData.annual_revenue_range,
      }))
    }
  }, [profile])

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
      const profileData = {
        id: profile?.id,
        user_id: auth.user.id,
        company_name: formData.company_name,
        company_description: formData.company_description,
        industry: formData.industry,
        company_size: formData.company_size,
        founded_year: formData.founded_year ? Number(formData.founded_year) : undefined,
        headquarters_location: formData.headquarters_location,
        website_url: formData.website_url,
        annual_revenue_range: formData.annual_revenue_range,
      }

      await dispatch(updateBuyerProfile(profileData) as any)
      setSaveStatus("success")

      // Save additional preferences to user metadata
      try {
        await fetch("/api/user/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_types: formData.project_types,
            typical_budget_range: formData.typical_budget_range,
            decision_timeline: formData.decision_timeline,
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
        body: JSON.stringify({ userType: "BUYER" }),
      })

      // Route to buyer-specific dashboard instead of generic dashboard
      router.push("/buyer-dashboard")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
      setSaveStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Complete Your Buyer Profile</h1>
        <p className="text-slate-400">
          Help us understand your business needs to match you with the right service providers.
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

          {error && (
            <Alert className="mb-4 bg-red-900/20 text-red-400 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={currentStep} className="mt-2">
            <TabsContent value="company" className="m-0 pt-4">
              <CompanyInformationStep formData={formData} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="industry" className="m-0 pt-4">
              <IndustryDetailsStep formData={formData} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="preferences" className="m-0 pt-4">
              <ProjectPreferencesStep formData={formData} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="communication" className="m-0 pt-4">
              <CommunicationPreferencesStep formData={formData} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="review" className="m-0 pt-4">
              <ReviewSubmitStep formData={formData} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === "company" || isSubmitting}
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
                  "Complete Profile"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
