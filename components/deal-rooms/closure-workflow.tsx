"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClosureChecklist } from "@/components/deal-rooms/closure-checklist"
import { ClosureUnsuccessfulView } from "@/components/deal-rooms/closure-unsuccessful-view"
import { ClosureAlternatives } from "@/components/deal-rooms/closure-alternatives"
import { FeedbackForm } from "@/components/deal-rooms/feedback-form"
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { ClosureOutcomeType, type ClosureReasonCategory } from "@/types/deal-room-types"

interface ClosureWorkflowProps {
  dealRoomId: string
  dealRoomName: string
  reasonCategory?: ClosureReasonCategory
  reasonDescription?: string
  onComplete: (outcome: ClosureOutcomeType) => void
  onCancel: () => void
}

export function ClosureWorkflow({
  dealRoomId,
  dealRoomName,
  reasonCategory,
  reasonDescription,
  onComplete,
  onCancel,
}: ClosureWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<"checklist" | "outcome" | "feedback" | "alternatives">("checklist")
  const [selectedOutcome, setSelectedOutcome] = useState<ClosureOutcomeType>(ClosureOutcomeType.SUCCESSFUL)

  // Handle checklist completion
  const handleChecklistComplete = () => {
    setCurrentStep("outcome")
  }

  // Handle outcome selection
  const handleOutcomeSelect = (outcome: ClosureOutcomeType) => {
    setSelectedOutcome(outcome)
    if (outcome === ClosureOutcomeType.SUCCESSFUL) {
      setCurrentStep("feedback")
    } else {
      setCurrentStep("alternatives")
    }
  }

  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    onComplete(selectedOutcome)
  }

  // Handle alternatives view completion
  const handleAlternativesComplete = () => {
    setCurrentStep("feedback")
  }

  // Handle back button
  const handleBack = () => {
    if (currentStep === "outcome") {
      setCurrentStep("checklist")
    } else if (currentStep === "feedback" && selectedOutcome === ClosureOutcomeType.UNSUCCESSFUL) {
      setCurrentStep("alternatives")
    } else if (currentStep === "feedback") {
      setCurrentStep("outcome")
    } else if (currentStep === "alternatives") {
      setCurrentStep("outcome")
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Close Deal Room: {dealRoomName}</span>
          {currentStep !== "checklist" && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === "checklist" && (
          <ClosureChecklist dealRoomId={dealRoomId} onComplete={handleChecklistComplete} />
        )}

        {currentStep === "outcome" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Select Closure Outcome</h3>
            <p className="text-sm text-gray-500">Please select the appropriate outcome for this deal room closure.</p>

            <Tabs defaultValue="successful" onValueChange={(value) => setSelectedOutcome(value as ClosureOutcomeType)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={ClosureOutcomeType.SUCCESSFUL} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Successful</span>
                </TabsTrigger>
                <TabsTrigger value={ClosureOutcomeType.UNSUCCESSFUL} className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Unsuccessful</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value={ClosureOutcomeType.SUCCESSFUL}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-700">Successful Closure</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Select this option if the project was completed successfully and all parties are satisfied
                            with the outcome.
                          </p>
                          <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>All deliverables have been completed</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>All payments have been processed</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>Both parties agree to close the deal room</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value={ClosureOutcomeType.UNSUCCESSFUL}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-red-700">Unsuccessful Closure</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Select this option if the project was not completed successfully or was terminated early.
                          </p>
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                            <p className="text-sm text-amber-800">
                              This will mark the deal room as unsuccessfully closed. Both parties will still be able to
                              view the deal room, but no further actions can be taken.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => handleOutcomeSelect(selectedOutcome)}>Continue</Button>
            </div>
          </div>
        )}

        {currentStep === "feedback" && (
          <FeedbackForm
            dealRoomId={dealRoomId}
            dealRoomName={dealRoomName}
            outcomeType={selectedOutcome}
            onSubmit={handleFeedbackSubmit}
            onCancel={handleBack}
          />
        )}

        {currentStep === "alternatives" && (
          <div className="space-y-6">
            <ClosureUnsuccessfulView
              dealRoomName={dealRoomName}
              reasonCategory={reasonCategory}
              reasonDescription={reasonDescription}
              onSubmitFeedback={() => setCurrentStep("feedback")}
              onViewAlternatives={() => {}}
            />

            <ClosureAlternatives dealRoomId={dealRoomId} closureReason={reasonCategory} />

            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={() => setCurrentStep("feedback")}>Continue to Feedback</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
