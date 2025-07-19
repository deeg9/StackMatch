'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

interface StatusTab {
  id: string
  label: string
  count?: number
}

interface FilterOption {
  value: string
  label: string
}

interface ActiveFilter {
  type: string
  label: string
  value: string
}

interface ListControlPanelProps {
  searchPlaceholder?: string
  searchQuery: string
  onSearchChange: (query: string) => void
  
  // Primary filter/sort
  sortOptions?: FilterOption[]
  sortBy?: string
  onSortChange?: (sort: string) => void
  
  primaryFilterOptions?: FilterOption[]
  primaryFilter?: string
  onPrimaryFilterChange?: (filter: string) => void
  
  // Status tabs
  statusTabs?: StatusTab[]
  activeStatus?: string
  onStatusChange?: (status: string) => void
  
  // Active filters display
  activeFilters?: ActiveFilter[]
  onClearFilter?: (filter: ActiveFilter) => void
  onClearAllFilters?: () => void
  
  className?: string
}

export function ListControlPanel({
  searchPlaceholder = "Search...",
  searchQuery,
  onSearchChange,
  sortOptions,
  sortBy,
  onSortChange,
  primaryFilterOptions,
  primaryFilter,
  onPrimaryFilterChange,
  statusTabs,
  activeStatus,
  onStatusChange,
  activeFilters,
  onClearFilter,
  onClearAllFilters,
  className
}: ListControlPanelProps) {
  return (
    <div className={cn("space-y-6 mb-8", className)}>
      {/* Primary controls - Search and filters grouped on left */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 h-10 bg-white border-medium-gray/30 focus:border-stackmatch-blue"
            />
          </div>

          {/* Primary Filter Dropdown */}
          {primaryFilterOptions && onPrimaryFilterChange && (
            <Select value={primaryFilter} onValueChange={onPrimaryFilterChange}>
              <SelectTrigger className="w-[200px] bg-white border-medium-gray/30">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                {primaryFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort Dropdown */}
          {sortOptions && onSortChange && (
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px] bg-white border-medium-gray/30">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Status Filter Pills */}
      {statusTabs && onStatusChange && (
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeStatus === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(tab.id)}
              className={cn(
                "rounded-full px-4 py-1 h-8 transition-all",
                activeStatus === tab.id
                  ? "bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
                  : "bg-white hover:bg-light-gray/50 text-charcoal border-medium-gray/30"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "ml-2 h-5 px-1.5 min-w-[20px] rounded-full",
                    activeStatus === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-light-gray text-charcoal"
                  )}
                >
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilters && activeFilters.length > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
          <span className="text-sm text-medium-gray">Active filters:</span>
          
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="outline" className="bg-slate-100">
              {filter.label}
              {onClearFilter && (
                <button
                  onClick={() => onClearFilter(filter)}
                  className="ml-2 text-medium-gray hover:text-charcoal"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
          
          {onClearAllFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-xs text-medium-gray hover:text-charcoal"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}