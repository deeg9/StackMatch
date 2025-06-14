"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProposalFormProps {
  listingId?: string
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

function ProposalForm({ listingId, onSubmit, onCancel }: ProposalFormProps) {
  const [formData, setFormData] = useState({
    proposal_text: "",
    technical_approach: "",
    proposed_budget: "",
    proposed_timeline: "",
    additional_notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const proposalData = {
        ...formData,
        proposed_budget: Number(formData.proposed_budget),
        listing_id: listingId,
      }

      await onSubmit?.(proposalData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit proposal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="proposal_text">Proposal Description *</Label>
            <Textarea
              id="proposal_text"
              value={formData.proposal_text}
              onChange={(e) => handleChange("proposal_text", e.target.value)}
              placeholder="Describe your approach to this project..."
              rows={6}
              required
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technical_approach">Technical Approach</Label>
            <Textarea
              id="technical_approach"
              value={formData.technical_approach}
              onChange={(e) => handleChange("technical_approach", e.target.value)}
              placeholder="Explain your technical approach and methodology..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proposed_budget">Proposed Budget ($) *</Label>
              <Input
                id="proposed_budget"
                type="number"
                value={formData.proposed_budget}
                onChange={(e) => handleChange("proposed_budget", e.target.value)}
                placeholder="Enter your budget"
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposed_timeline">Timeline *</Label>
              <Input
                id="proposed_timeline"
                value={formData.proposed_timeline}
                onChange={(e) => handleChange("proposed_timeline", e.target.value)}
                placeholder="e.g., 4-6 weeks"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              value={formData.additional_notes}
              onChange={(e) => handleChange("additional_notes", e.target.value)}
              placeholder="Any additional information or questions..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.proposal_text || !formData.proposed_budget || !formData.proposed_timeline}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { ProposalForm }
export default ProposalForm