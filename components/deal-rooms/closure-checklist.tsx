"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  required: boolean
}

interface ClosureChecklistProps {
  dealRoomId: string
  onComplete: () => void
}

export function ClosureChecklist({ dealRoomId, onComplete }: ClosureChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "deliverables",
      label: "All deliverables have been submitted and approved",
      checked: false,
      required: true,
    },
    {
      id: "payments",
      label: "All payments have been processed",
      checked: false,
      required: true,
    },
    {
      id: "contracts",
      label: "All contracts have been completed",
      checked: false,
      required: true,
    },
    {
      id: "files",
      label: "Important files have been downloaded for your records",
      checked: false,
      required: false,
    },
    {
      id: "feedback",
      label: "Feedback has been prepared for the other party",
      checked: false,
      required: false,
    },
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if all required items are checked
  const allRequiredChecked = items.filter((item) => item.required).every((item) => item.checked)

  // Handle checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, checked } : item)))
  }

  // Handle continue button click
  const handleContinue = () => {
    if (!allRequiredChecked) {
      setError("Please complete all required items before proceeding.")
      return
    }

    setError(null)
    onComplete()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Before Closing</h3>
        <p className="text-sm text-gray-500">
          Please ensure the following items are completed before closing this deal room. Items marked with * are
          required.
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start space-x-2">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={(checked) => handleCheckboxChange(item.id, checked === true)}
              />
              <label
                htmlFor={item.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label} {item.required && <span className="text-red-500">*</span>}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!allRequiredChecked || loading}>
          {loading ? "Processing..." : "Continue"}
        </Button>
      </div>

      {allRequiredChecked && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>All required items completed</span>
        </div>
      )}
    </div>
  )
}
