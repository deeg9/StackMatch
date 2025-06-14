"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UploadCloud } from "lucide-react"
import type { ContractFile, ContractFileVersion } from "@/types"

interface FileVersionUploaderProps {
  contractFile: ContractFile
  onUploadSuccess: (newVersion: ContractFileVersion) => void
}

export function FileVersionUploader({ contractFile, onUploadSuccess }: FileVersionUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [changeDescription, setChangeDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) {
      toast({ title: "No file selected", description: "Please select a file to upload.", variant: "destructive" })
      return
    }
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("change_description", changeDescription)

    try {
      const response = await fetch(`/api/contract-files/${contractFile.id}/versions`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload file version")
      }

      const newVersion = await response.json()
      toast({ title: "Upload Successful", description: `${file.name} (v${newVersion.version_number}) uploaded.` })
      onUploadSuccess(newVersion)
      setFile(null)
      setChangeDescription("")
      // Reset the file input visually
      const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md mt-4">
      <h4 className="text-md font-semibold">Upload New Version for: {contractFile.file_name}</h4>
      <div>
        <Label htmlFor={`file-upload-${contractFile.id}`}>File</Label>
        <Input
          id={`file-upload-${contractFile.id}`}
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          disabled={isUploading}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`change-description-${contractFile.id}`}>Change Description (Optional)</Label>
        <Textarea
          id={`change-description-${contractFile.id}`}
          value={changeDescription}
          onChange={(e) => setChangeDescription(e.target.value)}
          placeholder="Briefly describe what changed in this version..."
          disabled={isUploading}
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isUploading || !file} className="w-full">
        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
        Upload Version
      </Button>
    </form>
  )
}
