"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, DollarSign, Calendar, FileText, Target, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Proposal } from "@/types/proposal-types"

interface Milestone {
  id?: string
  title: string
  description: string
  deliverables: string[]
  amount: number
  duration_days: number | null
  order_index: number
}

interface EditProposalModalProps {
  isOpen: boolean
  onClose: () => void
  proposal: Proposal
  listingTitle: string
  companyName: string
  budget: string
  onSuccess?: (proposal: Proposal) => void
}

export function EditProposalModal({
  isOpen,
  onClose,
  proposal,
  listingTitle,
  companyName,
  budget,
  onSuccess,
}: EditProposalModalProps) {
  const [activeTab, setActiveTab] = useState("basics")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state - initialize with existing proposal data
  const [coverLetter, setCoverLetter] = useState(proposal.cover_letter || "")
  const [proposedBudget, setProposedBudget] = useState(proposal.proposed_budget?.toString() || "")
  const [proposedTimeline, setProposedTimeline] = useState(proposal.proposed_timeline || "")
  const [technicalApproach, setTechnicalApproach] = useState(proposal.technical_approach || "")
  const [relevantExperience, setRelevantExperience] = useState(proposal.relevant_experience || "")
  const [milestones, setMilestones] = useState<Milestone[]>([])

  // Initialize milestones from proposal data
  useEffect(() => {
    if (proposal.milestones && proposal.milestones.length > 0) {
      const initialMilestones: Milestone[] = proposal.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        deliverables: m.deliverables || [],
        amount: m.amount,
        duration_days: m.duration_days,
        order_index: m.order_index,
      }))
      setMilestones(initialMilestones)
    }
  }, [proposal.milestones])

  // Check if proposal can be edited
  const canEdit = proposal.status === "DRAFT" || proposal.status === "SUBMITTED"
  const isReadOnly = !canEdit

  const addMilestone = () => {
    if (isReadOnly) return
    const newMilestone: Milestone = {
      title: "",
      description: "",
      deliverables: [],
      amount: 0,
      duration_days: null,
      order_index: milestones.length,
    }
    setMilestones([...milestones, newMilestone])
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    if (isReadOnly) return
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const removeMilestone = (index: number) => {
    if (isReadOnly) return
    const updated = milestones.filter((_, i) => i !== index)
    setMilestones(updated.map((m, i) => ({ ...m, order_index: i })))
  }

  const handleSubmit = async (status: "DRAFT" | "SUBMITTED" = "SUBMITTED") => {
    if (!coverLetter.trim() || !proposedBudget) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const updates = {
        cover_letter: coverLetter.trim(),
        proposed_budget: Number(proposedBudget),
        proposed_timeline: proposedTimeline.trim() || null,
        technical_approach: technicalApproach.trim() || null,
        relevant_experience: relevantExperience.trim() || null,
        milestones: milestones
          .filter((m) => m.title.trim())
          .map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            deliverables: m.deliverables,
            amount: m.amount,
            duration_days: m.duration_days,
            order_index: m.order_index,
          })),
        status,
      }

      console.log("🔍 EDIT DEBUG: Updating proposal with data:", updates)

      const response = await fetch(`/api/proposals/${proposal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.proposal) {
        throw new Error("No proposal data returned from server")
      }

      console.log("🔍 EDIT DEBUG: Proposal updated successfully:", data.proposal)
      setIsSuccess(true)

      // Call success callback with the updated proposal
      if (onSuccess) {
        onSuccess(data.proposal)
      }

      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err: any) {
      console.error("Error updating proposal:", err)
      setError(err.message || "Failed to update proposal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return

    // Reset success state
    setError(null)
    setIsSuccess(false)
    setActiveTab("basics")

    onClose()
  }

  const totalMilestoneAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
  const budgetMatch = totalMilestoneAmount === Number(proposedBudget)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isSuccess ? "Proposal Updated Successfully!" : isReadOnly ? "View Proposal" : "Edit Proposal"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isSuccess ? (
              "Your proposal changes have been saved."
            ) : (
              <>
                {isReadOnly ? "Viewing" : "Editing"} proposal for{" "}
                <span className="font-semibold text-white">"{listingTitle}"</span> by{" "}
                <span className="font-semibold text-white">{companyName}</span>
                {isReadOnly && (
                  <div className="mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">
                      This proposal cannot be edited because it's {proposal.status.toLowerCase()}.
                    </span>
                  </div>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Proposal Updated!</h3>
            <p className="text-slate-400 mb-4">
              Your proposal has been successfully updated and sent to {companyName}.
            </p>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Status: {proposal.status}</Badge>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="basics" className="data-[state=active]:bg-slate-700">
                Basics
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">
                Details
              </TabsTrigger>
              <TabsTrigger value="milestones" className="data-[state=active]:bg-slate-700">
                Milestones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="text-white">
                    Proposed Budget *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="budget"
                      type="number"
                      placeholder="50000"
                      value={proposedBudget}
                      onChange={(e) => setProposedBudget(e.target.value)}
                      disabled={isReadOnly}
                      className="pl-10 bg-slate-800 border-slate-600 text-white disabled:opacity-50"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Listing budget: {budget}</p>
                </div>

                <div>
                  <Label htmlFor="timeline" className="text-white">
                    Proposed Timeline
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="timeline"
                      placeholder="8-12 weeks"
                      value={proposedTimeline}
                      onChange={(e) => setProposedTimeline(e.target.value)}
                      disabled={isReadOnly}
                      className="pl-10 bg-slate-800 border-slate-600 text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="cover-letter" className="text-white">
                  Cover Letter *
                </Label>
                <Textarea
                  id="cover-letter"
                  placeholder="Explain why you're the best fit for this project..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  disabled={isReadOnly}
                  className="min-h-[120px] bg-slate-800 border-slate-600 text-white disabled:opacity-50"
                />
                <p className="text-xs text-slate-400 mt-1">{coverLetter.length}/1000 characters</p>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div>
                <Label htmlFor="technical-approach" className="text-white">
                  Technical Approach
                </Label>
                <Textarea
                  id="technical-approach"
                  placeholder="Describe your technical approach and methodology..."
                  value={technicalApproach}
                  onChange={(e) => setTechnicalApproach(e.target.value)}
                  disabled={isReadOnly}
                  className="min-h-[100px] bg-slate-800 border-slate-600 text-white disabled:opacity-50"
                />
              </div>

              <div>
                <Label htmlFor="relevant-experience" className="text-white">
                  Relevant Experience
                </Label>
                <Textarea
                  id="relevant-experience"
                  placeholder="Highlight your relevant experience and past projects..."
                  value={relevantExperience}
                  onChange={(e) => setRelevantExperience(e.target.value)}
                  disabled={isReadOnly}
                  className="min-h-[100px] bg-slate-800 border-slate-600 text-white disabled:opacity-50"
                />
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Project Milestones</h3>
                  <p className="text-sm text-slate-400">Break down your project into deliverable phases</p>
                </div>
                {!isReadOnly && (
                  <Button onClick={addMilestone} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                  </Button>
                )}
              </div>

              {milestones.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Milestone Amount:</span>
                    <span className={`font-semibold ${budgetMatch ? "text-green-400" : "text-yellow-400"}`}>
                      {formatCurrency(totalMilestoneAmount)}
                    </span>
                  </div>
                  {!budgetMatch && proposedBudget && (
                    <p className="text-xs text-yellow-400 mt-1">
                      ⚠️ Milestone total doesn't match proposed budget ({formatCurrency(Number(proposedBudget))})
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <Card key={milestone.id || index} className="bg-slate-800 border-slate-600">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-white">Milestone {index + 1}</CardTitle>
                        {!isReadOnly && (
                          <Button
                            onClick={() => removeMilestone(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white text-xs">Title</Label>
                          <Input
                            placeholder="Milestone title"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(index, "title", e.target.value)}
                            disabled={isReadOnly}
                            className="bg-slate-700 border-slate-600 text-white disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-xs">Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-slate-400" />
                            <Input
                              type="number"
                              placeholder="0"
                              value={milestone.amount || ""}
                              onChange={(e) => updateMilestone(index, "amount", Number(e.target.value))}
                              disabled={isReadOnly}
                              className="pl-7 bg-slate-700 border-slate-600 text-white disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-white text-xs">Description</Label>
                        <Textarea
                          placeholder="Describe what will be delivered in this milestone"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, "description", e.target.value)}
                          disabled={isReadOnly}
                          className="bg-slate-700 border-slate-600 text-white disabled:opacity-50"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {milestones.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Target className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                  <p>No milestones added yet</p>
                  <p className="text-sm">Break your project into phases to help the buyer understand your approach</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!isSuccess && (
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={isSubmitting}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              {isReadOnly ? "Close" : "Cancel"}
            </Button>
            {!isReadOnly && (
              <>
                <Button
                  onClick={() => handleSubmit("DRAFT")}
                  variant="outline"
                  disabled={isSubmitting || !coverLetter.trim() || !proposedBudget}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleSubmit("SUBMITTED")}
                  disabled={isSubmitting || !coverLetter.trim() || !proposedBudget}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Update Proposal
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
