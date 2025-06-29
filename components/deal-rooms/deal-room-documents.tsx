'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
  Filter,
  Plus,
  MoreVertical,
  Star,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Lock,
  Unlock,
  Calendar,
  User,
  FileDown,
  FileImage,
  FileVideo,
  File,
  Archive,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  CloudUpload,
  Link,
  Settings,
  AlertCircle,
  CheckSquare,
  XCircle,
  Zap,
  Shield,
  Globe,
  Users,
  Timer,
  PenTool,
  Hash,
  Folder,
  FileSpreadsheet,
  FileCode
} from 'lucide-react'

interface DealRoomDocumentsProps {
  dealRoom: any
}

export function DealRoomDocuments({ dealRoom }: DealRoomDocumentsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])

  // Enhanced documents data
  const documents = [
    {
      id: 1,
      name: 'Master Service Agreement (MSA)',
      type: 'contract',
      fileType: 'pdf',
      size: '2.4 MB',
      uploadedBy: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/32/32',
        role: 'buyer',
        jobTitle: 'CTO'
      },
      uploadedAt: '2024-01-15',
      lastModified: '2024-01-28',
      status: 'signed',
      priority: 'high',
      category: 'Agreements',
      description: 'Primary service agreement outlining terms, conditions, and obligations for both parties.',
      signers: [
        { name: 'Sarah Johnson', email: 'sarah@healthtech.com', jobTitle: 'CTO', signed: true, signedAt: '2024-01-25 14:30', ipAddress: '192.168.1.100' },
        { name: 'Michael Chen', email: 'michael@crmexperts.com', jobTitle: 'Solutions Architect', signed: true, signedAt: '2024-01-26 09:15', ipAddress: '192.168.1.101' },
        { name: 'David Kim', email: 'david@healthtech.com', jobTitle: 'Project Manager', signed: true, signedAt: '2024-01-27 16:45', ipAddress: '192.168.1.102' }
      ],
      version: '3.0',
      versions: [
        { version: '1.0', uploadedAt: '2024-01-15', changes: 'Initial draft' },
        { version: '2.0', uploadedAt: '2024-01-20', changes: 'Revised payment terms' },
        { version: '3.0', uploadedAt: '2024-01-25', changes: 'Final version with legal review' }
      ],
      permissions: {
        view: ['all'],
        edit: ['buyer'],
        download: ['all'],
        delete: ['buyer']
      },
      isStarred: true,
      downloadCount: 12,
      viewCount: 47,
      expiryDate: null,
      tags: ['contract', 'legal', 'msa', 'signed']
    },
    {
      id: 2,
      name: 'Non-Disclosure Agreement (NDA)',
      type: 'contract',
      fileType: 'pdf',
      size: '156 KB',
      uploadedBy: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/32/32',
        role: 'buyer',
        jobTitle: 'CTO'
      },
      uploadedAt: '2024-01-10',
      lastModified: '2024-01-12',
      status: 'signed',
      priority: 'high',
      category: 'Agreements',
      description: 'Confidentiality agreement protecting sensitive business information shared during negotiations.',
      signers: [
        { name: 'Sarah Johnson', email: 'sarah@healthtech.com', jobTitle: 'CTO', signed: true, signedAt: '2024-01-10 10:30', ipAddress: '192.168.1.100' },
        { name: 'Michael Chen', email: 'michael@crmexperts.com', jobTitle: 'Solutions Architect', signed: true, signedAt: '2024-01-11 14:20', ipAddress: '192.168.1.101' }
      ],
      version: '1.0',
      versions: [
        { version: '1.0', uploadedAt: '2024-01-10', changes: 'Initial NDA template' }
      ],
      permissions: {
        view: ['all'],
        edit: ['buyer'],
        download: ['all'],
        delete: ['buyer']
      },
      isStarred: true,
      downloadCount: 8,
      viewCount: 23,
      expiryDate: '2025-01-10',
      tags: ['nda', 'confidentiality', 'legal', 'signed']
    },
    {
      id: 3,
      name: 'Technical Requirements Specification',
      type: 'specification',
      fileType: 'docx',
      size: '3.2 MB',
      uploadedBy: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/32/32',
        role: 'buyer',
        jobTitle: 'CTO'
      },
      uploadedAt: '2024-01-16',
      lastModified: '2024-01-29',
      status: 'approved',
      priority: 'high',
      category: 'Services & Features',
      description: 'Comprehensive technical requirements including system architecture, integration needs, and performance criteria.',
      version: '2.1',
      versions: [
        { version: '1.0', uploadedAt: '2024-01-16', changes: 'Initial requirements draft' },
        { version: '2.0', uploadedAt: '2024-01-22', changes: 'Added integration requirements' },
        { version: '2.1', uploadedAt: '2024-01-29', changes: 'Performance criteria updates' }
      ],
      permissions: {
        view: ['all'],
        edit: ['buyer', 'seller'],
        download: ['all'],
        delete: ['buyer']
      },
      isStarred: false,
      downloadCount: 15,
      viewCount: 34,
      expiryDate: null,
      tags: ['requirements', 'technical', 'architecture', 'approved']
    },
    {
      id: 4,
      name: 'Data Migration Strategy & Timeline',
      type: 'plan',
      fileType: 'xlsx',
      size: '1.8 MB',
      uploadedBy: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/32/32',
        role: 'seller',
        jobTitle: 'Solutions Architect'
      },
      uploadedAt: '2024-01-18',
      lastModified: '2024-01-30',
      status: 'under-review',
      priority: 'medium',
      category: 'Implementation',
      description: 'Detailed plan for migrating 2.5M+ customer records with zero-downtime strategy and rollback procedures.',
      version: '1.5',
      versions: [
        { version: '1.0', uploadedAt: '2024-01-18', changes: 'Initial migration plan' },
        { version: '1.5', uploadedAt: '2024-01-30', changes: 'Added rollback procedures' }
      ],
      permissions: {
        view: ['all'],
        edit: ['seller'],
        download: ['all'],
        delete: ['seller']
      },
      isStarred: false,
      downloadCount: 9,
      viewCount: 28,
      expiryDate: null,
      tags: ['migration', 'data', 'implementation', 'timeline']
    },
    {
      id: 5,
      name: 'Statement of Work (SOW)',
      type: 'contract',
      fileType: 'pdf',
      size: '945 KB',
      uploadedBy: {
        name: 'Elena Rodriguez',
        avatar: '/api/placeholder/32/32',
        role: 'seller',
        jobTitle: 'Account Manager'
      },
      uploadedAt: '2024-01-20',
      lastModified: '2024-01-31',
      status: 'pending-signature',
      priority: 'high',
      category: 'Agreements',
      description: 'Detailed scope of work including deliverables, timelines, acceptance criteria, and payment milestones.',
      signers: [
        { name: 'Sarah Johnson', email: 'sarah@healthtech.com', jobTitle: 'CTO', signed: false, signedAt: null, ipAddress: null },
        { name: 'David Kim', email: 'david@healthtech.com', jobTitle: 'Project Manager', signed: false, signedAt: null, ipAddress: null },
        { name: 'Michael Chen', email: 'michael@crmexperts.com', jobTitle: 'Solutions Architect', signed: true, signedAt: '2024-01-31 11:20', ipAddress: '192.168.1.101' }
      ],
      version: '2.0',
      versions: [
        { version: '1.0', uploadedAt: '2024-01-20', changes: 'Initial SOW draft' },
        { version: '2.0', uploadedAt: '2024-01-31', changes: 'Updated milestones and payment terms' }
      ],
      permissions: {
        view: ['all'],
        edit: ['seller'],
        download: ['all'],
        delete: ['seller']
      },
      isStarred: true,
      downloadCount: 6,
      viewCount: 19,
      expiryDate: '2024-02-15',
      tags: ['sow', 'scope', 'deliverables', 'contract']
    },
    {
      id: 6,
      name: 'Security Assessment Report',
      type: 'report',
      fileType: 'pdf',
      size: '4.1 MB',
      uploadedBy: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/32/32',
        role: 'seller',
        jobTitle: 'Solutions Architect'
      },
      uploadedAt: '2024-01-25',
      lastModified: '2024-01-25',
      status: 'new',
      priority: 'medium',
      category: 'Security & Compliance',
      description: 'Comprehensive security analysis including penetration testing results, vulnerability assessment, and compliance verification.',
      version: '1.0',
      versions: [
        { version: '1.0', uploadedAt: '2024-01-25', changes: 'Initial security assessment' }
      ],
      permissions: {
        view: ['buyer'],
        edit: ['seller'],
        download: ['buyer'],
        delete: ['seller']
      },
      isStarred: false,
      downloadCount: 3,
      viewCount: 11,
      expiryDate: null,
      tags: ['security', 'assessment', 'compliance', 'report']
    }
  ]

  const getFileIcon = (fileType: string, className = "w-5 h-5") => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${className} text-red-500`} />
      case 'docx':
      case 'doc':
        return <FileText className={`${className} text-blue-500`} />
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className={`${className} text-green-500`} />
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <FileImage className={`${className} text-purple-500`} />
      case 'mp4':
      case 'mov':
        return <FileVideo className={`${className} text-orange-500`} />
      case 'js':
      case 'ts':
      case 'json':
        return <FileCode className={`${className} text-yellow-500`} />
      default:
        return <File className={`${className} text-slate-500`} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-trust-green text-white'
      case 'approved':
        return 'bg-information-blue text-white'
      case 'under-review':
        return 'bg-attention-orange text-white'
      case 'pending-signature':
        return 'bg-yellow-500 text-white'
      case 'new':
        return 'bg-stackmatch-blue text-white'
      case 'expired':
        return 'bg-red-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'approved':
        return <CheckSquare className="w-4 h-4" />
      case 'pending-signature':
        return <FileSignature className="w-4 h-4" />
      case 'under-review':
        return <Clock className="w-4 h-4" />
      case 'new':
        return <Zap className="w-4 h-4" />
      case 'expired':
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const categories = ['All Documents', 'Agreements', 'Services & Features', 'Implementation', 'Security & Compliance']
  const documentStats = {
    total: documents.length,
    signed: documents.filter(d => d.status === 'signed').length,
    pending: documents.filter(d => d.status === 'pending-signature').length,
    expired: documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date()).length
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Documents Section */}
      <div className="w-full">
          {/* Streamlined Documents Header */}
          <div className="flex items-center justify-between mb-6">
            {/* Left Side - Search and Filter */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Right Side - View Toggle and Upload */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-md">
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
              
              <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200 p-1">
          {categories.map((category, index) => (
            <TabsTrigger 
              key={index} 
              value={index === 0 ? 'all' : category.toLowerCase().replace(/[\s&\/]/g, '-')}
              className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Documents Grid */}
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {documents.map((doc) => (
              <Card 
                key={doc.id} 
                className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* File Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors duration-200">
                          {getFileIcon(doc.fileType, "w-6 h-6")}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-stackmatch-navy truncate">
                              {doc.name}
                            </h3>
                            {doc.isStarred && (
                              <Star className="w-4 h-4 text-attention-orange fill-current" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              v{doc.version}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                              {getStatusIcon(doc.status)}
                              <span className="ml-1">{doc.status.replace('-', ' ')}</span>
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(doc.priority)}`}
                            >
                              {doc.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-medium-gray line-clamp-2 mb-2">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="w-4 h-4 mr-2" />
                            Version History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* File Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-medium-gray">
                        <User className="w-4 h-4" />
                        <span>Uploaded by: {doc.uploadedBy.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-medium-gray">
                        <Calendar className="w-4 h-4" />
                        <span>Date Uploaded: {doc.uploadedAt}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-medium-gray">
                        <Archive className="w-4 h-4" />
                        <span>File Size: {doc.size}</span>
                      </div>
                    </div>


                    {/* Expiry Warning */}
                    {doc.expiryDate && new Date(doc.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {new Date(doc.expiryDate) < new Date() ? 'Expired' : 'Expires Soon'}
                          </span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          Expiry: {doc.expiryDate}
                        </p>
                      </div>
                    )}

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="hover:bg-stackmatch-blue hover:text-white">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-trust-green hover:text-white">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      
                      {doc.status === 'under-review' && (
                        <Button size="sm" className="bg-information-blue hover:bg-blue-600">
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" className="hover:bg-slate-100">
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="hover:bg-slate-100">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

          {/* Drag & Drop Upload Area */}
          <Card className="border-2 border-dashed border-slate-300 hover:border-stackmatch-blue transition-all duration-200 hover:bg-stackmatch-blue/5">
            <CardContent className="py-12">
              <div className="text-center">
                <CloudUpload className="w-12 h-12 text-medium-gray mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                  Drag & Drop Files Here
                </h3>
                <p className="text-medium-gray mb-4">
                  or click to browse your computer
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button variant="outline">
                    <Link className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
                <p className="text-xs text-medium-gray mt-3">
                  Maximum file size: 50MB • Supported formats: PDF, DOC, XLS, PNG, JPG
                </p>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}