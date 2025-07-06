'use client'

import { useState } from 'react'
import { ContactCard } from './contact-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Users } from 'lucide-react'
import { AddContactModal } from '../modals/add-contact-modal'

export interface Contact {
  id: string
  name: string
  title: string
  email: string
  phone: string
  photo?: string
  isPrimary: boolean
  department: string
  lastContact?: string
}

interface ClientContactsProps {
  clientId: string
}

export function ClientContacts({ clientId }: ClientContactsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)

  // Mock data - in production this would come from API
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'VP of Technology',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 123-4567',
      isPrimary: true,
      department: 'Technology',
      lastContact: '2025-01-20'
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Director of Analytics',
      email: 'michael.chen@techcorp.com',
      phone: '+1 (555) 123-4568',
      isPrimary: false,
      department: 'Analytics',
      lastContact: '2025-01-18'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Chief Security Officer',
      email: 'emily.rodriguez@techcorp.com',
      phone: '+1 (555) 123-4569',
      isPrimary: false,
      department: 'Security',
      lastContact: '2025-01-15'
    },
    {
      id: '4',
      name: 'David Park',
      title: 'HR Director',
      email: 'david.park@techcorp.com',
      phone: '+1 (555) 123-4570',
      isPrimary: false,
      department: 'Human Resources',
      lastContact: '2025-01-10'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      title: 'Finance Manager',
      email: 'lisa.wang@techcorp.com',
      phone: '+1 (555) 123-4571',
      isPrimary: false,
      department: 'Finance',
      lastContact: '2025-01-12'
    },
    {
      id: '6',
      name: 'Robert Thompson',
      title: 'Procurement Lead',
      email: 'robert.thompson@techcorp.com',
      phone: '+1 (555) 123-4572',
      isPrimary: true,
      department: 'Procurement',
      lastContact: '2025-01-22'
    }
  ]

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.title.toLowerCase().includes(searchLower) ||
      contact.department.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower)
    )
  })

  // Sort contacts - primary contacts first
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1
    if (!a.isPrimary && b.isPrimary) return 1
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Search and Add Contact */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medium-gray" />
              <Input
                type="text"
                placeholder="Search contacts by name, title, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Button
              onClick={() => setIsAddContactModalOpen(true)}
              className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-medium-gray">
        Showing {sortedContacts.length} contact{sortedContacts.length !== 1 ? 's' : ''}
      </p>

      {/* Contact Cards */}
      {sortedContacts.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stackmatch-navy mb-2">
              No contacts found
            </h3>
            <p className="text-medium-gray mb-4">
              Try adjusting your search criteria
            </p>
            <Button
              onClick={() => setIsAddContactModalOpen(true)}
              className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        clientId={clientId}
      />
    </div>
  )
}