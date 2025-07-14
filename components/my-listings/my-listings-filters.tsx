'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
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

interface MyListingsFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export function MyListingsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}: MyListingsFiltersProps) {
  const statusTabs = [
    { id: 'all', label: 'All', count: 4 },
    { id: 'active', label: 'Active', count: 3 },
    { id: 'draft', label: 'Draft', count: 1 },
    { id: 'in-review', label: 'In Review', count: 0 },
    { id: 'closed', label: 'Closed', count: 0 }
  ]


  return (
    <div className="space-y-6 mb-8">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <Input
            type="text"
            placeholder="Search listings by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-10 bg-white border-medium-gray/30 focus:border-stackmatch-blue"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-white border-medium-gray/30">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="proposals">Most Proposals</SelectItem>
            <SelectItem value="deadline">Deadline Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={statusFilter === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(tab.id)}
            className={`rounded-full px-4 py-1 h-8 transition-all ${
              statusFilter === tab.id
                ? "bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
                : "bg-white hover:bg-light-gray/50 text-charcoal border-medium-gray/30"
            }`}
          >
            {tab.label}
            <Badge 
              variant="secondary" 
              className={`ml-2 h-5 px-1.5 min-w-[20px] rounded-full ${
                statusFilter === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-light-gray text-charcoal"
              }`}
            >
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Active Filters Display */}
      {(searchQuery || statusFilter !== 'all') && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
          <span className="text-sm text-medium-gray">Active filters:</span>
          
          {searchQuery && (
            <Badge variant="outline" className="bg-slate-100">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 text-medium-gray hover:text-charcoal"
              >
                ×
              </button>
            </Badge>
          )}
          
          {statusFilter !== 'all' && (
            <Badge variant="outline" className="bg-slate-100">
              Status: {statusTabs.find(t => t.id === statusFilter)?.label}
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-2 text-medium-gray hover:text-charcoal"
              >
                ×
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
            }}
            className="text-xs text-medium-gray hover:text-charcoal"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}