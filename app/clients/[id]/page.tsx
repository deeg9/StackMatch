'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { ClientRecordHeader } from '@/components/clients/client-record-header'
import { ClientRecordTabs } from '@/components/clients/client-record-tabs'
import { ClientRecordSidebar } from '@/components/clients/client-record-sidebar'
import { NewProposalModal } from '@/components/clients/modals/new-proposal-modal'
import { LogActivityModal } from '@/components/clients/modals/log-activity-modal'

// Extended client interface for the record page
export interface ClientRecord {
  id: string
  companyName: string
  logo: string
  industry: string
  website: string
  address: string
  description: string
  clientSince: string
  totalLifetimeValue: number
  currentAnnualValue: number
  activeAgreements: number
  totalContractValue: number
  annualRecurringRevenue: number
  nextRenewalDate: string
  status: 'active' | 'renewal-approaching' | 'inactive'
  primaryContact: {
    name: string
    title: string
    email: string
    phone: string
  }
}

export default function ClientRecordPage() {
  const params = useParams()
  const clientId = params.id as string
  const [activeTab, setActiveTab] = useState('overview')
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState(false)
  const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false)
  const [clientData, setClientData] = useState<ClientRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch client data - mock for now
    const fetchClientData = async () => {
      try {
        // Mock data - in production this would be an API call
        const mockClient: ClientRecord = {
          id: clientId,
          companyName: 'TechCorp Industries',
          logo: 'https://logo.clearbit.com/techcorp.com',
          industry: 'Technology',
          website: 'https://techcorp.com',
          address: '123 Innovation Drive, San Francisco, CA 94105',
          description: 'Leading provider of enterprise technology solutions specializing in cloud infrastructure and digital transformation.',
          clientSince: '2023-03-15',
          totalLifetimeValue: 1250000,
          currentAnnualValue: 450000,
          activeAgreements: 3,
          totalContractValue: 450000,
          annualRecurringRevenue: 375000,
          nextRenewalDate: '2025-03-15',
          status: 'renewal-approaching',
          primaryContact: {
            name: 'Sarah Johnson',
            title: 'VP of Technology',
            email: 'sarah.johnson@techcorp.com',
            phone: '+1 (555) 123-4567'
          }
        }

        setClientData(mockClient)
      } catch (error) {
        console.error('Error fetching client data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientData()
  }, [clientId])

  if (isLoading || !clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <TickerBanner />
        <NavigationWrapper />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Client Header */}
        <ClientRecordHeader 
          client={clientData}
          onNewProposal={() => setIsNewProposalModalOpen(true)}
          onLogActivity={() => setIsLogActivityModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Main Content - Tabs */}
          <div className="lg:col-span-8">
            <ClientRecordTabs 
              clientId={clientId}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <ClientRecordSidebar client={clientData} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewProposalModal
        isOpen={isNewProposalModalOpen}
        onClose={() => setIsNewProposalModalOpen(false)}
        clientId={clientId}
        clientName={clientData.companyName}
      />

      <LogActivityModal
        isOpen={isLogActivityModalOpen}
        onClose={() => setIsLogActivityModalOpen(false)}
        clientId={clientId}
        clientName={clientData.companyName}
      />
    </div>
  )
}