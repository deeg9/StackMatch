"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, FileText, ImageIcon, File } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ProjectDetails, FileAttachment } from "@/types/guided-listing-types"

interface ProjectLogisticsProps {
  projectDetails: ProjectDetails
  onUpdate: (details: ProjectDetails) => void
}

export default function ProjectLogistics({ projectDetails, onUpdate }: ProjectLogisticsProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: keyof ProjectDetails, value: any) => {
    onUpdate({
      ...projectDetails,
      [field]: value,
    })
  }

  const handleBudgetChange = (field: "min" | "max", value: string) => {
    const numValue = Number.parseInt(value) || 0
    onUpdate({
      ...projectDetails,
      budgetRange: {
        ...projectDetails.budgetRange,
        [field]: numValue,
      },
    })
  }

  const handleCommunicationChange = (method: string, checked: boolean) => {
    const current = projectDetails.preferredCommunication || []
    if (checked) {
      onUpdate({
        ...projectDetails,
        preferredCommunication: [...current, method],
      })
    } else {
      onUpdate({
        ...projectDetails,
        preferredCommunication: current.filter((m) => m !== method),
      })
    }
  }

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      setIsUploading(true)

      try {
        const uploadedFiles: FileAttachment[] = []

        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          // Mock file upload - in production, upload to actual storage
          const mockFileAttachment: FileAttachment = {
            id: `file-${Date.now()}-${i}`,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          }

          uploadedFiles.push(mockFileAttachment)
        }

        onUpdate({
          ...projectDetails,
          files: [...(projectDetails.files || []), ...uploadedFiles],
        })

        toast({
          title: "Files uploaded",
          description: `${uploadedFiles.length} file(s) uploaded successfully.`,
        })
      } catch (error) {
        console.error("Error uploading files:", error)
        toast({
          title: "Upload failed",
          description: "Failed to upload files. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    },
    [projectDetails, onUpdate, toast],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileUpload(files)
      }
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (fileId: string) => {
    onUpdate({
      ...projectDetails,
      files: (projectDetails.files || []).filter((f) => f.id !== fileId),
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (fileType.includes("pdf") || fileType.includes("document")) return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Project Details</h2>
        <p className="text-lg text-slate-400">Timeline, budget, and logistics information.</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Budget Range (USD)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={projectDetails.budgetRange.min || ""}
                  onChange={(e) => handleBudgetChange("min", e.target.value)}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  className="bg-slate-700 border-slate-600 text-white"
                  value={projectDetails.budgetRange.max || ""}
                  onChange={(e) => handleBudgetChange("max", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Timeline</Label>
              <Select value={projectDetails.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="3-months">Within 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Work Preferences */}
          <div className="space-y-4">
            <Label className="text-white">Work Preferences</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Location Preference</Label>
                <Select
                  value={projectDetails.locationPreference}
                  onValueChange={(value: "remote" | "onsite" | "hybrid") =>
                    handleInputChange("locationPreference", value)
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select location preference..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote work only</SelectItem>
                    <SelectItem value="onsite">On-site work required</SelectItem>
                    <SelectItem value="hybrid">Hybrid (mix of remote and on-site)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Time Zone (if remote)</Label>
                <Input
                  placeholder="e.g., EST, PST, GMT+1"
                  value={projectDetails.timeZone || ""}
                  onChange={(e) => handleInputChange("timeZone", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Preferred Communication Methods</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "email", label: "Email" },
                  { value: "slack", label: "Slack" },
                  { value: "zoom", label: "Zoom/Video calls" },
                  { value: "phone", label: "Phone calls" },
                  { value: "teams", label: "Microsoft Teams" },
                  { value: "discord", label: "Discord" },
                ].map((method) => (
                  <div key={method.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={method.value}
                      checked={(projectDetails.preferredCommunication || []).includes(method.value)}
                      onCheckedChange={(checked) => handleCommunicationChange(method.value, checked as boolean)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Label htmlFor={method.value} className="text-sm text-white">
                      {method.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label className="text-white">Project Files</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-600 mb-2">
                Drag and drop files here, or{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-blue-600"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  browse files
                </Button>
              </p>
              <p className="text-xs text-slate-400">Supports: PDF, DOC, DOCX, PNG, JPG, GIF (max 10MB each)</p>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
              />
            </div>

            {/* Uploaded Files */}
            {projectDetails.files && projectDetails.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label className="text-white">Uploaded Files</Label>
                <div className="space-y-2">
                  {projectDetails.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-slate-500">({formatFileSize(file.size)})</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <Label className="text-white">Additional Information</Label>
            <Textarea
              placeholder="Describe any specific requirements, constraints, or additional context for your project..."
              value={projectDetails.additionalInfo}
              onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
              rows={4}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
