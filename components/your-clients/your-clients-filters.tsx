'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YourClientsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedService: string;
  onServiceChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewType: 'list' | 'grid';
  onViewTypeChange: (value: 'list' | 'grid') => void;
}

export function YourClientsFilters({
  searchQuery,
  onSearchChange,
  selectedService,
  onServiceChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  viewType,
  onViewTypeChange,
}: YourClientsFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-slate-200 p-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medium-gray" />
        <Input
          type="text"
          placeholder="Search by client name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full border-2 focus:border-stackmatch-blue transition-colors"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Service/Product Filter */}
        <Select value={selectedService} onValueChange={onServiceChange}>
          <SelectTrigger className="w-full lg:w-[200px] border-2">
            <SelectValue placeholder="Filter by Service/Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="crm">CRM Solutions</SelectItem>
            <SelectItem value="analytics">Analytics Platform</SelectItem>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
            <SelectItem value="marketing">Marketing Automation</SelectItem>
            <SelectItem value="hr">HR Management</SelectItem>
            <SelectItem value="security">Security Solutions</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full lg:w-[200px] border-2">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="renewal-approaching">Renewal Approaching</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full lg:w-[200px] border-2">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value-high">Contract Value (High-Low)</SelectItem>
            <SelectItem value="value-low">Contract Value (Low-High)</SelectItem>
            <SelectItem value="renewal-soon">Renewal Date (Soonest)</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        {/* Spacer */}
        <div className="flex-1" />

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewTypeChange('list')}
            className={cn(
              "transition-all",
              viewType === 'list' && "bg-stackmatch-blue hover:bg-stackmatch-navy"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewTypeChange('grid')}
            className={cn(
              "transition-all",
              viewType === 'grid' && "bg-stackmatch-blue hover:bg-stackmatch-navy"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}