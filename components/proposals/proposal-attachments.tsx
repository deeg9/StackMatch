'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, ExternalLink, File, Image } from 'lucide-react'

interface ProposalAttachmentsProps {
  attachments: any
}

export function ProposalAttachments({ attachments }: ProposalAttachmentsProps) {
  // Mock attachments data - in real app would come from proposal.attachments
  const mockAttachments = [
    {
      id: '1',
      name: 'Technical_Specification_v2.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadedAt: '2024-01-15'
    },
    {
      id: '2', 
      name: 'Implementation_Timeline.xlsx',
      size: '345 KB',
      type: 'excel',
      uploadedAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Case_Studies.pdf',
      size: '5.1 MB',
      type: 'pdf',
      uploadedAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Security_Compliance_Cert.pdf',
      size: '1.2 MB',
      type: 'pdf',
      uploadedAt: '2024-01-15'
    }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'excel':
        return <File className="h-5 w-5 text-green-600" />
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-medium-gray" />
    }
  }

  return (
    <Card className="border-2 mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
          <FileText className="h-5 w-5 text-stackmatch-blue" />
          Attachments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAttachments.map((attachment) => (
            <div 
              key={attachment.id}
              className="flex items-center justify-between p-3 border-2 border-light-gray rounded-lg hover:border-stackmatch-blue transition-colors"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(attachment.type)}
                <div>
                  <p className="font-medium text-charcoal">{attachment.name}</p>
                  <p className="text-sm text-medium-gray">
                    {attachment.size} • Uploaded {attachment.uploadedAt}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {mockAttachments.length === 0 && (
          <p className="text-center text-medium-gray py-8">
            No attachments included with this proposal
          </p>
        )}
      </CardContent>
    </Card>
  )
}