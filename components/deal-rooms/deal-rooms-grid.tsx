'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Search, 
  Plus, 
  Filter,
  X
} from 'lucide-react'
import { DealRoomCard } from './deal-room-card'

interface DealRoomsGridProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  dateFilter: string
  setDateFilter: (filter: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export function DealRoomsGrid({
  selectedTab,
  setSelectedTab,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy
}: DealRoomsGridProps) {
  // Mock data for deal rooms
  const dealRooms = [
    {
      id: 'DR-001',
      title: 'CRM Implementation for Healthcare Startup',
      status: 'negotiating',
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
        documentsCount: 8,
        pendingApprovals: 2
      },
      signatures: {
        nda: 'signed',
        contract: 'pending'
      },
      category: 'active'
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
        documentsCount: 15,
        pendingApprovals: 1
      },
      signatures: {
        nda: 'signed',
        contract: 'pending'
      },
      category: 'active'
    },
    {
      id: 'DR-003',
      title: 'Marketing Automation Setup',
      status: 'pending-approval',
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
        documentsCount: 4,
        pendingApprovals: 0
      },
      signatures: {
        nda: 'pending',
        contract: 'not-started'
      },
      category: 'pending'
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
        paymentTerms: 'Completed'
      },
      communication: {
        unreadMessages: 0,
        documentsCount: 22,
        pendingApprovals: 0
      },
      signatures: {
        nda: 'signed',
        contract: 'signed'
      },
      category: 'completed'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Rooms', count: dealRooms.length },
    { id: 'active', name: 'Active Negotiations', count: dealRooms.filter(r => r.category === 'active').length },
    { id: 'pending', name: 'Pending Approval', count: dealRooms.filter(r => r.category === 'pending').length },
    { id: 'completed', name: 'Recently Completed', count: dealRooms.filter(r => r.category === 'completed').length },
    { id: 'archived', name: 'Archived', count: 0 }
  ]

  // Filter logic would go here based on search, status, role, date, and sort
  const filteredRooms = dealRooms // For now, showing all rooms

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full lg:w-auto">
          <TabsList className="w-full lg:w-auto justify-start bg-white border border-slate-200 p-1 h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
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
        </Tabs>
        
        {/* Action Bar */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
            <Input
              type="text"
              placeholder="Search deal rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-64"
            />
          </div>
          
          {/* Filters Toggle */}
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters && <X className="w-3 h-3" />}
          </Button>
          
          {/* Create Deal Room */}
          <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy gap-2">
            <Plus className="w-4 h-4" />
            Create Deal Room
          </Button>
        </div>
      </div>
      
      {/* Advanced Filters (Hidden by default) */}
      {showFilters && (
        <div className="bg-slate-50 rounded-lg p-4 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-medium-gray mb-2 block">
                Date Range
              </label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-medium-gray mb-2 block">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="value-high">Highest Value</SelectItem>
                  <SelectItem value="value-low">Lowest Value</SelectItem>
                  <SelectItem value="progress">Deal Progress</SelectItem>
                  <SelectItem value="activity">Last Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      <Tabs value={selectedTab} className="w-full">

        <TabsContent value={selectedTab} className="mt-0">
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