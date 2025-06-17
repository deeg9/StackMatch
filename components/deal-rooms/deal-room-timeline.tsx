'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  FileText,
  MessageCircle,
  Upload,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DealRoomTimelineProps {
  dealRoom: any
}

export function DealRoomTimeline({ dealRoom }: DealRoomTimelineProps) {
  const timelineEvents = [
    {
      id: 1,
      type: 'milestone',
      title: 'Deal Room Created',
      description: 'Initial deal room setup and participant invitations sent',
      date: '2024-01-15',
      time: '9:00 AM',
      status: 'completed',
      actor: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/32/32'
      },
      details: {
        participants: 3,
        documents: 0
      }
    },
    {
      id: 2,
      type: 'document',
      title: 'NDA Uploaded and Signed',
      description: 'Non-disclosure agreement signed by all parties',
      date: '2024-01-16',
      time: '2:30 PM',
      status: 'completed',
      actor: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/32/32'
      },
      details: {
        signers: ['Sarah Johnson', 'Michael Chen']
      }
    },
    {
      id: 3,
      type: 'proposal',
      title: 'Initial Proposal Submitted',
      description: 'CRM implementation proposal with timeline and pricing',
      date: '2024-01-17',
      time: '11:15 AM',
      status: 'completed',
      actor: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/32/32'
      },
      details: {
        value: '$55,000',
        timeline: '12 weeks'
      }
    },
    {
      id: 4,
      type: 'meeting',
      title: 'Requirements Review Meeting',
      description: 'Detailed discussion of project requirements and scope',
      date: '2024-01-18',
      time: '3:00 PM',
      status: 'completed',
      actor: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/32/32'
      },
      details: {
        duration: '2 hours',
        attendees: 4
      }
    },
    {
      id: 5,
      type: 'proposal',
      title: 'Revised Proposal Submitted',
      description: 'Updated proposal based on requirements discussion',
      date: '2024-01-20',
      time: '10:45 AM',
      status: 'in-progress',
      actor: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/32/32'
      },
      details: {
        value: '$48,000',
        timeline: '10 weeks'
      }
    },
    {
      id: 6,
      type: 'milestone',
      title: 'Contract Negotiation Phase',
      description: 'Beginning contract terms discussion and finalization',
      date: '2024-01-25',
      time: 'TBD',
      status: 'upcoming',
      actor: null,
      details: {
        estimated_duration: '1 week'
      }
    },
    {
      id: 7,
      type: 'milestone',
      title: 'Project Kickoff',
      description: 'Official project start and team introductions',
      date: '2024-02-01',
      time: 'TBD',
      status: 'upcoming',
      actor: null,
      details: {
        estimated_duration: '1 day'
      }
    }
  ]

  const getEventIcon = (type: string, status: string) => {
    switch (type) {
      case 'milestone':
        return status === 'completed' ? 
          <CheckCircle2 className="w-5 h-5 text-trust-green" /> :
          status === 'in-progress' ?
          <Clock className="w-5 h-5 text-attention-orange" /> :
          <AlertCircle className="w-5 h-5 text-medium-gray" />
      case 'document':
        return <FileText className="w-5 h-5 text-information-blue" />
      case 'proposal':
        return <Upload className="w-5 h-5 text-stackmatch-blue" />
      case 'meeting':
        return <Users className="w-5 h-5 text-purple-500" />
      case 'message':
        return <MessageCircle className="w-5 h-5 text-trust-green" />
      default:
        return <Calendar className="w-5 h-5 text-medium-gray" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-trust-green text-white'
      case 'in-progress':
        return 'bg-attention-orange text-white'
      case 'upcoming':
        return 'bg-slate-500 text-white'
      default:
        return 'bg-medium-gray text-white'
    }
  }

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stackmatch-navy">Project Timeline</h2>
          <p className="text-medium-gray">Track milestones and project progress</p>
        </div>
        
        <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>
        
        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start gap-6">
              {/* Timeline Marker */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white border-4 border-slate-200 rounded-full">
                {getEventIcon(event.type, event.status)}
              </div>
              
              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <Card className={`hover:shadow-md transition-shadow ${event.status === 'in-progress' ? 'border-attention-orange border-2' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-stackmatch-navy">
                            {event.title}
                          </h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-medium-gray mb-3">{event.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 font-medium text-stackmatch-navy">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </span>
                          <span className="text-medium-gray">
                            {event.time}
                          </span>
                          {event.actor && (
                            <>
                              <span className="text-medium-gray">•</span>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={event.actor.avatar} alt={event.actor.name} />
                                  <AvatarFallback className="text-xs">{event.actor.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-medium-gray">{event.actor.name}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Event Details */}
                    {event.details && (
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-medium-gray capitalize">
                                {key.replace('_', ' ')}:
                              </span>
                              <span className="font-medium text-stackmatch-navy">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Summary */}
      <Card className="bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5">
        <CardHeader>
          <CardTitle className="text-lg">Timeline Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-trust-green mb-1">
                {timelineEvents.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-sm text-medium-gray">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-attention-orange mb-1">
                {timelineEvents.filter(e => e.status === 'in-progress').length}
              </div>
              <div className="text-sm text-medium-gray">In Progress</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-medium-gray mb-1">
                {timelineEvents.filter(e => e.status === 'upcoming').length}
              </div>
              <div className="text-sm text-medium-gray">Upcoming</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}