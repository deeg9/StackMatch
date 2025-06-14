"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addApplication } from "@/store/slices/endorsementsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, FileText, X, Plus, AlertCircle } from "lucide-react"
import type { PartnerPlatform } from "@/store/slices/endorsementsSlice"

interface ApplicationFormProps {
  platform: PartnerPlatform
  onSubmit: () => void
  onCancel: () => void
}

interface FileUpload {
  id: string
  name: string
  type: string
  size: number
  file: File
}

export function ApplicationForm({ platform, onSubmit, onCancel }: ApplicationFormProps) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    badgeType: "",
    badgeLevel: "",
    yearsOfExperience: "",
    projectsCompleted: "",
    clientSatisfactionScore: "",
    additionalInfo: "",
  })

  const [certifications, setCertifications] = useState<string[]>([])
  const [newCertification, setNewCertification] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications((prev) => [...prev, newCertification.trim()])
      setNewCertification("")
    }
  }

  const removeCertification = (cert: string) => {
    setCertifications((prev) => prev.filter((c) => c !== cert))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    files.forEach((file) => {
      const fileUpload: FileUpload = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
      }
      setUploadedFiles((prev) => [...prev, fileUpload])
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)

    try {
      // Create application
      const application = {
        id: Math.random().toString(36).substr(2, 9),
        providerId: "current-user-id", // This would come from auth state
        platformId: platform.id,
        requestedBadgeType: formData.badgeType,
        requestedLevel: formData.badgeLevel,
        applicationDate: new Date().toISOString(),
        status: "pending" as const,
        submittedEvidence: {
          certifications: certifications,
          projectPortfolio: [], // Would be populated from uploaded files
          clientReferences: [], // Would be populated from uploaded files
          additionalDocuments: uploadedFiles.map((f) => f.id),
        },
      }

      dispatch(addApplication(application))
      onSubmit()
    } catch (error) {
      console.error("Failed to submit application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.badgeType &&
      formData.badgeLevel &&
      formData.yearsOfExperience &&
      formData.projectsCompleted &&
      certifications.length > 0 &&
      agreedToTerms
    )
  }

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <img src={platform.logo || "/placeholder.svg"} alt={platform.name} className="h-12 w-12 rounded-lg" />
            <div>
              <CardTitle>{platform.name} Partnership Application</CardTitle>
              <p className="text-sm text-muted-foreground">{platform.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-medium">Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Minimum {platform.endorsementCriteria.minimumCertifications} certifications</li>
              <li>• Minimum {platform.endorsementCriteria.minimumProjects} completed projects</li>
              <li>• Minimum {platform.endorsementCriteria.minimumRating} average rating</li>
              <li>• Required training: {platform.endorsementCriteria.requiredTraining.join(", ")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="badgeType">Badge Type</Label>
            <Select value={formData.badgeType} onValueChange={(value) => handleInputChange("badgeType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select badge type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certified_partner">Certified Partner</SelectItem>
                <SelectItem value="premier_partner">Premier Partner</SelectItem>
                <SelectItem value="implementation_specialist">Implementation Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="badgeLevel">Badge Level</Label>
            <Select value={formData.badgeLevel} onValueChange={(value) => handleInputChange("badgeLevel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select badge level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
              placeholder="e.g., 5"
            />
          </div>

          <div>
            <Label htmlFor="projects">Projects Completed</Label>
            <Input
              id="projects"
              type="number"
              value={formData.projectsCompleted}
              onChange={(e) => handleInputChange("projectsCompleted", e.target.value)}
              placeholder="e.g., 25"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="satisfaction">Client Satisfaction Score</Label>
            <Input
              id="satisfaction"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.clientSatisfactionScore}
              onChange={(e) => handleInputChange("clientSatisfactionScore", e.target.value)}
              placeholder="e.g., 4.8"
            />
          </div>

          <div>
            <Label>Certifications</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add certification ID or name"
                onKeyPress={(e) => e.key === "Enter" && addCertification()}
              />
              <Button type="button" size="sm" onClick={addCertification}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <Badge key={cert} variant="secondary" className="flex items-center space-x-1">
                  <span>{cert}</span>
                  <button onClick={() => removeCertification(cert)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <Label>Supporting Documents</Label>
        <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload certificates, project portfolios, or client references
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div>
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          value={formData.additionalInfo}
          onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
          placeholder="Provide any additional information that supports your application..."
          rows={4}
        />
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
        <div className="text-sm">
          <label htmlFor="terms" className="cursor-pointer">
            I agree to the{" "}
            <a href="#" className="text-primary hover:underline">
              terms and conditions
            </a>{" "}
            and confirm that all information provided is accurate and verifiable.
          </label>
        </div>
      </div>

      {/* Form Validation Warning */}
      {!isFormValid() && (
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Please complete all required fields and agree to the terms to submit your application.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isFormValid() || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  )
}
