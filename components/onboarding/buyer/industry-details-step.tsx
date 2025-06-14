"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IndustryDetailsStepProps {
  formData: {
    industry: string
    company_size: string
    founded_year: string
    annual_revenue_range: string
  }
  updateFormData: (data: Partial<IndustryDetailsStepProps["formData"]>) => void
}

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Media & Entertainment",
  "Real Estate",
  "Transportation",
  "Energy",
  "Hospitality",
  "Agriculture",
  "Other",
]

const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001-5000 employees",
  "5001+ employees",
]

const revenueRanges = [
  "Less than $100K",
  "$100K - $500K",
  "$500K - $1M",
  "$1M - $5M",
  "$5M - $10M",
  "$10M - $50M",
  "$50M - $100M",
  "$100M - $500M",
  "$500M - $1B",
  "$1B+",
]

export default function IndustryDetailsStep({ formData, updateFormData }: IndustryDetailsStepProps) {
  // Generate year options from 1900 to current year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => (currentYear - i).toString())

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Industry Details</h2>
        <p className="text-slate-400">Tell us more about your industry and company size.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => updateFormData({ industry: value })}>
            <SelectTrigger id="industry" className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_size">Company Size</Label>
          <Select value={formData.company_size} onValueChange={(value) => updateFormData({ company_size: value })}>
            <SelectTrigger id="company_size" className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="founded_year">Founded Year</Label>
          <Select value={formData.founded_year} onValueChange={(value) => updateFormData({ founded_year: value })}>
            <SelectTrigger id="founded_year" className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select founded year" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[200px]">
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="annual_revenue_range">Annual Revenue Range</Label>
          <Select
            value={formData.annual_revenue_range}
            onValueChange={(value) => updateFormData({ annual_revenue_range: value })}
          >
            <SelectTrigger id="annual_revenue_range" className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select revenue range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {revenueRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
