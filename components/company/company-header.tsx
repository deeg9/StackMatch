'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Calendar, Users, MapPin, Globe, MessageSquare, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CompanyData {
  id: string
  companyName: string
  companyLogoUrl: string
  coverImageUrl: string
  isVerified: boolean
  industry: string
  idealCustomerSize: string
  foundedYear: number
  headquarters: string
  employeeCount: string
  website: string
  tagline: string
  tier: 'Fortune 100' | 'Fortune 500' | 'Enterprise' | 'Growth'
}

interface CompanyHeaderProps {
  companyId: string
}

export function CompanyHeader({ companyId }: CompanyHeaderProps) {
  const [company, setCompany] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock company data - in production this would come from API
  const mockCompanies: Record<string, CompanyData> = {
    'salesforce': {
      id: 'salesforce',
      companyName: 'Salesforce',
      companyLogoUrl: '/api/placeholder/120/120',
      coverImageUrl: '/api/placeholder/1200/300',
      isVerified: true,
      industry: 'Enterprise Software',
      idealCustomerSize: '1,000+ Employees',
      foundedYear: 1999,
      headquarters: 'San Francisco, CA',
      employeeCount: '70,000+',
      website: 'salesforce.com',
      tagline: 'The Customer Company',
      tier: 'Fortune 100'
    },
    'microsoft': {
      id: 'microsoft',
      companyName: 'Microsoft',
      companyLogoUrl: '/api/placeholder/120/120',
      coverImageUrl: '/api/placeholder/1200/300',
      isVerified: true,
      industry: 'Cloud Computing',
      idealCustomerSize: '500+ Employees',
      foundedYear: 1975,
      headquarters: 'Redmond, WA',
      employeeCount: '220,000+',
      website: 'microsoft.com',
      tagline: 'Empowering every person and organization',
      tier: 'Fortune 100'
    },
    'oracle': {
      id: 'oracle',
      companyName: 'Oracle',
      companyLogoUrl: '/api/placeholder/120/120',
      coverImageUrl: '/api/placeholder/1200/300',
      isVerified: true,
      industry: 'Database & Cloud',
      idealCustomerSize: '1,000+ Employees',
      foundedYear: 1977,
      headquarters: 'Austin, TX',
      employeeCount: '140,000+',
      website: 'oracle.com',
      tagline: 'Integrated cloud applications and platform services',
      tier: 'Fortune 100'
    }
  }

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true)
      try {
        // Try to fetch from API first
        const response = await fetch(`/api/companies/${companyId}`)
        if (response.ok) {
          const data = await response.json()
          setCompany(data)
        } else {
          // Fallback to mock data
          const mockData = mockCompanies[companyId] || mockCompanies['salesforce']
          setCompany(mockData)
        }
      } catch (error) {
        console.error('Error fetching company data:', error)
        // Fallback to mock data
        const mockData = mockCompanies[companyId] || mockCompanies['salesforce']
        setCompany(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyData()
  }, [companyId])

  if (loading || !company) {
    return (
      <div className="relative h-80 bg-gradient-to-r from-stackmatch-navy to-stackmatch-blue animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 bg-white/20 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-48 mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Fortune 100': return 'bg-gradient-to-r from-yellow-400 to-amber-500'
      case 'Fortune 500': return 'bg-gradient-to-r from-stackmatch-blue to-blue-600'
      case 'Enterprise': return 'bg-gradient-to-r from-trust-green to-green-600'
      default: return 'bg-gradient-to-r from-medium-gray to-gray-600'
    }
  }

  return (
    <div className="relative">
      {/* Cover Image */}
      <div 
        className="h-80 bg-gradient-to-r from-stackmatch-navy to-stackmatch-blue relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(26, 43, 76, 0.8), rgba(74, 115, 204, 0.8)), url(${company.coverImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              {/* Left Side - Company Identity */}
              <div className="flex items-end gap-6">
                {/* Company Logo */}
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-xl p-4 shadow-2xl border-4 border-white/20">
                    <img
                      src={company.companyLogoUrl}
                      alt={`${company.companyName} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          const fallback = document.createElement('div')
                          fallback.className = 'w-full h-full flex items-center justify-center text-stackmatch-blue text-2xl font-bold'
                          fallback.textContent = company.companyName.charAt(0)
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  </div>
                  {/* Tier Badge */}
                  <Badge className={`absolute -top-2 -right-2 ${getTierColor(company.tier)} text-white text-xs font-semibold px-2 py-1`}>
                    {company.tier}
                  </Badge>
                </div>
                
                {/* Company Info */}
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl lg:text-5xl font-bold">{company.companyName}</h1>
                    {company.isVerified && (
                      <CheckCircle className="w-8 h-8 text-stackmatch-blue bg-white rounded-full p-1" />
                    )}
                  </div>
                  
                  <p className="text-xl text-white/90 mb-4 font-medium">
                    {company.tagline}
                  </p>
                  
                  {/* Key Stats */}
                  <div className="flex flex-wrap gap-6 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{company.industry}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Ideal: {company.idealCustomerSize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Founded {company.foundedYear}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{company.headquarters}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{company.website}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Action Buttons */}
              <div className="lg:ml-auto flex flex-col sm:flex-row gap-3 lg:mb-4">
                <Button 
                  size="lg" 
                  className="bg-trust-green hover:bg-green-600 text-white font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Request Quote
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/90 hover:bg-white text-stackmatch-navy border-2 border-white font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}