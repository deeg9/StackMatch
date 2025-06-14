"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BasicInformationStepProps {
  formData: {
    business_name: string
    business_description: string
    website_url: string
    location: string
    business_type: string
    founded_year: string
    team_size: string
  }
  updateFormData: (data: Partial<BasicInformationStepProps["formData"]>) => void
}

const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "LLC",
  "Corporation",
  "Freelancer",
  "Agency",
  "Consultancy",
  "Other",
]

const teamSizes = ["Just me (1)", "Small team (2-5)", "Medium team (6-15)", "Large team (16-50)", "Enterprise (50+)"]

export default function BasicInformationStep({ formData, updateFormData }: BasicInformationStepProps) {
  // Generate year options from 1900 to current year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => (currentYear - i).toString())

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Basic Information</h2>
        <p className="text-slate-400">Tell us about your business or freelance practice.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business_name">Business/Professional Name</Label>
          <Input
            id="business_name"
            placeholder="Enter your business or professional name"
            value={formData.business_name}
            onChange={(e) => updateFormData({ business_name: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_description">Business Description</Label>
          <Textarea
            id="business_description"
            placeholder="Describe your business, services, and what makes you unique"
            value={formData.business_description}
            onChange={(e) => updateFormData({ business_description: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              placeholder="https://yourwebsite.com"
              value={formData.website_url}
              onChange={(e) => updateFormData({ website_url: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="business_type">Business Type</Label>
            <Select value={formData.business_type} onValueChange={(value) => updateFormData({ business_type: value })}>
              <SelectTrigger id="business_type" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="founded_year">Founded Year</Label>
            <Select value={formData.founded_year} onValueChange={(value) => updateFormData({ founded_year: value })}>
              <SelectTrigger id="founded_year" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select year" />
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
            <Label htmlFor="team_size">Team Size</Label>
            <Select value={formData.team_size} onValueChange={(value) => updateFormData({ team_size: value })}>
              <SelectTrigger id="team_size" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {teamSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
