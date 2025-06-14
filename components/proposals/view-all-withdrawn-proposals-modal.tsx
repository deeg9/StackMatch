"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle, Eye, Calendar, DollarSign, Loader2, Archive } from "lucide-react"
import { ViewProposalModal } from "@/components/proposals/view-proposal-modal"
import type { Proposal } from "@/types/proposal-types"

interface ViewAllWithdrawnProposalsModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
  sellerId: string
  listingTitle: string
}

export function ViewAllWithdrawnProposalsModal({
  isOpen,
  onClose,
  listingId,
  sellerId,
  listingTitle,
}: ViewAllWithdrawnProposalsModalProps) {
  const [withdrawnProposals, setWithdrawnProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [isViewProposalOpen, setIsViewProposalOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchWithdrawnProposals()
    }
  }, [isOpen, listingId, sellerId])

  const fetchWithdrawnProposals = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/proposals?listing_id=${listingId}&seller_id=${sellerId}&status=WITHDRAWN`)

      if (!response.ok) {
        throw new Error(`Failed to fetch withdrawn proposals: ${response.status}`)
      }

      const data = await response.json()
      setWithdrawnProposals(data.proposals || [])
    } catch (err: any) {
      console.error("Error fetching withdrawn proposals:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal)
    setIsViewProposalOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center">
              <Archive className="w-6 h-6 mr-2 text-orange-400" />
              Withdrawn Proposals
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              All withdrawn proposals for "{listingTitle}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-slate-400">Loading withdrawn proposals...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
                <p className="text-red-400 mb-2">Error loading proposals</p>
                <p className="text-slate-500 text-sm">{error}</p>
                <Button onClick={fetchWithdrawnProposals} className="mt-4" size="sm">
                  Try Again
                </Button>
              </div>
            ) : withdrawnProposals.length === 0 ? (
              <div className="text-center py-8">
                <Archive className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                <p className="text-slate-400">No withdrawn proposals found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawnProposals
                  .sort((a, b) => new Date(b.withdrawn_at || 0).getTime() - new Date(a.withdrawn_at || 0).getTime())
                  .map((proposal, index) => (
                    <Card key={proposal.id} className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center text-lg">
                            <div className="w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center text-sm font-semibold text-orange-400 mr-3">
                              {index + 1}
                            </div>
                            Proposal #{proposal.id.slice(-8)}
                          </CardTitle>
                          <Badge className="bg-orange-600/80 text-white">WITHDRAWN</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <div>
                              <div className="text-slate-400">Budget</div>
                              <div className="text-white font-semibold">{formatCurrency(proposal.proposed_budget)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <div>
                              <div className="text-slate-400">Timeline</div>
                              <div className="text-white font-semibold">
                                {proposal.proposed_timeline || "Not specified"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                            <div>
                              <div className="text-slate-400">Withdrawn</div>
                              <div className="text-white font-semibold">
                                {proposal.withdrawn_at
                                  ? new Date(proposal.withdrawn_at).toLocaleDateString()
                                  : "Unknown"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {proposal.withdrawal_reason && (
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-md p-3">
                            <div className="text-xs text-orange-400 font-medium mb-1">Withdrawal Reason:</div>
                            <div className="text-sm text-slate-300">{proposal.withdrawal_reason}</div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <div className="text-xs text-slate-500">
                            Originally submitted:{" "}
                            {proposal.submitted_at ? new Date(proposal.submitted_at).toLocaleString() : "Not submitted"}
                          </div>
                          <Button
                            onClick={() => handleViewProposal(proposal)}
                            size="sm"
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Individual Proposal Modal */}
      {isViewProposalOpen && selectedProposal && (
        <ViewProposalModal
          isOpen={isViewProposalOpen}
          onClose={() => setIsViewProposalOpen(false)}
          proposal={selectedProposal}
          showEditButton={false}
        />
      )}
    </>
  )
}
