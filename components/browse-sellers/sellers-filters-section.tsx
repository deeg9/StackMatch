"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, Star, MapPin, Clock, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface SellersFiltersSectionProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedExpertise: string
  onExpertiseChange: (expertise: string) => void
  selectedRating: string
  onRatingChange: (rating: string) => void
  activeFilters?: string[]
  onRemoveFilter?: (filter: string) => void
  onClearFilters?: () => void
}

export function SellersFiltersSection({
  searchQuery,
  onSearchChange,
  selectedExpertise,
  onExpertiseChange,
  selectedRating,
  onRatingChange,
  activeFilters = [],
  onRemoveFilter,
  onClearFilters,
}: SellersFiltersSectionProps) {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <Select value={selectedExpertise} onValueChange={onExpertiseChange}>
            <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Expertise" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="All Expertise">All Expertise</SelectItem>
              <SelectItem value="React">React</SelectItem>
              <SelectItem value="Node.js">Node.js</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
              <SelectItem value="TypeScript">TypeScript</SelectItem>
              <SelectItem value="AWS">AWS</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRating} onValueChange={onRatingChange}>
            <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Ratings" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="All Ratings">All Ratings</SelectItem>
              <SelectItem value="4.5+">4.5+ Stars</SelectItem>
              <SelectItem value="4.0+">4.0+ Stars</SelectItem>
              <SelectItem value="3.5+">3.5+ Stars</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {isAdvancedFiltersOpen && (
          <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> Location
              </h4>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" /> Response Time
              </h4>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Any Response Time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">Any Response Time</SelectItem>
                  <SelectItem value="1h">Under 1 hour</SelectItem>
                  <SelectItem value="4h">Under 4 hours</SelectItem>
                  <SelectItem value="24h">Under 24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                <Filter className="w-4 h-4 mr-1" /> Project Count
              </h4>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Any Number" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">Any Number</SelectItem>
                  <SelectItem value="10+">10+ Projects</SelectItem>
                  <SelectItem value="25+">25+ Projects</SelectItem>
                  <SelectItem value="50+">50+ Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {activeFilters && activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-700">
            <span className="text-sm text-slate-400">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="bg-slate-700 text-slate-200 hover:bg-slate-600 px-3 py-1"
              >
                {filter}
                {onRemoveFilter && <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => onRemoveFilter(filter)} />}
              </Badge>
            ))}
            {onClearFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-transparent"
                onClick={onClearFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
