'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  ExternalLink,
  Award
} from 'lucide-react'

interface CaseStudy {
  id: string
  title: string
  clientName: string
  clientIndustry: string
  clientSize: string
  summary: string
  keyResults: {
    metric: string
    improvement: string
    icon: any
    color: string
  }[]
  readTime: string
  featured: boolean
}

interface FeaturedCaseStudiesProps {
  companyId: string
}

export function FeaturedCaseStudies({ companyId }: FeaturedCaseStudiesProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)

  // Mock case studies data
  const mockCaseStudies: Record<string, CaseStudy[]> = {
    'salesforce': [
      {
        id: '1',
        title: 'Global Retailer Increases Sales Productivity by 40%',
        clientName: 'Fortune 500 Retailer',
        clientIndustry: 'Retail & E-commerce',
        clientSize: '50,000+ employees',
        summary: 'A leading global retailer transformed their sales operations with Salesforce Sales Cloud, resulting in significantly improved sales productivity and customer engagement across all channels.',
        keyResults: [
          { metric: 'Sales Productivity', improvement: '+40%', icon: TrendingUp, color: 'text-trust-green' },
          { metric: 'Revenue Growth', improvement: '+$50M', icon: DollarSign, color: 'text-trust-green' },
          { metric: 'Customer Satisfaction', improvement: '+25%', icon: Star, color: 'text-yellow-500' }
        ],
        readTime: '5 min read',
        featured: true
      },
      {
        id: '2',
        title: 'Healthcare Provider Streamlines Patient Experience',
        clientName: 'Regional Healthcare System',
        clientIndustry: 'Healthcare',
        clientSize: '15,000+ employees',
        summary: 'Implemented Salesforce Health Cloud to create a unified patient experience platform, improving care coordination and patient satisfaction scores.',
        keyResults: [
          { metric: 'Patient Satisfaction', improvement: '+35%', icon: Star, color: 'text-trust-green' },
          { metric: 'Care Coordination', improvement: '+60%', icon: Users, color: 'text-stackmatch-blue' },
          { metric: 'Process Efficiency', improvement: '+45%', icon: Clock, color: 'text-attention-orange' }
        ],
        readTime: '4 min read',
        featured: true
      },
      {
        id: '3',
        title: 'Financial Services Firm Digitizes Customer Onboarding',
        clientName: 'Mid-Market Bank',
        clientIndustry: 'Financial Services',
        clientSize: '5,000+ employees',
        summary: 'Leveraged Salesforce Financial Services Cloud to completely digitize their customer onboarding process, reducing time-to-value and improving compliance.',
        keyResults: [
          { metric: 'Onboarding Time', improvement: '-70%', icon: Clock, color: 'text-trust-green' },
          { metric: 'Compliance Score', improvement: '+90%', icon: Award, color: 'text-stackmatch-blue' },
          { metric: 'Customer Acquisition', improvement: '+30%', icon: Users, color: 'text-attention-orange' }
        ],
        readTime: '6 min read',
        featured: true
      }
    ],
    'microsoft': [
      {
        id: '1',
        title: 'Enterprise Manufacturer Modernizes with Microsoft 365',
        clientName: 'Global Manufacturing Corp',
        clientIndustry: 'Manufacturing',
        clientSize: '75,000+ employees',
        summary: 'Complete digital transformation using Microsoft 365 and Teams, enabling remote collaboration and improving operational efficiency across global facilities.',
        keyResults: [
          { metric: 'Collaboration Efficiency', improvement: '+50%', icon: Users, color: 'text-trust-green' },
          { metric: 'IT Cost Reduction', improvement: '-30%', icon: DollarSign, color: 'text-trust-green' },
          { metric: 'Security Posture', improvement: '+85%', icon: Award, color: 'text-stackmatch-blue' }
        ],
        readTime: '5 min read',
        featured: true
      },
      {
        id: '2',
        title: 'Educational Institution Enables Hybrid Learning',
        clientName: 'Major University System',
        clientIndustry: 'Education',
        clientSize: '25,000+ students',
        summary: 'Implemented comprehensive Microsoft education suite to enable seamless hybrid learning experiences for students and faculty worldwide.',
        keyResults: [
          { metric: 'Student Engagement', improvement: '+40%', icon: Star, color: 'text-trust-green' },
          { metric: 'Faculty Productivity', improvement: '+35%', icon: TrendingUp, color: 'text-stackmatch-blue' },
          { metric: 'Platform Adoption', improvement: '95%', icon: Users, color: 'text-attention-orange' }
        ],
        readTime: '4 min read',
        featured: true
      }
    ],
    'oracle': [
      {
        id: '1',
        title: 'Telecommunications Giant Modernizes with Autonomous Database',
        clientName: 'Global Telecom Leader',
        clientIndustry: 'Telecommunications',
        clientSize: '100,000+ employees',
        summary: 'Migrated critical applications to Oracle Autonomous Database, achieving unprecedented performance and reducing operational overhead.',
        keyResults: [
          { metric: 'Database Performance', improvement: '+300%', icon: TrendingUp, color: 'text-trust-green' },
          { metric: 'Operational Costs', improvement: '-40%', icon: DollarSign, color: 'text-trust-green' },
          { metric: 'System Availability', improvement: '99.99%', icon: Award, color: 'text-stackmatch-blue' }
        ],
        readTime: '6 min read',
        featured: true
      }
    ]
  }

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true)
      try {
        // Try API call first
        const response = await fetch(`/api/companies/${companyId}/case-studies?featured=true`)
        if (response.ok) {
          const data = await response.json()
          setCaseStudies(data.caseStudies)
        } else {
          // Fallback to mock data
          const mock = mockCaseStudies[companyId] || mockCaseStudies['salesforce']
          setCaseStudies(mock)
        }
      } catch (error) {
        console.error('Error fetching case studies:', error)
        // Fallback to mock data
        const mock = mockCaseStudies[companyId] || mockCaseStudies['salesforce']
        setCaseStudies(mock)
      } finally {
        setLoading(false)
      }
    }

    fetchCaseStudies()
  }, [companyId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-slate-200 rounded"></div>
                    <div className="h-8 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-stackmatch-blue" />
          <h2 className="text-2xl font-bold text-stackmatch-navy">Featured Case Studies</h2>
        </div>
        <Button variant="outline" className="border-stackmatch-blue text-stackmatch-blue hover:bg-stackmatch-blue hover:text-white">
          View All Case Studies
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((study) => (
          <Card key={study.id} className="border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-stackmatch-blue/10 text-stackmatch-blue text-xs">
                    {study.clientIndustry}
                  </Badge>
                  <h3 className="font-bold text-stackmatch-navy leading-tight group-hover:text-stackmatch-blue transition-colors">
                    {study.title}
                  </h3>
                  <div className="text-sm text-medium-gray">
                    {study.clientName} • {study.clientSize}
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm text-charcoal leading-relaxed line-clamp-3">
                  {study.summary}
                </p>

                {/* Key Results */}
                <div className="grid grid-cols-2 gap-2">
                  {study.keyResults.slice(0, 2).map((result, index) => {
                    const IconComponent = result.icon
                    return (
                      <div key={index} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className={`w-4 h-4 ${result.color}`} />
                          <span className="text-xs text-medium-gray">{result.metric}</span>
                        </div>
                        <div className={`font-bold text-sm ${result.color}`}>
                          {result.improvement}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-medium-gray">{study.readTime}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-stackmatch-blue hover:text-stackmatch-navy hover:bg-stackmatch-blue/10 p-0 h-auto"
                  >
                    Read More
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}