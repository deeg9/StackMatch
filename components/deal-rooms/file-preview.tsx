"use client"

import { useState } from "react"
import type { DealRoomFile } from "@/store/slices/dealRoomsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"

interface FilePreviewProps {
  file: DealRoomFile | null
  isOpen: boolean
  onClose: () => void
}

export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)

  if (!file) return null

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderPreview = () => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="flex justify-center">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.name}
            className="max-w-full max-h-[70vh] object-contain"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )
    }

    if (file.type === "application/pdf") {
      return (
        <div className="w-full h-[70vh]">
          <iframe
            src={file.url}
            className="w-full h-full border-0"
            title={file.name}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )
    }

    if (file.type.startsWith("text/")) {
      return (
        <div className="w-full h-[70vh] overflow-auto">
          <iframe
            src={file.url}
            className="w-full h-full border-0"
            title={file.name}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )
    }

    // For other file types, show download option
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-medium mb-2">{file.name}</h3>
        <p className="text-muted-foreground mb-6">Preview not available for this file type.</p>
        <div className="space-x-4">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
          <Button variant="outline" onClick={() => window.open(file.url, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate">{file.name}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-auto">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
