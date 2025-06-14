"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { fetchDashboardProposalRequests } from "@/store/slices/proposalRequestsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, User, AlertCircle, Eye, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

const urgencyColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
}

const urgencyIcons = {
  LOW: null,
  MEDIUM: null,
  HIGH: <AlertCircle className="w-3 h-3" />,
  URGENT: <AlertCircle className="w-3 h-3" />,
}

export function SellerDashboardProposalPortlet() {
  const dispatch = useAppDispatch()
  const { dashboardRequests, dashboardLoading, dashboardError } = useAppSelector((state) => state.proposalRequests)

  useEffect(() => {
    dispatch(fetchDashboardProposalRequests({ userType: "seller", limit: 5 }))
  }, [dispatch])

  // Sort by urgency and creation date
  const sortedRequests = [...dashboardRequests].sort((a, b) => {
    const urgencyOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
    const urgencyDiff = urgencyOrder[b.urgency_level] - urgencyOrder[a.urgency_level]
    if (urgencyDiff !== 0) return urgencyDiff
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (dashboardLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Proposal Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (dashboardError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Proposal Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 text-sm">Error loading requests</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Proposal Requests
            {dashboardRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {dashboardRequests.length}
              </Badge>
            )}
          </CardTitle>
          {dashboardRequests.length > 0 && (
            <Link href="/proposal-requests">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sortedRequests.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No pending proposal requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm line-clamp-1">{request.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <User className="w-3 h-3" />
                        <span>{request.buyer?.full_name || "Buyer"}</span>
                      </div>
                    </div>
                    <Badge className={`${urgencyColors[request.urgency_level]} flex items-center gap-1 text-xs`}>
                      {urgencyIcons[request.urgency_level]}
                      {request.urgency_level}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-2">{request.description}</p>

                  {/* Details */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    {(request.budget_min || request.budget_max) && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>
                          {request.budget_min && request.budget_max
                            ? `$${request.budget_min.toLocaleString()}-${request.budget_max.toLocaleString()}`
                            : request.budget_min
                              ? `$${request.budget_min.toLocaleString()}+`
                              : `≤$${request.budget_max?.toLocaleString()}`}
                        </span>
                      </div>
                    )}
                    {request.timeline_days && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{request.timeline_days}d</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {request.required_skills && request.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {request.required_skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                          {skill}
                        </Badge>
                      ))}
                      {request.required_skills.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{request.required_skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(request.created_at))} ago
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/proposal-requests/${request.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/proposal-requests/${request.id}/respond`}>
                        <Button size="sm" className="text-xs h-7">
                          Respond
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
