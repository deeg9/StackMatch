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
  FileSignature,
  FileSearch
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
      case 'pending-signature':
        return 'bg-[#F59E0B] text-[#FFFFFF]'
      case 'agreement-reached':
        return 'bg-[#16A34A] text-[#FFFFFF]'
      case 'implementing':
        return 'bg-[#3B82F6] text-[#FFFFFF]'
      case 'go-live':
        return 'bg-[#3B82F6] text-[#FFFFFF]'
      case 'completed':
        return 'bg-[#16A34A] text-[#FFFFFF]'
      case 'archived':
        return 'bg-[#6B7280] text-[#FFFFFF]'
      default:
        return 'bg-[#6B7280] text-[#FFFFFF]'
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
        <div className="space-y-3">
          {/* Line 1: Title */}
          <h3 className="font-semibold text-[#374151] text-lg leading-tight group-hover:text-stackmatch-blue transition-colors">
            {room.title}
          </h3>
          
          {/* Line 2: Subtitle with ID and Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6B7280]">
              {room.id}
            </span>
            <Badge className={getStatusColor(room.status)}>
              {room.status.replace('-', ' ')}
            </Badge>
          </div>
          
          {/* Date and Activity Info */}
          <div className="flex items-center gap-4 text-sm text-medium-gray pt-1">
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Participants - Enhanced with Better Avatars */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarImage src={room.participants.buyer.avatar} alt={room.participants.buyer.name} />
                <AvatarFallback className="bg-stackmatch-blue text-white font-semibold">
                  {room.participants.buyer.name[0]}
                </AvatarFallback>
              </Avatar>
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarImage src={room.participants.seller.avatar} alt={room.participants.seller.name} />
                <AvatarFallback className="bg-trust-green text-white font-semibold">
                  {room.participants.seller.name[0]}
                </AvatarFallback>
              </Avatar>
              {/* Additional participants indicator */}
              {room.participants.totalCount > 2 && (
                <div className="w-10 h-10 border-2 border-white shadow-sm rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-medium-gray">+{room.participants.totalCount - 2}</span>
                </div>
              )}
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
            <span className="text-sm text-medium-gray">Value</span>
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


        {/* Action Buttons - Improved Hierarchy */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleEnterRoom}
            className="flex-1 bg-[#4A73CC] hover:bg-[#1A2B4C] text-white shadow-sm"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Enter Room
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#4A73CC] hover:text-[#1A2B4C] hover:bg-[#4A73CC]/5 px-3"
          >
            <FileSearch className="w-4 h-4 mr-1" />
            View Listing
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#4A73CC] hover:text-[#1A2B4C] hover:bg-[#4A73CC]/5 px-3"
          >
            View Proposal
          </Button>
        </div>

        {/* New Three-Column Footer Bar */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex items-center justify-between">
            {/* Column 1: Documents */}
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6B7280]" />
              <span className="text-sm text-[#374151]">
                Documents: <span className="font-medium">{room.documents?.total || 8}</span>
              </span>
            </div>

            {/* Column 2: New Messages */}
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#6B7280]" />
              <span className="text-sm text-[#374151]">
                New Messages: {room.communication.unreadMessages > 0 ? (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-[#F59E0B] text-white">
                    {room.communication.unreadMessages}
                  </span>
                ) : (
                  <span className="font-medium">0</span>
                )}
              </span>
            </div>

            {/* Column 3: Pending Tasks */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6B7280]" />
              <span className="text-sm text-[#374151]">
                Pending Tasks: {room.communication.pendingApprovals > 0 ? (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-[#F59E0B] text-white">
                    {room.communication.pendingApprovals}
                  </span>
                ) : (
                  <span className="font-medium">0</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}