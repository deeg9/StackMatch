'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PrepareDocumentModal } from './prepare-document-modal'
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Users,
  MessageSquare,
  Send,
  Plus,
  Filter,
  Search,
  AlertCircle,
  CheckSquare,
  Share2,
  PenTool,
  FileSignature,
  Clock3,
  UserCheck,
  AlertTriangle,
  FileCheck,
  RotateCcw,
  Mail,
  Copy,
  History,
  Shield,
  Zap,
  ChevronDown,
  Inbox
} from 'lucide-react'

interface DealRoomProposalsProps {
  dealRoom: any
}

export function DealRoomProposals({ dealRoom }: DealRoomProposalsProps) {
  const [activeTab, setActiveTab] = useState('inbox') // inbox or sent
  const [statusFilter, setStatusFilter] = useState('all') // for filtering within inbox/sent
  const [selectedEnvelope, setSelectedEnvelope] = useState<number | null>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [prepareDocumentOpen, setPrepareDocumentOpen] = useState(false)
  
  // Mock current user info - in real app this would come from auth context
  const currentUser = {
    name: 'Sarah Johnson',
    email: 'sarah@healthtech.com'
  }

  // Document signing envelopes data
  const signingEnvelopes = [
    {
      id: 1,
      title: 'Master Service Agreement v3.2',
      status: 'requires-my-signature',
      documentType: 'contract',
      sentDate: '2024-01-28',
      expiryDate: '2024-02-15',
      signers: [
        { 
          id: 1,
          name: 'Sarah Johnson', 
          email: 'sarah@healthtech.com',
          jobTitle: 'CTO',
          avatar: '/api/placeholder/32/32',
          status: 'pending',
          signedAt: null,
          isCurrentUser: true
        },
        { 
          id: 2,
          name: 'Michael Chen', 
          email: 'michael@crmexperts.com',
          jobTitle: 'Solutions Architect',
          avatar: '/api/placeholder/32/32',
          status: 'signed',
          signedAt: '2024-01-29 14:30',
          isCurrentUser: false
        },
        { 
          id: 3,
          name: 'David Kim', 
          email: 'david@healthtech.com',
          jobTitle: 'Project Manager',
          avatar: '/api/placeholder/32/32',
          status: 'pending',
          signedAt: null,
          isCurrentUser: false
        }
      ],
      sentBy: {
        name: 'Elena Rodriguez',
        jobTitle: 'Account Manager',
        company: 'CRM Experts Inc'
      },
      pages: 12,
      fieldsRequired: 8,
      fieldsCompleted: 3,
      priority: 'high',
      description: 'Primary service agreement outlining terms, conditions, and obligations for both parties.'
    },
    {
      id: 2,
      title: 'Statement of Work (SOW) v2.0',
      status: 'in-progress',
      documentType: 'sow',
      sentDate: '2024-01-25',
      expiryDate: '2024-02-10',
      signers: [
        { 
          id: 1,
          name: 'Sarah Johnson', 
          email: 'sarah@healthtech.com',
          jobTitle: 'CTO',
          avatar: '/api/placeholder/32/32',
          status: 'signed',
          signedAt: '2024-01-26 09:15',
          isCurrentUser: true
        },
        { 
          id: 2,
          name: 'Michael Chen', 
          email: 'michael@crmexperts.com',
          jobTitle: 'Solutions Architect',
          avatar: '/api/placeholder/32/32',
          status: 'pending',
          signedAt: null,
          isCurrentUser: false
        },
        { 
          id: 3,
          name: 'David Kim', 
          email: 'david@healthtech.com',
          jobTitle: 'Project Manager',
          avatar: '/api/placeholder/32/32',
          status: 'pending',
          signedAt: null,
          isCurrentUser: false
        }
      ],
      sentBy: {
        name: 'Elena Rodriguez',
        jobTitle: 'Account Manager',
        company: 'CRM Experts Inc'
      },
      pages: 8,
      fieldsRequired: 12,
      fieldsCompleted: 4,
      priority: 'high',
      description: 'Detailed scope of work including deliverables, timelines, acceptance criteria, and payment milestones.'
    },
    {
      id: 3,
      title: 'Non-Disclosure Agreement (NDA)',
      status: 'completed',
      documentType: 'nda',
      sentDate: '2024-01-10',
      expiryDate: null,
      completedDate: '2024-01-12',
      signers: [
        { 
          id: 1,
          name: 'Sarah Johnson', 
          email: 'sarah@healthtech.com',
          jobTitle: 'CTO',
          avatar: '/api/placeholder/32/32',
          status: 'signed',
          signedAt: '2024-01-11 10:30',
          isCurrentUser: true
        },
        { 
          id: 2,
          name: 'Michael Chen', 
          email: 'michael@crmexperts.com',
          jobTitle: 'Solutions Architect',
          avatar: '/api/placeholder/32/32',
          status: 'signed',
          signedAt: '2024-01-12 14:20',
          isCurrentUser: false
        }
      ],
      sentBy: {
        name: 'Sarah Johnson',
        jobTitle: 'CTO',
        company: 'HealthTech Solutions'
      },
      pages: 3,
      fieldsRequired: 4,
      fieldsCompleted: 4,
      priority: 'medium',
      description: 'Confidentiality agreement protecting sensitive business information shared during negotiations.'
    },
    {
      id: 4,
      title: 'Data Processing Agreement',
      status: 'draft',
      documentType: 'dpa',
      sentDate: null,
      expiryDate: null,
      signers: [
        { 
          id: 1,
          name: 'Sarah Johnson', 
          email: 'sarah@healthtech.com',
          jobTitle: 'CTO',
          avatar: '/api/placeholder/32/32',
          status: 'not-sent',
          signedAt: null,
          isCurrentUser: true
        },
        { 
          id: 2,
          name: 'Michael Chen', 
          email: 'michael@crmexperts.com',
          jobTitle: 'Solutions Architect',
          avatar: '/api/placeholder/32/32',
          status: 'not-sent',
          signedAt: null,
          isCurrentUser: false
        }
      ],
      sentBy: {
        name: 'Sarah Johnson',
        jobTitle: 'CTO',
        company: 'HealthTech Solutions'
      },
      pages: 5,
      fieldsRequired: 6,
      fieldsCompleted: 0,
      priority: 'low',
      description: 'Agreement covering data processing, storage, and privacy compliance requirements.'
    }
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'requires-my-signature':
        return {
          color: 'bg-information-blue text-white',
          icon: <FileSignature className="w-4 h-4" />,
          label: 'Requires My Signature',
          actionLabel: 'Review & Sign'
        }
      case 'in-progress':
        return {
          color: 'bg-attention-orange text-white',
          icon: <Clock className="w-4 h-4" />,
          label: 'Awaiting Signatures',
          actionLabel: 'View Document'
        }
      case 'completed':
        return {
          color: 'bg-trust-green text-white',
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: 'Completed',
          actionLabel: 'View Document'
        }
      case 'draft':
        return {
          color: 'bg-slate-500 text-white',
          icon: <Edit className="w-4 h-4" />,
          label: 'Draft',
          actionLabel: 'Continue Setup'
        }
      case 'voided':
        return {
          color: 'bg-slate-400 text-white',
          icon: <XCircle className="w-4 h-4" />,
          label: 'Voided',
          actionLabel: 'View Details'
        }
      default:
        return {
          color: 'bg-slate-500 text-white',
          icon: <FileText className="w-4 h-4" />,
          label: status,
          actionLabel: 'View'
        }
    }
  }

  const getSignerIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="w-3 h-3 text-trust-green" />
      case 'pending':
        return <Clock className="w-3 h-3 text-attention-orange" />
      case 'not-sent':
        return <Clock3 className="w-3 h-3 text-slate-400" />
      default:
        return <Clock className="w-3 h-3 text-slate-400" />
    }
  }

  // Helper functions to categorize documents
  const getInboxEnvelopes = () => {
    return signingEnvelopes.filter(e => 
      e.sentBy.name !== currentUser.name // Documents sent TO the current user
    )
  }

  const getSentEnvelopes = () => {
    return signingEnvelopes.filter(e => 
      e.sentBy.name === currentUser.name // Documents sent BY the current user
    )
  }

  // Calculate dashboard stats
  const inboxEnvelopes = getInboxEnvelopes()
  const sentEnvelopes = getSentEnvelopes()
  
  const stats = {
    actionRequired: inboxEnvelopes.filter(e => e.status === 'requires-my-signature').length,
    inProgress: signingEnvelopes.filter(e => e.status === 'in-progress').length,
    recentlyCompleted: signingEnvelopes.filter(e => e.status === 'completed').length,
    totalDocuments: signingEnvelopes.length
  }

  // Status filter options for the dropdown
  const statusFilterOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'action-required', label: 'Action Required' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'drafts', label: 'Drafts' }
  ]

  const getFilteredEnvelopes = () => {
    // First filter by inbox/sent
    let filtered = activeTab === 'inbox' ? inboxEnvelopes : sentEnvelopes
    
    // Then apply status filter
    switch (statusFilter) {
      case 'action-required':
        filtered = filtered.filter(e => e.status === 'requires-my-signature')
        break
      case 'in-progress':
        filtered = filtered.filter(e => e.status === 'in-progress')
        break
      case 'completed':
        filtered = filtered.filter(e => e.status === 'completed')
        break
      case 'drafts':
        filtered = filtered.filter(e => e.status === 'draft')
        break
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const selectedEnvelopeData = signingEnvelopes.find(e => e.id === selectedEnvelope)
  const filteredEnvelopes = getFilteredEnvelopes()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* eSignature Dashboard Header */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-2xl">
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
            
            <Button 
              size="sm" 
              className="bg-trust-green hover:bg-success-green ml-3"
              onClick={() => setPrepareDocumentOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Prepare Document for Signature
            </Button>
          </div>

          {/* Dashboard KPIs */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-information-blue">{stats.actionRequired}</div>
              <div className="text-sm text-medium-gray">Action Required</div>
              <div className="text-xs text-medium-gray mt-1">Awaiting your signature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-attention-orange">{stats.inProgress}</div>
              <div className="text-sm text-medium-gray">In Progress</div>
              <div className="text-xs text-medium-gray mt-1">Awaiting others</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-trust-green">{stats.recentlyCompleted}</div>
              <div className="text-sm text-medium-gray">Recently Completed</div>
              <div className="text-xs text-medium-gray mt-1">Last 30 days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-stackmatch-blue">{stats.totalDocuments}</div>
              <div className="text-sm text-medium-gray">Total Documents</div>
              <div className="text-xs text-medium-gray mt-1">All time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inbox/Sent Tabs with Status Filter */}
      <div className="flex items-center justify-between mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white border border-slate-200 p-1">
            <TabsTrigger 
              value="inbox"
              className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
            >
              <Inbox className="w-4 h-4 mr-2" />
              Inbox
              <Badge 
                variant="secondary" 
                className="ml-2 data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                {inboxEnvelopes.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="sent"
              className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Sent
              <Badge 
                variant="secondary" 
                className="ml-2 data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                {sentEnvelopes.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Status Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {statusFilterOptions.find(opt => opt.id === statusFilter)?.label || 'Filter'}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statusFilterOptions.map((option) => (
              <DropdownMenuItem 
                key={option.id}
                onClick={() => setStatusFilter(option.id)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        <TabsContent value="inbox" className="mt-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Signing Envelopes List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stackmatch-navy">
                  Inbox Documents
                </h3>
                <span className="text-sm text-medium-gray">
                  {filteredEnvelopes.length} {filteredEnvelopes.length === 1 ? 'document' : 'documents'}
                </span>
              </div>
              
              {filteredEnvelopes.map((envelope) => {
                const statusConfig = getStatusConfig(envelope.status)
                const daysUntilExpiry = envelope.expiryDate ? 
                  Math.ceil((new Date(envelope.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null

                return (
                  <Card 
                    key={envelope.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedEnvelope === envelope.id 
                        ? 'border-stackmatch-blue shadow-md' 
                        : 'border-slate-200'
                    }`}
                    onClick={() => setSelectedEnvelope(envelope.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {/* Envelope Header */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-stackmatch-navy truncate pr-2">
                              {envelope.title}
                            </h4>
                            {envelope.priority === 'high' && (
                              <AlertTriangle className="w-4 h-4 text-attention-orange flex-shrink-0" />
                            )}
                          </div>
                          
                          <Badge className={`text-xs ${statusConfig.color}`}>
                            {statusConfig.icon}
                            <span className="ml-1">{statusConfig.label}</span>
                          </Badge>
                        </div>

                        {/* Signers Status */}
                        <div>
                          <div className="text-xs text-medium-gray mb-2">Signers:</div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {envelope.signers.map((signer, index) => (
                              <div key={index} className="relative">
                                <Avatar className={`w-6 h-6 ${signer.isCurrentUser ? 'ring-2 ring-information-blue' : ''}`}>
                                  <AvatarImage src={signer.avatar} />
                                  <AvatarFallback className="text-xs">{signer.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -top-1 -right-1">
                                  {getSignerIcon(signer.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sent From & Key Dates */}
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between text-medium-gray">
                            <span>From:</span>
                            <span className="font-medium text-stackmatch-navy">
                              {envelope.sentBy.name}, {envelope.sentBy.jobTitle}
                            </span>
                          </div>
                          {envelope.sentDate && (
                            <div className="flex justify-between text-medium-gray">
                              <span>Sent:</span>
                              <span>{envelope.sentDate}</span>
                            </div>
                          )}
                          {envelope.expiryDate && daysUntilExpiry !== null && (
                            <div className={`flex justify-between ${
                              daysUntilExpiry <= 3 ? 'text-red-600' : 'text-medium-gray'
                            }`}>
                              <span>Expires:</span>
                              <span>
                                {daysUntilExpiry <= 0 ? 'Expired' : 
                                 daysUntilExpiry <= 3 ? `${daysUntilExpiry} days` : 
                                 envelope.expiryDate}
                              </span>
                            </div>
                          )}
                          {envelope.completedDate && (
                            <div className="flex justify-between text-trust-green">
                              <span>Completed:</span>
                              <span>{envelope.completedDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar for In-Progress Documents */}
                        {envelope.status !== 'completed' && envelope.status !== 'voided' && (
                          <div>
                            <div className="flex justify-between text-xs text-medium-gray mb-1">
                              <span>Progress</span>
                              <span>{Math.round((envelope.fieldsCompleted / envelope.fieldsRequired) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(envelope.fieldsCompleted / envelope.fieldsRequired) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}

                        {/* Primary Action */}
                        <Button 
                          size="sm" 
                          className={`w-full ${
                            envelope.status === 'requires-my-signature' 
                              ? 'bg-information-blue hover:bg-blue-600' 
                              : envelope.status === 'completed'
                              ? 'bg-trust-green hover:bg-success-green'
                              : 'bg-stackmatch-blue hover:bg-stackmatch-navy'
                          }`}
                        >
                          {envelope.status === 'requires-my-signature' && <FileSignature className="w-3 h-3 mr-1" />}
                          {envelope.status === 'completed' && <Eye className="w-3 h-3 mr-1" />}
                          {envelope.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                          {envelope.status === 'draft' && <Edit className="w-3 h-3 mr-1" />}
                          {statusConfig.actionLabel}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Selected Envelope Details */}
            <div className="lg:col-span-2">
              {selectedEnvelopeData ? (
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1 pr-4">
                        <CardTitle>
                          {selectedEnvelopeData.title}
                        </CardTitle>
                        <p className="text-medium-gray">{selectedEnvelopeData.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <History className="w-4 h-4 mr-2" />
                          History
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Badge className={getStatusConfig(selectedEnvelopeData.status).color}>
                        {getStatusConfig(selectedEnvelopeData.status).icon}
                        <span className="ml-1">{getStatusConfig(selectedEnvelopeData.status).label}</span>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Sent From Info */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-medium-gray">Sent From:</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-stackmatch-navy">
                            {selectedEnvelopeData.sentBy.name}
                          </div>
                          <div className="text-xs text-medium-gray">
                            {selectedEnvelopeData.sentBy.jobTitle} • {selectedEnvelopeData.sentBy.company}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-stackmatch-blue/5 rounded-lg">
                        <FileText className="w-6 h-6 text-stackmatch-blue mx-auto mb-2" />
                        <div className="text-xl font-bold text-stackmatch-blue">
                          {selectedEnvelopeData.pages}
                        </div>
                        <div className="text-sm text-medium-gray">Pages</div>
                      </div>
                      
                      <div className="text-center p-4 bg-trust-green/5 rounded-lg">
                        <Users className="w-6 h-6 text-trust-green mx-auto mb-2" />
                        <div className="text-xl font-bold text-trust-green">
                          {selectedEnvelopeData.signers.length}
                        </div>
                        <div className="text-sm text-medium-gray">Signers</div>
                      </div>
                    </div>

                    <Separator />

                    {/* Signer Details */}
                    <div>
                      <h4 className="font-semibold text-stackmatch-navy mb-3">Signature Progress</h4>
                      <div className="space-y-3">
                        {selectedEnvelopeData.signers.map((signer, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                            <Avatar className={`w-10 h-10 ${signer.isCurrentUser ? 'ring-2 ring-information-blue' : ''}`}>
                              <AvatarImage src={signer.avatar} />
                              <AvatarFallback>{signer.name[0]}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-stackmatch-navy">{signer.name}</span>
                                {signer.isCurrentUser && (
                                  <Badge variant="outline" className="text-xs text-information-blue border-information-blue">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-medium-gray">{signer.jobTitle}</div>
                              <div className="text-xs text-medium-gray">{signer.email}</div>
                            </div>
                            
                            <div className="text-right">
                              {signer.status === 'signed' ? (
                                <div className="flex items-center gap-2 text-trust-green">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <div>
                                    <div className="text-sm font-medium">Signed</div>
                                    <div className="text-xs">{signer.signedAt}</div>
                                  </div>
                                </div>
                              ) : signer.status === 'pending' ? (
                                <div className="flex items-center gap-2 text-attention-orange">
                                  <Clock className="w-4 h-4" />
                                  <div className="text-sm font-medium">Pending</div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Clock3 className="w-4 h-4" />
                                  <div className="text-sm font-medium">Not Sent</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {selectedEnvelopeData.status === 'requires-my-signature' && (
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <Button className="bg-information-blue hover:bg-blue-600">
                          <FileSignature className="w-4 h-4 mr-2" />
                          Review & Sign Document
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {selectedEnvelopeData.status === 'in-progress' && (
                      <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                        <Button variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Reminder
                        </Button>
                      </div>
                    )}

                    {selectedEnvelopeData.status === 'completed' && (
                      <div className="p-4 bg-trust-green/5 border border-trust-green/20 rounded-lg">
                        <div className="flex items-center gap-2 text-trust-green mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-semibold">Document Completed</span>
                        </div>
                        <p className="text-sm text-medium-gray">
                          All signatures have been collected. Document completed on {selectedEnvelopeData.completedDate}.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-trust-green hover:bg-success-green">
                            <Download className="w-3 h-3 mr-1" />
                            Download Signed Copy
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedEnvelopeData.status === 'draft' && (
                      <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <Button 
                          className="bg-stackmatch-blue hover:bg-stackmatch-navy"
                          onClick={() => window.location.href = `/deal-rooms/${selectedEnvelopeData.id}/esignature/add-fields?documentId=${selectedEnvelopeData.id}`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Continue Setup
                        </Button>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-2" />
                          Delete Draft
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="pt-12 pb-12 text-center">
                    <PenTool className="w-12 h-12 text-medium-gray mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                      Select a Document
                    </h3>
                    <p className="text-medium-gray">
                      Choose a document from the list to view its signing details and status.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Signing Envelopes List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stackmatch-navy">
                  Sent Documents
                </h3>
                <span className="text-sm text-medium-gray">
                  {filteredEnvelopes.length} {filteredEnvelopes.length === 1 ? 'document' : 'documents'}
                </span>
              </div>
              
              {filteredEnvelopes.map((envelope) => {
                const statusConfig = getStatusConfig(envelope.status)
                const daysUntilExpiry = envelope.expiryDate ? 
                  Math.ceil((new Date(envelope.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null

                return (
                  <Card 
                    key={envelope.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedEnvelope === envelope.id 
                        ? 'border-stackmatch-blue shadow-md' 
                        : 'border-slate-200'
                    }`}
                    onClick={() => setSelectedEnvelope(envelope.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {/* Envelope Header */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-stackmatch-navy truncate pr-2">
                              {envelope.title}
                            </h4>
                            {envelope.priority === 'high' && (
                              <AlertTriangle className="w-4 h-4 text-attention-orange flex-shrink-0" />
                            )}
                          </div>
                          
                          <Badge className={`text-xs ${statusConfig.color}`}>
                            {statusConfig.icon}
                            <span className="ml-1">{statusConfig.label}</span>
                          </Badge>
                        </div>

                        {/* Signers Status */}
                        <div>
                          <div className="text-xs text-medium-gray mb-2">Signers:</div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {envelope.signers.map((signer, index) => (
                              <div key={index} className="relative">
                                <Avatar className={`w-6 h-6 ${signer.isCurrentUser ? 'ring-2 ring-information-blue' : ''}`}>
                                  <AvatarImage src={signer.avatar} />
                                  <AvatarFallback className="text-xs">{signer.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -top-1 -right-1">
                                  {getSignerIcon(signer.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sent From & Key Dates */}
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between text-medium-gray">
                            <span>Sent to:</span>
                            <span className="font-medium text-stackmatch-navy">
                              {envelope.signers.filter(s => !s.isCurrentUser).map(s => s.name).join(', ')}
                            </span>
                          </div>
                          {envelope.sentDate && (
                            <div className="flex justify-between text-medium-gray">
                              <span>Sent:</span>
                              <span>{envelope.sentDate}</span>
                            </div>
                          )}
                          {envelope.expiryDate && daysUntilExpiry !== null && (
                            <div className={`flex justify-between ${
                              daysUntilExpiry <= 3 ? 'text-red-600' : 'text-medium-gray'
                            }`}>
                              <span>Expires:</span>
                              <span>
                                {daysUntilExpiry <= 0 ? 'Expired' : 
                                 daysUntilExpiry <= 3 ? `${daysUntilExpiry} days` : 
                                 envelope.expiryDate}
                              </span>
                            </div>
                          )}
                          {envelope.completedDate && (
                            <div className="flex justify-between text-trust-green">
                              <span>Completed:</span>
                              <span>{envelope.completedDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar for In-Progress Documents */}
                        {envelope.status !== 'completed' && envelope.status !== 'voided' && (
                          <div>
                            <div className="flex justify-between text-xs text-medium-gray mb-1">
                              <span>Progress</span>
                              <span>{Math.round((envelope.fieldsCompleted / envelope.fieldsRequired) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(envelope.fieldsCompleted / envelope.fieldsRequired) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}

                        {/* Primary Action */}
                        <Button 
                          size="sm" 
                          className={`w-full ${
                            envelope.status === 'in-progress' 
                              ? 'bg-attention-orange hover:bg-orange-600' 
                              : envelope.status === 'completed'
                              ? 'bg-trust-green hover:bg-success-green'
                              : 'bg-stackmatch-blue hover:bg-stackmatch-navy'
                          }`}
                        >
                          {envelope.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                          {envelope.status === 'completed' && <Eye className="w-3 h-3 mr-1" />}
                          {envelope.status === 'draft' && <Edit className="w-3 h-3 mr-1" />}
                          {envelope.status === 'in-progress' ? 'View Progress' : 
                           envelope.status === 'completed' ? 'View Document' : 
                           'Continue Setup'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Selected Envelope Details - Same as inbox */}
            <div className="lg:col-span-2">
              {selectedEnvelopeData ? (
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1 pr-4">
                        <CardTitle>
                          {selectedEnvelopeData.title}
                        </CardTitle>
                        <p className="text-medium-gray">{selectedEnvelopeData.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <History className="w-4 h-4 mr-2" />
                          History
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Badge className={getStatusConfig(selectedEnvelopeData.status).color}>
                        {getStatusConfig(selectedEnvelopeData.status).icon}
                        <span className="ml-1">{getStatusConfig(selectedEnvelopeData.status).label}</span>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Sent From Info */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-medium-gray">
                          {activeTab === 'inbox' ? 'Sent From:' : 'Sent By:'}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-stackmatch-navy">
                            {selectedEnvelopeData.sentBy.name}
                          </div>
                          <div className="text-xs text-medium-gray">
                            {selectedEnvelopeData.sentBy.jobTitle} • {selectedEnvelopeData.sentBy.company}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-stackmatch-blue/5 rounded-lg">
                        <FileText className="w-6 h-6 text-stackmatch-blue mx-auto mb-2" />
                        <div className="text-xl font-bold text-stackmatch-blue">
                          {selectedEnvelopeData.pages}
                        </div>
                        <div className="text-sm text-medium-gray">Pages</div>
                      </div>
                      
                      <div className="text-center p-4 bg-trust-green/5 rounded-lg">
                        <Users className="w-6 h-6 text-trust-green mx-auto mb-2" />
                        <div className="text-xl font-bold text-trust-green">
                          {selectedEnvelopeData.signers.length}
                        </div>
                        <div className="text-sm text-medium-gray">Signers</div>
                      </div>
                    </div>

                    <Separator />

                    {/* Signer Details */}
                    <div>
                      <h4 className="font-semibold text-stackmatch-navy mb-3">Signature Progress</h4>
                      <div className="space-y-3">
                        {selectedEnvelopeData.signers.map((signer, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                            <Avatar className={`w-10 h-10 ${signer.isCurrentUser ? 'ring-2 ring-information-blue' : ''}`}>
                              <AvatarImage src={signer.avatar} />
                              <AvatarFallback>{signer.name[0]}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-stackmatch-navy">{signer.name}</span>
                                {signer.isCurrentUser && (
                                  <Badge variant="outline" className="text-xs text-information-blue border-information-blue">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-medium-gray">{signer.jobTitle}</div>
                              <div className="text-xs text-medium-gray">{signer.email}</div>
                            </div>
                            
                            <div className="text-right">
                              {signer.status === 'signed' ? (
                                <div className="flex items-center gap-2 text-trust-green">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <div>
                                    <div className="text-sm font-medium">Signed</div>
                                    <div className="text-xs">{signer.signedAt}</div>
                                  </div>
                                </div>
                              ) : signer.status === 'pending' ? (
                                <div className="flex items-center gap-2 text-attention-orange">
                                  <Clock className="w-4 h-4" />
                                  <div className="text-sm font-medium">Pending</div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Clock3 className="w-4 h-4" />
                                  <div className="text-sm font-medium">Not Sent</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons - Same logic as inbox but for sent perspective */}
                    {selectedEnvelopeData.status === 'in-progress' && (
                      <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                        <Button variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Reminder
                        </Button>
                      </div>
                    )}

                    {selectedEnvelopeData.status === 'completed' && (
                      <div className="p-4 bg-trust-green/5 border border-trust-green/20 rounded-lg">
                        <div className="flex items-center gap-2 text-trust-green mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-semibold">Document Completed</span>
                        </div>
                        <p className="text-sm text-medium-gray">
                          All signatures have been collected. Document completed on {selectedEnvelopeData.completedDate}.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-trust-green hover:bg-success-green">
                            <Download className="w-3 h-3 mr-1" />
                            Download Signed Copy
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedEnvelopeData.status === 'draft' && (
                      <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <Button 
                          className="bg-stackmatch-blue hover:bg-stackmatch-navy"
                          onClick={() => window.location.href = `/deal-rooms/${selectedEnvelopeData.id}/esignature/add-fields?documentId=${selectedEnvelopeData.id}`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Continue Setup
                        </Button>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-2" />
                          Delete Draft
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="pt-12 pb-12 text-center">
                    <PenTool className="w-12 h-12 text-medium-gray mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                      Select a Document
                    </h3>
                    <p className="text-medium-gray">
                      Choose a document from the list to view its signing details and status.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Prepare Document Modal */}
      <PrepareDocumentModal 
        open={prepareDocumentOpen}
        onOpenChange={setPrepareDocumentOpen}
      />
    </div>
  )
}