"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, CheckCircle, XCircle, Clock, Mail, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AffiliationRequest {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    profileImage?: string
  }
  requestedAt: string
  message?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

export function AffiliationRequestsTab() {
  const [requests, setRequests] = useState<AffiliationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Mock data for demonstration
  const mockRequests: AffiliationRequest[] = [
    {
      id: "req-1",
      user: {
        id: "user-1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        profileImage: "/placeholder.svg?height=40&width=40",
      },
      requestedAt: "2024-01-15T10:30:00Z",
      message: "Hi! I'm the new frontend developer joining the team. Looking forward to working with everyone!",
      status: "PENDING",
    },
    {
      id: "req-2",
      user: {
        id: "user-2",
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@email.com",
      },
      requestedAt: "2024-01-14T14:20:00Z",
      message: "Hello, I'm the new UX designer. I'd like to join the company profile.",
      status: "PENDING",
    },
    {
      id: "req-3",
      user: {
        id: "user-3",
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.rodriguez@email.com",
      },
      requestedAt: "2024-01-13T09:15:00Z",
      status: "PENDING",
    },
  ]

  useEffect(() => {
    // Mock API call to fetch pending requests
    const fetchRequests = async () => {
      setIsLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In real implementation, this would be:
        // const response = await fetch('/api/sellers/affiliations/pending')
        // const data = await response.json()

        setRequests(mockRequests)
      } catch (error) {
        console.error("Error fetching affiliation requests:", error)
        toast({
          title: "Error",
          description: "Failed to load affiliation requests. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [toast])

  const handleApproveRequest = async (requestId: string) => {
    setProcessingRequests((prev) => new Set(prev).add(requestId))

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real implementation, this would be:
      // const response = await fetch(`/api/sellers/affiliations/${requestId}/approve`, {
      //   method: 'POST'
      // })

      // Remove the request from the list (it's now approved)
      setRequests((prev) => prev.filter((req) => req.id !== requestId))

      const request = requests.find((req) => req.id === requestId)
      toast({
        title: "Request Approved",
        description: `${request?.user.firstName} ${request?.user.lastName} has been added to your company.`,
      })
    } catch (error) {
      console.error("Error approving request:", error)
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequests((prev) => new Set(prev).add(requestId))

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real implementation, this would be:
      // const response = await fetch(`/api/sellers/affiliations/${requestId}/reject`, {
      //   method: 'POST'
      // })

      // Remove the request from the list (it's now rejected)
      setRequests((prev) => prev.filter((req) => req.id !== requestId))

      const request = requests.find((req) => req.id === requestId)
      toast({
        title: "Request Rejected",
        description: `${request?.user.firstName} ${request?.user.lastName}'s request has been rejected.`,
      })
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Affiliation Requests</span>
            </CardTitle>
            <CardDescription>Manage requests from users who want to join your company profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading requests...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Affiliation Requests</span>
            {requests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {requests.length} pending
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Manage requests from users who want to join your company profile</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>No pending affiliation requests at this time.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={request.user.profileImage || "/placeholder.svg"}
                            alt={`${request.user.firstName} ${request.user.lastName}`}
                          />
                          <AvatarFallback>
                            {request.user.firstName[0]}
                            {request.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-lg">
                              {request.user.firstName} {request.user.lastName}
                            </h4>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{request.user.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Requested {formatDate(request.requestedAt)}</span>
                            </div>
                          </div>

                          {request.message && (
                            <div className="bg-muted p-3 rounded-md mb-4">
                              <p className="text-sm italic">"{request.message}"</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={processingRequests.has(request.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {processingRequests.has(request.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={processingRequests.has(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processingRequests.has(request.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Managing Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Approving a request:</strong> The user will be added to your company profile as a team member and
              can represent your company on StackMatch.
            </p>
            <p>
              <strong>Rejecting a request:</strong> The user will be notified that their request was not approved. They
              can create their own company profile if needed.
            </p>
            <p>
              <strong>Team member roles:</strong> Approved members will initially have "Member" status. You can manage
              roles and permissions in the Team Management section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
