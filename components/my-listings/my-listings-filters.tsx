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

  const getTabClass = (tabId: string) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
    if (statusFilter === tabId) {
      return `${baseClass} bg-stackmatch-blue text-white shadow-md`
    }
    return `${baseClass} text-medium-gray hover:text-stackmatch-navy hover:bg-slate-100`
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
          <Input
            placeholder="Search listings by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-slate-300 focus:border-stackmatch-blue focus:ring-stackmatch-blue"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-medium-gray" />
            <span className="text-sm text-medium-gray">Sort by:</span>
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
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
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={getTabClass(tab.id)}
          >
            <span>{tab.label}</span>
            <Badge 
              variant="secondary" 
              className={`ml-1 ${
                statusFilter === tab.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-200 text-charcoal'
              }`}
            >
              {tab.count}
            </Badge>
          </button>
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