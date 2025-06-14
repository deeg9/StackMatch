"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  DollarSign,
  Clock,
  User,
  Calendar,
  FileText,
  CheckCircle,
  Building,
  Loader2,
  AlertTriangle,
} from "lucide-react"

interface ProposalDetail {
  id: string
  title: string
  description: string
  budget_amount?: number
  timeline_weeks?: number
  status: string
  seller_name: string
  seller_company?: string
  created_at: string
  updated_at: string
  key_deliverables?: string[]
  approach_summary?: string
  technical_approach?: string
  project_phases?: any[]
  assumptions?: string[]
  risks?: string[]
}

export default function ProposalDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const [proposal, setProposal] = useState<ProposalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDealRoom, setFromDealRoom] = useState(false)
  const [dealRoomId, setDealRoomId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user came from a deal room
    const from = searchParams.get("from")
    const dealRoomParam = searchParams.get("dealRoomId")

    if (from === "dealRoom" && dealRoomParam) {
      setFromDealRoom(true)
      setDealRoomId(dealRoomParam)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) {
        setError("Proposal ID is missing.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/proposals/${id}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch proposal. Status: ${response.status}`)
        }

        const data = await response.json()
        setProposal(data.proposal)
      } catch (err: any) {
        console.error("Error fetching proposal:", err)
        setError(err.message || "An unexpected error occurred while loading proposal details.")
      } finally {
        setLoading(false)
      }
    }

    fetchProposal()
  }, [id])

  const formatBudget = (amount?: number) => {
    if (!amount) return "Budget not specified"
    return `$${amount.toLocaleString()}`
  }

  const formatTimeline = (weeks?: number) => {
    if (!weeks) return "Timeline not specified"
    if (weeks === 1) return "1 week"
    if (weeks < 4) return `${weeks} weeks`
    const months = Math.round(weeks / 4)
    return months === 1 ? "1 month" : `${months} months`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "rejected":
        return "bg-red-600"
      case "withdrawn":
        return "bg-gray-600"
      default:
        return "bg-blue-600"
    }
  }

  const handleBackToDealRoom = () => {
    if (dealRoomId) {
      router.push(`/deal-rooms/${dealRoomId}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg">Loading proposal details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-red-400 flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Proposal</h2>
        <p className="text-sm">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center">
        <FileText className="w-12 h-12 text-slate-500 mb-4" />
        <p className="text-lg">Proposal not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          {fromDealRoom && dealRoomId ? (
            <Button
              onClick={handleBackToDealRoom}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Deal Room
            </Button>
          ) : (
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Proposal Details</h1>
            <Badge className={`${getStatusColor(proposal.status)} text-white`}>{proposal.status}</Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Proposal Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-3">{proposal.title}</h2>
            <p className="text-slate-300 leading-relaxed mb-4">{proposal.description}</p>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-slate-400 text-xs">Budget</div>
                  <div className="text-white font-semibold">{formatBudget(proposal.budget_amount)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-slate-400 text-xs">Timeline</div>
                  <div className="text-white font-semibold">{formatTimeline(proposal.timeline_weeks)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-slate-400 text-xs">Submitted by</div>
                  <div className="text-white font-semibold">{proposal.seller_name}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-slate-400 text-xs">Date</div>
                  <div className="text-white font-semibold">{new Date(proposal.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Approach Summary */}
          {proposal.approach_summary && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Approach Summary
              </h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{proposal.approach_summary}</p>
            </div>
          )}

          {/* Technical Approach */}
          {proposal.technical_approach && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-400" />
                Technical Approach
              </h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{proposal.technical_approach}</p>
            </div>
          )}

          {/* Key Deliverables */}
          {proposal.key_deliverables && proposal.key_deliverables.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Key Deliverables</h3>
              <ul className="space-y-3">
                {proposal.key_deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project Phases */}
          {proposal.project_phases && proposal.project_phases.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Project Phases</h3>
              <div className="space-y-4">
                {proposal.project_phases.map((phase, index) => (
                  <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-medium text-white mb-2">
                      Phase {index + 1}: {phase.title || `Phase ${index + 1}`}
                    </h4>
                    <p className="text-slate-300 text-sm">{phase.description}</p>
                    {phase.duration && <div className="text-slate-400 text-xs mt-2">Duration: {phase.duration}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assumptions & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposal.assumptions && proposal.assumptions.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Assumptions</h3>
                <ul className="space-y-2">
                  {proposal.assumptions.map((assumption, index) => (
                    <li key={index} className="text-slate-300 text-sm">
                      • {assumption}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {proposal.risks && proposal.risks.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                  Risks & Mitigation
                </h3>
                <ul className="space-y-2">
                  {proposal.risks.map((risk, index) => (
                    <li key={index} className="text-slate-300 text-sm">
                      • {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
