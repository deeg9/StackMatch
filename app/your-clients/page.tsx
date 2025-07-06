'use client';

import { TickerBanner } from '@/components/ticker/ticker-banner';
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper';
import { YourClientsHeader } from '@/components/your-clients/your-clients-header';
import { YourClientsStats } from '@/components/your-clients/your-clients-stats';
import { YourClientsFilters } from '@/components/your-clients/your-clients-filters';
import { YourClientsGrid } from '@/components/your-clients/your-clients-grid';
import { YourClientsSidebar } from '@/components/your-clients/your-clients-sidebar';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';

export default function YourClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('value-high');
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  const handleExportClients = () => {
    // TODO: Implement export functionality
    console.log('Exporting client list...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header with Export Button */}
        <div className="mb-8 flex items-start justify-between">
          <YourClientsHeader />
          <Button
            onClick={handleExportClients}
            variant="outline"
            className="hover:bg-stackmatch-blue/10 hover:text-stackmatch-blue hover:border-stackmatch-blue transition-all duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Client List
          </Button>
        </div>

        {/* KPI Stats Section */}
        <div className="mb-8">
          <YourClientsStats />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Content - Filters and Grid */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filters and Controls */}
            <YourClientsFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewType={viewType}
              onViewTypeChange={setViewType}
            />

            {/* Clients Grid/List */}
            <YourClientsGrid
              searchQuery={searchQuery}
              selectedService={selectedService}
              selectedStatus={selectedStatus}
              sortBy={sortBy}
              viewType={viewType}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <YourClientsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}