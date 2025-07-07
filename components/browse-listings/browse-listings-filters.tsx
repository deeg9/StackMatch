'use client'

import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

interface BrowseListingsFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedIndustry: string
  setSelectedIndustry: (value: string) => void
  selectedBudget: string
  setSelectedBudget: (value: string) => void
  selectedCompanySize: string
  setSelectedCompanySize: (value: string) => void
  selectedDeadline: string
  setSelectedDeadline: (value: string) => void
  selectedScope: string
  setSelectedScope: (value: string) => void
  selectedLocation: string
  setSelectedLocation: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
}

export function BrowseListingsFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedIndustry,
  setSelectedIndustry,
  selectedBudget,
  setSelectedBudget,
  selectedCompanySize,
  setSelectedCompanySize,
  selectedDeadline,
  setSelectedDeadline,
  selectedScope,
  setSelectedScope,
  selectedLocation,
  setSelectedLocation,
  sortBy,
  setSortBy
}: BrowseListingsFiltersProps) {
  const [showAllFilters, setShowAllFilters] = useState(false)

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedIndustry !== 'all',
    selectedBudget !== 'all',
    selectedCompanySize !== 'all',
    selectedDeadline !== 'all',
    selectedScope !== 'all',
    selectedLocation !== 'all',
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedIndustry('all')
    setSelectedBudget('all')
    setSelectedCompanySize('all')
    setSelectedDeadline('all')
    setSelectedScope('all')
    setSelectedLocation('all')
    setSortBy('recent')
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-medium-gray" />
        <Input
          type="text"
          placeholder="Search listings by software, industry, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-light-gray focus:border-stackmatch-blue transition-colors"
        />
      </div>

      {/* Primary Filters Row */}
      <div className="flex flex-wrap gap-4">
        {/* Software Category */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Software Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="crm">CRM</SelectItem>
            <SelectItem value="erp">ERP</SelectItem>
            <SelectItem value="hr">HR Software</SelectItem>
            <SelectItem value="marketing">Marketing Automation</SelectItem>
            <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
            <SelectItem value="cloud">Cloud Infrastructure</SelectItem>
            <SelectItem value="analytics">Data Analytics</SelectItem>
            <SelectItem value="project">Project Management</SelectItem>
            <SelectItem value="collaboration">Collaboration Tools</SelectItem>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
            <SelectItem value="accounting">Accounting</SelectItem>
            <SelectItem value="custom">Custom Development</SelectItem>
          </SelectContent>
        </Select>

        {/* Budget Range */}
        <Select value={selectedBudget} onValueChange={setSelectedBudget}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Budget Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Budgets</SelectItem>
            <SelectItem value="under-25k">Under $25K</SelectItem>
            <SelectItem value="25k-100k">$25K - $100K</SelectItem>
            <SelectItem value="100k-500k">$100K - $500K</SelectItem>
            <SelectItem value="500k-1m">$500K - $1M</SelectItem>
            <SelectItem value="over-1m">Over $1M</SelectItem>
            <SelectItem value="undisclosed">Undisclosed</SelectItem>
          </SelectContent>
        </Select>

        {/* Proposal Deadline */}
        <Select value={selectedDeadline} onValueChange={setSelectedDeadline}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deadlines</SelectItem>
            <SelectItem value="7-days">Next 7 Days</SelectItem>
            <SelectItem value="30-days">Next 30 Days</SelectItem>
            <SelectItem value="90-days">Next 90 Days</SelectItem>
            <SelectItem value="no-deadline">No Specific Deadline</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="ending-soon">Ending Soonest</SelectItem>
            <SelectItem value="highest-budget">Highest Budget</SelectItem>
            <SelectItem value="relevant">Most Relevant</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAllFilters(!showAllFilters)}
          className={`gap-2 ${activeFiltersCount > 0 ? 'border-stackmatch-blue text-stackmatch-blue' : ''}`}
        >
          <Filter className="h-4 w-4" />
          {showAllFilters ? 'Hide' : 'More'} Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 bg-stackmatch-blue text-white">{activeFiltersCount}</Badge>
          )}
        </Button>
      </div>

      {/* Additional Filters (Collapsible) */}
      {showAllFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg border-2 border-light-gray animate-fade-in">
          {/* Industry */}
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="nonprofit">Non-Profit</SelectItem>
              <SelectItem value="realestate">Real Estate</SelectItem>
              <SelectItem value="hospitality">Hospitality</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
            </SelectContent>
          </Select>

          {/* Company Size */}
          <Select value={selectedCompanySize} onValueChange={setSelectedCompanySize}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Company Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="1-50">1-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-1000">201-1000 employees</SelectItem>
              <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
              <SelectItem value="5001-10000">5001-10000 employees</SelectItem>
              <SelectItem value="10000+">10000+ employees</SelectItem>
            </SelectContent>
          </Select>

          {/* Project Scope */}
          <Select value={selectedScope} onValueChange={setSelectedScope}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Project Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              <SelectItem value="new-implementation">New Implementation</SelectItem>
              <SelectItem value="migration">Migration</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="custom-development">Custom Development</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="managed-services">Managed Services</SelectItem>
              <SelectItem value="upgrade">Upgrade/Enhancement</SelectItem>
            </SelectContent>
          </Select>

          {/* Location */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="usa">United States</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="emea">EMEA</SelectItem>
              <SelectItem value="apac">APAC</SelectItem>
              <SelectItem value="latam">Latin America</SelectItem>
              <SelectItem value="remote">Remote Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-slate-200" onClick={() => setSelectedCategory('all')}>
              Category: {selectedCategory}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {selectedIndustry !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-slate-200" onClick={() => setSelectedIndustry('all')}>
              Industry: {selectedIndustry}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {selectedBudget !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-slate-200" onClick={() => setSelectedBudget('all')}>
              Budget: {selectedBudget}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {selectedCompanySize !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-slate-200" onClick={() => setSelectedCompanySize('all')}>
              Size: {selectedCompanySize}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {selectedDeadline !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-slate-200" onClick={() => setSelectedDeadline('all')}>
              Deadline: {selectedDeadline}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {selectedScope !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-slate-200" onClick={() => setSelectedScope('all')}>
              Scope: {selectedScope}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {selectedLocation !== 'all' && (
            <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-slate-200" onClick={() => setSelectedLocation('all')}>
              Location: {selectedLocation}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}