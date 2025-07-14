'use client'

// Example: Creating a new page with the unified layout system
// This example shows how to create a new "Software Contracts" page

import { GridPageLayout, useGridPageState } from '@/components/layouts'
import { PageHeader, StatsDashboard, FiltersBar, ContentGrid, PageSidebar } from '@/components/shared'
import { FileText, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Example card component for the grid
function ContractCard({ item, index }: { item: any; index: number }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="font-semibold">{item.name}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{item.vendor}</p>
        <p className="text-lg font-bold mt-2">${item.value.toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}

export default function SoftwareContractsPage() {
  // Use the unified state management hook
  const state = useGridPageState({
    filters: { 
      status: 'all',
      vendor: 'all',
      renewal: 'all' 
    },
    sortBy: 'expiry-date'
  })

  // Example data
  const contracts = [
    { id: 1, name: 'Salesforce CRM', vendor: 'Salesforce', value: 120000 },
    { id: 2, name: 'Microsoft 365', vendor: 'Microsoft', value: 85000 },
    { id: 3, name: 'AWS Infrastructure', vendor: 'Amazon', value: 250000 },
  ]

  const stats = [
    {
      label: 'Total Contracts',
      value: 24,
      icon: FileText,
      trend: '+8',
      trendUp: true
    },
    {
      label: 'Annual Value',
      value: '$2.4M',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Expiring Soon',
      value: 3,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Savings YTD',
      value: '$145K',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+23%',
      trendUp: true
    }
  ]

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Contracts' },
        { value: 'active', label: 'Active' },
        { value: 'expiring', label: 'Expiring Soon' },
        { value: 'expired', label: 'Expired' }
      ]
    },
    {
      key: 'vendor',
      label: 'Vendor',
      options: [
        { value: 'all', label: 'All Vendors' },
        { value: 'salesforce', label: 'Salesforce' },
        { value: 'microsoft', label: 'Microsoft' },
        { value: 'aws', label: 'Amazon AWS' }
      ]
    },
    {
      key: 'renewal',
      label: 'Renewal Period',
      options: [
        { value: 'all', label: 'All Periods' },
        { value: '30', label: 'Next 30 Days' },
        { value: '60', label: 'Next 60 Days' },
        { value: '90', label: 'Next 90 Days' }
      ]
    }
  ]

  const sortOptions = [
    { value: 'expiry-date', label: 'Expiry Date' },
    { value: 'value-high', label: 'Highest Value' },
    { value: 'value-low', label: 'Lowest Value' },
    { value: 'vendor', label: 'Vendor Name' }
  ]

  return (
    <GridPageLayout
      header={
        <PageHeader
          title="Software Contracts"
          subtitle="Manage and track all your software contracts and renewals"
          actions={
            <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
              Add New Contract
            </Button>
          }
        />
      }
      stats={<StatsDashboard stats={stats} columns={4} />}
      filters={
        <FiltersBar
          searchValue={state.searchQuery}
          onSearchChange={state.setSearchQuery}
          searchPlaceholder="Search contracts..."
          filters={[
            { value: 'all', label: 'All', count: 24 },
            { value: 'active', label: 'Active', count: 20 },
            { value: 'expiring', label: 'Expiring Soon', count: 3 },
            { value: 'expired', label: 'Expired', count: 1 }
          ]}
          activeFilter={state.filters.status}
          onFilterChange={(value) => state.setFilter('status', value)}
          sortOptions={sortOptions}
          sortValue={state.sortBy}
          onSortChange={state.setSortBy}
        />
      }
      grid={(props) => (
        <ContentGrid
          items={contracts}
          renderItem={(item, index) => <ContractCard item={item} index={index} />}
          columns={3}
          emptyState={
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No contracts found</h3>
              <p className="text-gray-600 mb-6">Start by adding your first software contract</p>
              <Button onClick={() => console.log('Add contract')}>Add Contract</Button>
            </div>
          }
        />
      )}
      sidebar={
        <PageSidebar>
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View Renewal Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Export Contracts
              </Button>
            </CardContent>
          </Card>
        </PageSidebar>
      }
    />
  )
}