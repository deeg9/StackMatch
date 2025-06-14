"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/store"
import { nextStep, prevStep, setSubmitting, setError, resetWizard } from "@/store/slices/projectWizardSlice"
import { createListing, type ListingStatus } from "@/store/slices/listingsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ProjectBasicsStep } from "./steps/project-basics-step"
import { RequirementsStep } from "./steps/requirements-step"
import { BudgetLocationStep } from "./steps/budget-location-step"
import { ReviewStep } from "./steps/review-step"

export function ProjectWizard() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { currentStep, totalSteps, data, isSubmitting, error } = useSelector((state: RootState) => state.projectWizard)

  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    dispatch(nextStep())
  }

  const handlePrev = () => {
    dispatch(prevStep())
  }

  const handleSubmit = async () => {
    dispatch(setSubmitting(true))
    dispatch(setError(null))

    try {
      // Parse budget from wizard data
      let budget_min: number | null = null
      let budget_max: number | null = null
      if (data.budget) {
        if (data.budgetType === "range" && data.budget.includes("-")) {
          const parts = data.budget
            .replace(/\$|k/g, "")
            .split("-")
            .map((s) => Number.parseInt(s.trim()) * 1000)
          budget_min = parts[0] || null
          budget_max = parts[1] || null
        } else if (data.budgetType === "fixed") {
          budget_min = Number.parseInt(data.budget.replace(/\$|k/g, "")) * 1000
          budget_max = budget_min
        }
      }

      // Prepare listing payload for the API
      const listingPayload = {
        title: data.title,
        description: data.description,
        category_id: data.category, // Ensure this is the UUID of the category
        status: "DRAFT" as ListingStatus,
        budget_min: budget_min,
        budget_max: budget_max,
        bid_deadline: data.deadline || null,
        required_skills: data.skills,
        location_preference: data.location,
        // Note: buyer_id should be set by the API from the authenticated user
        // requirements will be handled by the API if it supports creating listing_requirements
      }

      // Dispatch the async thunk and unwrap to get the result or throw on error
      await dispatch(createListing(listingPayload)).unwrap()

      // Reset wizard on success
      dispatch(resetWizard())

      // Redirect to buyer dashboard
      router.push("/buyer-dashboard")
    } catch (error: any) {
      // unwrap() throws the error payload if the thunk is rejected
      dispatch(setError(typeof error === "string" ? error : error.message || "Failed to create project listing"))
    } finally {
      dispatch(setSubmitting(false))
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectBasicsStep />
      case 2:
        return <RequirementsStep />
      case 3:
        return <BudgetLocationStep />
      case 4:
        return <ReviewStep />
      default:
        return <ProjectBasicsStep />
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.title.trim() && data.description.trim() && data.category
      case 2:
        return data.requirements.length > 0 && data.timeline.trim()
      case 3:
        return data.budget && data.budgetType && data.location.trim()
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">{error}</div>}

          {renderStep()}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!isStepValid() || isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
