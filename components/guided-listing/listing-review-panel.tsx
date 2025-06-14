"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertCircle, Clock, DollarSign, MapPin, MessageSquare, FileText } from "lucide-react"
import type { GuidedListingFormData, CategoryTemplate, CompletenessCheckResponse } from "@/types/guided-listing-types"

interface ListingReviewPanelProps {
  formData: GuidedListingFormData
  template: CategoryTemplate
  onSubmit: (isDraft?: boolean) => Promise<void>
  isSubmitting: boolean
}

export default function ListingReviewPanel({ formData, template, onSubmit, isSubmitting }: ListingReviewPanelProps) {
  const [completenessData, setCompletenessData] = useState<CompletenessCheckResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const analyzeCompleteness = async () => {
      setIsAnalyzing(true)
      try {
        const response = await fetch("/api/ai/completeness-check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
            templateId: template.id,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setCompletenessData(data)
        }
      } catch (error) {
        console.error("Error analyzing completeness:", error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    analyzeCompleteness()
  }, [formData, template.id])

  const formatBudgetRange = () => {
    const { min, max, currency } = formData.projectDetails.budgetRange
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`
    }
    return "Budget not specified"
  }

  const getQualificationSummary = () => {
    const responses = Object.entries(formData.qualificationResponses)
    return responses
      .slice(0, 3)
      .map(([key, value]) => {
        const question = template.qualificationQuestions.find((q) => q.id === key)
        if (!question) return null

        let displayValue = value
        if (Array.isArray(value)) {
          displayValue = value.join(", ")
        } else if (typeof value === "boolean") {
          displayValue = value ? "Yes" : "No"
        }

        return (
          <div key={key} className="text-sm">
            <span className="font-medium">{question.text}:</span> <span className="text-slate-600">{displayValue}</span>
          </div>
        )
      })
      .filter(Boolean)
  }

  const getScopingSummary = () => {
    const responses = Object.entries(formData.scopingResponses)
    return responses
      .slice(0, 3)
      .map(([key, value]) => {
        const question = template.scopingQuestions.find((q) => q.id === key)
        if (!question) return null

        let displayValue = value
        if (Array.isArray(value)) {
          displayValue = value.join(", ")
        } else if (typeof value === "boolean") {
          displayValue = value ? "Yes" : "No"
        }

        return (
          <div key={key} className="text-sm">
            <span className="font-medium">{question.text}:</span> <span className="text-slate-600">{displayValue}</span>
          </div>
        )
      })
      .filter(Boolean)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Review & Submit</h2>
        <p className="text-lg text-slate-400">Review your listing details before publishing.</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">{template.name} Project</h3>
            <p className="text-slate-400">Your listing is ready to be published.</p>
          </div>
        </CardContent>
      </Card>

      {/* Completeness Analysis */}
      {isAnalyzing ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-3"></div>
            <span className="text-slate-600">Analyzing your listing...</span>
          </CardContent>
        </Card>
      ) : (
        completenessData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {completenessData.completenessScore >= 80 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                Listing Quality Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completeness</span>
                    <span className="text-sm text-slate-600">{completenessData.completenessScore}%</span>
                  </div>
                  <Progress value={completenessData.completenessScore} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className="text-sm text-slate-600">{completenessData.qualityScore}%</span>
                  </div>
                  <Progress value={completenessData.qualityScore} className="h-2" />
                </div>
              </div>

              {completenessData.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Suggestions for improvement:</h4>
                  <ul className="space-y-1">
                    {completenessData.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )
      )}

      {/* Listing Preview */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <h3 className="font-semibold">{template.name} Project</h3>
                <p className="text-sm text-slate-600">{template.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-sm text-slate-600">{formatBudgetRange()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">Timeline</p>
                  <p className="text-sm text-slate-600">{formData.projectDetails.timeline || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-slate-600 capitalize">{formData.projectDetails.locationPreference}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Qualification Details</h4>
              <div className="space-y-1">{getQualificationSummary()}</div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Technical Scope</h4>
              <div className="space-y-1">{getScopingSummary()}</div>
            </div>

            {formData.projectDetails.additionalInfo && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  <p className="text-sm text-slate-600">{formData.projectDetails.additionalInfo}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {formData.projectDetails.preferredCommunication.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Communication Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.projectDetails.preferredCommunication.map((method) => (
                  <Badge key={method} variant="outline" className="capitalize">
                    {method}
                  </Badge>
                ))}
              </div>
              {formData.projectDetails.timeZone && (
                <p className="text-sm text-slate-600 mt-2">Time Zone: {formData.projectDetails.timeZone}</p>
              )}
            </CardContent>
          </Card>
        )}

        {formData.projectDetails.files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Attached Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.projectDetails.files.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{file.name}</span>
                    <span className="text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button
          variant="outline"
          onClick={() => onSubmit(true)}
          disabled={isSubmitting}
          className="flex-1 border-slate-700 text-slate-300"
        >
          Save as Draft
        </Button>
        <Button
          onClick={() => onSubmit(false)}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Publishing..." : "Publish Listing"}
        </Button>
      </div>
    </div>
  )
}
