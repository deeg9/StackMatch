"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Clock, MessageSquare, User } from "lucide-react"
import { format } from "date-fns"

interface Approval {
  id: string
  deal_room_id: string
  contract_id?: string
  contract_file_version_id?: string
  approver_id: string
  approver_role: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMMENTED" | "RECALLED"
  comments?: string
  approval_order: number
  approval_step_name?: string
  requested_at: string
  responded_at?: string
  created_by: string
  approver?: {
    id: string
    full_name?: string
    email?: string
  }
  creator?: {
    id: string
    full_name?: string
    email?: string
  }
}

interface ApprovalWorkflowProps {
  contractId: string
  dealRoomId: string
  currentUserId: string
}

export function ApprovalWorkflow({ contractId, dealRoomId, currentUserId }: ApprovalWorkflowProps) {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchApprovals()
  }, [contractId])

  const fetchApprovals = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/approvals`)
      if (!response.ok) throw new Error("Failed to fetch approvals")
      const data = await response.json()
      setApprovals(data)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprovalAction = async (approvalId: string, action: "APPROVED" | "REJECTED" | "COMMENTED") => {
    setIsSubmitting(approvalId)
    try {
      const response = await fetch(`/api/approvals/${approvalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          comments: comments[approvalId] || "",
        }),
      })

      if (!response.ok) throw new Error("Failed to update approval")

      await fetchApprovals() // Refresh the list
      setComments((prev) => ({ ...prev, [approvalId]: "" }))
      toast({
        title: "Approval Updated",
        description: `Successfully ${action.toLowerCase()} the request.`,
      })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSubmitting(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "COMMENTED":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "COMMENTED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (isLoading) {
    return <div>Loading approvals...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Approval Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvals.length === 0 ? (
          <p className="text-muted-foreground">No approval requests for this contract.</p>
        ) : (
          approvals
            .sort((a, b) => a.approval_order - b.approval_order)
            .map((approval) => (
              <Card key={approval.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(approval.status)}
                        <span className="font-medium">
                          {approval.approval_step_name || `${approval.approver_role} Approval`}
                        </span>
                        <Badge className={getStatusColor(approval.status)}>{approval.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Requested by {approval.creator?.full_name || "Unknown"} on{" "}
                        {format(new Date(approval.requested_at), "PPp")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Assigned to: {approval.approver?.full_name || approval.approver?.email || "Unknown"}
                      </p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">Step {approval.approval_order}</span>
                  </div>

                  {approval.comments && (
                    <div className="bg-muted p-3 rounded-md mb-3">
                      <p className="text-sm font-medium mb-1">Comments:</p>
                      <p className="text-sm">{approval.comments}</p>
                      {approval.responded_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Responded on {format(new Date(approval.responded_at), "PPp")}
                        </p>
                      )}
                    </div>
                  )}

                  {approval.status === "PENDING" && approval.approver_id === currentUserId && (
                    <div className="space-y-3 pt-3 border-t">
                      <div>
                        <Label htmlFor={`comments-${approval.id}`}>Comments (Optional)</Label>
                        <Textarea
                          id={`comments-${approval.id}`}
                          value={comments[approval.id] || ""}
                          onChange={(e) => setComments((prev) => ({ ...prev, [approval.id]: e.target.value }))}
                          placeholder="Add your comments..."
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprovalAction(approval.id, "APPROVED")}
                          disabled={isSubmitting === approval.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApprovalAction(approval.id, "REJECTED")}
                          disabled={isSubmitting === approval.id}
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprovalAction(approval.id, "COMMENTED")}
                          disabled={isSubmitting === approval.id}
                        >
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Comment Only
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </CardContent>
    </Card>
  )
}
