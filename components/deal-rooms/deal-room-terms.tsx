'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileSignature,
  Edit,
  Save,
  X,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  Shield,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MessageSquare,
  History,
  Scale,
  Gavel,
  FileText,
  Users,
  Lock,
  Eye,
  EyeOff,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Briefcase,
  CreditCard,
  Timer,
  Globe,
  Building,
  Award,
  RefreshCw,
  Send,
  Archive,
  PenTool,
  Stamp,
  CheckSquare,
  AlertCircle,
  XCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Info
} from 'lucide-react'

interface DealRoomTermsProps {
  dealRoom: any
}

export function DealRoomTerms({ dealRoom }: DealRoomTermsProps) {
  const [editingTerm, setEditingTerm] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [activeTab, setActiveTab] = useState('terms')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Financial', 'Legal'])

  // Enhanced contract terms data
  const contractSections = [
    {
      id: 'financial',
      title: 'Financial Terms',
      icon: DollarSign,
      color: 'text-trust-green',
      terms: [
        {
          id: 1,
          title: 'Total Project Value',
          value: '$175,000 USD',
          status: 'agreed',
          priority: 'critical',
          negotiable: false,
          lastUpdated: '2024-01-25',
          updatedBy: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', role: 'buyer' },
          description: 'Total project cost including all deliverables, milestones, and 12-month support',
          history: [
            { date: '2024-01-15', value: '$185,000 USD', changedBy: 'Michael Chen', reason: 'Initial proposal' },
            { date: '2024-01-20', value: '$175,000 USD', changedBy: 'Sarah Johnson', reason: 'Negotiated reduction based on scope refinement' }
          ],
          legalNotes: 'All amounts are in USD and subject to applicable taxes',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-25', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-25', signature: 'electronic' }
          ]
        },
        {
          id: 2,
          title: 'Payment Schedule',
          value: '25% ($43,750) upfront, 50% ($87,500) at milestone completion, 25% ($43,750) on final delivery',
          status: 'agreed',
          priority: 'critical',
          negotiable: false,
          lastUpdated: '2024-01-25',
          updatedBy: { name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', role: 'seller' },
          description: 'Payment structure aligned with project milestones and deliverable completion',
          history: [
            { date: '2024-01-20', value: '30% upfront, 40% milestone, 30% final', changedBy: 'Michael Chen', reason: 'Standard payment terms' },
            { date: '2024-01-25', value: 'Current payment schedule', changedBy: 'Elena Rodriguez', reason: 'Adjusted to client cash flow preferences' }
          ],
          legalNotes: 'Payments due within 30 days of invoice. Late payments subject to 1.5% monthly interest',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-25', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-25', signature: 'electronic' }
          ]
        },
        {
          id: 3,
          title: 'Currency & Tax Terms',
          value: 'All amounts in USD. Client responsible for applicable taxes. Vendor responsible for own tax obligations.',
          status: 'agreed',
          priority: 'medium',
          negotiable: false,
          lastUpdated: '2024-01-20',
          updatedBy: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', role: 'buyer' },
          description: 'Currency, taxation, and financial obligation terms',
          history: [],
          legalNotes: 'Tax obligations determined by applicable local and federal regulations',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-20', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-20', signature: 'electronic' }
          ]
        }
      ]
    },
    {
      id: 'timeline',
      title: 'Timeline & Delivery',
      icon: Calendar,
      color: 'text-stackmatch-blue',
      terms: [
        {
          id: 4,
          title: 'Project Duration',
          value: '6 months (26 weeks) from contract execution',
          status: 'agreed',
          priority: 'high',
          negotiable: false,
          lastUpdated: '2024-01-28',
          updatedBy: { name: 'Michael Chen', avatar: '/api/placeholder/32/32', role: 'seller' },
          description: 'Total time required for complete project delivery including testing and deployment',
          history: [
            { date: '2024-01-15', value: '8 months', changedBy: 'Michael Chen', reason: 'Initial estimate' },
            { date: '2024-01-22', value: '6 months', changedBy: 'Michael Chen', reason: 'Optimized timeline with parallel workstreams' }
          ],
          legalNotes: 'Timeline subject to force majeure events and client-caused delays',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-28', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-28', signature: 'electronic' }
          ]
        },
        {
          id: 5,
          title: 'Key Milestones',
          value: 'Month 1: Requirements & Architecture (Week 4), Month 3: Core Development (Week 12), Month 5: Testing & Integration (Week 20), Month 6: Deployment & Training (Week 26)',
          status: 'agreed',
          priority: 'high',
          negotiable: true,
          lastUpdated: '2024-01-28',
          updatedBy: { name: 'Michael Chen', avatar: '/api/placeholder/32/32', role: 'seller' },
          description: 'Critical project milestones with specific delivery dates and acceptance criteria',
          history: [],
          legalNotes: 'Milestone completion subject to client approval within 5 business days',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-28', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-28', signature: 'electronic' }
          ]
        },
        {
          id: 6,
          title: 'Change Request Process',
          value: 'Changes requiring >5% scope increase need written approval and may adjust timeline/cost. Minor changes handled within weekly reviews.',
          status: 'under-review',
          priority: 'medium',
          negotiable: true,
          lastUpdated: '2024-01-30',
          updatedBy: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', role: 'buyer' },
          description: 'Process for handling scope changes and timeline adjustments',
          history: [],
          legalNotes: 'Change requests must be documented and approved in writing by both parties',
          approvals: [
            { user: 'Sarah Johnson', approved: false, date: null, signature: null },
            { user: 'Michael Chen', approved: false, date: null, signature: null }
          ]
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Compliance',
      icon: Shield,
      color: 'text-attention-orange',
      terms: [
        {
          id: 7,
          title: 'Intellectual Property Rights',
          value: 'Client owns all custom-developed IP. Vendor retains rights to pre-existing IP, methodologies, and general knowledge. Vendor may create anonymized case studies.',
          status: 'agreed',
          priority: 'critical',
          negotiable: false,
          lastUpdated: '2024-01-27',
          updatedBy: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', role: 'buyer' },
          description: 'Intellectual property ownership, usage rights, and restrictions',
          history: [
            { date: '2024-01-20', value: 'Standard IP terms', changedBy: 'Michael Chen', reason: 'Initial proposal' },
            { date: '2024-01-27', value: 'Current IP terms', changedBy: 'Sarah Johnson', reason: 'Added case study provision' }
          ],
          legalNotes: 'IP ownership transfers upon final payment. Vendor indemnifies against IP infringement claims.',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-27', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-27', signature: 'electronic' }
          ]
        },
        {
          id: 8,
          title: 'Confidentiality & Data Protection',
          value: 'Both parties maintain strict confidentiality. GDPR/CCPA compliance required. Data breach notification within 72 hours. Data retention as per client policy.',
          status: 'agreed',
          priority: 'critical',
          negotiable: false,
          lastUpdated: '2024-01-16',
          updatedBy: { name: 'Michael Chen', avatar: '/api/placeholder/32/32', role: 'seller' },
          description: 'Data protection, privacy compliance, and confidentiality obligations',
          history: [],
          legalNotes: 'Governed by applicable data protection regulations and industry standards',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-16', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-16', signature: 'electronic' }
          ]
        },
        {
          id: 9,
          title: 'Liability & Insurance',
          value: 'Vendor liability capped at total contract value. Both parties maintain professional liability insurance ($2M minimum). Mutual indemnification for third-party claims.',
          status: 'pending',
          priority: 'high',
          negotiable: true,
          lastUpdated: '2024-01-30',
          updatedBy: { name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', role: 'seller' },
          description: 'Liability limitations, insurance requirements, and indemnification terms',
          history: [],
          legalNotes: 'Liability cap excludes gross negligence, willful misconduct, and IP infringement',
          approvals: [
            { user: 'Sarah Johnson', approved: false, date: null, signature: null },
            { user: 'Michael Chen', approved: false, date: null, signature: null }
          ]
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Maintenance',
      icon: Award,
      color: 'text-information-blue',
      terms: [
        {
          id: 10,
          title: 'Post-Launch Support',
          value: '12 months comprehensive support included. 24/7 critical issue response, 4-hour response time. After year 1: $3,000/month maintenance.',
          status: 'agreed',
          priority: 'high',
          negotiable: false,
          lastUpdated: '2024-01-28',
          updatedBy: { name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', role: 'seller' },
          description: 'Post-implementation support terms, response times, and ongoing maintenance',
          history: [
            { date: '2024-01-22', value: '6 months support, then $2,500/month', changedBy: 'Michael Chen', reason: 'Initial support proposal' },
            { date: '2024-01-28', value: 'Current support terms', changedBy: 'Elena Rodriguez', reason: 'Extended support period and comprehensive coverage' }
          ],
          legalNotes: 'Support covers bug fixes, performance issues, and minor enhancements',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-28', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-28', signature: 'electronic' }
          ]
        },
        {
          id: 11,
          title: 'Training & Knowledge Transfer',
          value: '40 hours on-site training included. User manuals, admin documentation, and video tutorials provided. Additional training at $150/hour.',
          status: 'agreed',
          priority: 'medium',
          negotiable: true,
          lastUpdated: '2024-01-25',
          updatedBy: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', role: 'buyer' },
          description: 'Training delivery, documentation requirements, and knowledge transfer process',
          history: [],
          legalNotes: 'Training to be completed within 30 days of system deployment',
          approvals: [
            { user: 'Sarah Johnson', approved: true, date: '2024-01-25', signature: 'electronic' },
            { user: 'Michael Chen', approved: true, date: '2024-01-25', signature: 'electronic' }
          ]
        }
      ]
    }
  ]

  const allTerms = contractSections.flatMap(section => 
    section.terms.map(term => ({
      ...term,
      category: section.title,
      categoryIcon: section.icon,
      categoryColor: section.color
    }))
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agreed':
        return 'bg-trust-green text-white'
      case 'pending':
        return 'bg-attention-orange text-white'
      case 'under-review':
        return 'bg-stackmatch-blue text-white'
      case 'disputed':
        return 'bg-red-500 text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agreed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'under-review':
        return <AlertTriangle className="w-4 h-4" />
      case 'disputed':
        return <XCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return <FileSignature className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleEdit = (termId: number, currentValue: string) => {
    setEditingTerm(termId)
    setEditValue(currentValue)
  }

  const handleSave = (termId: number) => {
    console.log('Saving term:', termId, editValue)
    setEditingTerm(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setEditingTerm(null)
    setEditValue('')
  }

  const agreedTerms = allTerms.filter(t => t.status === 'agreed').length
  const totalTerms = allTerms.length
  const completionPercentage = Math.round((agreedTerms / totalTerms) * 100)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Terms Header */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-stackmatch-blue" />
                <h2 className="text-xl font-semibold text-stackmatch-navy">Contract Terms & Conditions</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-stackmatch-blue/10 text-stackmatch-blue">
                  {totalTerms} terms
                </Badge>
                <Badge className="bg-trust-green text-white">
                  {agreedTerms} agreed
                </Badge>
                <Badge variant="outline" className="text-attention-orange border-attention-orange">
                  {completionPercentage}% complete
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
                <Input
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                <Plus className="w-4 h-4 mr-2" />
                Add Term
              </Button>
            </div>
          </div>

          {/* Contract Completion Progress */}
          <div className="p-4 bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-stackmatch-navy">Contract Completion</span>
              <span className="text-sm font-bold text-stackmatch-blue">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3 mb-3" />
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-trust-green">{agreedTerms}</div>
                <div className="text-medium-gray">Agreed</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-stackmatch-blue">{allTerms.filter(t => t.status === 'under-review').length}</div>
                <div className="text-medium-gray">Under Review</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-attention-orange">{allTerms.filter(t => t.status === 'pending').length}</div>
                <div className="text-medium-gray">Pending</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-information-blue">{allTerms.filter(t => t.negotiable).length}</div>
                <div className="text-medium-gray">Negotiable</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 p-1">
          <TabsTrigger 
            value="terms" 
            className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Contract Terms
          </TabsTrigger>
          <TabsTrigger 
            value="negotiations" 
            className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
          >
            <Gavel className="w-4 h-4 mr-2" />
            Negotiations
          </TabsTrigger>
          <TabsTrigger 
            value="approvals" 
            className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
          >
            <Stamp className="w-4 h-4 mr-2" />
            Approvals
          </TabsTrigger>
        </TabsList>

        {/* Contract Terms Tab */}
        <TabsContent value="terms" className="mt-6">
          <div className="space-y-6">
            {contractSections.map((section) => {
              const Icon = section.icon
              const isExpanded = expandedCategories.includes(section.title)
              
              return (
                <Card key={section.id} className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCategory(section.title)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${section.color}`} />
                        <div>
                          <h3 className="text-lg font-semibold text-stackmatch-navy">{section.title}</h3>
                          <p className="text-sm text-medium-gray">
                            {section.terms.filter(t => t.status === 'agreed').length} of {section.terms.length} terms agreed
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          {section.terms.length} terms
                        </Badge>
                      </div>
                      
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-medium-gray" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-medium-gray" />
                      )}
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent>
                      <div className="space-y-6">
                        {section.terms.map((term) => (
                          <Card key={term.id} className="border border-slate-200 hover:shadow-sm transition-shadow duration-200">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                {/* Term Header */}
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-semibold text-stackmatch-navy">{term.title}</h4>
                                      <Badge className={getStatusColor(term.status)}>
                                        {getStatusIcon(term.status)}
                                        <span className="ml-1">{term.status.replace('-', ' ')}</span>
                                      </Badge>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getPriorityColor(term.priority)}`}
                                      >
                                        {term.priority}
                                      </Badge>
                                      {term.negotiable && (
                                        <Badge variant="outline" className="text-xs">
                                          <PenTool className="w-2 h-2 mr-1" />
                                          Negotiable
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <p className="text-sm text-medium-gray mb-3">{term.description}</p>
                                  </div>
                                  
                                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* Term Content */}
                                {editingTerm === term.id ? (
                                  <div className="space-y-3">
                                    <Textarea
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="min-h-[100px]"
                                      placeholder="Enter term details..."
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => handleSave(term.id)} className="bg-trust-green hover:bg-success-green">
                                        <Save className="w-4 h-4 mr-1" />
                                        Save Changes
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={handleCancel}>
                                        <X className="w-4 h-4 mr-1" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-stackmatch-blue">
                                    <p className="text-stackmatch-navy leading-relaxed">{term.value}</p>
                                  </div>
                                )}

                                {/* Legal Notes */}
                                {term.legalNotes && (
                                  <div className="p-3 bg-attention-orange/5 border border-attention-orange/20 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Info className="w-4 h-4 text-attention-orange" />
                                      <span className="text-sm font-medium text-attention-orange">Legal Notes</span>
                                    </div>
                                    <p className="text-sm text-charcoal">{term.legalNotes}</p>
                                  </div>
                                )}

                                {/* Approvals Status */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-stackmatch-navy">Approvals:</span>
                                    <div className="flex items-center gap-3">
                                      {term.approvals.map((approval, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                          <Avatar className="w-6 h-6">
                                            <AvatarFallback className="text-xs">{approval.user[0]}</AvatarFallback>
                                          </Avatar>
                                          <span className="text-sm text-medium-gray">{approval.user}</span>
                                          {approval.approved ? (
                                            <CheckCircle2 className="w-4 h-4 text-trust-green" />
                                          ) : (
                                            <Clock className="w-4 h-4 text-attention-orange" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="text-xs text-medium-gray">
                                    Last updated: {term.lastUpdated} by {term.updatedBy.name}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                  {editingTerm !== term.id && (
                                    <>
                                      {term.negotiable && (
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => handleEdit(term.id, term.value)}
                                          className="hover:bg-stackmatch-blue hover:text-white"
                                        >
                                          <Edit className="w-4 h-4 mr-1" />
                                          Edit
                                        </Button>
                                      )}
                                      
                                      {term.status === 'pending' && (
                                        <>
                                          <Button size="sm" className="bg-trust-green hover:bg-success-green">
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Approve
                                          </Button>
                                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                      
                                      {term.status === 'under-review' && (
                                        <Button size="sm" className="bg-information-blue hover:bg-blue-600">
                                          <MessageSquare className="w-4 h-4 mr-1" />
                                          Comment
                                        </Button>
                                      )}
                                      
                                      <Button variant="outline" size="sm" className="hover:bg-slate-100">
                                        <History className="w-4 h-4 mr-1" />
                                        History
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Negotiations Tab */}
        <TabsContent value="negotiations" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Gavel className="w-16 h-16 text-medium-gray mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                  Negotiation History
                </h3>
                <p className="text-medium-gray mb-4">
                  Track all term changes, negotiations, and discussions
                </p>
                <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Negotiation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Stamp className="w-16 h-16 text-medium-gray mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                  Approval Workflow
                </h3>
                <p className="text-medium-gray mb-4">
                  Digital signatures, approvals, and execution tracking
                </p>
                <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                  <FileSignature className="w-4 h-4 mr-2" />
                  Request Signature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}