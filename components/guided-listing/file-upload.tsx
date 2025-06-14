"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  File,
  X,
  AlertCircle,
  Loader2,
  FileText,
  FileImage,
  FileArchive,
  FileIcon as FilePdf,
} from "lucide-react"
import type { FileAttachment } from "@/types/guided-listing-types"

interface FileUploadProps {
  files: FileAttachment[]
  onFilesChange: (files: FileAttachment[]) => void
  maxFiles?: number
  maxSizeMB?: number
  allowedTypes?: string[]
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
}: FileUploadProps) {
  const [uploading, setUploading] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    // Reset the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    // Validate files
    const validFiles = selectedFiles.filter((file) => {
      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [file.name]: "File type not allowed",
        }))
        return false
      }

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [file.name]: `File exceeds maximum size (${maxSizeMB}MB)`,
        }))
        return false
      }

      return true
    })

    // Check max files limit
    if (files.length + validFiles.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files`)
      return
    }

    // Process valid files
    validFiles.forEach((file) => {
      // Start upload simulation
      setUploading((prev) => ({
        ...prev,
        [file.name]: 0,
      }))

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploading((prev) => {
          const progress = (prev[file.name] || 0) + 10

          if (progress >= 100) {
            clearInterval(interval)

            // Create file attachment
            const newFile: FileAttachment = {
              id: `file-${Date.now()}-${file.name}`,
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file),
              uploadedAt: new Date().toISOString(),
            }

            // Add to files list
            onFilesChange([...files, newFile])

            // Remove from uploading state
            const { [file.name]: _, ...rest } = prev
            return rest
          }

          return {
            ...prev,
            [file.name]: progress,
          }
        })
      }, 300)
    })
  }

  const handleRemoveFile = (fileId: string) => {
    onFilesChange(files.filter((file) => file.id !== fileId))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <FileImage className="h-5 w-5" />
    if (fileType === "application/pdf") return <FilePdf className="h-5 w-5" />
    if (fileType.includes("word")) return <FileText className="h-5 w-5" />
    if (fileType.includes("zip") || fileType.includes("compressed")) return <FileArchive className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Project Files</h3>
          <p className="text-xs text-slate-400">
            Upload relevant documents, images, or files (max {maxFiles} files, {maxSizeMB}MB each)
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= maxFiles}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
          accept={allowedTypes.join(",")}
        />
      </div>

      {/* File List */}
      <div className="space-y-2">
        {files.length === 0 && Object.keys(uploading).length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 border-dashed">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <File className="h-8 w-8 text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">No files uploaded yet</p>
              <p className="text-xs text-slate-500 mt-1">Upload files to share with potential providers</p>
            </CardContent>
          </Card>
        )}

        {/* Uploading Files */}
        {Object.entries(uploading).map(([fileName, progress]) => (
          <Card key={fileName} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="bg-slate-700 p-2 rounded">
                  <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">{fileName}</p>
                    <Badge variant="outline" className="ml-2">
                      Uploading
                    </Badge>
                  </div>

                  <div className="mt-2">
                    <Progress value={progress} className="h-1" />
                  </div>

                  <p className="text-xs text-slate-400 mt-1">{progress}% complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Uploaded Files */}
        {files.map((file) => (
          <Card key={file.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="bg-slate-700 p-2 rounded">{getFileIcon(file.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(file.size)}
                    </Badge>
                    <p className="text-xs text-slate-400">Uploaded {new Date(file.uploadedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Error Messages */}
        {Object.entries(errors).map(([fileName, error]) => (
          <Card key={fileName} className="bg-red-900/20 border-red-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="bg-red-900/50 p-2 rounded">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">{fileName}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                      onClick={() =>
                        setErrors((prev) => {
                          const { [fileName]: _, ...rest } = prev
                          return rest
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-red-400 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {files.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <p>
            {files.length} of {maxFiles} files uploaded
          </p>
          {files.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs hover:bg-transparent hover:text-white"
              onClick={() => onFilesChange([])}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
