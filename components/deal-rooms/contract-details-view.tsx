"use client"

import { useEffect, useState, useCallback } from "react"
import { getErrorMessage } from "@/lib/utils/error-handler"
import type { Contract, ContractFile, ContractFileVersion, ContractFileCategory } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileVersionUploader } from "./file-version-uploader"
import { Download, Eye, PlusCircle, History } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { ApprovalWorkflow } from "./approval-workflow"
import { PaymentMilestones } from "./payment-milestones"

interface ContractDetailsViewProps {
  contract: Contract
  dealRoomId: string // Needed for creating new files under the correct deal room
}

// Mock function - replace with your actual auth logic
const getCurrentUserId = () => "mock-user-id-replace-me"

export function ContractDetailsView({ contract: initialContract, dealRoomId }: ContractDetailsViewProps) {
  const [contract, setContract] = useState<Contract>(initialContract)
  const [files, setFiles] = useState<ContractFile[]>([])
  const [isLoadingFiles, setIsLoadingFiles] = useState(true)
  const [showVersionHistory, setShowVersionHistory] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  // State for new file dialog
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [newFileDescription, setNewFileDescription] = useState("")
  const [newFileCategory, setNewFileCategory] = useState<ContractFileCategory>("AGREEMENT")
  const [isCreatingFile, setIsCreatingFile] = useState(false)

  const fetchContractFiles = useCallback(async () => {
    setIsLoadingFiles(true)
    try {
      const response = await fetch(`/api/contracts/${contract.id}/files`)
      if (!response.ok) throw new Error("Failed to fetch files")
      const data = await response.json()
      setFiles(data as ContractFile[])
    } catch (error: any) {
      toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" })
      setFiles([])
    } finally {
      setIsLoadingFiles(false)
    }
  }, [contract.id, toast])

  useEffect(() => {
    fetchContractFiles()
  }, [fetchContractFiles])

  useEffect(() => {
    setContract(initialContract) // Update local contract state if prop changes
  }, [initialContract])

  const handleNewVersionUpload = (contractFileId: string, newVersion: ContractFileVersion) => {
    // Refetch files to get the updated version list and current_version_id
    fetchContractFiles()
  }

  const toggleVersionHistory = (fileId: string) => {
    setShowVersionHistory((prev) => ({ ...prev, [fileId]: !prev[fileId] }))
  }

  const handleCreateNewFile = async () => {
    if (!newFileName.trim() || !newFileCategory) {
      toast({
        title: "Missing Information",
        description: "File name and category are required.",
        variant: "destructive",
      })
      return
    }
    setIsCreatingFile(true)
    try {
      const response = await fetch(`/api/contracts/${contract.id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: newFileName,
          description: newFileDescription,
          category: newFileCategory,
          deal_room_id: dealRoomId, // Pass dealRoomId
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create file record")
      }
      const newFile = await response.json()
      setFiles((prevFiles) => [newFile, ...prevFiles])
      toast({
        title: "File Record Created",
        description: `${newFile.file_name} record added. You can now upload its first version.`,
      })
      setIsNewFileDialogOpen(false)
      setNewFileName("")
      setNewFileDescription("")
      setNewFileCategory("AGREEMENT")
    } catch (error: any) {
      toast({ title: "Error Creating File", description: getErrorMessage(error), variant: "destructive" })
    } finally {
      setIsCreatingFile(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {contract.contract_name}
          <Badge variant={contract.status === "ACTIVE" ? "default" : "secondary"}>{contract.status}</Badge>
        </CardTitle>
        <CardDescription>
          Created on {format(new Date(contract.created_at), "PPP")} by {contract.creator?.full_name || "Unknown User"}
          {contract.summary && <p className="mt-1 text-sm">{contract.summary}</p>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
            Contract Files
            <Dialog open={isNewFileDialogOpen} onOpenChange={setIsNewFileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add File Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New File Record</DialogTitle>
                  <DialogDescription>
                    Create a record for a new contract file. You can upload its first version afterwards.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="new-file-name">File Name</Label>
                    <Input
                      id="new-file-name"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="e.g., Master Service Agreement"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-file-category">Category</Label>
                    <Select
                      value={newFileCategory}
                      onValueChange={(value) => setNewFileCategory(value as ContractFileCategory)}
                    >
                      <SelectTrigger id="new-file-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          [
                            "AGREEMENT",
                            "STATEMENT_OF_WORK",
                            "AMENDMENT",
                            "APPENDIX",
                            "SUPPORTING_DOCUMENT",
                            "DELIVERABLE",
                          ] as ContractFileCategory[]
                        ).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-file-description">Description (Optional)</Label>
                    <Input
                      id="new-file-description"
                      value={newFileDescription}
                      onChange={(e) => setNewFileDescription(e.target.value)}
                      placeholder="Brief description of the file"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewFileDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewFile} disabled={isCreatingFile}>
                    {isCreatingFile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Record
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </h3>
          {isLoadingFiles ? (
            <p>Loading files...</p>
          ) : files.length === 0 ? (
            <p>No files associated with this contract yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Version</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <>
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.file_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{file.category.replace(/_/g, " ")}</Badge>
                      </TableCell>
                      <TableCell>
                        {file.current_version ? `v${file.current_version.version_number}` : "No versions"}
                      </TableCell>
                      <TableCell>{format(new Date(file.updated_at), "PPp")}</TableCell>
                      <TableCell className="space-x-1">
                        {file.current_version && (
                          <>
                            <Button variant="outline" size="sm" asChild>
                              <a href={file.current_version.blob_url} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-1 h-3 w-3" /> Download
                              </a>
                            </Button>
                            {/* Placeholder for a proper previewer */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                alert(`Previewing ${file.file_name} v${file.current_version?.version_number}`)
                              }
                            >
                              <Eye className="mr-1 h-3 w-3" /> Preview
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => toggleVersionHistory(file.id)}>
                          <History className="mr-1 h-3 w-3" /> {showVersionHistory[file.id] ? "Hide" : "History"} (
                          {file.versions.length})
                        </Button>
                      </TableCell>
                    </TableRow>
                    {showVersionHistory[file.id] && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="p-4 bg-muted/50 rounded-md">
                            <h5 className="text-sm font-semibold mb-2">Version History for {file.file_name}</h5>
                            {file.versions && file.versions.length > 0 ? (
                              <ul className="space-y-2">
                                {file.versions.map((version) => (
                                  <li
                                    key={version.id}
                                    className="text-xs p-2 border rounded-md flex justify-between items-center"
                                  >
                                    <div>
                                      <strong>v{version.version_number}</strong> - Uploaded{" "}
                                      {format(new Date(version.created_at), "PPp")} by{" "}
                                      {version.uploader?.full_name || "Unknown"}
                                      {version.change_description && (
                                        <p className="text-muted-foreground italic text-xs mt-0.5">
                                          "{version.change_description}"
                                        </p>
                                      )}
                                    </div>
                                    <Button variant="outline" size="xs" asChild>
                                      <a href={version.blob_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-1 h-3 w-3" /> Download
                                      </a>
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-muted-foreground">No version history.</p>
                            )}
                            <FileVersionUploader
                              contractFile={file}
                              onUploadSuccess={(newVersion) => handleNewVersionUpload(file.id, newVersion)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {/* Payment Milestones and Approvals sections */}
        <div className="space-y-6">
          <PaymentMilestones contractId={contract.id} dealRoomId={dealRoomId} currentUserId={getCurrentUserId()} />
          <ApprovalWorkflow contractId={contract.id} dealRoomId={dealRoomId} currentUserId={getCurrentUserId()} />
        </div>
      </CardContent>
    </Card>
  )
}
