'use client'

import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProductFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  totalProducts: number
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalProducts
}: ProductFiltersProps) {
  const categories = [
    'CRM & Sales',
    'Marketing Automation',
    'Customer Service',
    'E-commerce',
    'Analytics',
    'Cloud Infrastructure',
    'Productivity Suite',
    'Database Management',
    'Enterprise Resource Planning',
    'Human Capital Management'
  ]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products and services..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base border-slate-200 focus:border-stackmatch-blue"
          />
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-12 border-slate-200 focus:border-stackmatch-blue">
              <Filter className="w-4 h-4 mr-2 text-medium-gray" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-medium-gray">
        Showing <span className="font-semibold text-stackmatch-navy">{totalProducts}</span> products and services
      </div>
    </div>
  )
}