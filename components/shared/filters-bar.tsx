'use client'

import { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FiltersBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: FilterOption[]
  activeFilter?: string
  onFilterChange?: (value: string) => void
  sortOptions?: FilterOption[]
  sortValue?: string
  onSortChange?: (value: string) => void
  additionalActions?: ReactNode
  className?: string
  searchPlaceholder?: string
}

export function FiltersBar({
  searchValue,
  onSearchChange,
  filters,
  activeFilter,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  additionalActions,
  className,
  searchPlaceholder = "Search..."
}: FiltersBarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 h-10 bg-white border-medium-gray/30 focus:border-stackmatch-blue"
          />
        </div>

        {/* Sort Dropdown */}
        {sortOptions && onSortChange && (
          <Select value={sortValue} onValueChange={onSortChange}>
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

        {/* Additional Actions */}
        {additionalActions}
      </div>

      {/* Filter Pills */}
      {filters && onFilterChange && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                "rounded-full px-4 py-1 h-8 transition-all",
                activeFilter === filter.value
                  ? "bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
                  : "bg-white hover:bg-light-gray/50 text-charcoal border-medium-gray/30"
              )}
            >
              {filter.label}
              {filter.count !== undefined && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "ml-2 h-5 px-1.5 min-w-[20px] rounded-full",
                    activeFilter === filter.value
                      ? "bg-white/20 text-white"
                      : "bg-light-gray text-charcoal"
                  )}
                >
                  {filter.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}