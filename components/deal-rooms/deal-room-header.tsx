'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Settings, 
  UserPlus, 
  Share2, 
  MoreVertical,
  CircleDot,
  Briefcase,
  Calendar,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface DealRoomHeaderProps {
  dealRoom: any
}

export function DealRoomHeader({ dealRoom }: DealRoomHeaderProps) {
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

  return (
    <div className="mb-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/deal-rooms">
          <Button variant="ghost" className="text-stackmatch-blue hover:text-stackmatch-navy">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deal Rooms
          </Button>
        </Link>
      </div>

      {/* Header Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-slide-up">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-stackmatch-blue to-stackmatch-navy p-3 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-stackmatch-navy">
                  {dealRoom.title}
                </h1>
                <Badge className={getStatusColor(dealRoom.status)}>
                  {dealRoom.status.replace('-', ' ')}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-medium-gray">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {dealRoom.createdAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last activity {dealRoom.lastActivity}
                </span>
                <span>•</span>
                <Badge variant="outline">
                  {dealRoom.id}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stackmatch-navy">Participants:</span>
            
            <div className="flex items-center gap-3">
              {dealRoom.participants.map((participant: any) => (
                <div key={participant.id} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    {participant.isOnline && (
                      <CircleDot className="absolute -bottom-1 -right-1 w-4 h-4 text-trust-green" />
                    )}
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-stackmatch-navy">{participant.name}</div>
                    <div className="text-xs text-medium-gray">{participant.company}</div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      participant.role === 'buyer' 
                        ? 'bg-stackmatch-blue/10 text-stackmatch-blue' 
                        : 'bg-trust-green/10 text-trust-green'
                    }`}
                  >
                    {participant.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-medium-gray">
            <span>{dealRoom.participants.length} total participants</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CircleDot className="w-3 h-3 text-trust-green" />
              {dealRoom.participants.filter((p: any) => p.isOnline).length} online
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}