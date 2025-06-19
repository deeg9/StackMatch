'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  MessageCircle, 
  FileText, 
  Users, 
  DollarSign,
  MoreVertical,
  ArrowRight,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileSignature
} from 'lucide-react'

interface DealRoomCardProps {
  room: any
  index: number
}

export function DealRoomCard({ room, index }: DealRoomCardProps) {
  const router = useRouter()

  const handleEnterRoom = () => {
    router.push(`/deal-rooms/${room.id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'negotiating':
        return 'bg-yellow-500 text-white'
      case 'agreement-reached':
        return 'bg-trust-green text-white'
      case 'pending-approval':
        return 'bg-attention-orange text-white'
      case 'completed':
        return 'bg-information-blue text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'initial-discussion':
        return 'Initial Discussion'
      case 'proposal-review':
        return 'Proposal Review'
      case 'contract-negotiation':
        return 'Contract Negotiation'
      case 'completed':
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  const getSignatureIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="w-4 h-4 text-trust-green" />
      case 'pending':
        return <Clock className="w-4 h-4 text-attention-orange" />
      default:
        return <AlertCircle className="w-4 h-4 text-medium-gray" />
    }
  }

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-stackmatch-blue animate-slide-up cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-stackmatch-navy group-hover:text-stackmatch-blue transition-colors line-clamp-1">
                {room.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {room.id}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-medium-gray">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {room.createdDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {room.lastActivity}
              </span>
            </div>
          </div>
          
          <Badge className={getStatusColor(room.status)}>
            {room.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src={room.participants.buyer.avatar} alt={room.participants.buyer.name} />
                <AvatarFallback>{room.participants.buyer.name[0]}</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src={room.participants.seller.avatar} alt={room.participants.seller.name} />
                <AvatarFallback>{room.participants.seller.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="text-sm">
              <div className="font-medium text-stackmatch-navy">
                {room.participants.buyer.company} ↔ {room.participants.seller.company}
              </div>
              <div className="text-medium-gray flex items-center gap-1">
                <Users className="w-3 h-3" />
                {room.participants.totalCount} participants
              </div>
            </div>
          </div>
        </div>

        {/* Deal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-medium-gray">Deal Progress</span>
            <span className="font-medium text-stackmatch-navy">{getStageLabel(room.stage)}</span>
          </div>
          <Progress value={room.stageProgress} className="h-2" />
        </div>

        {/* Financials */}
        <div className="bg-slate-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-medium-gray">Deal Value</span>
            <span className="font-semibold text-stackmatch-navy flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {room.financials.proposedValue}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-medium-gray">Payment Terms</span>
            <span className="text-sm font-medium text-charcoal">{room.financials.paymentTerms}</span>
          </div>
        </div>

        {/* Communication & Documents */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-stackmatch-navy">
              <MessageCircle className="w-4 h-4" />
              {room.communication.unreadMessages}
            </div>
            <div className="text-xs text-medium-gray">Unread</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-stackmatch-navy">
              <FileText className="w-4 h-4" />
              {room.communication.documentsCount}
            </div>
            <div className="text-xs text-medium-gray">Documents</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm font-medium text-stackmatch-navy">
              <Shield className="w-4 h-4" />
              {room.communication.pendingApprovals}
            </div>
            <div className="text-xs text-medium-gray">Pending</div>
          </div>
        </div>

        {/* Signatures Status */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getSignatureIcon(room.signatures.nda)}
            <span className="text-medium-gray">NDA</span>
          </div>
          <div className="flex items-center gap-2">
            {getSignatureIcon(room.signatures.contract)}
            <span className="text-medium-gray">Contract</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleEnterRoom}
            className="flex-1 bg-stackmatch-blue hover:bg-stackmatch-navy"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Enter Room
          </Button>
          
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-1" />
            Quick Message
          </Button>
          
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            View Proposal
          </Button>
          
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}