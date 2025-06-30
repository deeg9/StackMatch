'use client';

import { TickerBanner } from '@/components/ui/ticker-banner';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { MyTechStackHeader } from '@/components/my-tech-stack/my-tech-stack-header';
import { MyTechStackStats } from '@/components/my-tech-stack/my-tech-stack-stats';
import { MyTechStackFilters } from '@/components/my-tech-stack/my-tech-stack-filters';
import { MyTechStackGrid } from '@/components/my-tech-stack/my-tech-stack-grid';
import { MyTechStackSidebar } from '@/components/my-tech-stack/my-tech-stack-sidebar';
import { AddSoftwareModal } from '@/components/my-tech-stack/add-software-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function MyTechStackPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('cost-high');
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper>
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Page Header with Add Button */}
          <div className="mb-8 flex items-start justify-between">
            <MyTechStackHeader />
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-trust-green hover:bg-trust-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Software
            </Button>
          </div>

          {/* KPI Stats Section */}
          <div className="mb-8">
            <MyTechStackStats />
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content - Filters and Grid */}
            <div className="lg:col-span-8 space-y-6">
              {/* Filters and Controls */}
              <MyTechStackFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedOwner={selectedOwner}
                onOwnerChange={setSelectedOwner}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewType={viewType}
                onViewTypeChange={setViewType}
              />

              {/* Software Grid/List */}
              <MyTechStackGrid
                searchQuery={searchQuery}
                selectedOwner={selectedOwner}
                selectedStatus={selectedStatus}
                sortBy={sortBy}
                viewType={viewType}
              />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              <MyTechStackSidebar />
            </div>
          </div>
        </div>
      </NavigationWrapper>

      {/* Add Software Modal */}
      <AddSoftwareModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}