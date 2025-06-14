"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ThumbsDown } from "lucide-react"

interface ClosureUnsuccessfulViewProps {
  dealRoomName: string
  reasonCategory?: string
  reasonDescription?: string
  onSubmitFeedback: () => void
  onViewAlternatives: () => void
}

export function ClosureUnsuccessfulView({
  dealRoomName,
  reasonCategory,
  reasonDescription,
  onSubmitFeedback,
  onViewAlternatives,
}: ClosureUnsuccessfulViewProps) {
  // Format reason category for display
  const formatReasonCategory = (category?: string): string => {
    if (!category) return "Unspecified"

    // Convert from SNAKE_CASE to Title Case
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <ThumbsDown className="h-8 w-8 text-amber-600" />
          </div>

          <h2 className="text-xl font-bold text-amber-700 mb-2">Deal Room Closed Unsuccessfully</h2>

          <p className="text-gray-600">The deal room has been closed without successful completion:</p>

          <p className="font-medium text-lg mt-2">{dealRoomName}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Closure Details</h3>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Reason:</span>{" "}
              <span className="font-medium">{formatReasonCategory(reasonCategory)}</span>
            </div>

            {reasonDescription && (
              <div>
                <span className="text-gray-500">Description:</span>{" "}
                <p className="mt-1 text-gray-700">{reasonDescription}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-2 text-left bg-blue-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <p className="text-sm text-blue-700">
              We value your feedback on why this deal didn't work out. Your insights help us improve the platform.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onSubmitFeedback} className="w-full">
              Submit Feedback
            </Button>

            <Button onClick={onViewAlternatives} variant="outline" className="w-full">
              View Alternatives
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
