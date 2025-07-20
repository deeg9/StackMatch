'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { 
  Globe, 
  MapPin, 
  Info,
  Users,
  Calendar,
  MessageSquare,
  ClipboardList,
  Mail,
  Phone,
  Star,
  Zap
} from 'lucide-react'
import { ClientRecord } from '@/app/clients/[id]/page'

interface ClientRecordSidebarProps {
  client: ClientRecord
}

export function ClientRecordSidebar({ client }: ClientRecordSidebarProps) {
  const quickActions = [
    { id: 1, label: 'Create a Task', icon: ClipboardList },
    { id: 2, label: 'Send Message', icon: MessageSquare },
    { id: 3, label: 'Schedule Meeting', icon: Calendar }
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* At a Glance */}
      <SidebarWidget
        title="At a Glance"
        icon={Info}
        className="border-2"
      >
          <div className="space-y-3">
            <div>
              <p className="text-sm text-medium-gray mb-1">Website</p>
              <a 
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stackmatch-blue hover:text-stackmatch-navy transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">{client.website}</span>
              </a>
            </div>

            <div>
              <p className="text-sm text-medium-gray mb-1">Address</p>
              <div className="flex items-start gap-2 text-stackmatch-navy">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{client.address}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-medium-gray mb-1">Description</p>
              <p className="text-sm text-stackmatch-navy">
                {client.description}
              </p>
            </div>
          </div>
      </SidebarWidget>

      {/* Key Contacts */}
      <SidebarWidget
        title="Key Contacts"
        icon={Users}
        className="border-2"
        actionLabel="View All Contacts"
        onAction={() => window.location.href = `/clients/${client.id}/contacts`}
      >
          <div className="space-y-4">
            {/* Primary Contact */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-stackmatch-blue text-white text-sm">
                    {getInitials(client.primaryContact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-stackmatch-navy">
                      {client.primaryContact.name}
                    </h4>
                    <Badge className="bg-trust-green/10 text-trust-green border-trust-green/20 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  </div>
                  <p className="text-sm text-medium-gray mb-2">
                    {client.primaryContact.title}
                  </p>
                  <div className="space-y-1">
                    <a
                      href={`mailto:${client.primaryContact.email}`}
                      className="flex items-center gap-2 text-xs text-stackmatch-blue hover:text-stackmatch-navy transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                      {client.primaryContact.email}
                    </a>
                    <a
                      href={`tel:${client.primaryContact.phone}`}
                      className="flex items-center gap-2 text-xs text-stackmatch-blue hover:text-stackmatch-navy transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      {client.primaryContact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Contact - Mock */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gray-400 text-white text-sm">
                    MC
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-stackmatch-navy mb-1">
                    Michael Chen
                  </h4>
                  <p className="text-sm text-medium-gray mb-2">
                    Director of Analytics
                  </p>
                  <div className="space-y-1">
                    <a
                      href="mailto:michael.chen@techcorp.com"
                      className="flex items-center gap-2 text-xs text-stackmatch-blue hover:text-stackmatch-navy transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                      michael.chen@techcorp.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </SidebarWidget>

      {/* Quick Actions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            const isPrimary = index === 0
            
            if (isPrimary) {
              return (
                <Button
                  key={action.id}
                  className="w-full justify-start bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              )
            }
            
            return (
              <button
                key={action.id}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors"
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}