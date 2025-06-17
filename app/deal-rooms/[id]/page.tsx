'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { DealRoomHeader } from '@/components/deal-rooms/deal-room-header'
import { DealRoomTabs } from '@/components/deal-rooms/deal-room-tabs'

export default function DealRoomPage() {
  const params = useParams()
  const dealRoomId = params.id as string
  const [activeTab, setActiveTab] = useState('discussion')

  // Mock data for the deal room - in real app this would come from API
  const dealRoom = {
    id: dealRoomId,
    title: 'CRM Implementation for Healthcare Startup',
    status: 'negotiating',
    participants: [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@healthtech.com',
        company: 'HealthTech Solutions',
        role: 'buyer',
        avatar: '/api/placeholder/40/40',
        isOnline: true
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@crmexperts.com',
        company: 'CRM Experts Inc',
        role: 'seller',
        avatar: '/api/placeholder/40/40',
        isOnline: false
      },
      {
        id: '3',
        name: 'David Kim',
        email: 'david@healthtech.com',
        company: 'HealthTech Solutions',
        role: 'buyer',
        avatar: '/api/placeholder/40/40',
        isOnline: true
      }
    ],
    createdAt: '2024-01-15',
    lastActivity: '2 hours ago'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Deal Room Header */}
        <DealRoomHeader dealRoom={dealRoom} />
        
        {/* Deal Room Content Tabs */}
        <DealRoomTabs 
          dealRoom={dealRoom}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  )
}