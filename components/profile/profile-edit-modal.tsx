'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Edit3, 
  Camera, 
  Plus, 
  X, 
  Save, 
  Upload,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Phone,
  Mail
} from 'lucide-react'

interface ProfileEditModalProps {
  children: React.ReactNode
  profileData: any
  onSave: (updatedData: any) => void
}

export default function ProfileEditModal({ children, profileData, onSave }: ProfileEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editedData, setEditedData] = useState(profileData)
  const [activeTab, setActiveTab] = useState('basic')
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' })
  const [newLanguage, setNewLanguage] = useState({ language: '', proficiency: 'Conversational', isNative: false })

  const handleSave = () => {
    onSave(editedData)
    setIsOpen(false)
  }

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setEditedData({
        ...editedData,
        skills: [...editedData.skills, newSkill]
      })
      setNewSkill({ name: '', level: 'Intermediate' })
    }
  }

  const removeSkill = (index: number) => {
    setEditedData({
      ...editedData,
      skills: editedData.skills.filter((_: any, i: number) => i !== index)
    })
  }

  const addLanguage = () => {
    if (newLanguage.language.trim()) {
      setEditedData({
        ...editedData,
        languages: [...editedData.languages, newLanguage]
      })
      setNewLanguage({ language: '', proficiency: 'Conversational', isNative: false })
    }
  }

  const removeLanguage = (index: number) => {
    setEditedData({
      ...editedData,
      languages: editedData.languages.filter((_: any, i: number) => i !== index)
    })
  }

  const addSpecialization = (spec: string) => {
    if (spec.trim() && !editedData.specializations.includes(spec)) {
      setEditedData({
        ...editedData,
        specializations: [...editedData.specializations, spec]
      })
    }
  }

  const removeSpecialization = (index: number) => {
    setEditedData({
      ...editedData,
      specializations: editedData.specializations.filter((_: any, i: number) => i !== index)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1A2B4C]">Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={editedData.avatar} alt={editedData.fullName} />
                      <AvatarFallback className="text-2xl">
                        {editedData.fullName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Name and Headline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editedData.fullName}
                      onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      id="headline"
                      value={editedData.headline}
                      onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
                    />
                  </div>
                </div>

                {/* Location and Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="location"
                        className="pl-10"
                        value={editedData.location}
                        onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={editedData.experience}
                      onChange={(e) => setEditedData({ ...editedData, experience: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Availability Status */}
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability Status</Label>
                  <Select
                    value={editedData.availability.status}
                    onValueChange={(value) => 
                      setEditedData({
                        ...editedData,
                        availability: { ...editedData.availability, status: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Busy">Busy</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About & Specializations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    rows={6}
                    value={editedData.bio}
                    onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                    placeholder="Tell potential clients about your experience, expertise, and what makes you unique..."
                  />
                </div>

                {/* Specializations */}
                <div className="space-y-4">
                  <Label>Specializations</Label>
                  <div className="flex flex-wrap gap-2">
                    {editedData.specializations.map((spec: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-[#4A73CC]/10 text-[#4A73CC] pr-1">
                        {spec}
                        <button
                          onClick={() => removeSpecialization(index)}
                          className="ml-2 hover:bg-red-100 rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add specialization..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSpecialization(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addSpecialization(input.value)
                        input.value = ''
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Industries */}
                <div className="space-y-4">
                  <Label>Industry Focus</Label>
                  <div className="flex flex-wrap gap-2">
                    {editedData.industries.map((industry: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Skills */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Skills & Expertise</Label>
                  
                  {/* Existing Skills */}
                  <div className="space-y-3">
                    {editedData.skills.map((skill: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{skill.name}</span>
                          <Badge 
                            variant={skill.level === 'Expert' ? 'default' : 'secondary'}
                            className={
                              skill.level === 'Expert' 
                                ? 'bg-[#22C55E] hover:bg-[#22C55E]/80' 
                                : skill.level === 'Intermediate'
                                ? 'bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white'
                                : 'bg-gray-400 hover:bg-gray-400/80 text-white'
                            }
                          >
                            {skill.level}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Skill */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Skill name..."
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    />
                    <Select
                      value={newSkill.level}
                      onValueChange={(value) => setNewSkill({ ...newSkill, level: value as any })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Languages</Label>
                  
                  {/* Existing Languages */}
                  <div className="space-y-3">
                    {editedData.languages.map((lang: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{lang.language}</span>
                          <Badge variant="outline">{lang.proficiency}</Badge>
                          {lang.isNative && (
                            <Badge variant="secondary" className="bg-[#1A2B4C]/10 text-[#1A2B4C]">
                              Native
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLanguage(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Language */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Language..."
                      value={newLanguage.language}
                      onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                    />
                    <Select
                      value={newLanguage.proficiency}
                      onValueChange={(value) => setNewLanguage({ ...newLanguage, proficiency: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Conversational">Conversational</SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addLanguage}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={editedData.contactInfo.email}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          contactInfo: { ...editedData.contactInfo, email: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        className="pl-10"
                        value={editedData.contactInfo.phone}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          contactInfo: { ...editedData.contactInfo, phone: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Website and Social */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="website"
                        className="pl-10"
                        value={editedData.contactInfo.website}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          contactInfo: { ...editedData.contactInfo, website: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="linkedin"
                        className="pl-10"
                        value={editedData.contactInfo.linkedin}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          contactInfo: { ...editedData.contactInfo, linkedin: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="github"
                      className="pl-10"
                      value={editedData.contactInfo.github}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contactInfo: { ...editedData.contactInfo, github: e.target.value }
                      })}
                    />
                  </div>
                </div>

                {/* Working Hours and Timezone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input
                      id="workingHours"
                      value={editedData.availability.workingHours}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        availability: { ...editedData.availability, workingHours: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={editedData.availability.timezone}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        availability: { ...editedData.availability, timezone: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hourly Rate */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Hourly Rate Range</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minRate">Minimum Rate ($/hour)</Label>
                      <Input
                        id="minRate"
                        type="number"
                        value={editedData.pricing.hourlyRate.min}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          pricing: {
                            ...editedData.pricing,
                            hourlyRate: { ...editedData.pricing.hourlyRate, min: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxRate">Maximum Rate ($/hour)</Label>
                      <Input
                        id="maxRate"
                        type="number"
                        value={editedData.pricing.hourlyRate.max}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          pricing: {
                            ...editedData.pricing,
                            hourlyRate: { ...editedData.pricing.hourlyRate, max: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Project Minimum */}
                <div className="space-y-2">
                  <Label htmlFor="projectMinimum">Project Minimum ($)</Label>
                  <Input
                    id="projectMinimum"
                    type="number"
                    value={editedData.pricing.projectMinimum}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      pricing: { ...editedData.pricing, projectMinimum: parseInt(e.target.value) }
                    })}
                  />
                </div>

                {/* Payment Terms */}
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select
                    value={editedData.pricing.paymentTerms}
                    onValueChange={(value) => setEditedData({
                      ...editedData,
                      pricing: { ...editedData.pricing, paymentTerms: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15 days</SelectItem>
                      <SelectItem value="Net 30">Net 30 days</SelectItem>
                      <SelectItem value="50% upfront">50% upfront, 50% on completion</SelectItem>
                      <SelectItem value="Payment on delivery">Payment on delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hours per Week */}
                <div className="space-y-2">
                  <Label htmlFor="hoursPerWeek">Available Hours per Week</Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    value={editedData.availability.hoursPerWeek}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      availability: { ...editedData.availability, hoursPerWeek: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#1A2B4C] hover:bg-[#1A2B4C]/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}