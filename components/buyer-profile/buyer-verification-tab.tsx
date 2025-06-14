"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Upload, FileText, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED"

type VerificationDocument = {
  id: string
  document_type: string
  file_url?: string
  status: "UPLOADED" | "VERIFIED" | "REJECTED"
  uploaded_at: string
  notes?: string
}

interface BuyerVerificationTabProps {
  buyerProfileId: string
}

const BuyerVerificationTab = ({ buyerProfileId }: BuyerVerificationTabProps) => {
  const { profile } = useSelector((state: RootState) => state.buyerProfile)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("UNVERIFIED")
  const [uploadedDocuments, setUploadedDocuments] = useState<VerificationDocument[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch verification status and documents
    const fetchVerificationData = async () => {
      if (!profile?.id) return

      try {
        const response = await fetch(`/api/buyer-profiles/verification?profileId=${profile.id}`)
        if (response.ok) {
          const data = await response.json()
          setVerificationStatus(data.status || "UNVERIFIED")
          setUploadedDocuments(data.documents || [])
        }
      } catch (error) {
        console.error("Failed to fetch verification data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVerificationData()
  }, [profile?.id])

  // Mock document upload
  const handleDocumentUpload = () => {
    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        setUploadProgress(0)

        // Add mock document
        const newDoc = {
          id: `doc-${Date.now()}`,
          document_type: "Business Registration Certificate",
          file_url: "",
          status: "UPLOADED" as const,
          uploaded_at: new Date().toISOString(),
          notes: "",
        }

        setUploadedDocuments([...uploadedDocuments, newDoc])

        // If this is the first document, change status to PENDING
        if (verificationStatus === "UNVERIFIED") {
          setVerificationStatus("PENDING")
        }
      }
    }, 300)
  }

  const handleDeleteDocument = (docId: string) => {
    setUploadedDocuments(uploadedDocuments.filter((doc) => doc.id !== docId))

    // If no documents left, change status back to UNVERIFIED
    if (uploadedDocuments.length <= 1) {
      setVerificationStatus("UNVERIFIED")
    }
  }

  const handleSubmitVerification = () => {
    // In a real app, this would call an API
    setVerificationStatus("PENDING")
  }

  // For demo purposes, allow toggling verification status
  const handleToggleVerificationStatus = () => {
    if (verificationStatus === "UNVERIFIED") setVerificationStatus("PENDING")
    else if (verificationStatus === "PENDING") setVerificationStatus("VERIFIED")
    else if (verificationStatus === "VERIFIED") setVerificationStatus("REJECTED")
    else setVerificationStatus("UNVERIFIED")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "REJECTED":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Buyer Verification</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Buyer Verification</h2>
        <Badge
          className={`cursor-pointer ${getStatusColor(verificationStatus)}`}
          onClick={handleToggleVerificationStatus} // For demo only
        >
          {verificationStatus}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>
            Get verified to increase your credibility with sellers and unlock premium features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationStatus === "UNVERIFIED" && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your buyer account is not verified. Please upload the required documents to start the verification
                      process.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === "PENDING" && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Your verification is being reviewed. This process typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === "VERIFIED" && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Your buyer account is verified! You now have access to all premium features.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === "REJECTED" && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Your verification was rejected. Please review the feedback and resubmit with the correct
                      documents.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Required Documents</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Business registration or incorporation certificate</li>
                <li>Company ID or tax registration number</li>
                <li>Proof of business address (utility bill, lease agreement)</li>
                <li>Government-issued ID of company representative</li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Uploaded Documents</h3>

              {uploadedDocuments.length === 0 ? (
                <p className="text-gray-500">No documents uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        {getDocumentStatusIcon(doc.status)}
                        <span className="ml-2">{doc.document_type}</span>
                        <Badge className={`ml-2 ${getStatusColor(doc.status)}`} variant="outline">
                          {doc.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Uploading document...</p>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="mt-4">
                <Button onClick={handleDocumentUpload} disabled={isUploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </div>

            {uploadedDocuments.length > 0 && verificationStatus !== "VERIFIED" && verificationStatus !== "PENDING" && (
              <div className="mt-6">
                <Button onClick={handleSubmitVerification}>Submit for Verification</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BuyerVerificationTab
