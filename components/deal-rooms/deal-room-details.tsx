"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  DollarSign, 
  Users, 
  MessageSquare, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface DealRoomDetailsProps {
  dealRoom: {
    id: string
    room_name: string
    status: string
    created_at: string
    listing?: {
      title: string
      description: string
      budget_min?: number
      budget_max?: number
      timeline?: string
    }
    proposal?: {
      proposal_text?: string
      proposed_budget?: number
      proposed_timeline?: string
    }
    deal_room_participants?: Array<{
      id: string
      role: string
      user: {
        full_name?: string
        email: string
      }
    }>
    deal_room_messages?: Array<{
      id: string
      content: string
      created_at: string
    }>
    deal_room_files?: Array<{
      id: string
      file_name: string
      file_size: number
    }>
  }
  dealRoomId: string
  onAddParticipant?: () => void
  onRemoveParticipant?: () => void
  onViewListing?: () => void
  onViewProposal?: () => void
}

export function DealRoomDetails({
  dealRoom,
  dealRoomId,
  onAddParticipant,
  onRemoveParticipant,
  onViewListing,
  onViewProposal
}: DealRoomDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{dealRoom.room_name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                Deal Room ID: {dealRoomId}
              </p>
            </div>
            <Badge 
              className={`${getStatusColor(dealRoom.status)} flex items-center gap-1`}
            >
              {getStatusIcon(dealRoom.status)}
              {dealRoom.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Created: {new Date(dealRoom.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Participants</p>
                <p className="text-2xl font-bold">
                  {dealRoom.deal_room_participants?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
              <div>
                <p className="text-sm font-medium">Messages</p>
                <p className="text-2xl font-bold">
                  {dealRoom.deal_room_messages?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Files</p>
                <p className="text-2xl font-bold">
                  {dealRoom.deal_room_files?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="text-lg font-bold">
                  ${dealRoom.proposal?.proposed_budget?.toLocaleString() || 'TBD'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listing Details */}
        {dealRoom.listing && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Listing</CardTitle>
              <Button variant="outline" size="sm" onClick={onViewListing}>
                View Full Listing
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{dealRoom.listing.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {dealRoom.listing.description?.slice(0, 150)}...
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Budget Range:</span>
                  <p>${dealRoom.listing.budget_min?.toLocaleString()} - ${dealRoom.listing.budget_max?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium">Timeline:</span>
                  <p>{dealRoom.listing.timeline || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proposal Details */}
        {dealRoom.proposal && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Selected Proposal</CardTitle>
              <Button variant="outline" size="sm" onClick={onViewProposal}>
                View Full Proposal
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {dealRoom.proposal.proposal_text?.slice(0, 150)}...
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Proposed Budget:</span>
                  <p>${dealRoom.proposal.proposed_budget?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium">Timeline:</span>
                  <p>{dealRoom.proposal.proposed_timeline || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Participants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Participants</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={onAddParticipant}>
              Add Participant
            </Button>
            <Button variant="outline" size="sm" onClick={onRemoveParticipant}>
              Manage Access
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dealRoom.deal_room_participants?.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {participant.user.full_name?.slice(0, 2).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{participant.user.full_name || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">{participant.user.email}</p>
                  </div>
                </div>
                <Badge variant="outline">{participant.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}