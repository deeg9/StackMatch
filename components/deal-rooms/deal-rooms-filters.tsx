'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Filter } from 'lucide-react'

interface DealRoomsFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
  dateFilter: string
  setDateFilter: (date: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

export function DealRoomsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy
}: DealRoomsFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 animate-slide-up">
      <div className="flex flex-wrap items-center gap-4">
        {/* Create New Deal Room Button */}
        <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy transition-all duration-200 shadow-md hover:shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Create New Deal Room
        </Button>
        
        {/* Search Input */}
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
          <Input
            placeholder="Search deal rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-200 focus:border-stackmatch-blue transition-colors"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 border-slate-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40 border-slate-200">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="buyer">As Buyer</SelectItem>
            <SelectItem value="seller">As Seller</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40 border-slate-200">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 border-slate-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent Activity</SelectItem>
            <SelectItem value="created">Created Date</SelectItem>
            <SelectItem value="value">Deal Value</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Icon for Mobile */}
        <Button variant="outline" size="icon" className="lg:hidden">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}