'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  ArrowLeft, 
  Settings, 
  UserPlus, 
  Share2, 
  MoreVertical,
  CircleDot,
  Briefcase,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DealRoomHeaderProps {
  dealRoom: any
}

export function DealRoomHeader({ dealRoom }: DealRoomHeaderProps) {
  const router = useRouter()
  const [showAllParticipants, setShowAllParticipants] = useState(false)
  
  // Define the list of available deal room IDs for navigation
  const dealRoomIds = ['DR-001', 'DR-002', 'DR-003', 'DR-004', 'DR-005', 'DR-006', 'DR-007']
  const currentIndex = dealRoomIds.indexOf(dealRoom.id)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < dealRoomIds.length - 1
  
  const navigateToDealRoom = (direction: 'previous' | 'next') => {
    const newIndex = direction === 'previous' ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < dealRoomIds.length) {
      router.push(`/deal-rooms/${dealRoomIds[newIndex]}`)
    }
  }
  
  // Limit displayed participants
  const maxDisplayedParticipants = 5
  const displayedParticipants = dealRoom.participants.slice(0, maxDisplayedParticipants)
  const remainingParticipants = dealRoom.participants.length - maxDisplayedParticipants
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
      {/* Navigation Controls */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/deal-rooms">
          <Button variant="ghost" className="text-stackmatch-blue hover:text-stackmatch-navy">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deal Rooms
          </Button>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToDealRoom('previous')}
            disabled={!hasPrevious}
            className="text-stackmatch-blue hover:text-stackmatch-navy hover:bg-stackmatch-blue/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <span className="px-3 py-1 text-sm text-medium-gray">
            {currentIndex + 1} of {dealRoomIds.length}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToDealRoom('next')}
            disabled={!hasNext}
            className="text-stackmatch-blue hover:text-stackmatch-navy hover:bg-stackmatch-blue/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
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
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-stackmatch-blue/5 hover:text-stackmatch-navy hover:border-stackmatch-blue"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Listing
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-stackmatch-blue/5 hover:text-stackmatch-navy hover:border-stackmatch-blue"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Proposal
            </Button>
            
            <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stackmatch-navy">Participants:</span>
            
            <div className="flex items-center gap-3">
              {displayedParticipants.map((participant: any) => (
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
                    <div className="text-xs text-medium-gray">
                      {participant.company}
                      <span className="block capitalize">{participant.role}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {remainingParticipants > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAllParticipants(true)}
                  className="text-stackmatch-blue hover:text-stackmatch-navy hover:bg-stackmatch-blue/5"
                >
                  +{remainingParticipants} More
                </Button>
              )}
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
      
      {/* All Participants Modal */}
      <Dialog open={showAllParticipants} onOpenChange={setShowAllParticipants}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>All Participants ({dealRoom.participants.length})</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            {dealRoom.participants.map((participant: any) => (
              <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    {participant.isOnline && (
                      <CircleDot className="absolute -bottom-1 -right-1 w-4 h-4 text-trust-green" />
                    )}
                  </div>
                  
                  <div>
                    <div className="font-medium text-stackmatch-navy">{participant.name}</div>
                    <div className="text-sm text-medium-gray">{participant.title} at {participant.company}</div>
                    <div className="text-sm capitalize text-stackmatch-blue">{participant.role}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-medium-gray">{participant.email}</div>
                  <div className="text-xs text-medium-gray">
                    {participant.isOnline ? (
                      <span className="flex items-center gap-1 text-trust-green">
                        <CircleDot className="w-3 h-3" />
                        Online now
                      </span>
                    ) : (
                      <span>Last seen {participant.lastSeen}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}