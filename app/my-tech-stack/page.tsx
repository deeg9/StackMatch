'use client';

import { TickerBanner } from '@/components/ticker/ticker-banner';
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper';
import { PageHeader } from '@/components/ui/page-header';
import { MyTechStackStats } from '@/components/my-tech-stack/my-tech-stack-stats';
import { MyTechStackFilters } from '@/components/my-tech-stack/my-tech-stack-filters';
import { MyTechStackGrid } from '@/components/my-tech-stack/my-tech-stack-grid';
import { MyTechStackSidebar } from '@/components/my-tech-stack/my-tech-stack-sidebar';
import { AddSoftwareModal } from '@/components/my-tech-stack/add-software-modal';
import { Button } from '@/components/ui/button';
import { Plus, Server } from 'lucide-react';
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
      <NavigationWrapper />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Centered Page Header */}
          <PageHeader
            icon={Server}
            title="My Tech Stack"
            description="Manage your software inventory and optimize your technology investments"
            action={{
              label: "Add Software",
              onClick: () => setIsAddModalOpen(true),
              icon: Plus
            }}
          />

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

      {/* Add Software Modal */}
      <AddSoftwareModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}