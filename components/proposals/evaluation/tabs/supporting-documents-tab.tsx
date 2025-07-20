'use client'

import { 
  FileText, 
  Download, 
  Eye, 
  FileSpreadsheet, 
  Video,
  File,
  ExternalLink,
  Zap
} from 'lucide-react'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SupportingDocumentsTabProps {
  proposal: AIGeneratedProposal
}

export function SupportingDocumentsTab({ proposal }: SupportingDocumentsTabProps) {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-600" />
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="w-8 h-8 text-green-600" />
    if (type.includes('video')) return <Video className="w-8 h-8 text-purple-600" />
    return <File className="w-8 h-8 text-gray-600" />
  }

  const getFileTypeLabel = (type: string) => {
    if (type.includes('pdf')) return 'PDF Document'
    if (type.includes('spreadsheet') || type.includes('excel')) return 'Spreadsheet'
    if (type.includes('video')) return 'Video'
    return 'Document'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB'
    return Math.round(bytes / 1048576) + ' MB'
  }

  // Group documents by category
  const documentCategories = {
    'Implementation & Training': ['Implementation_Guide', 'Training'],
    'Security & Compliance': ['Security_Whitepaper', 'Compliance'],
    'Financial': ['ROI_Calculator', 'Pricing'],
    'References': ['Customer_References', 'Case_Studies'],
    'Product Information': ['Product_Demo', 'Integration_Catalog'],
    'Legal': ['Contract_Template', 'Terms']
  }

  const categorizeDocument = (docName: string) => {
    for (const [category, keywords] of Object.entries(documentCategories)) {
      if (keywords.some(keyword => docName.includes(keyword))) {
        return category
      }
    }
    return 'Other Documents'
  }

  const groupedDocuments = proposal.supportingDocuments.documents.reduce((acc, doc) => {
    const category = categorizeDocument(doc.name)
    if (!acc[category]) acc[category] = []
    acc[category].push(doc)
    return acc
  }, {} as Record<string, typeof proposal.supportingDocuments.documents>)

  return (
    <div className="space-y-6">
      {/* Document Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Document Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {proposal.supportingDocuments.documents.length}
              </p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(groupedDocuments).length}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(
                  proposal.supportingDocuments.documents.reduce((sum, doc) => sum + doc.size, 0)
                )}
              </p>
              <p className="text-sm text-gray-600">Total Size</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents by Category */}
      {Object.entries(groupedDocuments).map(([category, documents]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {doc.name.replace(/_/g, ' ').replace('.pdf', '').replace('.xlsx', '')}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getFileTypeLabel(doc.type)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(doc.size)}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          asChild
                        >
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download All Documents
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Share Document Package
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Document Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                All documents have been verified for completeness and relevance to your RFQ requirements
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                The ROI Calculator includes customized projections based on your organization size
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Security documentation includes the latest audit reports and compliance certificates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}