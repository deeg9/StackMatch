"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Calendar, Clock, FileText, Edit, Trash2, Eye, AlertTriangle, CheckCircle } from "lucide-react"
import { EditProposalModal } from "@/components/proposals/edit-proposal-modal"
import { WithdrawProposalDialog } from "@/components/proposals/withdraw-proposal-dialog"
import { ViewProposalModal } from "@/components/proposals/view-proposal-modal"
import type { Proposal } from "@/types/proposal-types"
import { useToast } from "@/hooks/use-toast"

interface SubmittedProposalCardProps {
  proposal: Proposal
  listingBudget: string
  onEdit?: (updatedProposal: Proposal) => void
  onWithdraw?: (withdrawnProposal: Proposal) => void
  onViewFull?: () => void
}

export function SubmittedProposalCard({
  proposal,
  listingBudget,
  onEdit,
  onWithdraw,
  onViewFull,
}: SubmittedProposalCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { toast } = useToast()

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
        return <CheckCircle className="w-4 h-4" />
      case "REJECTED":
      case "WITHDRAWN":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const canEdit = ["DRAFT", "SUBMITTED"].includes(proposal.status.toUpperCase())
  const canWithdraw = ["DRAFT", "SUBMITTED", "UNDER_REVIEW"].includes(proposal.status.toUpperCase())

  const handleEditSuccess = (updatedProposal: Proposal) => {
    setIsEditModalOpen(false)
    if (onEdit) {
      onEdit(updatedProposal)
    }
  }

  const handleWithdrawSuccess = () => {
    setIsWithdrawDialogOpen(false)
    setIsWithdrawing(false)

    // Show success toast
    toast({
      title: "Proposal withdrawn",
      description: "Your proposal has been successfully withdrawn.",
      variant: "default",
    })

    // Create a mock updated proposal with withdrawn status
    const withdrawnProposal: Proposal = {
      ...proposal,
      status: "WITHDRAWN",
      withdrawn_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (onWithdraw) {
      onWithdraw(withdrawnProposal)
    }
  }

  const handleViewFull = () => {
    setIsViewModalOpen(true)
    if (onViewFull) {
      onViewFull()
    }
  }

  const handleEditFromView = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <Card className="bg-slate-900 border border-slate-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center">
              {getStatusIcon(proposal.status)}
              <span className="ml-2">Your Proposal</span>
            </CardTitle>
            <Badge className={`${getStatusColor(proposal.status)} text-white`}>
              {proposal.status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded-md">
              <div className="text-xs text-slate-400 mb-1">Your Bid</div>
              <div className="text-xl font-semibold text-green-400">{formatCurrency(proposal.proposed_budget)}</div>
              <div className="text-xs text-slate-500">Listing Budget: {listingBudget}</div>
            </div>

            <div className="bg-slate-800 p-3 rounded-md">
              <div className="text-xs text-slate-400 mb-1">Timeline</div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-400 mr-1" />
                <div className="text-white font-medium">{proposal.proposed_timeline || "Not specified"}</div>
              </div>
              <div className="mt-1 flex items-center text-xs text-slate-500">
                <Calendar className="w-3 h-3 mr-1" />
                {proposal.milestones?.length || 0} milestones
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-300 space-y-1">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-slate-400">Submitted:</span>{" "}
                {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleString() : "Not submitted yet"}
              </div>
            </div>

            {proposal.status === "WITHDRAWN" && proposal.withdrawn_at && (
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5" />
                <div>
                  <span className="text-slate-400">Withdrawn:</span> {new Date(proposal.withdrawn_at).toLocaleString()}
                </div>
              </div>
            )}

            {proposal.withdrawal_reason && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-2 mt-2">
                <div className="text-xs text-orange-400 font-medium mb-1">Withdrawal Reason:</div>
                <div className="text-xs text-slate-300">{proposal.withdrawal_reason}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={handleViewFull} className="bg-slate-800 hover:bg-slate-700 text-white" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Full Proposal
            </Button>

            {canEdit && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}

            {canWithdraw && (
              <Button
                onClick={() => setIsWithdrawDialogOpen(true)}
                variant="destructive"
                size="sm"
                disabled={isWithdrawing}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            )}

            {proposal.status === "WITHDRAWN" && (
              <div className="text-xs text-orange-400 flex items-center mt-2 sm:mt-0">
                <AlertTriangle className="w-3 h-3 mr-1" />
                This proposal has been withdrawn
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Proposal Modal */}
      {isViewModalOpen && (
        <ViewProposalModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          proposal={proposal}
          onEdit={handleEditFromView}
          showEditButton={canEdit}
        />
      )}

      {/* Edit Proposal Modal */}
      {isEditModalOpen && (
        <EditProposalModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          proposal={proposal}
          listingTitle={proposal.listing?.title || ""}
          companyName={proposal.seller_profile?.company_name || ""}
          budget={listingBudget}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Withdraw Proposal Dialog */}
      {isWithdrawDialogOpen && (
        <WithdrawProposalDialog
          isOpen={isWithdrawDialogOpen}
          onClose={() => setIsWithdrawDialogOpen(false)}
          proposalId={proposal.id}
          listingTitle={proposal.listing?.title || "Unknown Listing"}
          onSuccess={handleWithdrawSuccess}
        />
      )}
    </>
  )
}
