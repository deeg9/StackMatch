'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Share2,
  Clock,
  CheckCircle2,
  FileSignature,
  FolderOpen,
  Search,
  Filter
} from 'lucide-react'
import { Input } from '@/components/ui/input'

interface DealRoomDocumentsProps {
  dealRoom: any
}

export function DealRoomDocuments({ dealRoom }: DealRoomDocumentsProps) {
  const documents = [
    {
      id: 1,
      name: 'Non-Disclosure Agreement (NDA)',
      type: 'Contract',
      size: '156 KB',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-15',
      status: 'signed',
      signers: [
        { name: 'Sarah Johnson', signed: true, signedAt: '2024-01-15' },
        { name: 'Michael Chen', signed: true, signedAt: '2024-01-16' }
      ],
      version: '1.0'
    },
    {
      id: 2,
      name: 'Project Requirements Document',
      type: 'Requirements',
      size: '2.4 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-16',
      status: 'approved',
      version: '2.1'
    },
    {
      id: 3,
      name: 'Data Migration Plan',
      type: 'Technical',
      size: '1.8 MB',
      uploadedBy: 'Michael Chen',
      uploadedAt: '2024-01-18',
      status: 'review',
      version: '1.0'
    },
    {
      id: 4,
      name: 'Service Agreement Draft',
      type: 'Contract',
      size: '245 KB',
      uploadedBy: 'Michael Chen',
      uploadedAt: '2024-01-20',
      status: 'pending-signature',
      signers: [
        { name: 'Sarah Johnson', signed: false },
        { name: 'Michael Chen', signed: false }
      ],
      version: '1.0'
    },
    {
      id: 5,
      name: 'Technical Architecture Diagram',
      type: 'Technical',
      size: '512 KB',
      uploadedBy: 'Michael Chen',
      uploadedAt: '2024-01-22',
      status: 'new',
      version: '1.0'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-trust-green text-white'
      case 'approved':
        return 'bg-information-blue text-white'
      case 'review':
        return 'bg-attention-orange text-white'
      case 'pending-signature':
        return 'bg-yellow-500 text-white'
      case 'new':
        return 'bg-stackmatch-blue text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'pending-signature':
        return <FileSignature className="w-4 h-4" />
      case 'review':
        return <Clock className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Contract':
        return <FileSignature className="w-5 h-5 text-stackmatch-blue" />
      case 'Technical':
        return <FileText className="w-5 h-5 text-trust-green" />
      case 'Requirements':
        return <FolderOpen className="w-5 h-5 text-attention-orange" />
      default:
        return <FileText className="w-5 h-5 text-medium-gray" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Documents Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stackmatch-navy">Documents</h2>
          <p className="text-medium-gray">Manage shared files, contracts, and documentation</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Library
          </Button>
          <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    {getTypeIcon(doc.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-stackmatch-navy">{doc.name}</h3>
                      <Badge variant="outline">v{doc.version}</Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-medium-gray mb-3">
                      <span>Type: {doc.type}</span>
                      <span>•</span>
                      <span>Size: {doc.size}</span>
                      <span>•</span>
                      <span>Uploaded: {doc.uploadedAt}</span>
                      <span>•</span>
                      <span>By: {doc.uploadedBy}</span>
                    </div>

                    {/* Signature Status */}
                    {doc.signers && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-stackmatch-navy mb-2">Signature Status:</div>
                        <div className="flex gap-3">
                          {doc.signers.map((signer, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">{signer.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-medium-gray">{signer.name}</span>
                              {signer.signed ? (
                                <CheckCircle2 className="w-4 h-4 text-trust-green" />
                              ) : (
                                <Clock className="w-4 h-4 text-attention-orange" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      {doc.status === 'pending-signature' && (
                        <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                          <FileSignature className="w-4 h-4 mr-2" />
                          Sign Document
                        </Button>
                      )}
                      {doc.status === 'review' && (
                        <Button size="sm" className="bg-trust-green hover:bg-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-slate-300 hover:border-stackmatch-blue transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="w-12 h-12 text-medium-gray mb-4" />
          <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
            Drop files here to upload
          </h3>
          <p className="text-medium-gray mb-4">
            or click to browse your computer
          </p>
          <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
            Choose Files
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}