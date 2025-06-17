'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Plus
} from 'lucide-react'

interface DealRoomTermsProps {
  dealRoom: any
}

export function DealRoomTerms({ dealRoom }: DealRoomTermsProps) {
  const [editingTerm, setEditingTerm] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const terms = [
    {
      id: 1,
      category: 'Financial',
      title: 'Project Value',
      value: '$48,000 USD',
      status: 'agreed',
      negotiable: false,
      lastUpdated: '2024-01-20',
      updatedBy: 'Michael Chen',
      description: 'Total project cost including all deliverables and milestones'
    },
    {
      id: 2,
      category: 'Financial',
      title: 'Payment Schedule',
      value: '30% upfront, 40% at milestone completion, 30% on delivery',
      status: 'agreed',
      negotiable: false,
      lastUpdated: '2024-01-20',
      updatedBy: 'Sarah Johnson',
      description: 'Payment structure for project deliverables'
    },
    {
      id: 3,
      category: 'Timeline',
      title: 'Project Duration',
      value: '10 weeks from contract signing',
      status: 'pending',
      negotiable: true,
      lastUpdated: '2024-01-22',
      updatedBy: 'Michael Chen',
      description: 'Total time required for project completion'
    },
    {
      id: 4,
      category: 'Timeline',
      title: 'Delivery Milestones',
      value: 'Week 3: Requirements analysis, Week 6: Development complete, Week 10: Testing and deployment',
      status: 'under-review',
      negotiable: true,
      lastUpdated: '2024-01-22',
      updatedBy: 'Michael Chen',
      description: 'Key project milestones and delivery dates'
    },
    {
      id: 5,
      category: 'Scope',
      title: 'Data Migration',
      value: 'Full migration of existing customer data, contact records, and sales history',
      status: 'agreed',
      negotiable: false,
      lastUpdated: '2024-01-18',
      updatedBy: 'Sarah Johnson',
      description: 'Scope of data migration activities'
    },
    {
      id: 6,
      category: 'Support',
      title: 'Post-Launch Support',
      value: '90 days of free support, then $200/month maintenance',
      status: 'pending',
      negotiable: true,
      lastUpdated: '2024-01-22',
      updatedBy: 'Michael Chen',
      description: 'Support and maintenance terms after project completion'
    },
    {
      id: 7,
      category: 'Legal',
      title: 'Intellectual Property',
      value: 'Client retains all IP rights, vendor retains rights to general methodologies',
      status: 'under-review',
      negotiable: true,
      lastUpdated: '2024-01-21',
      updatedBy: 'Sarah Johnson',
      description: 'Intellectual property ownership and usage rights'
    }
  ]

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
      default:
        return <FileSignature className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial':
        return <DollarSign className="w-5 h-5 text-trust-green" />
      case 'Timeline':
        return <Calendar className="w-5 h-5 text-stackmatch-blue" />
      case 'Legal':
        return <Shield className="w-5 h-5 text-attention-orange" />
      default:
        return <FileSignature className="w-5 h-5 text-medium-gray" />
    }
  }

  const groupedTerms = terms.reduce((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = []
    }
    acc[term.category].push(term)
    return acc
  }, {} as Record<string, typeof terms>)

  const handleEdit = (termId: number, currentValue: string) => {
    setEditingTerm(termId)
    setEditValue(currentValue)
  }

  const handleSave = (termId: number) => {
    // Handle saving the term
    console.log('Saving term:', termId, editValue)
    setEditingTerm(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setEditingTerm(null)
    setEditValue('')
  }

  return (
    <div className="space-y-6">
      {/* Terms Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stackmatch-navy">Contract Terms</h2>
          <p className="text-medium-gray">Review and negotiate project terms and conditions</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileSignature className="w-4 h-4 mr-2" />
            Export Terms
          </Button>
          <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
            <Plus className="w-4 h-4 mr-2" />
            Add Term
          </Button>
        </div>
      </div>

      {/* Terms Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-trust-green mb-1">
              {terms.filter(t => t.status === 'agreed').length}
            </div>
            <div className="text-sm text-medium-gray">Agreed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-stackmatch-blue mb-1">
              {terms.filter(t => t.status === 'under-review').length}
            </div>
            <div className="text-sm text-medium-gray">Under Review</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-attention-orange mb-1">
              {terms.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-medium-gray">Pending</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-medium-gray mb-1">
              {terms.filter(t => t.negotiable).length}
            </div>
            <div className="text-sm text-medium-gray">Negotiable</div>
          </CardContent>
        </Card>
      </div>

      {/* Terms by Category */}
      {Object.entries(groupedTerms).map(([category, categoryTerms]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(category)}
              {category} Terms
              <Badge variant="secondary">{categoryTerms.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryTerms.map((term) => (
                <div key={term.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-stackmatch-navy">{term.title}</h4>
                        <Badge className={getStatusColor(term.status)}>
                          {getStatusIcon(term.status)}
                          <span className="ml-1">{term.status.replace('-', ' ')}</span>
                        </Badge>
                        {term.negotiable && (
                          <Badge variant="outline" className="text-xs">
                            Negotiable
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-medium-gray mb-3">{term.description}</p>
                      
                      {editingTerm === term.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSave(term.id)}>
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded p-3 mb-3">
                          <p className="font-medium text-stackmatch-navy">{term.value}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-medium-gray">
                        <span>Last updated: {term.lastUpdated}</span>
                        <span>•</span>
                        <span>By: {term.updatedBy}</span>
                      </div>
                    </div>
                    
                    {editingTerm !== term.id && (
                      <div className="flex gap-2">
                        {term.negotiable && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(term.id, term.value)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {term.status === 'pending' && (
                          <Button size="sm" className="bg-trust-green hover:bg-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}