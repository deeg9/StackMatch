'use client';

import { Search, Filter, Grid3X3, List, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MyTechStackFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedOwner: string;
  onOwnerChange: (owner: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewType: 'list' | 'grid';
  onViewTypeChange: (view: 'list' | 'grid') => void;
}

const owners = [
  { value: 'all', label: 'All Departments' },
  { value: 'marketing', label: 'Marketing Dept' },
  { value: 'sales', label: 'Sales Dept' },
  { value: 'engineering', label: 'Engineering Dept' },
  { value: 'hr', label: 'HR Dept' },
  { value: 'finance', label: 'Finance Dept' },
  { value: 'operations', label: 'Operations Dept' }
];

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'renewal-approaching', label: 'Renewal Approaching' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'trial', label: 'Trial' }
];

const sortOptions = [
  { value: 'cost-high', label: 'Annual Cost (High-Low)' },
  { value: 'cost-low', label: 'Annual Cost (Low-High)' },
  { value: 'renewal-soon', label: 'Renewal Date (Soonest)' },
  { value: 'renewal-late', label: 'Renewal Date (Latest)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'usage-high', label: 'Usage (Highest)' },
  { value: 'usage-low', label: 'Usage (Lowest)' }
];

export function MyTechStackFilters({
  searchQuery,
  onSearchChange,
  selectedOwner,
  onOwnerChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  viewType,
  onViewTypeChange
}: MyTechStackFiltersProps) {
  const getLabel = (items: typeof owners | typeof statuses | typeof sortOptions, value: string) => {
    return items.find(item => item.value === value)?.label || value;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by software name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 h-10 w-full"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2">
          {/* Owner Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                <Filter className="h-4 w-4" />
                {getLabel(owners, selectedOwner)}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {owners.map((owner) => (
                <DropdownMenuItem
                  key={owner.value}
                  onClick={() => onOwnerChange(owner.value)}
                  className={selectedOwner === owner.value ? 'bg-gray-100' : ''}
                >
                  {owner.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                <Filter className="h-4 w-4" />
                {getLabel(statuses, selectedStatus)}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => onStatusChange(status.value)}
                  className={selectedStatus === status.value ? 'bg-gray-100' : ''}
                >
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                {getLabel(sortOptions, sortBy)}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={sortBy === option.value ? 'bg-gray-100' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewType === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewTypeChange('list')}
              className={`h-8 px-3 ${viewType === 'list' ? 'bg-white shadow-sm' : 'hover:bg-transparent'}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewTypeChange('grid')}
              className={`h-8 px-3 ${viewType === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-transparent'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}