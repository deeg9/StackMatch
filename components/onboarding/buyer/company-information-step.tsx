"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, User, Building2, Mail, Phone } from "lucide-react"

interface CompanyInformationStepProps {
  formData: {
    company_name: string
    company_description: string
    website_url: string
    headquarters_location: string
    company_logo_url: string
    contact_person_name: string
    contact_person_title: string
    contact_person_email: string
    contact_person_phone: string
  }
  updateFormData: (data: Partial<CompanyInformationStepProps["formData"]>) => void
}

export default function CompanyInformationStep({ formData, updateFormData }: CompanyInformationStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.company_logo_url || null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload to storage and get a URL
      // For now, we'll just create a local preview
      const reader = new FileReader()
      reader.onload = (event) => {
        const preview = event.target?.result as string
        setLogoPreview(preview)
        updateFormData({ company_logo_url: preview })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Company Information</h2>
        <p className="text-slate-400">Tell us about your company.</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-800">
            {logoPreview ? (
              <img
                src={logoPreview || "/placeholder.svg"}
                alt="Company logo preview"
                className="h-full w-full rounded-lg object-contain p-2"
              />
            ) : (
              <Building2 className="h-12 w-12 text-slate-500" />
            )}
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={handleLogoUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <Label htmlFor="logo-upload" className="text-white">
              Company Logo
            </Label>
            <p className="text-sm text-slate-400">Upload your company logo for better brand recognition.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Logo</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            placeholder="Enter your company name"
            value={formData.company_name}
            onChange={(e) => updateFormData({ company_name: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_description">Company Description</Label>
          <Textarea
            id="company_description"
            placeholder="Provide a detailed description of your company, including your mission, values, and what sets you apart from competitors."
            value={formData.company_description}
            onChange={(e) => updateFormData({ company_description: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
          />
          <p className="text-xs text-slate-400">
            A comprehensive description helps service providers understand your business better.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            type="url"
            placeholder="https://yourcompany.com"
            value={formData.website_url}
            onChange={(e) => updateFormData({ website_url: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="headquarters_location">Headquarters Location</Label>
          <Input
            id="headquarters_location"
            placeholder="City, Country"
            value={formData.headquarters_location}
            onChange={(e) => updateFormData({ headquarters_location: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Primary Contact Person</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_person_name">
                <User className="mr-1 inline h-4 w-4" /> Full Name
              </Label>
              <Input
                id="contact_person_name"
                placeholder="John Doe"
                value={formData.contact_person_name}
                onChange={(e) => updateFormData({ contact_person_name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_title">Job Title</Label>
              <Input
                id="contact_person_title"
                placeholder="CTO, Project Manager, etc."
                value={formData.contact_person_title}
                onChange={(e) => updateFormData({ contact_person_title: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_email">
                <Mail className="mr-1 inline h-4 w-4" /> Email
              </Label>
              <Input
                id="contact_person_email"
                type="email"
                placeholder="john.doe@company.com"
                value={formData.contact_person_email}
                onChange={(e) => updateFormData({ contact_person_email: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_phone">
                <Phone className="mr-1 inline h-4 w-4" /> Phone Number
              </Label>
              <Input
                id="contact_person_phone"
                placeholder="+1 (555) 123-4567"
                value={formData.contact_person_phone}
                onChange={(e) => updateFormData({ contact_person_phone: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
