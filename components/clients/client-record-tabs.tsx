'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClientOverview } from './overview/client-overview'
import { ClientAgreements } from './agreements/client-agreements'
import { ClientContacts } from './contacts/client-contacts'
import { ClientActivity } from './activity/client-activity'
import { FileText, Users, Clock, LayoutDashboard } from 'lucide-react'

interface ClientRecordTabsProps {
  clientId: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ClientRecordTabs({ clientId, activeTab, onTabChange }: ClientRecordTabsProps) {
  const tabs = [
    { value: 'overview', label: 'Overview', icon: LayoutDashboard },
    { value: 'agreements', label: 'Agreements & Licenses', icon: FileText },
    { value: 'contacts', label: 'Key Contacts', icon: Users },
    { value: 'activity', label: 'Activity History', icon: Clock }
  ]

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-slate-200 p-1 h-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white data-[state=active]:shadow-sm px-4 py-3 text-sm font-medium transition-all"
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>

      <div className="mt-6">
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <ClientOverview clientId={clientId} />
        </TabsContent>

        <TabsContent value="agreements" className="space-y-6 animate-fade-in">
          <ClientAgreements clientId={clientId} />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6 animate-fade-in">
          <ClientContacts clientId={clientId} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 animate-fade-in">
          <ClientActivity clientId={clientId} />
        </TabsContent>
      </div>
    </Tabs>
  )
}