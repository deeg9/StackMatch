"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { fetchProposalRequest, clearCurrentRequest } from "@/store/slices/proposalRequestsSlice"
import { ProposalResponseForm } from "@/components/proposal-requests/proposal-response-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Clock, DollarSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function RespondToProposalPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentRequest, isLoading, error } = useAppSelector((state) => state.proposalRequests)

  const requestId = params.id as string

  useEffect(() => {
    if (requestId) {
      dispatch(fetchProposalRequest(requestId))
    }

    return () => {
      dispatch(clearCurrentRequest())
    }
  }, [dispatch, requestId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !currentRequest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The proposal request could not be found."}</p>
          <Button onClick={() => router.push("/proposal-requests")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
        </div>
      </div>
    )
  }

  // Check if already responded
  const hasExistingResponse = currentRequest.responses && currentRequest.responses.length > 0

  if (hasExistingResponse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Already Responded</h1>
          <p className="text-gray-600 mb-6">You have already submitted a response to this proposal request.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => router.push("/proposal-requests")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Requests
            </Button>
            <Button onClick={() => router.push(`/proposal-requests/${requestId}`)}>View Request Details</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Respond to Proposal Request</h1>
        <p className="text-gray-600">Create your response to this proposal request</p>
      </div>

      {/* Request Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Request Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{currentRequest.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{currentRequest.buyer?.full_name || "Buyer"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(currentRequest.created_at))} ago</span>
              </div>
              <Badge className="ml-auto">{currentRequest.urgency_level}</Badge>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{currentRequest.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {(currentRequest.budget_min || currentRequest.budget_max) && (
              <div>
                <h4 className="font-medium text-sm text-gray-600">Budget Range</h4>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>
                    {currentRequest.budget_min && currentRequest.budget_max
                      ? `$${currentRequest.budget_min.toLocaleString()}-${currentRequest.budget_max.toLocaleString()}`
                      : currentRequest.budget_min
                        ? `$${currentRequest.budget_min.toLocaleString()}+`
                        : `≤$${currentRequest.budget_max?.toLocaleString()}`}
                  </span>
                </div>
              </div>
            )}

            {currentRequest.timeline_days && (
              <div>
                <h4 className="font-medium text-sm text-gray-600">Preferred Timeline</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{currentRequest.timeline_days} days</span>
                </div>
              </div>
            )}

            {currentRequest.deadline && (
              <div>
                <h4 className="font-medium text-sm text-gray-600">Deadline</h4>
                <span>{new Date(currentRequest.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {currentRequest.required_skills && currentRequest.required_skills.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {currentRequest.required_skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Form */}
      <ProposalResponseForm request={currentRequest} onSuccess={() => router.push(`/proposal-requests/${requestId}`)} />
    </div>
  )
}
