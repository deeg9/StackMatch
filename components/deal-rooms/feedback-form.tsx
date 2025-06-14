"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/shared/star-rating"
import { Loader2 } from "lucide-react"
import type { ClosureOutcomeType } from "@/types/deal-room-types"

interface FeedbackFormProps {
  dealRoomId: string
  dealRoomName: string
  outcomeType: ClosureOutcomeType
  onSubmit: () => void
  onCancel: () => void
}

export function FeedbackForm({ dealRoomId, dealRoomName, outcomeType, onSubmit, onCancel }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Please provide a rating")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would call an API to submit the feedback
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSubmit()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      setError("Failed to submit feedback. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Provide Feedback</h3>
        <p className="text-sm text-gray-500 mt-1">
          Your feedback helps improve the platform and provides valuable insights for other users.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                How would you rate your overall experience with this deal room?
              </label>
              <div className="flex justify-center py-4">
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="feedback-comment" className="block text-sm font-medium">
                Additional Comments (Optional)
              </label>
              <Textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about your experience..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Back
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </div>
    </form>
  )
}
