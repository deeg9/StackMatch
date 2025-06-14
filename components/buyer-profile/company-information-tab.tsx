"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, MapPin, Calendar, DollarSign, Globe, Edit, Save, X, Mail, User } from "lucide-react"
import { updateBuyerProfile } from "@/store/slices/buyerProfileSlice"
import type { BuyerProfile } from "@/store/slices/buyerProfileSlice"

interface CompanyInformationTabProps {
  profile: BuyerProfile
}

export default function CompanyInformationTab({ profile }: CompanyInformationTabProps) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    company_name: profile?.company_name || "",
    company_description: profile?.company_description || "",
    detailed_company_description: profile?.detailed_company_description || "",
    website_url: profile?.website_url || "",
    industry: profile?.industry || "",
    company_size: profile?.company_size || "",
    founded_year: profile?.founded_year || new Date().getFullYear(),
    headquarters_location: profile?.headquarters_location || "",
    annual_revenue_range: profile?.annual_revenue_range || "",
    primary_contact_name: profile?.primary_contact_name || "",
    primary_contact_title: profile?.primary_contact_title || "",
    primary_contact_email: profile?.primary_contact_email || "",
    primary_contact_phone: profile?.primary_contact_phone || "",
  })

  const handleSave = async () => {
    try {
      await dispatch(updateBuyerProfile(formData) as any)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleCancel = () => {
    setFormData({
      company_name: profile?.company_name || "",
      company_description: profile?.company_description || "",
      detailed_company_description: profile?.detailed_company_description || "",
      website_url: profile?.website_url || "",
      industry: profile?.industry || "",
      company_size: profile?.company_size || "",
      founded_year: profile?.founded_year || new Date().getFullYear(),
      headquarters_location: profile?.headquarters_location || "",
      annual_revenue_range: profile?.annual_revenue_range || "",
      primary_contact_name: profile?.primary_contact_name || "",
      primary_contact_title: profile?.primary_contact_title || "",
      primary_contact_email: profile?.primary_contact_email || "",
      primary_contact_phone: profile?.primary_contact_phone || "",
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-white">Edit Company Information</h3>
            <p className="text-gray-400">Update your company details and contact information</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="border-gray-600 text-gray-300">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Company Information */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_name" className="text-gray-300">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="industry" className="text-gray-300">
                  Industry
                </Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="company_size" className="text-gray-300">
                  Company Size
                </Label>
                <Input
                  id="company_size"
                  value={formData.company_size}
                  onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="headquarters_location" className="text-gray-300">
                  Headquarters Location
                </Label>
                <Input
                  id="headquarters_location"
                  value={formData.headquarters_location}
                  onChange={(e) => setFormData({ ...formData, headquarters_location: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="website_url" className="text-gray-300">
                  Website URL
                </Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://www.example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Primary Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primary_contact_name" className="text-gray-300">
                  Contact Name
                </Label>
                <Input
                  id="primary_contact_name"
                  value={formData.primary_contact_name}
                  onChange={(e) => setFormData({ ...formData, primary_contact_name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="primary_contact_title" className="text-gray-300">
                  Title
                </Label>
                <Input
                  id="primary_contact_title"
                  value={formData.primary_contact_title}
                  onChange={(e) => setFormData({ ...formData, primary_contact_title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="primary_contact_email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="primary_contact_email"
                  type="email"
                  value={formData.primary_contact_email}
                  onChange={(e) => setFormData({ ...formData, primary_contact_email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="primary_contact_phone" className="text-gray-300">
                  Phone
                </Label>
                <Input
                  id="primary_contact_phone"
                  value={formData.primary_contact_phone}
                  onChange={(e) => setFormData({ ...formData, primary_contact_phone: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Description */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Company Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="detailed_company_description" className="text-gray-300">
                Detailed Description
              </Label>
              <Textarea
                id="detailed_company_description"
                value={formData.detailed_company_description}
                onChange={(e) => setFormData({ ...formData, detailed_company_description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                placeholder="Provide a detailed description of your company, services, and goals..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // View Mode
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">Company Information</h3>
          <p className="text-gray-400">Your company details and public information</p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
          <Edit className="w-4 h-4 mr-2" />
          Edit Information
        </Button>
      </div>

      {/* Company Overview */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.company_logo_url || "/placeholder.svg"} alt={profile?.company_name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                {profile?.company_name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white text-xl">{profile?.company_name || "Company Name Not Set"}</CardTitle>
              <CardDescription className="text-gray-400">
                {profile?.industry || "Industry not specified"} • {profile?.company_size || "Size not specified"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            {profile?.detailed_company_description ||
              profile?.company_description ||
              "No company description provided."}
          </p>
        </CardContent>
      </Card>

      {/* Company Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Location</span>
            </div>
            <p className="text-white font-medium">{profile?.headquarters_location || "Not specified"}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Founded</span>
            </div>
            <p className="text-white font-medium">{profile?.founded_year || "Not specified"}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Revenue Range</span>
            </div>
            <p className="text-white font-medium">{profile?.annual_revenue_range || "Not specified"}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Website</span>
            </div>
            <p className="text-white font-medium">
              {profile?.website_url ? (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {profile.website_url}
                </a>
              ) : (
                "Not specified"
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-orange-400" />
              <span className="text-gray-400 text-sm">Primary Contact</span>
            </div>
            <p className="text-white font-medium">
              {profile?.primary_contact_name || "Not specified"}
              {profile?.primary_contact_title && (
                <span className="text-gray-400 text-sm block">{profile.primary_contact_title}</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-red-400" />
              <span className="text-gray-400 text-sm">Contact Info</span>
            </div>
            <div className="space-y-1">
              {profile?.primary_contact_email && <p className="text-white text-sm">{profile.primary_contact_email}</p>}
              {profile?.primary_contact_phone && <p className="text-white text-sm">{profile.primary_contact_phone}</p>}
              {!profile?.primary_contact_email && !profile?.primary_contact_phone && (
                <p className="text-white font-medium">Not specified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
