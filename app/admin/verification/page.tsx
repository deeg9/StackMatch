"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  FileText,
  Award,
  Building,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Search,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface VerificationRequest {
  id: string
  providerId: string
  providerName: string
  type: "certification" | "business_registration" | "background_check"
  status: "pending" | "under_review" | "verified" | "rejected"
  submittedAt: string
  priority: "low" | "medium" | "high"
  documents: Array<{
    id: string
    name: string
    fileName: string
    fileSize: number
    type: string
  }>
  details: any
}

export default function AdminVerificationDashboard() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [reviewDecision, setReviewDecision] = useState<"approve" | "reject" | null>(null)

  useEffect(() => {
    fetchVerificationRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter, typeFilter])

  const fetchVerificationRequests = async () => {
    // Mock data for admin verification requests
    const mockRequests: VerificationRequest[] = [
      {
        id: "req-1",
        providerId: "provider-1",
        providerName: "TechFlow Solutions",
        type: "business_registration",
        status: "pending",
        submittedAt: "2024-01-20T10:30:00Z",
        priority: "high",
        documents: [
          {
            id: "doc-1",
            name: "Articles of Incorporation",
            fileName: "articles_of_incorporation.pdf",
            fileSize: 2048576,
            type: "business_registration",
          },
        ],
        details: {
          businessName: "TechFlow Solutions LLC",
          registrationNumber: "LLC-2014-SF-001234",
          registrationType: "llc",
          taxId: "12-3456789",
        },
      },
      {
        id: "req-2",
        providerId: "provider-2",
        providerName: "DataSync Pro",
        type: "certification",
        status: "under_review",
        submittedAt: "2024-01-19T14:20:00Z",
        priority: "medium",
        documents: [
          {
            id: "doc-2",
            name: "AWS Certificate",
            fileName: "aws_cert.pdf",
            fileSize: 1024768,
            type: "certification",
          },
        ],
        details: {
          name: "AWS Solutions Architect Professional",
          issuer: "Amazon Web Services",
          credentialId: "AWS-SAP-2023-789",
          issuedDate: "2023-06-15",
          expiryDate: "2026-06-15",
        },
      },
      {
        id: "req-3",
        providerId: "provider-3",
        providerName: "CloudTech Innovations",
        type: "certification",
        status: "pending",
        submittedAt: "2024-01-18T09:15:00Z",
        priority: "low",
        documents: [
          {
            id: "doc-3",
            name: "Salesforce Certificate",
            fileName: "sf_cert.pdf",
            fileSize: 856432,
            type: "certification",
          },
        ],
        details: {
          name: "Salesforce Certified System Architect",
          issuer: "Salesforce",
          credentialId: "SF-ARCH-2023-456",
          issuedDate: "2023-08-20",
          expiryDate: "2026-08-20",
        },
      },
    ]

    setRequests(mockRequests)
  }

  const filterRequests = () => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((req) => req.type === typeFilter)
    }

    setFilteredRequests(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "under_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleReview = (request: VerificationRequest) => {
    setSelectedRequest(request)
    setReviewNotes("")
    setReviewDecision(null)
    setIsReviewDialogOpen(true)
  }

  const submitReview = async () => {
    if (!selectedRequest || !reviewDecision) return

    // Mock API call to submit review
    const updatedStatus = reviewDecision === "approve" ? "verified" : "rejected"

    setRequests((prev) =>
      prev.map((req) => (req.id === selectedRequest.id ? { ...req, status: updatedStatus as any } : req)),
    )

    setIsReviewDialogOpen(false)
    setSelectedRequest(null)
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    underReview: requests.filter((r) => r.status === "under_review").length,
    verified: requests.filter((r) => r.status === "verified").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Verification Dashboard</h1>
          <p className="text-muted-foreground">Review and manage provider verification requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.underReview}</div>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by provider name or request ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="business_registration">Business Registration</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="background_check">Background Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {request.type === "business_registration" && (
                        <Building className="h-5 w-5 text-muted-foreground" />
                      )}
                      {request.type === "certification" && <Award className="h-5 w-5 text-muted-foreground" />}
                      {request.type === "background_check" && <Shield className="h-5 w-5 text-muted-foreground" />}
                      {getStatusIcon(request.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.providerName}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {request.type.replace("_", " ")} • ID: {request.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {formatDistanceToNow(new Date(request.submittedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getPriorityBadge(request.priority)}
                    {getStatusBadge(request.status)}
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {(request.status === "pending" || request.status === "under_review") && (
                        <Button size="sm" onClick={() => handleReview(request)}>
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Request Details Preview */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Details</h4>
                      {request.type === "business_registration" && (
                        <div className="space-y-1 text-sm">
                          <p>Business: {request.details.businessName}</p>
                          <p>Registration: {request.details.registrationNumber}</p>
                          <p>Type: {request.details.registrationType.toUpperCase()}</p>
                          <p>Tax ID: {request.details.taxId}</p>
                        </div>
                      )}
                      {request.type === "certification" && (
                        <div className="space-y-1 text-sm">
                          <p>Certification: {request.details.name}</p>
                          <p>Issuer: {request.details.issuer}</p>
                          <p>Credential ID: {request.details.credentialId}</p>
                          <p>Issued: {request.details.issuedDate}</p>
                          {request.details.expiryDate && <p>Expires: {request.details.expiryDate}</p>}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Documents ({request.documents.length})</h4>
                      <div className="space-y-1">
                        {request.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{doc.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">{formatFileSize(doc.fileSize)}</span>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Verification Requests</h3>
                <p className="text-muted-foreground">No requests match your current filters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Verification Request</DialogTitle>
              <DialogDescription>Review the verification request for {selectedRequest?.providerName}</DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Provider</Label>
                    <p className="text-sm">{selectedRequest.providerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-sm capitalize">{selectedRequest.type.replace("_", " ")}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Review Decision</Label>
                  <div className="flex space-x-4 mt-2">
                    <Button
                      variant={reviewDecision === "approve" ? "default" : "outline"}
                      onClick={() => setReviewDecision("approve")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant={reviewDecision === "reject" ? "destructive" : "outline"}
                      onClick={() => setReviewDecision("reject")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <Textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes about your review decision..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitReview} disabled={!reviewDecision}>
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
