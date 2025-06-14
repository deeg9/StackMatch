"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import {
  FileText,
  DollarSign,
  Calendar,
  Clock,
  Target,
  User,
  Building,
  CheckCircle,
  AlertTriangle,
  Download,
  Edit,
  X,
  MessageSquare,
  TrendingUp,
  Award,
} from "lucide-react"
import type { Proposal } from "@/types/proposal-types"

interface ViewProposalModalProps {
  isOpen: boolean
  onClose: () => void
  proposal: Proposal
  onEdit?: () => void
  showEditButton?: boolean
}

export function ViewProposalModal({
  isOpen,
  onClose,
  proposal,
  onEdit,
  showEditButton = true,
}: ViewProposalModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DRAFT":
        return "bg-slate-500"
      case "SUBMITTED":
        return "bg-blue-600"
      case "UNDER_REVIEW":
        return "bg-yellow-600"
      case "ACCEPTED":
        return "bg-green-600"
      case "REJECTED":
        return "bg-red-600"
      case "WITHDRAWN":
        return "bg-orange-600"
      default:
        return "bg-slate-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
        return <CheckCircle className="w-5 h-5" />
      case "REJECTED":
      case "WITHDRAWN":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const canEdit = ["DRAFT", "SUBMITTED"].includes(proposal.status.toUpperCase())
  const totalMilestoneAmount = proposal.milestones?.reduce((sum, m) => sum + (m.amount || 0), 0) || 0
  const budgetMatch = totalMilestoneAmount === proposal.proposed_budget

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(proposal.status)}
              <div>
                <DialogTitle className="text-white text-xl">
                  Proposal for "{proposal.listing?.title || "Unknown Listing"}"
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Submitted by{" "}
                  {proposal.seller_profile?.company_name || proposal.seller_profile?.full_name || "Unknown"}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getStatusColor(proposal.status)} text-white`}>
                {proposal.status.replace("_", " ")}
              </Badge>
              {showEditButton && canEdit && onEdit && (
                <Button onClick={onEdit} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">
              Details
            </TabsTrigger>
            <TabsTrigger value="milestones" className="data-[state=active]:bg-slate-700">
              Milestones
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-slate-700">
              Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-xs text-slate-400">Proposed Budget</div>
                      <div className="text-xl font-bold text-white">{formatCurrency(proposal.proposed_budget)}</div>
                      <div className="text-xs text-slate-500">
                        Listing:{" "}
                        {proposal.listing?.budget_min && proposal.listing?.budget_max
                          ? `${formatCurrency(proposal.listing.budget_min)}-${formatCurrency(proposal.listing.budget_max)}`
                          : "Not specified"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-xs text-slate-400">Timeline</div>
                      <div className="text-lg font-semibold text-white">
                        {proposal.proposed_timeline || "Not specified"}
                      </div>
                      <div className="text-xs text-slate-500">{proposal.milestones?.length || 0} milestones</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-xs text-slate-400">Submitted</div>
                      <div className="text-lg font-semibold text-white">
                        {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleDateString() : "Not submitted"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleTimeString() : "Draft status"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cover Letter */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{proposal.cover_letter}</p>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-400" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-white font-medium">
                      {proposal.seller_profile?.company_name || "Company not specified"}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {proposal.seller_profile?.full_name || "Name not specified"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-white font-medium">Business Type</div>
                    <div className="text-slate-400 text-sm">
                      {proposal.seller_profile?.business_type || "Not specified"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Information */}
            {(proposal.status === "WITHDRAWN" || proposal.status === "REJECTED") && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
                    Status Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {proposal.status === "WITHDRAWN" && proposal.withdrawn_at && (
                    <div>
                      <div className="text-slate-400 text-sm">Withdrawn on:</div>
                      <div className="text-white">{new Date(proposal.withdrawn_at).toLocaleString()}</div>
                    </div>
                  )}
                  {proposal.withdrawal_reason && (
                    <div>
                      <div className="text-slate-400 text-sm">Reason:</div>
                      <div className="text-white">{proposal.withdrawal_reason}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Technical Approach */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-400" />
                    Technical Approach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {proposal.technical_approach || "No technical approach specified."}
                  </p>
                </CardContent>
              </Card>

              {/* Relevant Experience */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-teal-400" />
                    Relevant Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {proposal.relevant_experience || "No relevant experience specified."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Attachments */}
            {proposal.attachments && Array.isArray(proposal.attachments) && proposal.attachments.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Download className="w-5 h-5 mr-2 text-green-400" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {proposal.attachments.map((attachment: any, index: number) => (
                      <div
                        key={index}
                        className="bg-slate-700 border border-slate-600 rounded-lg p-3 hover:bg-slate-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-slate-400" />
                          <div>
                            <div className="text-slate-200 font-medium text-sm truncate">
                              {attachment.name || `Attachment ${index + 1}`}
                            </div>
                            <div className="text-slate-500 text-xs">{attachment.size || "Unknown size"}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6 mt-6">
            {/* Milestone Summary */}
            {proposal.milestones && proposal.milestones.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-400" />
                      Milestone Summary
                    </span>
                    <Badge className={`${budgetMatch ? "bg-green-600" : "bg-yellow-600"} text-white`}>
                      {formatCurrency(totalMilestoneAmount)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-slate-400">Total Milestone Amount:</span>
                    <span className={`font-semibold ${budgetMatch ? "text-green-400" : "text-yellow-400"}`}>
                      {formatCurrency(totalMilestoneAmount)}
                    </span>
                  </div>
                  {!budgetMatch && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                      <p className="text-yellow-400 text-sm">
                        ⚠️ Milestone total ({formatCurrency(totalMilestoneAmount)}) doesn't match proposed budget (
                        {formatCurrency(proposal.proposed_budget)})
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Milestones List */}
            <div className="space-y-4">
              {proposal.milestones && proposal.milestones.length > 0 ? (
                proposal.milestones
                  .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                  .map((milestone, index) => (
                    <Card key={milestone.id || index} className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold text-white mr-3">
                              {index + 1}
                            </div>
                            {milestone.title}
                          </CardTitle>
                          <Badge className="bg-slate-700 text-slate-200">{formatCurrency(milestone.amount)}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {milestone.description && <p className="text-slate-300 text-sm">{milestone.description}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Duration:</span>
                            <span className="text-white ml-2">
                              {milestone.duration_days ? `${milestone.duration_days} days` : "Not specified"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Deliverables:</span>
                            <span className="text-white ml-2">
                              {milestone.deliverables && milestone.deliverables.length > 0
                                ? `${milestone.deliverables.length} items`
                                : "Not specified"}
                            </span>
                          </div>
                        </div>
                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                          <div>
                            <div className="text-slate-400 text-sm mb-2">Deliverables:</div>
                            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                              {milestone.deliverables.map((deliverable, idx) => (
                                <li key={idx}>{deliverable}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                    <p className="text-slate-400">No milestones defined for this proposal</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6 mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-indigo-400" />
                  Proposal Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                      1
                    </div>
                    <div>
                      <div className="text-white font-medium">Proposal Created</div>
                      <div className="text-slate-400 text-sm">
                        {proposal.created_at ? new Date(proposal.created_at).toLocaleString() : "Unknown"}
                      </div>
                    </div>
                  </div>

                  {proposal.submitted_at && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                        2
                      </div>
                      <div>
                        <div className="text-white font-medium">Proposal Submitted</div>
                        <div className="text-slate-400 text-sm">{new Date(proposal.submitted_at).toLocaleString()}</div>
                      </div>
                    </div>
                  )}

                  {proposal.reviewed_at && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                        3
                      </div>
                      <div>
                        <div className="text-white font-medium">Under Review</div>
                        <div className="text-slate-400 text-sm">{new Date(proposal.reviewed_at).toLocaleString()}</div>
                      </div>
                    </div>
                  )}

                  {proposal.withdrawn_at && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                        <X className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Proposal Withdrawn</div>
                        <div className="text-slate-400 text-sm">{new Date(proposal.withdrawn_at).toLocaleString()}</div>
                        {proposal.withdrawal_reason && (
                          <div className="text-slate-500 text-sm mt-1">Reason: {proposal.withdrawal_reason}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
