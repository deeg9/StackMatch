'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { DealRoomHeader } from '@/components/deal-rooms/deal-room-header'
import { DealRoomTabs } from '@/components/deal-rooms/deal-room-tabs'
import { DealRoomSidebar } from '@/components/deal-rooms/deal-room-sidebar'

export default function DealRoomPage() {
  const params = useParams()
  const dealRoomId = params.id as string
  const [activeTab, setActiveTab] = useState('discussion')

  // Comprehensive mock data for the deal room - in real app this would come from API
  const dealRoom = {
    id: dealRoomId,
    title: 'Enterprise CRM Implementation for HealthTech Solutions',
    status: 'negotiating',
    dealValue: 175000,
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    duration: '6 months',
    startDate: '2024-02-01',
    expectedCompletion: '2024-08-01',
    progress: 35,
    participants: [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@healthtech.com',
        company: 'HealthTech Solutions',
        role: 'buyer',
        title: 'CTO',
        avatar: '/api/placeholder/40/40',
        isOnline: true,
        lastSeen: 'now'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@crmexperts.com',
        company: 'CRM Experts Inc',
        role: 'seller',
        title: 'Solutions Architect',
        avatar: '/api/placeholder/40/40',
        isOnline: false,
        lastSeen: '2 hours ago'
      },
      {
        id: '3',
        name: 'David Kim',
        email: 'david@healthtech.com',
        company: 'HealthTech Solutions',
        role: 'buyer',
        title: 'Project Manager',
        avatar: '/api/placeholder/40/40',
        isOnline: true,
        lastSeen: 'now'
      },
      {
        id: '4',
        name: 'Elena Rodriguez',
        email: 'elena@crmexperts.com',
        company: 'CRM Experts Inc',
        role: 'seller',
        title: 'Account Manager',
        avatar: '/api/placeholder/40/40',
        isOnline: true,
        lastSeen: 'now'
      }
    ],
    stats: {
      messagesExchanged: 247,
      documentsShared: 23,
      meetingsHeld: 8,
      daysSinceCreation: 18,
      averageResponseTime: '2.4 hours'
    },
    recentActivity: [
      {
        id: '1',
        type: 'message',
        user: 'Sarah Johnson',
        action: 'sent a message',
        timestamp: '5 minutes ago',
        details: 'Reviewed the updated proposal terms'
      },
      {
        id: '2',
        type: 'document',
        user: 'Michael Chen',
        action: 'uploaded a document',
        timestamp: '1 hour ago',
        details: 'Technical Requirements v2.1.pdf'
      },
      {
        id: '3',
        type: 'proposal',
        user: 'Elena Rodriguez',
        action: 'updated proposal',
        timestamp: '3 hours ago',
        details: 'Revised timeline and deliverables'
      },
      {
        id: '4',
        type: 'meeting',
        user: 'David Kim',
        action: 'scheduled meeting',
        timestamp: '1 day ago',
        details: 'Technical review session for Friday'
      }
    ],
    createdAt: '2024-01-15',
    lastActivity: '5 minutes ago'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-6">
        {/* Deal Room Header */}
        <DealRoomHeader dealRoom={dealRoom} />
        
        {/* Main Content Area with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Tabs */}
          <div className="lg:col-span-3">
            <DealRoomTabs 
              dealRoom={dealRoom}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <DealRoomSidebar dealRoom={dealRoom} />
          </div>
        </div>
      </div>
    </div>
  )
}