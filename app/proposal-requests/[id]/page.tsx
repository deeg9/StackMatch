"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { fetchProposalRequest, clearCurrentRequest } from "@/store/slices/proposalRequestsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, DollarSign, User, Calendar, AlertCircle, MessageSquare, FileText, ArrowLeft } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import Link from "next/link"
import { ProposalResponsesList } from "@/components/proposal-requests/proposal-responses-list"

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

export default function ProposalRequestDetailPage() {
  const params = useParams()
  const dispatch = useAppDispatch()
  const { currentRequest, isLoading, error } = useAppSelector((state) => state.proposalRequests)

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProposalRequest(params.id as string))
    }

    return () => {
      dispatch(clearCurrentRequest())
    }
  }, [dispatch, params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !currentRequest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error || "Proposal request not found"}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/proposal-requests">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[currentRequest.status]}>{currentRequest.status}</Badge>
          <Badge className={urgencyColors[currentRequest.urgency_level]}>{currentRequest.urgency_level}</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{currentRequest.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>From: {currentRequest.buyer?.full_name || "Buyer"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Sent {formatDistanceToNow(new Date(currentRequest.created_at))} ago</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Project Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{currentRequest.description}</p>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentRequest.budget_min || currentRequest.budget_max) && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Budget Range</div>
                      <div className="text-sm text-gray-600">
                        {currentRequest.budget_min && currentRequest.budget_max
                          ? `$${currentRequest.budget_min.toLocaleString()} - $${currentRequest.budget_max.toLocaleString()}`
                          : currentRequest.budget_min
                            ? `From $${currentRequest.budget_min.toLocaleString()}`
                            : `Up to $${currentRequest.budget_max?.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                )}

                {currentRequest.timeline_days && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Timeline</div>
                      <div className="text-sm text-gray-600">{currentRequest.timeline_days} days</div>
                    </div>
                  </div>
                )}

                {currentRequest.deadline && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Deadline</div>
                      <div className="text-sm text-gray-600">{format(new Date(currentRequest.deadline), "PPP")}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Required Skills */}
              {currentRequest.required_skills && currentRequest.required_skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentRequest.required_skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {currentRequest.files && currentRequest.files.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Attached Files</h3>
                  <div className="space-y-2">
                    {currentRequest.files.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 border rounded">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{file.file_name}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {(file.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Responses Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Responses ({currentRequest.responses?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProposalResponsesList requestId={currentRequest.id} responses={currentRequest.responses || []} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-medium">{currentRequest.seller?.company_name || "Company Name"}</div>
                  <div className="text-sm text-gray-600">Service Provider</div>
                </div>

                {currentRequest.seller?.expertise && currentRequest.seller.expertise.length > 0 && (
                  <div>
                    <div className="font-medium text-sm mb-1">Expertise</div>
                    <div className="flex flex-wrap gap-1">
                      {currentRequest.seller.expertise.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {currentRequest.seller.expertise.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{currentRequest.seller.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                <Link href={`/sellers/${currentRequest.seller_id}`}>
                  <Button variant="outline" className="w-full">
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentRequest.status === "PENDING" && (
                <Button variant="outline" className="w-full">
                  Edit Request
                </Button>
              )}

              <Button variant="outline" className="w-full">
                Message Seller
              </Button>

              {currentRequest.status === "RESPONDED" && <Button className="w-full">Review Responses</Button>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
