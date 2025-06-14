"use client"

import React from "react"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  label: string
  description?: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStepId: string
  completedStepIds: string[]
  onStepClick?: (stepId: string) => void
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg"
  showLabels?: boolean
  allowNavigation?: boolean
}

function ProgressIndicator({
  steps,
  currentStepId,
  completedStepIds,
  onStepClick,
  orientation = "horizontal",
  size = "md",
  showLabels = true,
  allowNavigation = true,
}: ProgressIndicatorProps) {
  // Determine if a step is completed
  const isStepCompleted = (stepId: string) => completedStepIds.includes(stepId)

  // Determine if a step is the current step
  const isCurrentStep = (stepId: string) => stepId === currentStepId

  // Determine if a step is clickable
  const isStepClickable = (stepId: string, index: number) => {
    if (!allowNavigation) return false

    // Can always click completed steps
    if (isStepCompleted(stepId)) return true

    // Can click the current step
    if (isCurrentStep(stepId)) return true

    // Can click the next step if the current step is completed
    const currentStepIndex = steps.findIndex((step) => step.id === currentStepId)
    if (index === currentStepIndex + 1 && isStepCompleted(currentStepId)) return true

    return false
  }

  // Handle step click
  const handleStepClick = (stepId: string, index: number) => {
    if (onStepClick && isStepClickable(stepId, index)) {
      onStepClick(stepId)
    }
  }

  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          container: "gap-2",
          step: "w-6 h-6",
          icon: "h-4 w-4",
          line: "h-0.5",
          text: "text-xs",
        }
      case "lg":
        return {
          container: "gap-4",
          step: "w-10 h-10",
          icon: "h-6 w-6",
          line: "h-1",
          text: "text-base",
        }
      default: // md
        return {
          container: "gap-3",
          step: "w-8 h-8",
          icon: "h-5 w-5",
          line: "h-0.5",
          text: "text-sm",
        }
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <div
      className={cn("flex", orientation === "vertical" ? "flex-col" : "flex-row items-center", sizeClasses.container)}
    >
      {steps.map((step, index) => {
        const isCompleted = isStepCompleted(step.id)
        const isCurrent = isCurrentStep(step.id)
        const isClickable = isStepClickable(step.id, index)

        return (
          <React.Fragment key={step.id}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "rounded-full flex items-center justify-center transition-colors",
                  sizeClasses.step,
                  isCompleted
                    ? "bg-green-100 text-green-600"
                    : isCurrent
                      ? "bg-blue-100 text-blue-600 ring-2 ring-blue-200"
                      : "bg-gray-100 text-gray-400",
                  isClickable && !isCurrent && "cursor-pointer hover:bg-gray-200",
                )}
                onClick={() => handleStepClick(step.id, index)}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
              >
                {isCompleted ? <CheckCircle2 className={sizeClasses.icon} /> : <Circle className={sizeClasses.icon} />}
              </div>

              {/* Step label */}
              {showLabels && (
                <div
                  className={cn(
                    "mt-1 text-center",
                    sizeClasses.text,
                    isCurrent ? "font-medium text-gray-900" : "text-gray-500",
                  )}
                >
                  {step.label}
                </div>
              )}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "bg-gray-200",
                  orientation === "vertical" ? "w-0.5 h-4 mx-auto" : `flex-1 ${sizeClasses.line}`,
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default ProgressIndicator
