'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Phone, 
  Mail,
  Award,
  TrendingUp,
  Shield,
  DollarSign
} from 'lucide-react'

interface CompanyInfoData {
  companyName: string
  description: string
  headquarters: string
  foundedYear: number
  employeeCount: string
  revenue: string
  website: string
  phone: string
  email: string
  offices: string[]
  industries: string[]
  technologies: string[]
  certifications: string[]
  awards: {
    title: string
    year: number
    organization: string
  }[]
  financials: {
    revenue: string
    growth: string
    funding: string
    valuation: string
  }
  leadership: {
    name: string
    title: string
    tenure: string
  }[]
}

interface CompanyInfoProps {
  companyId: string
}

export function CompanyInfo({ companyId }: CompanyInfoProps) {
  const [data, setData] = useState<CompanyInfoData | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock company info data
  const mockData: Record<string, CompanyInfoData> = {
    'salesforce': {
      companyName: 'Salesforce',
      description: 'Salesforce is the global leader in Customer Relationship Management (CRM), bringing companies and customers together in the digital age. Founded in 1999, Salesforce enables companies of every size and industry to take advantage of powerful technologies—cloud, mobile, social, internet of things, artificial intelligence, voice and blockchain—to create a 360° view of their customers.',
      headquarters: 'San Francisco, California, USA',
      foundedYear: 1999,
      employeeCount: '70,000+',
      revenue: '$31.35B (2024)',
      website: 'https://salesforce.com',
      phone: '+1 (800) 667-6389',
      email: 'info@salesforce.com',
      offices: [
        'San Francisco, CA (HQ)',
        'Indianapolis, IN',
        'Atlanta, GA',
        'Chicago, IL',
        'New York, NY',
        'London, UK',
        'Tokyo, Japan',
        'Sydney, Australia'
      ],
      industries: [
        'Enterprise Software',
        'Cloud Computing',
        'Customer Relationship Management',
        'Sales Automation',
        'Marketing Automation',
        'Analytics'
      ],
      technologies: [
        'Apex',
        'Lightning Platform',
        'Einstein AI',
        'Heroku',
        'MuleSoft',
        'Tableau',
        'Slack'
      ],
      certifications: [
        'SOC 2 Type II',
        'ISO 27001',
        'ISO 27018',
        'ISO 27017',
        'GDPR Compliant',
        'HIPAA Ready',
        'FedRAMP Authorized',
        'PCI DSS Level 1'
      ],
      awards: [
        {
          title: 'Fortune\'s World\'s Most Admired Companies',
          year: 2024,
          organization: 'Fortune Magazine'
        },
        {
          title: 'Best Companies to Work For',
          year: 2024,
          organization: 'Fortune Magazine'
        },
        {
          title: 'Leader in CRM Customer Engagement',
          year: 2024,
          organization: 'Gartner Magic Quadrant'
        }
      ],
      financials: {
        revenue: '$31.35B',
        growth: '+11% YoY',
        funding: 'Public (NYSE: CRM)',
        valuation: '$220B Market Cap'
      },
      leadership: [
        {
          name: 'Marc Benioff',
          title: 'Chairman & CEO',
          tenure: '25 years'
        },
        {
          name: 'Amy Weaver',
          title: 'President & CFO',
          tenure: '8 years'
        },
        {
          name: 'Brian Millham',
          title: 'President & COO',
          tenure: '12 years'
        }
      ]
    },
    'microsoft': {
      companyName: 'Microsoft',
      description: 'Microsoft Corporation is an American multinational technology corporation headquartered in Redmond, Washington. Microsoft\'s best-known software products are the Windows line of operating systems, the Microsoft Office suite, and the Internet Explorer and Edge web browsers.',
      headquarters: 'Redmond, Washington, USA',
      foundedYear: 1975,
      employeeCount: '220,000+',
      revenue: '$211.9B (2023)',
      website: 'https://microsoft.com',
      phone: '+1 (425) 882-8080',
      email: 'info@microsoft.com',
      offices: [
        'Redmond, WA (HQ)',
        'Mountain View, CA',
        'New York, NY',
        'Austin, TX',
        'Dublin, Ireland',
        'Bangalore, India',
        'Shanghai, China'
      ],
      industries: [
        'Cloud Computing',
        'Productivity Software',
        'Operating Systems',
        'Business Applications',
        'Gaming',
        'AI & Machine Learning'
      ],
      technologies: [
        'Azure',
        '.NET',
        'TypeScript',
        'PowerShell',
        'Visual Studio',
        'Microsoft 365',
        'Teams'
      ],
      certifications: [
        'SOC 1, 2, 3',
        'ISO 27001',
        'ISO 27018',
        'FedRAMP High',
        'GDPR Compliant',
        'HITRUST CSF',
        'PCI DSS'
      ],
      awards: [
        {
          title: 'Leader in Cloud Infrastructure',
          year: 2024,
          organization: 'Gartner Magic Quadrant'
        },
        {
          title: 'Most Valuable Brand',
          year: 2024,
          organization: 'Interbrand'
        }
      ],
      financials: {
        revenue: '$211.9B',
        growth: '+7% YoY',
        funding: 'Public (NASDAQ: MSFT)',
        valuation: '$2.8T Market Cap'
      },
      leadership: [
        {
          name: 'Satya Nadella',
          title: 'Chairman & CEO',
          tenure: '10 years'
        },
        {
          name: 'Amy Hood',
          title: 'CFO',
          tenure: '11 years'
        }
      ]
    }
  }

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/companies/${companyId}/info`)
        if (response.ok) {
          const apiData = await response.json()
          setData(apiData)
        } else {
          // Fallback to mock data
          const mock = mockData[companyId] || mockData['salesforce']
          setData(mock)
        }
      } catch (error) {
        console.error('Error fetching company info:', error)
        // Fallback to mock data
        const mock = mockData[companyId] || mockData['salesforce']
        setData(mock)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyInfo()
  }, [companyId])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Company Overview */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6 text-stackmatch-blue" />
            <h2 className="text-2xl font-bold text-stackmatch-navy">Company Overview</h2>
          </div>
          <p className="text-charcoal leading-relaxed mb-6">{data.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-stackmatch-blue" />
              <div>
                <div className="text-sm text-medium-gray">Headquarters</div>
                <div className="font-semibold text-stackmatch-navy">{data.headquarters}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-stackmatch-blue" />
              <div>
                <div className="text-sm text-medium-gray">Founded</div>
                <div className="font-semibold text-stackmatch-navy">{data.foundedYear}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-stackmatch-blue" />
              <div>
                <div className="text-sm text-medium-gray">Employees</div>
                <div className="font-semibold text-stackmatch-navy">{data.employeeCount}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-stackmatch-blue" />
              <div>
                <div className="text-sm text-medium-gray">Revenue</div>
                <div className="font-semibold text-stackmatch-navy">{data.revenue}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-6 h-6 text-stackmatch-blue" />
            <h3 className="text-xl font-bold text-stackmatch-navy">Contact Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-trust-green" />
              <div>
                <div className="text-sm text-medium-gray">Website</div>
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-stackmatch-blue hover:underline">
                  {data.website.replace('https://', '')}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-trust-green" />
              <div>
                <div className="text-sm text-medium-gray">Phone</div>
                <div className="font-semibold text-stackmatch-navy">{data.phone}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-trust-green" />
              <div>
                <div className="text-sm text-medium-gray">Email</div>
                <div className="font-semibold text-stackmatch-navy">{data.email}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Offices */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-stackmatch-blue" />
            <h3 className="text-xl font-bold text-stackmatch-navy">Global Offices</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.offices.map((office, index) => (
              <Badge key={index} variant="outline" className="justify-start p-3 border-slate-300">
                <MapPin className="w-3 h-3 mr-2 text-stackmatch-blue" />
                {office}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technologies & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-stackmatch-blue" />
              <h3 className="text-xl font-bold text-stackmatch-navy">Certifications</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {data.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="justify-start p-3 border-trust-green/30 text-trust-green">
                  <Shield className="w-3 h-3 mr-2" />
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-stackmatch-blue" />
              <h3 className="text-xl font-bold text-stackmatch-navy">Recent Awards</h3>
            </div>
            
            <div className="space-y-3">
              {data.awards.map((award, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-semibold text-stackmatch-navy">{award.title}</div>
                  <div className="text-sm text-medium-gray">{award.organization} • {award.year}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-stackmatch-blue" />
            <h3 className="text-xl font-bold text-stackmatch-navy">Financial Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-trust-green">{data.financials.revenue}</div>
              <div className="text-sm text-medium-gray">Annual Revenue</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-stackmatch-blue">{data.financials.growth}</div>
              <div className="text-sm text-medium-gray">Revenue Growth</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-attention-orange">{data.financials.valuation}</div>
              <div className="text-sm text-medium-gray">Market Valuation</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-sm font-bold text-stackmatch-navy">{data.financials.funding}</div>
              <div className="text-sm text-medium-gray">Funding Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}