"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Download,
  MoreVertical,
  Search,
  Filter,
  FileText,
  ImageIcon,
  Archive,
  File,
  Trash2,
  Eye,
  Upload,
  History,
  GitBranch,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface DealRoomFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedBy: string
  uploadedByName: string
  uploadedByAvatar?: string
  uploadedAt: string
  category: string
  description?: string
  version: number
  isLatest: boolean
  parentFileId?: string
  source: string
  isInherited: boolean
  canDelete: boolean
  canEdit: boolean
}

interface FileVersion {
  id: string
  version: number
  uploadedAt: string
  uploadedBy: string
  uploadedByName: string
  size: number
  description?: string
  isCurrent: boolean
  url: string
}

interface UploadFile {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
}

interface EnhancedFileManagerProps {
  dealRoomId: string
}

export function EnhancedFileManager({ dealRoomId }: EnhancedFileManagerProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const { toast } = useToast()

  const [files, setFiles] = useState<DealRoomFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showVersions, setShowVersions] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Upload state
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [uploadCategory, setUploadCategory] = useState<string>("OTHER")
  const [uploadDescription, setUploadDescription] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Version upload state
  const [versionUploadFile, setVersionUploadFile] = useState<DealRoomFile | null>(null)
  const [isVersionUploadOpen, setIsVersionUploadOpen] = useState(false)
  const [selectedVersionFile, setSelectedVersionFile] = useState<File | null>(null)
  const [versionDescription, setVersionDescription] = useState("")
  const [isVersionUploading, setIsVersionUploading] = useState(false)

  // Version history state
  const [versionHistoryFile, setVersionHistoryFile] = useState<DealRoomFile | null>(null)
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false)
  const [fileVersions, setFileVersions] = useState<FileVersion[]>([])
  const [loadingVersions, setLoadingVersions] = useState(false)

  // Delete state
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch files
  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log(`🔍 FILE MANAGER: Fetching files for deal room ${dealRoomId}...`)
      const response = await fetch(`/api/deal-rooms/${dealRoomId}/files?includeVersions=${showVersions}`)

      // Check if response is ok
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`

        try {
          // Try to parse error as JSON
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            // If not JSON, get text
            const errorText = await response.text()
            errorMessage = `${errorMessage}: ${errorText.substring(0, 100)}`
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }

        throw new Error(errorMessage)
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()
      console.log(`🔍 FILE MANAGER: Fetched ${data.files?.length || 0} files`)

      setFiles(data.files || [])

      // Reset retry count on success
      setRetryCount(0)
    } catch (error) {
      console.error("Error fetching files:", error)
      setError(error instanceof Error ? error.message : "Failed to load files")

      toast({
        title: "Failed to load files",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
        action:
          retryCount < 3 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRetryCount((prev) => prev + 1)
                fetchFiles()
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          ) : undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [dealRoomId, showVersions])

  // Filter and sort files
  const filteredFiles = files
    .filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || file.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case "oldest":
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return b.size - a.size
        default:
          return 0
      }
    })

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    console.log("🔍 FILE MANAGER: Files selected:", files.length)

    const newFiles: UploadFile[] = Array.from(files).map((file) => ({
      file,
      id: `upload-${Date.now()}-${Math.random()}`,
      progress: 0,
      status: "pending",
    }))

    setUploadFiles((prev) => [...prev, ...newFiles])
    console.log("🔍 FILE MANAGER: Upload files updated, total:", uploadFiles.length + newFiles.length)
  }

  const removeUploadFile = (fileId: string) => {
    console.log("🔍 FILE MANAGER: Removing upload file:", fileId)
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const uploadFile = async (uploadFile: UploadFile) => {
    const formData = new FormData()
    formData.append("file", uploadFile.file)
    formData.append("category", uploadCategory)
    formData.append("description", uploadDescription)

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

      console.log(`🔍 FILE MANAGER: Uploading file ${uploadFile.file.name}...`)
      const response = await fetch(`/api/deal-rooms/${dealRoomId}/files`, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      // Check if response is ok
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`

        try {
          // Try to parse error as JSON
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            // If not JSON, get text
            const errorText = await response.text()
            errorMessage = `${errorMessage}: ${errorText.substring(0, 100)}`
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Upload failed")
      }

      console.log(`🔍 FILE MANAGER: File uploaded successfully: ${result.file?.id}`)

      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed", progress: 100 } : f)),
      )

      toast({
        title: "File uploaded successfully",
        description: `${uploadFile.file.name} has been uploaded to the deal room.`,
      })

      // Refresh files list
      fetchFiles()
    } catch (error) {
      console.error("Error uploading file:", error)

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
    console.log("🔍 FILE MANAGER: Starting upload of all files...")
    const pendingFiles = uploadFiles.filter((f) => f.status === "pending")
    console.log("🔍 FILE MANAGER: Pending files to upload:", pendingFiles.length)

    for (const file of pendingFiles) {
      await uploadFile(file)
    }

    // Close dialog after all uploads complete
    setTimeout(() => {
      const allCompleted = uploadFiles.every((f) => f.status === "completed" || f.status === "error")
      if (allCompleted) {
        console.log("🔍 FILE MANAGER: All uploads completed, closing dialog")
        setIsUploadOpen(false)
        setUploadFiles([])
        setUploadDescription("")
      }
    }, 1000)
  }

  const handleVersionUpload = async () => {
    if (!selectedVersionFile || !versionUploadFile || !user) return

    setIsVersionUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedVersionFile)
      formData.append("parentFileId", versionUploadFile.id)
      formData.append("category", versionUploadFile.category)
      formData.append("description", versionDescription)

      console.log(`🔍 FILE MANAGER: Uploading new version of ${versionUploadFile.name}...`)
      const response = await fetch(`/api/deal-rooms/${dealRoomId}/files`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`

        try {
          // Try to parse error as JSON
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            // If not JSON, get text
            const errorText = await response.text()
            errorMessage = `${errorMessage}: ${errorText.substring(0, 100)}`
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log(`🔍 FILE MANAGER: New version uploaded successfully: ${result.file?.id}`)

      toast({
        title: "New version uploaded",
        description: `Version ${result.file.version} of ${versionUploadFile.name} has been uploaded successfully.`,
      })

      // Reset form
      setSelectedVersionFile(null)
      setVersionDescription("")
      setIsVersionUploadOpen(false)
      setVersionUploadFile(null)

      // Refresh files
      fetchFiles()
    } catch (error) {
      console.error("Error uploading version:", error)

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload new version",
        variant: "destructive",
      })
    } finally {
      setIsVersionUploading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    setIsDeleting(true)
    try {
      console.log(`🔍 FILE MANAGER: Deleting file ${fileId}...`)
      const response = await fetch(`/api/deal-rooms/${dealRoomId}/files?fileId=${fileId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`

        try {
          // Try to parse error as JSON
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            // If not JSON, get text
            const errorText = await response.text()
            errorMessage = `${errorMessage}: ${errorText.substring(0, 100)}`
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }

        throw new Error(errorMessage)
      }

      console.log(`🔍 FILE MANAGER: File deleted successfully`)

      toast({
        title: "File deleted",
        description: "The file has been successfully deleted.",
      })

      // Refresh files
      fetchFiles()
    } catch (error) {
      console.error("Error deleting file:", error)

      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete the file",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteFileId(null)
    }
  }

  const handleDownload = (file: DealRoomFile) => {
    try {
      console.log(`🔍 FILE MANAGER: Downloading file ${file.id}...`)
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download started",
        description: `Downloading ${file.name}`,
      })
    } catch (error) {
      console.error("Error downloading file:", error)

      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (file: DealRoomFile) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    }
    if (file.type.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />
    }
    if (file.type.includes("zip") || file.type.includes("compressed")) {
      return <Archive className="h-8 w-8 text-yellow-500" />
    }
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CONTRACT":
        return "bg-blue-100 text-blue-800"
      case "SCOPE_DOCUMENT":
        return "bg-green-100 text-green-800"
      case "DELIVERABLE":
        return "bg-purple-100 text-purple-800"
      case "INVOICE":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    fetchFiles()
  }

  const handleUploadClick = () => {
    console.log("🔍 FILE MANAGER: Upload button clicked")
    setIsUploadOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Files & Documents</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-versions"
                checked={showVersions}
                onCheckedChange={(checked) => setShowVersions(checked as boolean)}
              />
              <Label htmlFor="show-versions" className="text-sm">
                Show all versions
              </Label>
            </div>
            <Button onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="CONTRACT">Contracts</SelectItem>
              <SelectItem value="SCOPE_DOCUMENT">Scope Documents</SelectItem>
              <SelectItem value="DELIVERABLE">Deliverables</SelectItem>
              <SelectItem value="INVOICE">Invoices</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Loading files...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading files</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="font-medium truncate">{file.name}</p>
                      {file.version > 1 && (
                        <Badge variant="outline" className="ml-2">
                          v{file.version}
                        </Badge>
                      )}
                      {!file.isLatest && (
                        <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                          Outdated
                        </Badge>
                      )}
                      {file.isInherited && (
                        <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                          From {file.source}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}</span>
                    </div>
                    {file.description && <p className="text-sm mt-1 text-muted-foreground">{file.description}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(file.category)}>{file.category.replace("_", " ")}</Badge>
                  <div className="flex items-center space-x-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={file.uploadedByAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {file.uploadedByName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground hidden sm:inline">{file.uploadedByName}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      {file.isLatest && !file.isInherited && (
                        <DropdownMenuItem
                          onClick={() => {
                            setVersionUploadFile(file)
                            setIsVersionUploadOpen(true)
                          }}
                        >
                          <GitBranch className="h-4 w-4 mr-2" />
                          Upload New Version
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setVersionHistoryFile(file)
                          setIsVersionHistoryOpen(true)
                        }}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Version History
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {file.canDelete && user?.id === file.uploadedBy && (
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteFileId(file.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Upload files to share with your project partner"}
            </p>
            <Button onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        )}
      </CardContent>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Files to Deal Room</DialogTitle>
            <DialogDescription>
              Upload documents, images, and other files to share with your project partner.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Category and Description */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">File Category</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTRACT">Contract Documents</SelectItem>
                    <SelectItem value="SCOPE_DOCUMENT">Scope Documents</SelectItem>
                    <SelectItem value="DELIVERABLE">Deliverables</SelectItem>
                    <SelectItem value="INVOICE">Invoices</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>
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
                    <div className="text-2xl">📄</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{uploadFile.file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(uploadFile.file.size)}</p>
                      {uploadFile.status === "uploading" && (
                        <Progress value={uploadFile.progress} className="mt-2 h-2" />
                      )}
                      {uploadFile.status === "error" && <p className="text-sm text-red-500 mt-1">{uploadFile.error}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadFile.status === "pending" && <Badge variant="outline">Pending</Badge>}
                      {uploadFile.status === "uploading" && (
                        <Badge variant="outline">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
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
                        <Button variant="ghost" size="sm" onClick={() => removeUploadFile(uploadFile.id)}>
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
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
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

      {/* Version Upload Dialog */}
      <Dialog open={isVersionUploadOpen} onOpenChange={setIsVersionUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload New Version</DialogTitle>
            <DialogDescription>
              Upload a new version of <span className="font-medium">{versionUploadFile?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="version-file">Select File</Label>
              <Input
                id="version-file"
                type="file"
                onChange={(e) => setSelectedVersionFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version-description">Version Notes (Optional)</Label>
              <Textarea
                id="version-description"
                placeholder="Describe what changed in this version..."
                value={versionDescription}
                onChange={(e) => setVersionDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVersionUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVersionUpload} disabled={!selectedVersionFile || isVersionUploading}>
              {isVersionUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Upload New Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteFileId} onOpenChange={(open) => !open && setDeleteFileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file and all its versions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFileId && handleDelete(deleteFileId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
