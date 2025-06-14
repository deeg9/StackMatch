"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, FileText, User, Calendar, DollarSign, CheckCircle } from "lucide-react"
import { getCurrentToken } from "@/lib/auth/token-utils"
import { formatDistanceToNow } from "date-fns"

interface ViewProposalModalProps {
  isOpen: boolean
  onClose: () => void
  proposalId: string
  dealRoomId: string
}

export function ViewProposalModal({ isOpen, onClose, proposalId, dealRoomId }: ViewProposalModalProps) {
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && proposalId) {
      fetchProposal()
    }
  }, [isOpen, proposalId])

  const fetchProposal = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔍 PROPOSAL MODAL: Starting fetch for proposal ID:", proposalId)

      const { token, success } = await getCurrentToken()

      if (!success || !token) {
        console.log("🔍 PROPOSAL MODAL: Token retrieved:", success)
        setError("Authentication token not found")
        setLoading(false)
        return
      }

      console.log("🔍 PROPOSAL MODAL: Token retrieved successfully")
      const response = await fetch(`/api/proposals/${proposalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("🔍 PROPOSAL MODAL: Error response:", errorText)
        setError(`Failed to fetch proposal: ${errorText || response.statusText}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log("🔍 PROPOSAL MODAL: Proposal data received:", data)
      setProposal(data)
    } catch (error) {
      console.error("🔍 PROPOSAL MODAL: Error fetching proposal:", error)
      setError(`Error fetching proposal: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Unknown date"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-800 text-slate-200 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-100">Proposal Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-slate-400">Loading proposal details...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
            <p className="text-slate-300 font-medium mb-2">Failed to load proposal</p>
            <p className="text-slate-400 text-sm text-center">{error}</p>
          </div>
        ) : proposal ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100">
                {proposal.title || "Proposal for " + (proposal.listing?.title || "Project")}
              </h2>
              <Badge className={proposal.status === "ACCEPTED" ? "bg-green-600" : "bg-blue-600"}>
                {proposal.status || "Submitted"}
              </Badge>
            </div>

            <Card className="bg-slate-700 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 whitespace-pre-wrap">
                  {proposal.cover_letter || proposal.proposal_text || "No cover letter provided."}
                </p>
              </CardContent>
            </Card>

            {proposal.technical_approach && (
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Technical Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 whitespace-pre-wrap">{proposal.technical_approach}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-slate-400">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Proposed Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-slate-100">
                    {proposal.proposed_budget ? `$${proposal.proposed_budget.toLocaleString()}` : "Not specified"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-slate-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Proposed Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-slate-100">
                    {proposal.proposed_timeline || "Not specified"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-700 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-slate-400">
                  <User className="h-4 w-4 mr-2" />
                  Submitted By
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-slate-300"
                  style={{
                    backgroundImage: proposal.seller_profile?.avatar_url
                      ? `url(${proposal.seller_profile.avatar_url})`
                      : "none",
                    backgroundSize: "cover",
                  }}
                >
                  {!proposal.seller_profile?.avatar_url && (proposal.seller_profile?.company_name?.[0] || "S")}
                </div>
                <div>
                  <p className="font-medium text-slate-200">
                    {proposal.seller_profile?.company_name || "Unknown Provider"}
                  </p>
                  <p className="text-xs text-slate-400">
                    Submitted {proposal.created_at ? formatDate(proposal.created_at) : "recently"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {proposal.key_deliverables && proposal.key_deliverables.length > 0 && (
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-slate-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Key Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {proposal.key_deliverables.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-8 w-8 text-slate-500 mb-4" />
            <p className="text-slate-400">No proposal data available</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
