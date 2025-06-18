'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, MapPin, User, Briefcase, Calendar } from 'lucide-react'

interface BasicInformationData {
  fullName: string
  headline: string
  location: string
  avatar: string
  experienceYears: number
}

interface BasicInformationStepProps {
  data: BasicInformationData
  onUpdate: (data: BasicInformationData) => void
  onNext: () => void
  onPrev: () => void
  userType: 'buyer' | 'seller' | 'consultant'
}

export default function BasicInformationStep({ 
  data, 
  onUpdate, 
  onNext, 
  onPrev, 
  userType 
}: BasicInformationStepProps) {
  const [formData, setFormData] = useState<BasicInformationData>(data)

  const handleChange = (field: keyof BasicInformationData, value: string | number) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onUpdate(newData)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service and get back a URL
      const mockUrl = URL.createObjectURL(file)
      handleChange('avatar', mockUrl)
    }
  }

  const isFormValid = () => {
    return formData.fullName.trim() !== '' && 
           formData.headline.trim() !== '' && 
           formData.location.trim() !== ''
  }

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'buyer': return 'Finding the perfect solutions for your business'
      case 'seller': return 'Showcasing your expertise to potential clients'
      case 'consultant': return 'Connecting businesses with the right solutions'
      default: return 'Building your professional presence'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A2B4C] mb-2">Welcome to StackMatch!</h2>
          <p className="text-gray-600">
            {getUserTypeLabel()}. Let's start by setting up your basic information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Photo Section */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Label className="text-lg font-semibold text-[#1A2B4C]">Profile Photo</Label>
              <p className="text-sm text-gray-600">Upload a professional photo to make a great first impression</p>
              
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={formData.avatar} alt="Profile photo" />
                  <AvatarFallback className="bg-[#1A2B4C] text-white text-2xl">
                    {formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('') : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                  fileInput?.click()
                }}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {formData.avatar ? 'Change Photo' : 'Upload Photo'}
              </Button>
              
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF. Max size 2MB. Square images work best.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information Form */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Professional Headline */}
            <div className="space-y-2">
              <Label htmlFor="headline" className="text-sm font-medium text-gray-700">
                Professional Headline *
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="headline"
                  type="text"
                  placeholder={
                    userType === 'buyer' 
                      ? "e.g., VP of Technology at TechCorp" 
                      : "e.g., Senior Full-Stack Developer & CRM Specialist"
                  }
                  value={formData.headline}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500">
                A brief description of your current role or expertise
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                Years of Experience
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="5"
                  value={formData.experienceYears || ''}
                  onChange={(e) => handleChange('experienceYears', parseInt(e.target.value) || 0)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500">
                {userType === 'buyer' 
                  ? 'Years of experience in your current field or industry'
                  : 'Total years of professional experience in your field'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="border-0 bg-gradient-to-r from-[#4A73CC]/10 to-[#22C55E]/10">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#1A2B4C] mb-3 flex items-center gap-2">
            <div className="w-5 h-5 bg-[#4A73CC] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💡</span>
            </div>
            Tips for a great first impression
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p className="font-medium">Profile Photo:</p>
              <ul className="space-y-1 text-xs">
                <li>• Use a clear, professional headshot</li>
                <li>• Smile and look directly at the camera</li>
                <li>• Ensure good lighting and minimal background</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Professional Headline:</p>
              <ul className="space-y-1 text-xs">
                <li>• Include your current role and key expertise</li>
                <li>• Mention specific technologies or industries</li>
                <li>• Keep it concise but descriptive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Validation Message */}
      {!isFormValid() && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            Please fill in all required fields (marked with *) to continue
          </p>
        </div>
      )}
    </div>
  )
}