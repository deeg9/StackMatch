'use client'

import { useState } from 'react'
import { AgreementCard } from './agreement-card'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, FileText } from 'lucide-react'

export interface Agreement {
  id: string
  productServiceName: string
  status: 'active' | 'renewal-approaching' | 'expired'
  contractValue: number
  renewalDate: string
  pointOfContact: {
    name: string
    title: string
    email: string
  }
  startDate: string
  endDate: string
  dealRoomId: string
  licenseCount?: number
  category: string
}

interface ClientAgreementsProps {
  clientId: string
}

export function ClientAgreements({ clientId }: ClientAgreementsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data - in production this would come from API
  const agreements: Agreement[] = [
    {
      id: '1',
      productServiceName: 'Enterprise CRM Solution',
      status: 'active',
      contractValue: 250000,
      renewalDate: '2025-03-15',
      pointOfContact: {
        name: 'Sarah Johnson',
        title: 'VP of Technology',
        email: 'sarah.johnson@techcorp.com'
      },
      startDate: '2024-03-15',
      endDate: '2025-03-15',
      dealRoomId: 'dr-123',
      licenseCount: 150,
      category: 'CRM'
    },
    {
      id: '2',
      productServiceName: 'Data Analytics Platform',
      status: 'renewal-approaching',
      contractValue: 150000,
      renewalDate: '2025-03-15',
      pointOfContact: {
        name: 'Michael Chen',
        title: 'Director of Analytics',
        email: 'michael.chen@techcorp.com'
      },
      startDate: '2024-06-01',
      endDate: '2025-03-15',
      dealRoomId: 'dr-124',
      licenseCount: 75,
      category: 'Analytics'
    },
    {
      id: '3',
      productServiceName: 'Security Compliance Suite',
      status: 'active',
      contractValue: 50000,
      renewalDate: '2025-09-01',
      pointOfContact: {
        name: 'Emily Rodriguez',
        title: 'Chief Security Officer',
        email: 'emily.rodriguez@techcorp.com'
      },
      startDate: '2024-09-01',
      endDate: '2025-09-01',
      dealRoomId: 'dr-125',
      licenseCount: 200,
      category: 'Security'
    },
    {
      id: '4',
      productServiceName: 'HR Management System',
      status: 'expired',
      contractValue: 35000,
      renewalDate: '2024-12-31',
      pointOfContact: {
        name: 'David Park',
        title: 'HR Director',
        email: 'david.park@techcorp.com'
      },
      startDate: '2023-12-31',
      endDate: '2024-12-31',
      dealRoomId: 'dr-126',
      licenseCount: 50,
      category: 'HR'
    }
  ]

  // Filter agreements based on search and status
  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.productServiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agreement.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter
    return matchesSearch && matchesStatus
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
                placeholder="Search agreements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="renewal-approaching">Renewal Approaching</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-medium-gray">
        Showing {filteredAgreements.length} agreement{filteredAgreements.length !== 1 ? 's' : ''}
      </p>

      {/* Agreement Cards */}
      {filteredAgreements.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stackmatch-navy mb-2">
              No agreements found
            </h3>
            <p className="text-medium-gray">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAgreements.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))}
        </div>
      )}
    </div>
  )
}