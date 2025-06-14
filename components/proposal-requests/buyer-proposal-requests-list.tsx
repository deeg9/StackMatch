"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { fetchBuyerProposalRequests } from "@/store/slices/proposalRequestsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, DollarSign, User, MessageSquare, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  RESPONDED: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-green-100 text-green-800",
  DECLINED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
}

const urgencyColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
}

export function BuyerProposalRequestsList() {
  const dispatch = useAppDispatch()
  const { buyerRequests, isLoading, error } = useAppSelector((state) => state.proposalRequests)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchBuyerProposalRequests())
  }, [dispatch])

  const filteredRequests = buyerRequests.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">Error loading proposal requests: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="RESPONDED">Responded</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              {buyerRequests.length === 0
                ? "You haven't sent any proposal requests yet."
                : "No requests match your current filters."}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>To: {request.seller?.company_name || "Seller"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={statusColors[request.status]}>{request.status}</Badge>
                    <Badge className={urgencyColors[request.urgency_level]}>{request.urgency_level}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 line-clamp-2">{request.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {(request.budget_min || request.budget_max) && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {request.budget_min && request.budget_max
                            ? `$${request.budget_min.toLocaleString()} - $${request.budget_max.toLocaleString()}`
                            : request.budget_min
                              ? `From $${request.budget_min.toLocaleString()}`
                              : `Up to $${request.budget_max?.toLocaleString()}`}
                        </span>
                      </div>
                    )}
                    {request.timeline_days && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{request.timeline_days} days</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{request.responses?.length || 0} responses</span>
                    </div>
                  </div>

                  {request.required_skills && request.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {request.required_skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {request.required_skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{request.required_skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-500">
                      Sent {formatDistanceToNow(new Date(request.created_at))} ago
                    </span>
                    <Link href={`/proposal-requests/${request.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
