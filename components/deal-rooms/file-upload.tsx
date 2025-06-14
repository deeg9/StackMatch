"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { addFile } from "@/store/slices/dealRoomsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  dealRoomId: string
  userId: string
  userName: string
  onUploadComplete?: () => void
}

interface UploadFile {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
}

export function FileUpload({ dealRoomId, userId, userName, onUploadComplete }: FileUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [category, setCategory] = useState<string>("other")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const { toast } = useToast()

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadFile[] = Array.from(files).map((file) => ({
      file,
      id: `upload-${Date.now()}-${Math.random()}`,
      progress: 0,
      status: "pending",
    }))

    setUploadFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const uploadFile = async (uploadFile: UploadFile) => {
    const formData = new FormData()
    formData.append("file", uploadFile.file)
    formData.append("category", category)
    formData.append("uploadedBy", userId)
    formData.append("uploadedByName", userName)

    try {
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f)),
      )

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadFiles((prev) =>
          prev.map((f) => {
            if (f.id === uploadFile.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 }
            }
            return f
          }),
        )
      }, 200)

      const response = await fetch(`/api/deal-rooms/${dealRoomId}/files`, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()

      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed", progress: 100 } : f)),
      )

      // Add file to Redux store
      dispatch(addFile({ dealRoomId, file: result.file }))

      toast({
        title: "File uploaded successfully",
        description: `${uploadFile.file.name} has been uploaded to the deal room.`,
      })
    } catch (error) {
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "error", error: error instanceof Error ? error.message : "Upload failed" }
            : f,
        ),
      )

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      })
    }
  }

  const uploadAllFiles = async () => {
    const pendingFiles = uploadFiles.filter((f) => f.status === "pending")

    for (const file of pendingFiles) {
      await uploadFile(file)
    }

    // Close dialog after all uploads complete
    setTimeout(() => {
      const allCompleted = uploadFiles.every((f) => f.status === "completed" || f.status === "error")
      if (allCompleted) {
        setIsOpen(false)
        setUploadFiles([])
        onUploadComplete?.()
      }
    }, 1000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️"
    if (file.type.includes("pdf")) return "📄"
    if (file.type.includes("word")) return "📝"
    if (file.type.includes("excel") || file.type.includes("spreadsheet")) return "📊"
    if (file.type.includes("powerpoint") || file.type.includes("presentation")) return "📊"
    if (file.type.includes("zip") || file.type.includes("compressed")) return "🗜️"
    return "📎"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Files to Deal Room</DialogTitle>
          <DialogDescription>
            Upload documents, images, and other files to share with your project partner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">File Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proposal">Proposal Documents</SelectItem>
                <SelectItem value="contract">Contracts & Legal</SelectItem>
                <SelectItem value="deliverable">Deliverables</SelectItem>
                <SelectItem value="reference">Reference Materials</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, DOC, XLS, PPT, images, and ZIP files up to 50MB
            </p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.zip"
            />
          </div>

          {/* File List */}
          {uploadFiles.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <Label>Files to Upload ({uploadFiles.length})</Label>
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="text-2xl">{getFileIcon(uploadFile.file)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(uploadFile.file.size)}</p>
                    {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="mt-2 h-2" />}
                    {uploadFile.status === "error" && <p className="text-sm text-red-500 mt-1">{uploadFile.error}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {uploadFile.status === "pending" && <Badge variant="outline">Pending</Badge>}
                    {uploadFile.status === "uploading" && (
                      <Badge variant="outline">
                        <Upload className="h-3 w-3 mr-1" />
                        Uploading
                      </Badge>
                    )}
                    {uploadFile.status === "completed" && (
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                    {uploadFile.status === "error" && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    {uploadFile.status === "pending" && (
                      <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={uploadAllFiles}
            disabled={uploadFiles.length === 0 || uploadFiles.every((f) => f.status !== "pending")}
          >
            Upload {uploadFiles.filter((f) => f.status === "pending").length} Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
