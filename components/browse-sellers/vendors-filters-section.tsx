'use client'

import { useState } from 'react'
import { Search, Filter, X, MapPin, Building2, Users, Award, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export function VendorsFiltersSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedCompanySize, setSelectedCompanySize] = useState('all')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const activeFilters = [
    selectedIndustry && selectedIndustry !== 'all' && { key: 'industry', label: selectedIndustry, value: selectedIndustry },
    selectedLocation && selectedLocation !== 'all' && { key: 'location', label: selectedLocation, value: selectedLocation },
    selectedCompanySize && selectedCompanySize !== 'all' && { key: 'companySize', label: selectedCompanySize, value: selectedCompanySize },
    selectedSpecialization && selectedSpecialization !== 'all' && { key: 'specialization', label: selectedSpecialization, value: selectedSpecialization },
  ].filter((filter): filter is { key: string; label: string; value: string } => Boolean(filter))

  const clearAllFilters = () => {
    setSelectedIndustry('all')
    setSelectedLocation('all')
    setSelectedCompanySize('all')
    setSelectedSpecialization('all')
    setSearchQuery('')
  }

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'industry':
        setSelectedIndustry('all')
        break
      case 'location':
        setSelectedLocation('all')
        break
      case 'companySize':
        setSelectedCompanySize('all')
        break
      case 'specialization':
        setSelectedSpecialization('all')
        break
    }
  }

  const industries = [
    'Enterprise Software',
    'Cloud Computing', 
    'Database & Analytics',
    'HR & Finance Software',
    'Digital Experience',
    'E-commerce Platform',
    'Digital Workflow',
    'Cybersecurity',
    'Marketing Technology',
    'Healthcare Technology',
    'Financial Services',
    'Manufacturing Software'
  ]

  const locations = [
    'North America',
    'United States',
    'Europe',
    'Asia-Pacific',
    'Global',
    'Canada',
    'United Kingdom',
    'Germany',
    'Australia',
    'Remote/Distributed'
  ]

  const companySizes = [
    'Startup (1-50)',
    'SMB (51-200)', 
    'Mid-market (201-1000)',
    'Enterprise (1000-5000)',
    'Large Enterprise (5000+)',
    'Fortune 500',
    'Fortune 100'
  ]

  const specializations = [
    'CRM & Sales',
    'ERP & Finance',
    'HR & Talent Management',
    'Marketing & Analytics',
    'Security & Compliance',
    'Cloud Infrastructure',
    'Data & Analytics',
    'Collaboration Tools',
    'E-commerce & Retail',
    'Industry-Specific Solutions'
  ]

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-5 h-5" />
            <Input
              type="text"
              placeholder="Search vendors by name, products, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base border-slate-200 focus:border-stackmatch-blue"
            />
          </div>

          {/* Sort By */}
          <div className="lg:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 border-slate-200 focus:border-stackmatch-blue">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="clients">Most Clients</SelectItem>
                <SelectItem value="established">Most Established</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden h-12 border-slate-200"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm transition-all duration-300 ${
        showMobileFilters ? 'block' : 'hidden lg:block'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Industry Filter */}
          <div>
            <label className="block text-sm font-medium text-stackmatch-navy mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Industry
            </label>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="border-slate-200 focus:border-stackmatch-blue">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-stackmatch-navy mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="border-slate-200 focus:border-stackmatch-blue">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Size Filter */}
          <div>
            <label className="block text-sm font-medium text-stackmatch-navy mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Company Size
            </label>
            <Select value={selectedCompanySize} onValueChange={setSelectedCompanySize}>
              <SelectTrigger className="border-slate-200 focus:border-stackmatch-blue">
                <SelectValue placeholder="All Sizes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specialization Filter */}
          <div>
            <label className="block text-sm font-medium text-stackmatch-navy mb-2">
              <Award className="w-4 h-4 inline mr-1" />
              Specialization
            </label>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="border-slate-200 focus:border-stackmatch-blue">
                <SelectValue placeholder="All Specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-stackmatch-navy">Active Filters:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-medium-gray hover:text-stackmatch-blue text-sm"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="bg-stackmatch-blue/10 text-stackmatch-blue hover:bg-stackmatch-blue/20 cursor-pointer"
                  onClick={() => removeFilter(filter.key)}
                >
                  {filter.label}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filter Chips */}
        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-stackmatch-navy">Quick Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-trust-green/10 hover:text-trust-green hover:border-trust-green"
              onClick={() => setSelectedSpecialization('CRM & Sales')}
            >
              <Award className="w-3 h-3 mr-1" />
              Top Rated Only
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-stackmatch-blue/10 hover:text-stackmatch-blue hover:border-stackmatch-blue"
              onClick={() => setSelectedCompanySize('Fortune 500')}
            >
              <Building2 className="w-3 h-3 mr-1" />
              Fortune 500
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-attention-orange/10 hover:text-attention-orange hover:border-attention-orange"
              onClick={() => setSelectedLocation('Global')}
            >
              <MapPin className="w-3 h-3 mr-1" />
              Global Presence
            </Badge>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-medium-gray bg-slate-50 rounded-lg px-4 py-3">
        <span>
          Showing <span className="font-semibold text-stackmatch-navy">2,847</span> verified enterprise vendors
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-trust-green" />
            <span className="text-trust-green font-medium">98% satisfaction rate</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4 text-stackmatch-blue" />
            <span className="text-stackmatch-blue font-medium">Enterprise verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}