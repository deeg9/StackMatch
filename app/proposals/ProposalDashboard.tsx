"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, DollarSign, Clock, Eye, Edit, Trash2 } from "lucide-react"

interface Proposal {
  id: string
  listing_title: string
  proposal_text: string
  proposed_budget: number
  proposed_timeline: string
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  created_at: string
  listing: {
    id: string
    title: string
    budget_min?: number
    budget_max?: number
  }
}

interface ProposalDashboardProps {
  userId?: string
}

export function ProposalDashboard({ userId }: ProposalDashboardProps) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchProposals()
  }, [userId])

  const fetchProposals = async () => {
    try {
      setIsLoading(true)
      // Mock data for now
      const mockProposals: Proposal[] = [
        {
          id: "1",
          listing_title: "E-commerce Website Development",
          proposal_text: "I can build a modern e-commerce solution...",
          proposed_budget: 5000,
          proposed_timeline: "6-8 weeks",
          status: "pending",
          created_at: new Date().toISOString(),
          listing: {
            id: "listing-1",
            title: "E-commerce Website Development",
            budget_min: 3000,
            budget_max: 8000,
          }
        },
        {
          id: "2",
          listing_title: "Mobile App UI/UX Design",
          proposal_text: "I specialize in mobile app design...",
          proposed_budget: 2500,
          proposed_timeline: "4 weeks",
          status: "accepted",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          listing: {
            id: "listing-2",
            title: "Mobile App UI/UX Design",
            budget_min: 2000,
            budget_max: 4000,
          }
        }
      ]
      setProposals(mockProposals)
    } catch (error) {
      console.error("Failed to fetch proposals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "withdrawn":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const filterProposals = (status: string) => {
    if (status === "all") return proposals
    return proposals.filter(proposal => proposal.status === status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStats = () => {
    return {
      total: proposals.length,
      pending: proposals.filter(p => p.status === "pending").length,
      accepted: proposals.filter(p => p.status === "accepted").length,
      rejected: proposals.filter(p => p.status === "rejected").length,
    }
  }

  const stats = getStats()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Proposals</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold">{stats.accepted}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals List */}
      <Card>
        <CardHeader>
          <CardTitle>My Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filterProposals(activeTab).map((proposal) => (
                  <Card key={proposal.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">
                            {proposal.listing.title}
                          </h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {proposal.proposal_text}
                          </p>
                        </div>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Budget:</span> ${proposal.proposed_budget.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span> {proposal.proposed_timeline}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {formatDate(proposal.created_at)}
                        </div>
                        <div>
                          <span className="font-medium">Budget Range:</span> ${proposal.listing.budget_min?.toLocaleString()} - ${proposal.listing.budget_max?.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {proposal.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Withdraw
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filterProposals(activeTab).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No proposals found for this filter.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}