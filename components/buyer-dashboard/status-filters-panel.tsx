"use client"

import { useState } from "react"
import { Calendar, Filter, Search, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface FiltersState {
  status: string[]
  dateRange: { from: Date; to: Date } | null
  industry: string
  searchQuery: string
  smartTags: string[]
}

interface StatusFiltersPanelProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
}

const statusOptions = [
  { value: "draft", label: "Draft", color: "bg-gray-500" },
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "closed", label: "Closed", color: "bg-blue-500" },
  { value: "archived", label: "Archived", color: "bg-slate-500" },
]

const industryOptions = [
  "CRM Systems",
  "ERP Solutions",
  "Finance & Accounting",
  "Marketing Automation",
  "E-commerce",
  "Custom Development",
]

const smartTags = [
  "High Activity",
  "Low Engagement",
  "Needs Follow-up",
  "Deadline Soon",
  "Over Budget",
  "Top Performers",
]

export function StatusFiltersPanel({ filters, onFiltersChange }: StatusFiltersPanelProps) {
  const [localSearch, setLocalSearch] = useState("")

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]

    onFiltersChange({ ...filters, status: newStatus })
  }

  const toggleSmartTag = (tag: string) => {
    const newTags = filters.smartTags.includes(tag)
      ? filters.smartTags.filter((t) => t !== tag)
      : [...filters.smartTags, tag]

    onFiltersChange({ ...filters, smartTags: newTags })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      status: [],
      dateRange: null,
      industry: "",
      searchQuery: "",
      smartTags: [],
    })
    setLocalSearch("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-slate-400 hover:text-white">
          Clear All
        </Button>
      </div>

      {/* Search within Results */}
      <div className="space-y-2">
        <Label className="text-slate-300">Search within Results</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Type to filter..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value)
              onFiltersChange({ ...filters, searchQuery: e.target.value })
            }}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Status Toggle Buttons */}
      <div className="space-y-3">
        <Label className="text-slate-300">Listing Status</Label>
        <div className="grid grid-cols-2 gap-2">
          {statusOptions.map((status) => (
            <Button
              key={status.value}
              variant={filters.status.includes(status.value) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleStatus(status.value)}
              className={cn(
                "justify-start",
                filters.status.includes(status.value)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700",
              )}
            >
              <div className={cn("w-2 h-2 rounded-full mr-2", status.color)} />
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="space-y-3">
        <Label className="text-slate-300">Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd, y")} - {format(filters.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
            {/* <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange?.from}
              selected={filters.dateRange}
              onSelect={(range) => onFiltersChange({ ...filters, dateRange: range })}
              numberOfMonths={2}
              className="bg-slate-800 text-white"
            /> */}\n            <p className="p-4 text-sm text-slate-400">Date range picker temporarily disabled</p>
          </PopoverContent>
        </Popover>
      </div>

      {/* Industry Dropdown */}
      <div className="space-y-3">
        <Label className="text-slate-300">Industry / Category</Label>
        <Select value={filters.industry} onValueChange={(value) => onFiltersChange({ ...filters, industry: value })}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300">
            <SelectValue placeholder="Select industry..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {industryOptions.map((industry) => (
              <SelectItem key={industry} value={industry} className="text-slate-300 hover:bg-slate-700">
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Smart Tags */}
      <div className="space-y-3">
        <Label className="text-slate-300 flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          Smart Tags
        </Label>
        <div className="flex flex-wrap gap-2">
          {smartTags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.smartTags.includes(tag) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                filters.smartTags.includes(tag)
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700",
              )}
              onClick={() => toggleSmartTag(tag)}
            >
              {tag}
              {filters.smartTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.status.length > 0 || filters.smartTags.length > 0 || filters.industry) && (
        <div className="pt-4 border-t border-slate-700">
          <Label className="text-slate-300 text-sm">Active Filters</Label>
          <div className="mt-2 space-y-1">
            {filters.status.length > 0 && (
              <div className="text-xs text-slate-400">Status: {filters.status.join(", ")}</div>
            )}
            {filters.industry && <div className="text-xs text-slate-400">Industry: {filters.industry}</div>}
            {filters.smartTags.length > 0 && (
              <div className="text-xs text-slate-400">Tags: {filters.smartTags.join(", ")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
