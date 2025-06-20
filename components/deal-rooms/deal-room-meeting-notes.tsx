'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Download, 
  Play,
  Upload, 
  Plus,
  Search,
  Filter,
  Link,
  CheckSquare,
  User,
} from 'lucide-react'

interface DealRoomMeetingNotesProps {
  dealRoom: any
}

export function DealRoomMeetingNotes({ dealRoom }: DealRoomMeetingNotesProps) {
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-slate-500 text-white'
    switch (status) {
      case 'scheduled':
        return 'bg-information-blue text-white'
      case 'in-progress':
        return 'bg-attention-orange text-white'
      case 'completed':
        return 'bg-success-green text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return 'Unknown'
    switch (status) {
      case 'scheduled':
        return 'Scheduled'
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  const shouldShowJoinButton = (status: string | undefined) => {
    if (!status) return false
    return status === 'scheduled' || status === 'in-progress'
  }
  // Mock data for meetings and notes
  const meetings = [
    {
      id: '1',
      title: 'Project Kickoff Meeting',
      date: '2024-01-18',
      time: '10:00 AM',
      duration: '1h 30m',
      attendees: [
        { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', present: true },
        { name: 'Michael Chen', avatar: '/api/placeholder/32/32', present: true },
        { name: 'David Kim', avatar: '/api/placeholder/32/32', present: true },
        { name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', present: false }
      ],
      recording: {
        available: true,
        duration: '1h 28m',
        size: '145 MB',
        url: '#'
      },
      transcript: {
        available: true,
        wordCount: 12450,
        url: '#'
      },
      status: 'completed',
      notes: `## Key Discussion Points

1. **Project Timeline Review**
   - Confirmed 6-month implementation timeline
   - Identified 3 critical milestones
   - Discussed resource allocation

2. **Technical Requirements**
   - Data migration strategy approved
   - Integration requirements finalized
   - Security protocols established

3. **Action Items**
   - [ ] Sarah: Finalize user acceptance criteria (Due: Jan 25)
   - [ ] Michael: Prepare technical architecture document (Due: Jan 22)
   - [ ] David: Schedule stakeholder interviews (Due: Jan 20)`,
      actionItems: 3
    },
    {
      id: '2',
      title: 'Technical Architecture Review',
      date: '2024-01-25',
      time: '2:00 PM',
      duration: '45m',
      attendees: [
        { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', present: true },
        { name: 'Michael Chen', avatar: '/api/placeholder/32/32', present: true },
        { name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', present: true }
      ],
      recording: {
        available: true,
        duration: '42m',
        size: '89 MB',
        url: '#'
      },
      transcript: {
        available: true,
        wordCount: 8200,
        url: '#'
      },
      notes: `## Architecture Review Outcomes

1. **System Architecture**
   - Approved microservices approach
   - Database design validated
   - API specifications confirmed

2. **Performance Requirements**
   - Response time targets: <200ms
   - Concurrent user capacity: 1000+
   - Data processing throughput defined

3. **Next Steps**
   - Begin development phase
   - Weekly progress reviews scheduled`,
      actionItems: 0
    },
    {
      id: '3',
      title: 'Weekly Progress Review',
      date: '2024-02-01',
      time: '11:00 AM',
      duration: '30m',
      attendees: [
        { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', present: true },
        { name: 'Michael Chen', avatar: '/api/placeholder/32/32', present: true },
        { name: 'David Kim', avatar: '/api/placeholder/32/32', present: true },
        { name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', present: true }
      ],
      recording: {
        available: false,
        duration: null,
        size: null,
        url: null
      },
      transcript: {
        available: false,
        wordCount: null,
        url: null
      },
      notes: `## Progress Update

1. **Completed This Week**
   - Database schema implementation: 85%
   - API development: 60%
   - Frontend mockups: 90%

2. **Upcoming Milestones**
   - Alpha version deployment: Feb 15
   - User testing phase: Mar 1

3. **Blockers & Risks**
   - Third-party integration delays
   - Resource availability concerns`,
      status: 'in-progress',
      actionItems: 2
    },
    {
      id: '3',
      title: 'Sprint Planning Session',
      date: '2024-02-05',
      time: '9:00 AM',
      duration: '2h',
      attendees: [
        { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', present: false },
        { name: 'Michael Chen', avatar: '/api/placeholder/32/32', present: false },
        { name: 'David Kim', avatar: '/api/placeholder/32/32', present: false },
        { name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', present: false }
      ],
      recording: {
        available: false,
        duration: null,
        size: null,
        url: null
      },
      transcript: {
        available: false,
        wordCount: null,
        url: null
      },
      status: 'scheduled',
      notes: `## Agenda

1. **Sprint Goals Definition**
   - Review product backlog
   - Set sprint objectives
   - Capacity planning

2. **Task Breakdown**
   - Story point estimation
   - Task assignment
   - Dependency mapping

3. **Timeline & Deliverables**
   - Sprint timeline review
   - Definition of done criteria
   - Acceptance criteria validation`,
      actionItems: 0
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filter Row */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
          <Input 
            placeholder="Search meetings..." 
            className="pl-10 w-full"
          />
        </div>
        
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Primary Actions Bar */}
      <Card className="border-slate-200 bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                <Plus className="w-4 h-4 mr-2" />
                Add Meeting
              </Button>
              
              <Button size="sm" className="bg-trust-green hover:bg-success-green">
                <Video className="w-4 h-4 mr-2" />
                Start Instant Meeting
              </Button>
            </div>
            
            <div className="text-sm text-medium-gray">
              Total meeting time: <span className="font-semibold text-stackmatch-navy">12h 45m</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg text-stackmatch-navy">
                      {meeting.title}
                    </CardTitle>
                    <Badge className={getStatusColor(meeting.status)}>
                      {getStatusLabel(meeting.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-medium-gray">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {meeting.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {meeting.time} • {meeting.duration}
                    </div>
                  </div>
                </div>
                
                {shouldShowJoinButton(meeting.status) && (
                  <Button size="sm" className="bg-trust-green hover:bg-success-green text-white">
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Attendees */}
              <div>
                <h4 className="text-sm font-semibold text-stackmatch-navy mb-3">Attendees</h4>
                <div className="flex items-center gap-3">
                  {meeting.attendees.map((attendee, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={attendee.avatar} alt={attendee.name} />
                          <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                        </Avatar>
                        {attendee.present ? (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-trust-green rounded-full border-2 border-white" />
                        ) : (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-stackmatch-navy">{attendee.name}</div>
                        <div className="text-xs text-medium-gray">
                          {attendee.present ? 'Present' : 'Absent'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recording & Transcript Info */}
              {(meeting.recording.available || meeting.transcript.available) && (
                <div>
                  <h4 className="text-sm font-semibold text-stackmatch-navy mb-3">Recording & Transcript</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {meeting.recording.available && (
                      <div className="p-4 bg-stackmatch-blue/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-4 h-4 text-stackmatch-blue" />
                          <span className="font-medium text-stackmatch-navy">Recording</span>
                        </div>
                        <div className="text-sm text-medium-gray space-y-1">
                          <div>Duration: {meeting.recording.duration}</div>
                          <div>Size: {meeting.recording.size}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                            <Play className="w-3 h-3 mr-1" />
                            Watch
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {meeting.transcript.available && (
                      <div className="p-4 bg-trust-green/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-trust-green" />
                          <span className="font-medium text-stackmatch-navy">Transcript</span>
                        </div>
                        <div className="text-sm text-medium-gray space-y-1">
                          <div>Words: {meeting.transcript.wordCount?.toLocaleString()}</div>
                          <div>Searchable text available</div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Button size="sm" variant="outline" className="border-trust-green text-trust-green hover:bg-trust-green hover:text-white">
                            <FileText className="w-3 h-3 mr-1" />
                            Read
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Meeting Notes */}
              <div>
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-stackmatch-navy">Meeting Notes</h4>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-charcoal font-mono">
{meeting.notes}
                    </pre>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Edit Notes
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Link className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <div className="text-xs text-medium-gray">
                  Last updated: {meeting.date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Meeting Notes */}
      <Card className="border-dashed border-2 border-slate-300 hover:border-stackmatch-blue transition-colors duration-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <Video className="w-8 h-8 text-medium-gray mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
              No upcoming meetings
            </h3>
            <p className="text-medium-gray mb-4">
              Schedule your next meeting or upload meeting recordings
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Recording
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}