'use client'

import { useState } from 'react'
import { Search, Filter, X, MapPin, Clock, Award, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export function SellersFiltersSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const activeFilters = [
    selectedCategory && { key: 'category', label: selectedCategory, value: selectedCategory },
    selectedLocation && { key: 'location', label: selectedLocation, value: selectedLocation },
    selectedExperience && { key: 'experience', label: selectedExperience, value: selectedExperience },
    selectedAvailability && { key: 'availability', label: selectedAvailability, value: selectedAvailability },
  ].filter((filter): filter is { key: string; label: string; value: string } => Boolean(filter))

  const clearAllFilters = () => {
    setSelectedCategory('')
    setSelectedLocation('')
    setSelectedExperience('')
    setSelectedAvailability('')
    setSearchQuery('')
  }

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'category':
        setSelectedCategory('')
        break
      case 'location':
        setSelectedLocation('')
        break
      case 'experience':
        setSelectedExperience('')
        break
      case 'availability':
        setSelectedAvailability('')
        break
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Main Search Bar */}
      <div className="p-6 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-medium-gray w-5 h-5" />
          <Input
            placeholder="Search sellers by skills, location, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 h-12 text-lg border-slate-200 focus:border-stackmatch-blue focus:ring-stackmatch-blue/20"
          />
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-medium-gray" />
            <span className="text-sm font-medium text-charcoal">Filters:</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="mobile-development">Mobile Development</SelectItem>
              <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
              <SelectItem value="data-analytics">Data Analytics</SelectItem>
              <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
              <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <MapPin className="w-4 h-4 mr-1" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="us-east">US East Coast</SelectItem>
              <SelectItem value="us-west">US West Coast</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedExperience} onValueChange={setSelectedExperience}>
            <SelectTrigger className="w-48">
              <Award className="w-4 h-4 mr-1" />
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
              <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
              <SelectItem value="senior">Senior (6-10 years)</SelectItem>
              <SelectItem value="expert">Expert (10+ years)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
            <SelectTrigger className="w-48">
              <Clock className="w-4 h-4 mr-1" />
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Available Now</SelectItem>
              <SelectItem value="week">Within 1 Week</SelectItem>
              <SelectItem value="month">Within 1 Month</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="response-time">Response Time</SelectItem>
                <SelectItem value="recent">Recently Active</SelectItem>
              </SelectContent>
            </Select>

            {activeFilters.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="text-medium-gray hover:text-charcoal"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-slate-100">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters & Sort
        </Button>
      </div>

      {/* Mobile Filters (Collapsible) */}
      {showMobileFilters && (
        <div className="lg:hidden p-4 space-y-4 bg-slate-50 border-b border-slate-100">
          <div className="grid grid-cols-1 gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-development">Mobile Development</SelectItem>
                <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                <SelectItem value="data-analytics">Data Analytics</SelectItem>
                <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-1" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="us-east">US East Coast</SelectItem>
                <SelectItem value="us-west">US West Coast</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="flex-1">
                  <Award className="w-4 h-4 mr-1" />
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger className="flex-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Available Now</SelectItem>
                  <SelectItem value="week">Within 1 Week</SelectItem>
                  <SelectItem value="month">Within 1 Month</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="response-time">Response Time</SelectItem>
                <SelectItem value="recent">Recently Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activeFilters.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full text-medium-gray hover:text-charcoal"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="p-4 bg-slate-50">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-charcoal">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="bg-stackmatch-blue/10 text-stackmatch-blue hover:bg-stackmatch-blue/20 transition-colors"
              >
                {filter.label}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer hover:text-stackmatch-navy"
                  onClick={() => removeFilter(filter.key)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
        <div className="flex justify-between items-center text-sm text-medium-gray">
          <span>Showing 1-20 of 2,847 sellers</span>
          <span>Updated 2 minutes ago</span>
        </div>
      </div>
    </div>
  )
}