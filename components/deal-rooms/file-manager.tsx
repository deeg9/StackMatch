"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { removeFile, type DealRoomFile } from "@/store/slices/dealRoomsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Share,
  Upload,
  History,
  GitBranch,
  GitCompare,
  ArrowLeftRight,
  Calendar,
  User,
  FileIcon as FileSize,
  MessageSquare,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "./file-upload"
import { FilePreview } from "./file-preview"

interface FileVersion {
  id: string
  versionNumber: string
  uploadedAt: string
  uploadedBy: string
  uploadedByName: string
  size: number
  changeNotes: string
  isCurrent: boolean
  url: string
}

interface FileManagerProps {
  dealRoomId: string
}

export function FileManager({ dealRoomId }: FileManagerProps) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { user } = useSelector((state: RootState) => state.auth)
  const { activeDealRoom } = useSelector((state: RootState) => state.dealRooms)

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [previewFile, setPreviewFile] = useState<DealRoomFile | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Version upload state
  const [versionUploadFile, setVersionUploadFile] = useState<DealRoomFile | null>(null)
  const [isVersionUploadOpen, setIsVersionUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [changeNotes, setChangeNotes] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  // Version history state
  const [versionHistoryFile, setVersionHistoryFile] = useState<DealRoomFile | null>(null)
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false)

  // Version comparison state
  const [selectedVersions, setSelectedVersions] = useState<FileVersion[]>([])
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  const files = activeDealRoom?.files || []

  // Mock version data for demonstration
  const getFileVersions = (fileId: string): FileVersion[] => [
    {
      id: `${fileId}-v3`,
      versionNumber: "3.0",
      uploadedAt: "2024-01-20T14:30:00Z",
      uploadedBy: "user-1",
      uploadedByName: "John Smith",
      size: 2150000,
      changeNotes:
        "Updated project timeline and added new requirements section. Revised budget calculations based on latest market research. Added risk assessment matrix.",
      isCurrent: true,
      url: "/placeholder.svg?height=800&width=600&text=Version+3.0",
    },
    {
      id: `${fileId}-v2`,
      versionNumber: "2.1",
      uploadedAt: "2024-01-18T10:15:00Z",
      uploadedBy: "user-2",
      uploadedByName: "Sarah Johnson",
      size: 2048000,
      changeNotes:
        "Fixed formatting issues and corrected budget calculations. Updated contact information and legal disclaimers.",
      isCurrent: false,
      url: "/placeholder.svg?height=800&width=600&text=Version+2.1",
    },
    {
      id: `${fileId}-v1`,
      versionNumber: "1.0",
      uploadedAt: "2024-01-15T09:00:00Z",
      uploadedBy: "user-1",
      uploadedByName: "John Smith",
      size: 1950000,
      changeNotes: "Initial version of the project proposal with basic requirements and timeline.",
      isCurrent: false,
      url: "/placeholder.svg?height=800&width=600&text=Version+1.0",
    },
  ]

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

  const handleDownload = (file: DealRoomFile) => {
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
  }

  const handleDelete = async (fileId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/deal-rooms/${dealRoomId}/files?fileId=${fileId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      dispatch(removeFile({ dealRoomId, fileId }))

      toast({
        title: "File deleted",
        description: "The file has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setDeleteFileId(null)
    }
  }

  const handlePreview = (file: DealRoomFile) => {
    setPreviewFile(file)
    setIsPreviewOpen(true)
  }

  const handleVersionUpload = (file: DealRoomFile) => {
    setVersionUploadFile(file)
    setIsVersionUploadOpen(true)
  }

  const handleVersionHistory = (file: DealRoomFile) => {
    setVersionHistoryFile(file)
    setIsVersionHistoryOpen(true)
    setIsComparisonMode(false)
    setSelectedVersions([])
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUploadNewVersion = async () => {
    if (!selectedFile || !versionUploadFile || !user) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("originalFileId", versionUploadFile.id)
      formData.append("changeNotes", changeNotes)
      formData.append("uploadedBy", user.id)
      formData.append("uploadedByName", user.name)

      const response = await fetch(`/api/deal-rooms/${dealRoomId}/files/${versionUploadFile.id}/versions`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload new version")
      }

      const result = await response.json()

      toast({
        title: "New version uploaded",
        description: `Version ${result.versionNumber} of ${versionUploadFile.name} has been uploaded successfully.`,
      })

      // Reset form
      setSelectedFile(null)
      setChangeNotes("")
      setIsVersionUploadOpen(false)
      setVersionUploadFile(null)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload new version. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleVersionSelection = (version: FileVersion, checked: boolean) => {
    if (checked) {
      if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, version])
      } else {
        // Replace the first selected version
        setSelectedVersions([selectedVersions[1], version])
      }
    } else {
      setSelectedVersions(selectedVersions.filter((v) => v.id !== version.id))
    }
  }

  const handleStartComparison = () => {
    if (selectedVersions.length === 2) {
      setIsComparisonOpen(true)
    }
  }

  const handleCompareVersions = (file: DealRoomFile) => {
    const versions = getFileVersions(file.id)
    if (versions.length >= 2) {
      // Auto-select current and previous version for quick comparison
      setSelectedVersions([versions[0], versions[1]])
      setIsComparisonOpen(true)
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
      case "proposal":
        return "bg-blue-100 text-blue-800"
      case "contract":
        return "bg-green-100 text-green-800"
      case "deliverable":
        return "bg-purple-100 text-purple-800"
      case "reference":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSizeDifference = (size1: number, size2: number) => {
    const diff = size1 - size2
    const percentage = ((diff / size2) * 100).toFixed(1)
    return {
      diff,
      percentage: Number.parseFloat(percentage),
      isIncrease: diff > 0,
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Files & Documents</CardTitle>
          {user && <FileUpload dealRoomId={dealRoomId} userId={user.id} userName={user.name} />}
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
              <SelectItem value="proposal">Proposals</SelectItem>
              <SelectItem value="contract">Contracts</SelectItem>
              <SelectItem value="deliverable">Deliverables</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
        {filteredFiles.length > 0 ? (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <Badge className={getCategoryColor(file.category)} variant="secondary">
                        {file.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <GitBranch className="h-3 w-3 mr-1" />
                        v3.0
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">{file.uploadedByName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{file.uploadedByName}</span>
                      </div>
                      <span>{formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                    <Download className="h-4 w-4" />
                  </Button>

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
                      <DropdownMenuItem onClick={() => handlePreview(file)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleVersionUpload(file)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Version
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleVersionHistory(file)}>
                        <History className="h-4 w-4 mr-2" />
                        Version History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCompareVersions(file)}>
                        <GitCompare className="h-4 w-4 mr-2" />
                        Compare Versions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share Link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => setDeleteFileId(file.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all"
                ? "No files match your current filters."
                : "Upload files to start sharing documents with your project partner."}
            </p>
            {user && <FileUpload dealRoomId={dealRoomId} userId={user.id} userName={user.name} />}
          </div>
        )}
      </CardContent>

      {/* Version Upload Dialog */}
      <Dialog open={isVersionUploadOpen} onOpenChange={setIsVersionUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Version</DialogTitle>
            <DialogDescription>
              Upload a new version of "{versionUploadFile?.name}". This will create version 4.0.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="version-file">Select File</Label>
              <Input
                id="version-file"
                type="file"
                onChange={handleFileSelect}
                accept={versionUploadFile?.type}
                className="mt-1"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="change-notes">Change Notes</Label>
              <Textarea
                id="change-notes"
                placeholder="Describe what changed in this version..."
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVersionUploadOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadNewVersion}
              disabled={!selectedFile || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? "Uploading..." : "Upload Version"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={isVersionHistoryOpen} onOpenChange={setIsVersionHistoryOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Version History</DialogTitle>
                <DialogDescription>All versions of "{versionHistoryFile?.name}"</DialogDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsComparisonMode(!isComparisonMode)}
                  className={isComparisonMode ? "bg-blue-50 border-blue-200" : ""}
                >
                  <GitCompare className="h-4 w-4 mr-2" />
                  {isComparisonMode ? "Exit Compare" : "Compare Mode"}
                </Button>
                {isComparisonMode && selectedVersions.length === 2 && (
                  <Button size="sm" onClick={handleStartComparison} className="bg-blue-600 hover:bg-blue-700">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Compare Selected
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {versionHistoryFile &&
              getFileVersions(versionHistoryFile.id).map((version) => (
                <div
                  key={version.id}
                  className={`p-4 border rounded-lg ${version.isCurrent ? "bg-blue-50 border-blue-200" : ""} ${
                    selectedVersions.some((v) => v.id === version.id) ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {isComparisonMode && (
                        <Checkbox
                          checked={selectedVersions.some((v) => v.id === version.id)}
                          onCheckedChange={(checked) => handleVersionSelection(version, checked as boolean)}
                          disabled={!selectedVersions.some((v) => v.id === version.id) && selectedVersions.length >= 2}
                        />
                      )}
                      <Badge variant={version.isCurrent ? "default" : "secondary"}>
                        Version {version.versionNumber}
                      </Badge>
                      {version.isCurrent && (
                        <Badge variant="outline" className="text-green-600">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!version.isCurrent && (
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-2">
                      <FileSize className="h-4 w-4" />
                      <span>{formatFileSize(version.size)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>by {version.uploadedByName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(version.uploadedAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  {version.changeNotes && (
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                      <p className="text-sm bg-gray-50 p-2 rounded border-l-4 border-gray-300 flex-1">
                        {version.changeNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVersionHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version Comparison Dialog */}
      <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Version Comparison</DialogTitle>
            <DialogDescription>
              Comparing versions {selectedVersions[0]?.versionNumber} and {selectedVersions[1]?.versionNumber} of "
              {versionHistoryFile?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            {selectedVersions.map((version, index) => (
              <div key={version.id} className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant={version.isCurrent ? "default" : "secondary"}>Version {version.versionNumber}</Badge>
                    {version.isCurrent && (
                      <Badge variant="outline" className="text-green-600">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Version Metadata */}
                <div className="space-y-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">File Size:</span>
                    <span className="font-medium">{formatFileSize(version.size)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploaded By:</span>
                    <span className="font-medium">{version.uploadedByName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Upload Date:</span>
                    <span className="font-medium">
                      {formatDistanceToNow(new Date(version.uploadedAt), { addSuffix: true })}
                    </span>
                  </div>
                  {index === 1 && selectedVersions.length === 2 && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Size Difference:</span>
                        <span
                          className={`font-medium ${
                            getSizeDifference(selectedVersions[1].size, selectedVersions[0].size).isIncrease
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {getSizeDifference(selectedVersions[1].size, selectedVersions[0].size).isIncrease ? "+" : ""}
                          {formatFileSize(
                            Math.abs(getSizeDifference(selectedVersions[1].size, selectedVersions[0].size).diff),
                          )}{" "}
                          ({getSizeDifference(selectedVersions[1].size, selectedVersions[0].size).percentage}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Notes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Change Notes:</Label>
                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                    <p className="text-sm">{version.changeNotes}</p>
                  </div>
                </div>

                {/* File Preview */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview:</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                      <img
                        src={version.url || "/placeholder.svg"}
                        alt={`Version ${version.versionNumber} preview`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComparisonOpen(false)}>
              Close Comparison
            </Button>
            {selectedVersions.length === 2 && (
              <Button
                onClick={() => {
                  toast({
                    title: "Comparison exported",
                    description: "Version comparison report has been generated.",
                  })
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Export Comparison
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteFileId} onOpenChange={() => setDeleteFileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone and will delete all versions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFileId && handleDelete(deleteFileId)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* File Preview Modal */}
      <FilePreview
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setPreviewFile(null)
        }}
      />
    </Card>
  )
}
