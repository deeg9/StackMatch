"use client"

import { useState, useEffect } from "react"
import { getErrorMessage } from "@/lib/utils/error-handler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Calendar, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

interface PaymentMilestone {
  id: string
  contract_id: string
  deal_room_id: string
  milestone_name: string
  description?: string
  due_date?: string
  amount: number
  currency: string
  status: "PENDING" | "AWAITING_APPROVAL" | "APPROVED_FOR_PAYMENT" | "IN_PROGRESS" | "PAID" | "REJECTED" | "CANCELLED"
  payment_provider_transaction_id?: string
  invoice_id?: string
  paid_at?: string
  approved_for_payment_by?: string
  approved_for_payment_at?: string
  created_at: string
  updated_at: string
}

interface PaymentMilestonesProps {
  contractId: string
  dealRoomId: string
  currentUserId: string
}

export function PaymentMilestones({ contractId, dealRoomId, currentUserId }: PaymentMilestonesProps) {
  const [milestones, setMilestones] = useState<PaymentMilestone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // New milestone form state
  const [newMilestone, setNewMilestone] = useState({
    milestone_name: "",
    description: "",
    due_date: "",
    amount: "",
    currency: "USD",
  })

  useEffect(() => {
    fetchMilestones()
  }, [contractId])

  const fetchMilestones = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/milestones`)
      if (!response.ok) throw new Error("Failed to fetch milestones")
      const data = await response.json()
      setMilestones(data)
    } catch (error: any) {
      toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMilestone = async () => {
    if (!newMilestone.milestone_name || !newMilestone.amount) {
      toast({ title: "Missing Information", description: "Name and amount are required.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/contracts/${contractId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMilestone,
          amount: Number.parseFloat(newMilestone.amount),
          deal_room_id: dealRoomId,
        }),
      })

      if (!response.ok) throw new Error("Failed to create milestone")

      await fetchMilestones()
      setIsDialogOpen(false)
      setNewMilestone({
        milestone_name: "",
        description: "",
        due_date: "",
        amount: "",
        currency: "USD",
      })
      toast({ title: "Success", description: "Payment milestone created successfully." })
    } catch (error: any) {
      toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (milestoneId: string, newStatus: PaymentMilestone["status"]) => {
    try {
      const response = await fetch(`/api/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update milestone")

      await fetchMilestones()
      toast({ title: "Success", description: "Milestone status updated." })
    } catch (error: any) {
      toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "APPROVED_FOR_PAYMENT":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case "REJECTED":
      case "CANCELLED":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "APPROVED_FOR_PAYMENT":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800"
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const totalAmount = milestones.reduce((sum, milestone) => sum + milestone.amount, 0)
  const paidAmount = milestones.filter((m) => m.status === "PAID").reduce((sum, milestone) => sum + milestone.amount, 0)

  if (isLoading) {
    return <div>Loading payment milestones...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Milestones
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Payment Milestone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="milestone-name">Milestone Name</Label>
                  <Input
                    id="milestone-name"
                    value={newMilestone.milestone_name}
                    onChange={(e) => setNewMilestone((prev) => ({ ...prev, milestone_name: e.target.value }))}
                    placeholder="e.g., Initial Payment, Delivery Milestone"
                  />
                </div>
                <div>
                  <Label htmlFor="milestone-description">Description</Label>
                  <Textarea
                    id="milestone-description"
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what triggers this payment..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="milestone-amount">Amount</Label>
                    <Input
                      id="milestone-amount"
                      type="number"
                      step="0.01"
                      value={newMilestone.amount}
                      onChange={(e) => setNewMilestone((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="milestone-currency">Currency</Label>
                    <Input
                      id="milestone-currency"
                      value={newMilestone.currency}
                      onChange={(e) => setNewMilestone((prev) => ({ ...prev, currency: e.target.value }))}
                      placeholder="USD"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="milestone-due-date">Due Date (Optional)</Label>
                  <Input
                    id="milestone-due-date"
                    type="date"
                    value={newMilestone.due_date}
                    onChange={(e) => setNewMilestone((prev) => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMilestone} disabled={isSubmitting}>
                  Create Milestone
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        {milestones.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Total: {formatCurrency(totalAmount, milestones[0]?.currency || "USD")} | Paid:{" "}
            {formatCurrency(paidAmount, milestones[0]?.currency || "USD")}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.length === 0 ? (
          <p className="text-muted-foreground">No payment milestones defined for this contract.</p>
        ) : (
          milestones.map((milestone) => (
            <Card key={milestone.id} className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(milestone.status)}
                      <span className="font-medium">{milestone.milestone_name}</span>
                      <Badge className={getStatusColor(milestone.status)}>{milestone.status.replace(/_/g, " ")}</Badge>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-lg text-foreground">
                        {formatCurrency(milestone.amount, milestone.currency)}
                      </span>
                      {milestone.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {format(new Date(milestone.due_date), "PPP")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {milestone.status === "PENDING" && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(milestone.id, "AWAITING_APPROVAL")}
                      variant="outline"
                    >
                      Request Approval
                    </Button>
                  </div>
                )}

                {milestone.status === "AWAITING_APPROVAL" && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(milestone.id, "APPROVED_FOR_PAYMENT")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve Payment
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(milestone.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {milestone.status === "APPROVED_FOR_PAYMENT" && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(milestone.id, "PAID")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Mark as Paid
                    </Button>
                  </div>
                )}

                {milestone.paid_at && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-green-600">✓ Paid on {format(new Date(milestone.paid_at), "PPP")}</p>
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
