'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  GitCompare,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Calendar
} from 'lucide-react'

interface DealRoomProposalsProps {
  dealRoom: any
}

export function DealRoomProposals({ dealRoom }: DealRoomProposalsProps) {
  const proposals = [
    {
      id: 1,
      title: 'Initial CRM Implementation Proposal',
      version: '1.0',
      status: 'accepted',
      value: '$55,000',
      submittedBy: 'Michael Chen',
      submittedAt: '2024-01-15',
      updatedAt: '2024-01-20',
      timeline: '12 weeks',
      description: 'Complete CRM implementation with data migration, custom integrations, and training.'
    },
    {
      id: 2,
      title: 'Revised Implementation Proposal',
      version: '2.0',
      status: 'under-review',
      value: '$48,000',
      submittedBy: 'Michael Chen',
      submittedAt: '2024-01-20',
      updatedAt: '2024-01-22',
      timeline: '10 weeks',
      description: 'Updated proposal with reduced scope and optimized timeline based on client feedback.'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-trust-green text-white'
      case 'under-review':
        return 'bg-attention-orange text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4" />
      case 'under-review':
        return <Clock className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Proposals Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stackmatch-navy">Proposals</h2>
          <p className="text-medium-gray">Review and manage project proposals</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <GitCompare className="w-4 h-4 mr-2" />
            Compare Versions
          </Button>
          <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
            <Edit className="w-4 h-4 mr-2" />
            Create Counter-Offer
          </Button>
        </div>
      </div>

      {/* Proposals List */}
      <div className="grid gap-6">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {proposal.title}
                    <Badge variant="outline">v{proposal.version}</Badge>
                    <Badge className={getStatusColor(proposal.status)}>
                      {getStatusIcon(proposal.status)}
                      <span className="ml-1">{proposal.status.replace('-', ' ')}</span>
                    </Badge>
                  </CardTitle>
                  <p className="text-medium-gray mt-2">{proposal.description}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="space-y-1">
                  <div className="text-sm text-medium-gray">Proposal Value</div>
                  <div className="font-semibold text-stackmatch-navy flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {proposal.value}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-medium-gray">Timeline</div>
                  <div className="font-semibold text-stackmatch-navy flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {proposal.timeline}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-medium-gray">Submitted By</div>
                  <div className="font-semibold text-stackmatch-navy">{proposal.submittedBy}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-medium-gray">Last Updated</div>
                  <div className="font-semibold text-stackmatch-navy">{proposal.updatedAt}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                {proposal.status === 'under-review' && (
                  <>
                    <Button size="sm" className="bg-trust-green hover:bg-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}