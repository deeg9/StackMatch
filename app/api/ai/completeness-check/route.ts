import { type NextRequest, NextResponse } from "next/server"
import type { CompletenessCheckRequest, CompletenessCheckResponse } from "@/types/guided-listing-types"

export async function POST(request: NextRequest) {
  try {
    const body: CompletenessCheckRequest = await request.json()
    const { formData, templateId } = body

    // Mock completeness analysis
    const analysis = analyzeCompleteness(formData)

    const response: CompletenessCheckResponse = {
      completenessScore: analysis.completenessScore,
      qualityScore: analysis.qualityScore,
      missingFields: analysis.missingFields,
      suggestions: analysis.suggestions,
      estimatedTimeToComplete: analysis.estimatedTimeToComplete,
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error checking completeness:", error)
    return NextResponse.json({ error: "Failed to check completeness", success: false }, { status: 500 })
  }
}

function analyzeCompleteness(formData: any) {
  let completenessScore = 0
  let qualityScore = 0
  const missingFields: string[] = []
  const suggestions: string[] = []

  // Check qualification responses
  const qualificationCount = Object.keys(formData.qualificationResponses || {}).length
  if (qualificationCount > 0) {
    completenessScore += 30
    qualityScore += 25
  } else {
    missingFields.push("qualification_responses")
    suggestions.push("Complete the qualification questions to help freelancers understand your needs")
  }

  // Check scoping responses
  const scopingCount = Object.keys(formData.scopingResponses || {}).length
  if (scopingCount > 0) {
    completenessScore += 40
    qualityScore += 35
  } else {
    missingFields.push("scoping_responses")
    suggestions.push("Provide detailed project scope to receive accurate proposals")
  }

  // Check project details
  const details = formData.projectDetails || {}
  if (details.timeline) {
    completenessScore += 10
    qualityScore += 15
  } else {
    missingFields.push("timeline")
    suggestions.push("Add a timeline to help freelancers plan their availability")
  }

  if (details.budgetRange?.min && details.budgetRange?.max) {
    completenessScore += 20
    qualityScore += 25
  } else {
    missingFields.push("budget")
    suggestions.push("Include a budget range to attract suitable freelancers")
  }

  // Estimate time to complete based on missing fields
  const estimatedTimeToComplete = missingFields.length * 2 // 2 minutes per missing field

  return {
    completenessScore: Math.min(completenessScore, 100),
    qualityScore: Math.min(qualityScore, 100),
    missingFields,
    suggestions,
    estimatedTimeToComplete,
  }
}
