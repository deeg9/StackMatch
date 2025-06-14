"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Confetti } from "@/components/shared/confetti"
import { Star } from "lucide-react"

interface ClosureSuccessCelebrationProps {
  dealRoomName: string
  onSubmitFeedback: () => void
  onViewArchive: () => void
}

export function ClosureSuccessCelebration({
  dealRoomName,
  onSubmitFeedback,
  onViewArchive,
}: ClosureSuccessCelebrationProps) {
  return (
    <div className="relative">
      <Confetti />

      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-green-700 mb-2">Success!</h2>

            <p className="text-gray-600">Congratulations! You've successfully closed the deal room:</p>

            <p className="font-medium text-lg mt-2">{dealRoomName}</p>
          </div>

          <div className="space-y-4 mt-6">
            <p className="text-sm text-gray-500">
              We'd love to hear about your experience. Your feedback helps improve the platform for everyone.
            </p>

            <div className="flex flex-col gap-3">
              <Button onClick={onSubmitFeedback} className="w-full">
                Submit Feedback
              </Button>

              <Button onClick={onViewArchive} variant="outline" className="w-full">
                View in Archive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
