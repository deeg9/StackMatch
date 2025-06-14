"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"

interface FiltersSectionProps {
  onFilterChange: (filters: { searchTerm: string; category: string; budget: string }) => void
}

export function FiltersSection({ onFilterChange }: FiltersSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [budget, setBudget] = useState("all")

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    onFilterChange({ searchTerm: event.target.value, category, budget })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    onFilterChange({ searchTerm, category: value, budget })
  }

  const handleBudgetChange = (value: string) => {
    setBudget(value)
    onFilterChange({ searchTerm, category, budget: value })
  }

  return (
    <div className="mb-8 p-6 bg-[#1e293b] rounded-lg border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative md:col-span-2 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Search listings..."
            className="pl-10 w-full bg-slate-800 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-400"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white data-[placeholder]:text-slate-400">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="all" className="hover:bg-slate-700">
              All Categories
            </SelectItem>
            <SelectItem value="web-dev" className="hover:bg-slate-700">
              Web Development
            </SelectItem>
            <SelectItem value="mobile-dev" className="hover:bg-slate-700">
              Mobile Development
            </SelectItem>
            <SelectItem value="crm" className="hover:bg-slate-700">
              CRM Integration
            </SelectItem>
            <SelectItem value="analytics" className="hover:bg-slate-700">
              Data Analytics
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={budget} onValueChange={handleBudgetChange}>
          <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white data-[placeholder]:text-slate-400">
            <SelectValue placeholder="All Budgets" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="all" className="hover:bg-slate-700">
              All Budgets
            </SelectItem>
            <SelectItem value="<50k" className="hover:bg-slate-700">
              {"< $50k"}
            </SelectItem>
            <SelectItem value="50k-100k" className="hover:bg-slate-700">
              $50k - $100k
            </SelectItem>
            <SelectItem value="100k-250k" className="hover:bg-slate-700">
              $100k - $250k
            </SelectItem>
            <SelectItem value=">250k" className="hover:bg-slate-700">
              {"> $250k"}
            </SelectItem>
          </SelectContent>
        </Select>
        {/* <Button variant="outline" className="w-full lg:w-auto bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button> */}
      </div>
    </div>
  )
}
