"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Calendar, Clock, Eye, AlertTriangle, Archive, List } from "lucide-react"
import { ViewProposalModal } from "@/components/proposals/view-proposal-modal"
import { ViewAllWithdrawnProposalsModal } from "@/components/proposals/view-all-withdrawn-proposals-modal"
import type { Proposal } from "@/types/proposal-types"

interface WithdrawnProposalCardProps {
  proposal: Proposal
  listingBudget: string
  withdrawnCount: number
  listingId: string
  sellerId: string
  onViewAll?: () => void
}

export function WithdrawnProposalCard({
  proposal,
  listingBudget,
  withdrawnCount,
  listingId,
  sellerId,
  onViewAll,
}: WithdrawnProposalCardProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false)

  const handleViewFull = () => {
    setIsViewModalOpen(true)
  }

  const handleViewAll = () => {
    setIsViewAllModalOpen(true)
    if (onViewAll) {
      onViewAll()
    }
  }

  return (
    <>
      <Card className="bg-slate-900/60 border border-slate-700/60 opacity-90">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-300 flex items-center">
              <Archive className="w-4 h-4 mr-2 text-orange-400" />
              <span>Withdrawn Proposal</span>
            </CardTitle>
            <Badge className="bg-orange-600/80 text-white">WITHDRAWN</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-3 rounded-md border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Your Bid</div>
              <div className="text-xl font-semibold text-slate-400">{formatCurrency(proposal.proposed_budget)}</div>
              <div className="text-xs text-slate-600">Listing Budget: {listingBudget}</div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-md border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Timeline</div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-slate-500 mr-1" />
                <div className="text-slate-400 font-medium">{proposal.proposed_timeline || "Not specified"}</div>
              </div>
              <div className="mt-1 flex items-center text-xs text-slate-600">
                <Calendar className="w-3 h-3 mr-1" />
                {proposal.milestones?.length || 0} milestones
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-400 space-y-1">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5" />
              <div>
                <span className="text-slate-500">Withdrawn:</span>{" "}
                <span className="text-slate-300">
                  {proposal.withdrawn_at ? new Date(proposal.withdrawn_at).toLocaleString() : "Unknown"}
                </span>
              </div>
            </div>

            {proposal.withdrawal_reason && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-md p-2 mt-2">
                <div className="text-xs text-orange-400 font-medium mb-1">Withdrawal Reason:</div>
                <div className="text-xs text-slate-400">{proposal.withdrawal_reason}</div>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-slate-600 mt-0.5" />
              <div>
                <span className="text-slate-500">Originally Submitted:</span>{" "}
                <span className="text-slate-400">
                  {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleString() : "Not submitted"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={handleViewFull} className="bg-slate-700 hover:bg-slate-600 text-slate-200" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Full Proposal
            </Button>

            {withdrawnCount > 1 && (
              <Button onClick={handleViewAll} className="bg-slate-700 hover:bg-slate-600 text-slate-200" size="sm">
                <List className="w-4 h-4 mr-2" />
                View All Withdrawn ({withdrawnCount})
              </Button>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            You can submit a new proposal for this listing
          </div>
        </CardContent>
      </Card>

      {/* View Proposal Modal */}
      {isViewModalOpen && (
        <ViewProposalModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          proposal={proposal}
          showEditButton={false}
        />
      )}

      {/* View All Withdrawn Proposals Modal */}
      {isViewAllModalOpen && (
        <ViewAllWithdrawnProposalsModal
          isOpen={isViewAllModalOpen}
          onClose={() => setIsViewAllModalOpen(false)}
          listingId={listingId}
          sellerId={sellerId}
          listingTitle={proposal.listing?.title || "Unknown Listing"}
        />
      )}
    </>
  )
}
