"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { useEffect, useState } from "react"

export interface Step {
  id: string
  name: string
  description?: string
  status: "complete" | "current" | "upcoming"
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStepId: string
  className?: string
  onStepClick?: (stepId: string) => void
  allowNavigation?: boolean
}

export function ProgressIndicator({
  steps,
  currentStepId,
  className,
  onStepClick,
  allowNavigation = true,
}: ProgressIndicatorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol role="list" className="space-y-3 md:flex md:space-x-4 md:space-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="md:flex-1">
            <button
              onClick={() => allowNavigation && onStepClick?.(step.id)}
              disabled={!allowNavigation || step.status === "upcoming"}
              className={cn(
                "group flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                step.status === "complete" ? "border-emerald-600" : "",
                step.status === "current" ? "border-primary" : "",
                step.status === "upcoming" ? "border-gray-200 dark:border-gray-700" : "",
                allowNavigation && step.status !== "upcoming" ? "cursor-pointer" : "cursor-default",
              )}
            >
              <span className="flex items-center text-sm font-medium">
                <span
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                    step.status === "complete" ? "bg-emerald-600 group-hover:bg-emerald-700" : "",
                    step.status === "current" ? "border-2 border-primary text-primary" : "",
                    step.status === "upcoming" ? "border-2 border-gray-300 dark:border-gray-600" : "",
                  )}
                >
                  {step.status === "complete" ? (
                    <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  ) : (
                    <span>{stepIdx + 1}</span>
                  )}
                </span>
                <span
                  className={cn(
                    "ml-3 text-sm font-medium",
                    step.status === "complete" ? "text-emerald-600" : "",
                    step.status === "current" ? "text-primary" : "",
                    step.status === "upcoming" ? "text-gray-500 dark:text-gray-400" : "",
                  )}
                >
                  {step.name}
                </span>
              </span>
              {step.description && (
                <span
                  className={cn(
                    "ml-11 text-xs",
                    step.status === "upcoming"
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  {step.description}
                </span>
              )}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
