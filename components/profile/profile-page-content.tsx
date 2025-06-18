'use client'

import { useState, useEffect } from 'react'
import ProfileEditModal from './profile-edit-modal'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Edit3, 
  Camera, 
  CheckCircle, 
  Shield, 
  Mail, 
  Phone,
  Globe,
  Download,
  Share2,
  Settings,
  TrendingUp,
  Award,
  Target,
  DollarSign,
  Eye,
  MessageSquare,
  Heart,
  Briefcase,
  GraduationCap,
  Languages,
  ExternalLink,
  Plus,
  Flag
} from 'lucide-react'

interface ProfileData {
  id: string
  fullName: string
  headline: string
  location: string
  memberSince: string
  lastActive: string
  isOnline: boolean
  avatar: string
  overallRating: number
  totalReviews: number
  ratingBreakdown: { [key: number]: number }
  projectsCompleted: number
  successRate: number
  onTimeDelivery: number
  repeatClientRate: number
  totalEarnings: number
  projectsThisMonth: number
  responseTime: string
  profileViews: number
  verifications: {
    identity: boolean
    payment: boolean
    email: boolean
    phone: boolean
  }
  bio: string
  experience: number
  specializations: string[]
  industries: string[]
  skills: Array<{ name: string; level: 'Beginner' | 'Intermediate' | 'Expert' }>
  languages: Array<{ language: string; proficiency: string; isNative: boolean }>
  education: Array<{ institution: string; degree: string; year: string }>
  certifications: Array<{ name: string; issuer: string; year: string }>
  portfolio: Array<{
    id: string
    title: string
    description: string
    image: string
    category: string
    testimonial: string
    clientName: string
  }>
  reviews: Array<{
    id: string
    clientName: string
    clientAvatar: string
    rating: number
    feedback: string
    projectContext: string
    date: string
    response?: string
  }>
  workHistory: Array<{
    company: string
    role: string
    startDate: string
    endDate: string
    description: string
  }>
  contactInfo: {
    email: string
    phone: string
    website: string
    linkedin: string
    github: string
  }
  availability: {
    status: 'Available' | 'Busy' | 'Unavailable'
    hoursPerWeek: number
    workingHours: string
    timezone: string
  }
  pricing: {
    hourlyRate: { min: number; max: number }
    projectMinimum: number
    paymentTerms: string
  }
}

export default function ProfilePageContent() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [profileCompletion, setProfileCompletion] = useState(85)

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      } else {
        // Fallback to mock data for demo
        loadMockData()
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      // Fallback to mock data for demo
      loadMockData()
    }
  }

  const loadMockData = () => {
    const mockProfileData: ProfileData = {
      id: 'user-123',
      fullName: 'Christopher Fill',
      headline: 'Senior Software Solutions Architect & Procurement Expert',
      location: 'San Francisco, CA',
      memberSince: 'January 2023',
      lastActive: '2 minutes ago',
      isOnline: true,
      avatar: '/api/placeholder/150/150',
      overallRating: 4.9,
      totalReviews: 127,
      ratingBreakdown: { 5: 98, 4: 23, 3: 4, 2: 1, 1: 1 },
      projectsCompleted: 89,
      successRate: 98.8,
      onTimeDelivery: 96.6,
      repeatClientRate: 78.2,
      totalEarnings: 450000,
      projectsThisMonth: 7,
      responseTime: '< 1 hour',
      profileViews: 234,
      verifications: {
        identity: true,
        payment: true,
        email: true,
        phone: true
      },
      bio: "Passionate software procurement expert with 8+ years of experience helping mid-market companies find and implement the perfect technology solutions. I specialize in CRM implementations, ERP migrations, and digital transformation projects that drive real business value.",
      experience: 8,
      specializations: ['CRM Implementation', 'ERP Solutions', 'Digital Transformation', 'Software Procurement'],
      industries: ['SaaS', 'E-commerce', 'Financial Services', 'Healthcare Tech'],
      skills: [
        { name: 'Salesforce', level: 'Expert' },
        { name: 'HubSpot', level: 'Expert' },
        { name: 'SAP', level: 'Intermediate' },
        { name: 'Microsoft Dynamics', level: 'Expert' },
        { name: 'Project Management', level: 'Expert' },
        { name: 'Vendor Negotiation', level: 'Expert' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native', isNative: true },
        { language: 'Spanish', proficiency: 'Conversational', isNative: false },
        { language: 'French', proficiency: 'Basic', isNative: false }
      ],
      education: [
        { institution: 'Stanford University', degree: 'MBA in Technology Management', year: '2018' },
        { institution: 'UC Berkeley', degree: 'BS in Computer Science', year: '2015' }
      ],
      certifications: [
        { name: 'Salesforce Certified Administrator', issuer: 'Salesforce', year: '2023' },
        { name: 'Project Management Professional (PMP)', issuer: 'PMI', year: '2022' },
        { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2023' }
      ],
      portfolio: [
        {
          id: 'p1',
          title: 'Enterprise CRM Implementation for $50M Tech Company',
          description: 'Led complete Salesforce implementation for growing SaaS company, resulting in 40% increase in sales efficiency and $2M additional ARR.',
          image: '/api/placeholder/300/200',
          category: 'CRM',
          testimonial: "Christopher's expertise was invaluable. He guided us through every step and delivered exceptional results.",
          clientName: 'Sarah Johnson, VP Sales'
        },
        {
          id: 'p2',
          title: 'ERP Migration for Manufacturing Company',
          description: 'Successful migration from legacy system to SAP S/4HANA, improving operational efficiency by 35% and reducing costs by $1.2M annually.',
          image: '/api/placeholder/300/200',
          category: 'ERP',
          testimonial: "The migration was seamless and ahead of schedule. Outstanding work!",
          clientName: 'Michael Chen, CTO'
        },
        {
          id: 'p3',
          title: 'Digital Transformation Strategy',
          description: 'Comprehensive digital transformation roadmap for financial services firm, including technology stack evaluation and implementation plan.',
          image: '/api/placeholder/300/200',
          category: 'Strategy',
          testimonial: "Christopher's strategic vision transformed our entire approach to technology.",
          clientName: 'Lisa Rodriguez, CEO'
        }
      ],
      reviews: [
        {
          id: 'r1',
          clientName: 'Jennifer Martinez',
          clientAvatar: '/api/placeholder/40/40',
          rating: 5,
          feedback: 'Exceptional work on our CRM implementation. Christopher was professional, knowledgeable, and delivered ahead of schedule. The team adoption rate was 95% within the first month!',
          projectContext: 'Salesforce Implementation - E-commerce Platform',
          date: '2 weeks ago',
          response: 'Thank you Jennifer! It was a pleasure working with your team. The high adoption rate speaks to your excellent change management.'
        },
        {
          id: 'r2',
          clientName: 'David Kim',
          clientAvatar: '/api/placeholder/40/40',
          rating: 5,
          feedback: 'Outstanding project management and technical expertise. Christopher saved us months of work and potential costly mistakes.',
          projectContext: 'ERP System Selection - Manufacturing',
          date: '1 month ago'
        },
        {
          id: 'r3',
          clientName: 'Rachel Thompson',
          clientAvatar: '/api/placeholder/40/40',
          rating: 4,
          feedback: 'Very thorough analysis and great communication throughout the project. Minor delays due to vendor issues, but Christopher handled everything professionally.',
          projectContext: 'Digital Transformation Strategy',
          date: '2 months ago',
          response: 'Thanks Rachel! The vendor delays were indeed frustrating, but I\'m glad we found the perfect solution for your needs.'
        }
      ],
      workHistory: [
        {
          company: 'StackMatch',
          role: 'Senior Procurement Consultant',
          startDate: 'Jan 2023',
          endDate: 'Present',
          description: 'Leading strategic procurement projects for enterprise clients, specializing in software vendor evaluation and implementation management.'
        },
        {
          company: 'TechConsult Pro',
          role: 'Principal Technology Advisor',
          startDate: 'Jun 2020',
          endDate: 'Dec 2022',
          description: 'Advised Fortune 500 companies on technology strategy and vendor selection, managing $50M+ in software procurement decisions.'
        },
        {
          company: 'Salesforce',
          role: 'Solutions Engineering Manager',
          startDate: 'Sep 2018',
          endDate: 'May 2020',
          description: 'Led pre-sales engineering team for enterprise accounts, driving $25M in annual revenue through technical solution design.'
        }
      ],
      contactInfo: {
        email: 'buyer@example.com',
        phone: '+1 (555) 123-4567',
        website: 'example.com',
        linkedin: 'linkedin.com/in/example',
        github: 'github.com/example'
      },
      availability: {
        status: 'Available',
        hoursPerWeek: 40,
        workingHours: '9:00 AM - 6:00 PM PST',
        timezone: 'Pacific Standard Time (PST)'
      },
      pricing: {
        hourlyRate: { min: 150, max: 300 },
        projectMinimum: 5000,
        paymentTerms: 'Net 30'
      }
    }
    
    setProfileData(mockProfileData)
  }

  useEffect(() => {
    fetchProfileData()
  }, [])

  const handleProfileSave = async (updatedData: ProfileData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        setProfileData(updatedData)
        // You could show a success toast here
      } else {
        console.error('Failed to update profile')
        // You could show an error toast here
      }
    } catch (error) {
      console.error('Profile update error:', error)
      // You could show an error toast here
    }
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-[#1A2B4C] via-[#4A73CC] to-[#1A2B4C]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <CardContent className="relative p-8 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl">
                <AvatarImage src={profileData.avatar} alt={profileData.fullName} />
                <AvatarFallback className="bg-white text-[#1A2B4C] text-3xl font-bold">
                  {profileData.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
              {profileData.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#22C55E] border-4 border-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold">{profileData.fullName}</h1>
                <div className="flex gap-2">
                  {profileData.verifications.identity && (
                    <Badge variant="secondary" className="bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-xl text-white/90">{profileData.headline}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {profileData.memberSince}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Last active {profileData.lastActive}</span>
                </div>
              </div>

              {/* Rating Display */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(profileData.overallRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-semibold">{profileData.overallRating}</span>
                  <span className="text-white/70">({profileData.totalReviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <ProfileEditModal profileData={profileData} onSave={handleProfileSave}>
                <Button 
                  variant="secondary" 
                  className="bg-white text-[#1A2B4C] hover:bg-white/90"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </ProfileEditModal>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Projects Completed</p>
                <p className="text-3xl font-bold text-[#1A2B4C]">{profileData.projectsCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-[#22C55E]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-[#1A2B4C]">{profileData.successRate}%</p>
              </div>
              <div className="w-12 h-12 bg-[#4A73CC]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#4A73CC]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On-Time Delivery</p>
                <p className="text-3xl font-bold text-[#1A2B4C]">{profileData.onTimeDelivery}%</p>
              </div>
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Repeat Clients</p>
                <p className="text-3xl font-bold text-[#1A2B4C]">{profileData.repeatClientRate}%</p>
              </div>
              <div className="w-12 h-12 bg-[#EF4444]/10 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#EF4444]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-[#1A2B4C]">${(profileData.totalEarnings / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-[#1A2B4C]">{profileData.responseTime}</p>
              </div>
              <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#8B5CF6]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white border shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#1A2B4C] data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-[#1A2B4C] data-[state=active]:text-white">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-[#1A2B4C] data-[state=active]:text-white">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-[#1A2B4C] data-[state=active]:text-white">
                Experience
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* About Section */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#1A2B4C]">About</h2>
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-[#1A2B4C] mb-3">Experience</h3>
                      <p className="text-gray-600">{profileData.experience} years</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A2B4C] mb-3">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="bg-[#4A73CC]/10 text-[#4A73CC]">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Expertise */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#1A2B4C]">Skills & Expertise</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#1A2B4C]">Languages</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Language
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Languages className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{lang.language}</span>
                          {lang.isNative && (
                            <Badge variant="secondary" className="bg-[#1A2B4C]/10 text-[#1A2B4C]">
                              Native
                            </Badge>
                          )}
                        </div>
                        <span className="text-gray-600">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1A2B4C]">Education</h2>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profileData.education.map((edu, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="w-5 h-5 text-[#1A2B4C] mt-1" />
                          <div>
                            <h3 className="font-medium">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1A2B4C]">Certifications</h2>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profileData.certifications.map((cert, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-[#22C55E] mt-1" />
                          <div>
                            <h3 className="font-medium">{cert.name}</h3>
                            <p className="text-gray-600">{cert.issuer}</p>
                            <p className="text-sm text-gray-500">{cert.year}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#1A2B4C]">Portfolio</h2>
                  <Button className="bg-[#1A2B4C] hover:bg-[#1A2B4C]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profileData.portfolio.map((project) => (
                      <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className="aspect-video bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] rounded-t-lg flex items-center justify-center">
                          <div className="text-white text-center p-6">
                            <h3 className="font-bold text-lg mb-2">{project.category}</h3>
                            <p className="text-sm opacity-90">Project Showcase</p>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-3 text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {project.description}
                          </p>
                          <div className="space-y-3">
                            <Separator />
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm italic text-gray-700">"{project.testimonial}"</p>
                              <p className="text-xs text-gray-500 mt-2">- {project.clientName}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-8">
              {/* Review Summary */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <h2 className="text-2xl font-bold text-[#1A2B4C]">Review Summary</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-[#1A2B4C] mb-2">{profileData.overallRating}</div>
                        <div className="flex justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${
                                star <= Math.floor(profileData.overallRating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">Based on {profileData.totalReviews} reviews</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-3">{stars}</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <Progress 
                            value={(profileData.ratingBreakdown[stars] / profileData.totalReviews) * 100} 
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-gray-600 w-8">{profileData.ratingBreakdown[stars]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Reviews */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <h2 className="text-2xl font-bold text-[#1A2B4C]">Recent Reviews</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.reviews.map((review) => (
                    <div key={review.id} className="p-6 border border-gray-200 rounded-lg space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={review.clientAvatar} />
                          <AvatarFallback>{review.clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{review.clientName}</h3>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {review.projectContext}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3">{review.feedback}</p>
                          {review.response && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-[#1A2B4C] mb-1">Response from Christopher:</p>
                              <p className="text-sm text-gray-700">{review.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#1A2B4C]">Work History</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.workHistory.map((work, index) => (
                    <div key={index} className="flex gap-6 p-6 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-[#1A2B4C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-[#1A2B4C]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-[#1A2B4C]">{work.role}</h3>
                        <p className="text-[#4A73CC] font-medium">{work.company}</p>
                        <p className="text-sm text-gray-600 mb-3">{work.startDate} - {work.endDate}</p>
                        <p className="text-gray-700">{work.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-bold text-[#1A2B4C]">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProfileEditModal profileData={profileData} onSave={handleProfileSave}>
                <Button className="w-full bg-[#1A2B4C] hover:bg-[#1A2B4C]/90">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </ProfileEditModal>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-bold text-[#1A2B4C]">Profile Completion</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Progress value={profileCompletion} className="absolute inset-0 rounded-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#1A2B4C]">{profileCompletion}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Your profile is {profileCompletion}% complete</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                  <span>Profile photo added</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                  <span>Contact information verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                  <span>Portfolio projects added</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-500">Add 2 more certifications</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-bold text-[#1A2B4C]">Verification Status</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm">Identity Verified</span>
                </div>
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm">Email Verified</span>
                </div>
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm">Phone Verified</span>
                </div>
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm">Payment Verified</span>
                </div>
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-bold text-[#1A2B4C]">Recent Activity</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-sm font-medium">Received 5-star review</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4A73CC]/10 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[#4A73CC]" />
                </div>
                <div>
                  <p className="text-sm font-medium">Profile viewed 12 times</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F59E0B]/10 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-sm font-medium">Completed project milestone</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}