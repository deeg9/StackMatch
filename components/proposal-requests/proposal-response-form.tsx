"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { createProposalResponse } from "@/store/slices/proposalRequestsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, DollarSign, Clock, FileText, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ProposalRequest, CreateProposalResponseData } from "@/types/proposal-request-types"

interface Milestone {
  title: string
  description: string
  amount: number
  duration_days: number
  order_index: number
}

interface ProposalResponseFormProps {
  request: ProposalRequest
  onSuccess?: () => void
}

export function ProposalResponseForm({ request, onSuccess }: ProposalResponseFormProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    price: "",
    timeline_days: "",
    scope_description: "",
    terms_conditions: "",
    validity_period_days: "30",
  })

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      title: "",
      description: "",
      amount: 0,
      duration_days: 0,
      order_index: 0,
    },
  ])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        amount: 0,
        duration_days: 0,
        order_index: prev.length,
      },
    ])
  }

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index).map((m, i) => ({ ...m, order_index: i })))
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    setMilestones((prev) => prev.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone)))
  }

  const calculateTotalMilestoneAmount = () => {
    return milestones.reduce((total, milestone) => total + (milestone.amount || 0), 0)
  }

  const calculateTotalMilestoneDuration = () => {
    return milestones.reduce((total, milestone) => total + (milestone.duration_days || 0), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.price || !formData.timeline_days || !formData.scope_description) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const price = Number.parseFloat(formData.price)
      const timelineDays = Number.parseInt(formData.timeline_days)

      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid price.",
          variant: "destructive",
        })
        return
      }

      if (isNaN(timelineDays) || timelineDays <= 0) {
        toast({
          title: "Invalid Timeline",
          description: "Please enter a valid timeline in days.",
          variant: "destructive",
        })
        return
      }

      // Validate milestones if any are provided
      const validMilestones = milestones.filter((m) => m.title.trim() && m.description.trim())
      const totalMilestoneAmount = calculateTotalMilestoneAmount()

      if (validMilestones.length > 0 && Math.abs(totalMilestoneAmount - price) > 0.01) {
        toast({
          title: "Milestone Amount Mismatch",
          description: "The sum of milestone amounts must equal the total price.",
          variant: "destructive",
        })
        return
      }

      const responseData: CreateProposalResponseData = {
        request_id: request.id,
        price,
        timeline_days: timelineDays,
        scope_description: formData.scope_description,
        terms_conditions: formData.terms_conditions || undefined,
        validity_period_days: Number.parseInt(formData.validity_period_days),
        milestones: validMilestones.length > 0 ? validMilestones : undefined,
      }

      await dispatch(createProposalResponse(responseData)).unwrap()

      toast({
        title: "Response Submitted",
        description: "Your proposal response has been sent to the buyer.",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/proposal-requests")
      }
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error || "Failed to submit proposal response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pricing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing & Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Total Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter total price"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
              {request.budget_min && request.budget_max && (
                <p className="text-sm text-gray-600">
                  Buyer's budget: ${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline_days">Timeline (Days) *</Label>
              <Input
                id="timeline_days"
                type="number"
                min="1"
                placeholder="Enter timeline in days"
                value={formData.timeline_days}
                onChange={(e) => handleInputChange("timeline_days", e.target.value)}
                required
              />
              {request.timeline_days && (
                <p className="text-sm text-gray-600">Buyer's preferred timeline: {request.timeline_days} days</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validity_period_days">Quote Validity (Days)</Label>
            <Input
              id="validity_period_days"
              type="number"
              min="1"
              max="365"
              value={formData.validity_period_days}
              onChange={(e) => handleInputChange("validity_period_days", e.target.value)}
            />
            <p className="text-sm text-gray-600">How long this quote remains valid</p>
          </div>
        </CardContent>
      </Card>

      {/* Scope Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Scope of Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scope_description">Detailed Scope Description *</Label>
            <Textarea
              id="scope_description"
              placeholder="Describe what you will deliver, your approach, and any assumptions..."
              value={formData.scope_description}
              onChange={(e) => handleInputChange("scope_description", e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms_conditions">Terms & Conditions</Label>
            <Textarea
              id="terms_conditions"
              placeholder="Payment terms, revision policy, intellectual property, etc..."
              value={formData.terms_conditions}
              onChange={(e) => handleInputChange("terms_conditions", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Milestones Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Project Milestones
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
              <Plus className="w-4 h-4 mr-1" />
              Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Milestone {index + 1}</h4>
                {milestones.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeMilestone(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Milestone Title</Label>
                  <Input
                    placeholder="e.g., Initial Design Phase"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, "title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration (Days)</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Days to complete"
                    value={milestone.duration_days || ""}
                    onChange={(e) => updateMilestone(index, "duration_days", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what will be delivered in this milestone..."
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, "description", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Milestone payment amount"
                  value={milestone.amount || ""}
                  onChange={(e) => updateMilestone(index, "amount", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}

          {milestones.some((m) => m.title.trim() || m.amount > 0) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span>Total Milestone Amount:</span>
                <span className="font-medium">${calculateTotalMilestoneAmount().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Duration:</span>
                <span className="font-medium">{calculateTotalMilestoneDuration()} days</span>
              </div>
              {formData.price &&
                Math.abs(calculateTotalMilestoneAmount() - Number.parseFloat(formData.price)) > 0.01 && (
                  <p className="text-sm text-red-600 mt-2">⚠️ Milestone amounts must equal total price</p>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Section */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Response
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
