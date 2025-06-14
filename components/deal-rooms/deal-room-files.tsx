import type { DealRoomFile } from "@/types" // Assuming types/index.ts or types/deal-room-types.ts has this
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DealRoomFilesProps {
  files: DealRoomFile[]
  dealRoomId?: string // Optional: if needed for upload/actions
}

// Mock DealRoomFile if not defined elsewhere for preview
// type DealRoomFile = {
//   id: string;
//   file_name: string;
//   file_type?: string | null;
//   file_size_bytes?: number | null;
//   blob_url: string;
//   created_at: string;
//   uploaded_by_name?: string; // Assuming you might join to get user name
// };

export default function DealRoomFiles({ files }: DealRoomFilesProps) {
  if (!files || files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No files have been shared in this deal room yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Shared Files</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded At</TableHead>
              {/* <TableHead>Uploaded By</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  {file.file_name}
                </TableCell>
                <TableCell>{file.file_type || "N/A"}</TableCell>
                <TableCell>
                  {file.file_size_bytes ? `${(file.file_size_bytes / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                </TableCell>
                <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
                {/* <TableCell>{file.uploaded_by_name || 'N/A'}</TableCell> */}
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <a href={file.blob_url} target="_blank" rel="noopener noreferrer" download={file.file_name}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
