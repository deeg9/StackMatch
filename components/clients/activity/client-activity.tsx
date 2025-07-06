'use client'

import { useState } from 'react'
import { ActivityItem } from './activity-item'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, Clock } from 'lucide-react'

export interface Activity {
  id: string
  type: 'meeting' | 'message' | 'document' | 'proposal' | 'contract' | 'note' | 'call'
  description: string
  date: string
  user: {
    name: string
    avatar?: string
  }
  details?: string
  metadata?: {
    duration?: string
    documentName?: string
    meetingAttendees?: string[]
    proposalValue?: number
  }
}

interface ClientActivityProps {
  clientId: string
}

export function ClientActivity({ clientId }: ClientActivityProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data - in production this would come from API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'meeting',
      description: 'Quarterly Business Review',
      date: '2025-01-22T14:00:00',
      user: {
        name: 'Elena Rodriguez',
        avatar: '/api/placeholder/32/32'
      },
      details: 'Discussed Q4 performance and Q1 roadmap',
      metadata: {
        duration: '90 minutes',
        meetingAttendees: ['Sarah Johnson', 'Michael Chen', 'Elena Rodriguez']
      }
    },
    {
      id: '2',
      type: 'document',
      description: 'uploaded technical requirements',
      date: '2025-01-20T10:30:00',
      user: {
        name: 'Michael Chen'
      },
      metadata: {
        documentName: 'CRM_Technical_Requirements_v2.pdf'
      }
    },
    {
      id: '3',
      type: 'proposal',
      description: 'submitted renewal proposal',
      date: '2025-01-18T15:45:00',
      user: {
        name: 'David Kim'
      },
      details: 'Annual renewal with 15% volume discount',
      metadata: {
        proposalValue: 287500
      }
    },
    {
      id: '4',
      type: 'message',
      description: 'sent follow-up on security requirements',
      date: '2025-01-15T09:20:00',
      user: {
        name: 'Emily Rodriguez'
      },
      details: 'Clarified compliance requirements for SOC 2'
    },
    {
      id: '5',
      type: 'call',
      description: 'phone call with procurement team',
      date: '2025-01-12T11:00:00',
      user: {
        name: 'Robert Thompson'
      },
      metadata: {
        duration: '25 minutes'
      }
    },
    {
      id: '6',
      type: 'contract',
      description: 'contract amendment signed',
      date: '2025-01-10T16:30:00',
      user: {
        name: 'Sarah Johnson'
      },
      details: 'Added 50 additional licenses to existing agreement'
    },
    {
      id: '7',
      type: 'note',
      description: 'added internal note',
      date: '2025-01-08T13:15:00',
      user: {
        name: 'Elena Rodriguez'
      },
      details: 'Client interested in expanding to marketing automation next quarter'
    },
    {
      id: '8',
      type: 'meeting',
      description: 'Initial demo for analytics platform',
      date: '2025-01-05T10:00:00',
      user: {
        name: 'Michael Chen'
      },
      metadata: {
        duration: '60 minutes',
        meetingAttendees: ['Michael Chen', 'Lisa Wang', 'David Park']
      }
    },
    {
      id: '9',
      type: 'document',
      description: 'received signed MSA',
      date: '2024-12-20T14:00:00',
      user: {
        name: 'Sarah Johnson'
      },
      metadata: {
        documentName: 'Master_Service_Agreement_2025.pdf'
      }
    },
    {
      id: '10',
      type: 'proposal',
      description: 'created initial proposal',
      date: '2024-12-15T11:30:00',
      user: {
        name: 'David Kim'
      },
      metadata: {
        proposalValue: 250000
      }
    }
  ]

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || activity.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medium-gray" />
              <Input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="proposal">Proposals</SelectItem>
                <SelectItem value="contract">Contracts</SelectItem>
                <SelectItem value="call">Calls</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-stackmatch-blue" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stackmatch-navy mb-2">
                No activities found
              </h3>
              <p className="text-medium-gray">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <ActivityItem 
                  key={activity.id} 
                  activity={activity}
                  isLast={index === filteredActivities.length - 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}