'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  FileText, 
  FolderOpen, 
  Calendar, 
  FileSignature,
  Clock,
  Video
} from 'lucide-react'
import { DealRoomDiscussion } from './deal-room-discussion'
import { DealRoomDocuments } from './deal-room-documents'
import { DealRoomTimeline } from './deal-room-timeline'
import { DealRoomTerms } from './deal-room-terms'
import { DealRoomMeetingNotes } from './deal-room-meeting-notes'

interface DealRoomTabsProps {
  dealRoom: any
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DealRoomTabs({ dealRoom, activeTab, setActiveTab }: DealRoomTabsProps) {
  const tabs = [
    {
      id: 'discussion',
      label: 'Discussion',
      icon: MessageCircle,
      badge: 5, // unread messages
      component: DealRoomDiscussion
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FolderOpen,
      badge: 10, // total documents (8 docs + 2 proposals)
      component: DealRoomDocuments
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: Calendar,
      badge: null,
      component: DealRoomTimeline
    },
    {
      id: 'terms',
      label: 'Terms',
      icon: FileSignature,
      badge: 3, // pending terms
      component: DealRoomTerms
    },
    {
      id: 'meeting-notes',
      label: 'Meeting Notes',
      icon: Video,
      badge: 4, // recordings available
      component: DealRoomMeetingNotes
    }
  ]

  return (
    <div className="animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-white border border-slate-200 p-1 h-auto mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {tabs.map((tab) => {
          const Component = tab.component
          return (
            <TabsContent 
              key={tab.id} 
              value={tab.id} 
              className="mt-0 animate-slide-up"
            >
              <Component dealRoom={dealRoom} />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}