'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { DealRoomCard } from './deal-room-card'

interface DealRoomsGridProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  searchQuery: string
  statusFilter: string
  dateFilter: string
  sortBy: string
}

export function DealRoomsGrid({
  selectedTab,
  setSelectedTab,
  searchQuery,
  statusFilter,
  dateFilter,
  sortBy
}: DealRoomsGridProps) {
  // Mock data for deal rooms
  const dealRooms = [
    {
      id: 'DR-001',
      title: 'CRM Implementation for Healthcare Startup',
      status: 'active',
      stage: 'proposal-review',
      stageProgress: 60,
      createdDate: '2024-01-15',
      lastActivity: '2 hours ago',
      participants: {
        buyer: {
          name: 'Sarah Johnson',
          avatar: '/api/placeholder/40/40',
          company: 'HealthTech Solutions'
        },
        seller: {
          name: 'Michael Chen',
          avatar: '/api/placeholder/40/40',
          company: 'CRM Experts Inc'
        },
        totalCount: 4
      },
      financials: {
        proposedValue: '$45,000 - $65,000',
        paymentTerms: 'Milestone-based'
      },
      communication: {
        unreadMessages: 3,
        pendingApprovals: 2
      },
      documents: {
        total: 8,
        pendingSignature: 2
      },
      category: 'agreement-reached'
    },
    {
      id: 'DR-002',
      title: 'E-commerce Platform Development',
      status: 'agreement-reached',
      stage: 'contract-negotiation',
      stageProgress: 85,
      createdDate: '2024-01-10',
      lastActivity: '1 day ago',
      participants: {
        buyer: {
          name: 'David Kim',
          avatar: '/api/placeholder/40/40',
          company: 'RetailFlow'
        },
        seller: {
          name: 'Emma Rodriguez',
          avatar: '/api/placeholder/40/40',
          company: 'WebDev Solutions'
        },
        totalCount: 6
      },
      financials: {
        proposedValue: '$120,000 - $150,000',
        paymentTerms: 'Hourly + Milestones'
      },
      communication: {
        unreadMessages: 0,
        pendingApprovals: 1
      },
      documents: {
        total: 15,
        pendingSignature: 1
      },
      category: 'agreement-reached'
    },
    {
      id: 'DR-003',
      title: 'Marketing Automation Setup',
      status: 'pending-signature',
      stage: 'initial-discussion',
      stageProgress: 25,
      createdDate: '2024-01-20',
      lastActivity: '3 hours ago',
      participants: {
        buyer: {
          name: 'Lisa Anderson',
          avatar: '/api/placeholder/40/40',
          company: 'Growth Marketing Co'
        },
        seller: {
          name: 'James Wilson',
          avatar: '/api/placeholder/40/40',
          company: 'AutoMate Pro'
        },
        totalCount: 3
      },
      financials: {
        proposedValue: '$25,000 - $35,000',
        paymentTerms: 'Fixed Price'
      },
      communication: {
        unreadMessages: 5,
        pendingApprovals: 0
      },
      documents: {
        total: 4,
        pendingSignature: 3
      },
      category: 'pending-signature'
    },
    {
      id: 'DR-004',
      title: 'Data Analytics Dashboard',
      status: 'completed',
      stage: 'completed',
      stageProgress: 100,
      createdDate: '2023-12-01',
      lastActivity: '2 weeks ago',
      participants: {
        buyer: {
          name: 'Robert Taylor',
          avatar: '/api/placeholder/40/40',
          company: 'DataDriven Inc'
        },
        seller: {
          name: 'Anna Martinez',
          avatar: '/api/placeholder/40/40',
          company: 'Analytics Pro'
        },
        totalCount: 5
      },
      financials: {
        proposedValue: '$75,000',
        paymentTerms: 'Monthly'
      },
      communication: {
        unreadMessages: 0,
        pendingApprovals: 0
      },
      documents: {
        total: 22,
        pendingSignature: 0
      },
      category: 'completed'
    },
    {
      id: 'DR-005',
      title: 'Enterprise HR System Integration',
      status: 'implementing',
      stage: 'implementation',
      stageProgress: 70,
      createdDate: '2024-01-05',
      lastActivity: '1 hour ago',
      participants: {
        buyer: {
          name: 'Jennifer Liu',
          avatar: '/api/placeholder/40/40',
          company: 'TechCorp Enterprise'
        },
        seller: {
          name: 'Marcus Thompson',
          avatar: '/api/placeholder/40/40',
          company: 'HR Systems Pro'
        },
        totalCount: 8
      },
      financials: {
        proposedValue: '$180,000',
        paymentTerms: 'Milestone-based'
      },
      communication: {
        unreadMessages: 2,
        pendingApprovals: 1
      },
      documents: {
        total: 25,
        pendingSignature: 0
      },
      category: 'implementing'
    },
    {
      id: 'DR-006',
      title: 'Mobile App Development',
      status: 'go-live',
      stage: 'go-live-preparation',
      stageProgress: 95,
      createdDate: '2023-11-20',
      lastActivity: '4 hours ago',
      participants: {
        buyer: {
          name: 'Alex Chen',
          avatar: '/api/placeholder/40/40',
          company: 'StartupFlow'
        },
        seller: {
          name: 'Sophie Williams',
          avatar: '/api/placeholder/40/40',
          company: 'Mobile Innovators'
        },
        totalCount: 5
      },
      financials: {
        proposedValue: '$95,000',
        paymentTerms: 'Fixed Price'
      },
      communication: {
        unreadMessages: 1,
        pendingApprovals: 0
      },
      documents: {
        total: 18,
        pendingSignature: 0
      },
      category: 'go-live'
    },
    {
      id: 'DR-007',
      title: 'Supply Chain Management System',
      status: 'archived',
      stage: 'archived',
      stageProgress: 100,
      createdDate: '2023-10-05',
      lastActivity: '2 months ago',
      participants: {
        buyer: {
          name: 'Patricia Brown',
          avatar: '/api/placeholder/40/40',
          company: 'LogisticsPlus'
        },
        seller: {
          name: 'Kevin Zhang',
          avatar: '/api/placeholder/40/40',
          company: 'SCM Solutions'
        },
        totalCount: 7
      },
      financials: {
        proposedValue: '$250,000',
        paymentTerms: 'Quarterly'
      },
      communication: {
        unreadMessages: 0,
        pendingApprovals: 0
      },
      documents: {
        total: 35,
        pendingSignature: 0
      },
      category: 'archived'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Rooms', count: dealRooms.length },
    { id: 'in-progress', name: 'In Progress', count: dealRooms.filter(r => r.category !== 'archived' && r.category !== 'completed').length },
    { id: 'agreement-reached', name: 'Agreement Reached', count: dealRooms.filter(r => r.category === 'agreement-reached').length },
    { id: 'implementing', name: 'Implementing', count: dealRooms.filter(r => r.category === 'implementing').length },
    { id: 'completed', name: 'Completed', count: dealRooms.filter(r => r.category === 'completed').length },
    { id: 'archived', name: 'Archived', count: dealRooms.filter(r => r.category === 'archived').length }
  ]

  // Filter logic based on selected tab
  const filteredRooms = dealRooms.filter(room => {
    if (selectedTab === 'all') return true
    if (selectedTab === 'in-progress') return room.category !== 'archived' && room.category !== 'completed'
    return room.category === selectedTab
  })

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="w-full flex bg-white border border-slate-200 p-1 h-auto">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
            >
              {category.name}
              <Badge 
                variant="secondary" 
                className="ml-1 data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRooms.map((room, index) => (
                <DealRoomCard 
                  key={room.id} 
                  room={room} 
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-stackmatch-navy mb-2">
                No deal rooms found
              </h3>
              <p className="text-medium-gray">
                Try adjusting your filters or create a new deal room to get started.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}