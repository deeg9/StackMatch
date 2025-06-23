'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Award, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock 
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
    icon: string
    color: string
  }[]
  readTime: string
  publishDate: string
}

interface CaseStudiesGridProps {
  companyId: string
}

export function CaseStudiesGrid({ companyId }: CaseStudiesGridProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [filteredStudies, setFilteredStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')

  // Mock case studies data
  const mockCaseStudies: CaseStudy[] = [
    {
      id: '1',
      title: 'Global Retailer Increases Sales Productivity by 40%',
      clientName: 'Fortune 500 Retailer',
      clientIndustry: 'Retail & E-commerce',
      clientSize: '50,000+ employees',
      summary: 'A leading global retailer transformed their sales operations with comprehensive platform implementation, resulting in significantly improved sales productivity and customer engagement across all channels.',
      keyResults: [
        { metric: 'Sales Productivity', improvement: '+40%', icon: 'trending-up', color: 'text-trust-green' },
        { metric: 'Revenue Growth', improvement: '+$50M', icon: 'dollar-sign', color: 'text-trust-green' },
        { metric: 'Customer Satisfaction', improvement: '+25%', icon: 'users', color: 'text-stackmatch-blue' }
      ],
      readTime: '5 min read',
      publishDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Healthcare Provider Streamlines Patient Experience',
      clientName: 'Regional Healthcare System',
      clientIndustry: 'Healthcare',
      clientSize: '15,000+ employees',
      summary: 'Implemented comprehensive healthcare platform to create a unified patient experience, improving care coordination and patient satisfaction scores across multiple facilities.',
      keyResults: [
        { metric: 'Patient Satisfaction', improvement: '+35%', icon: 'users', color: 'text-trust-green' },
        { metric: 'Care Coordination', improvement: '+60%', icon: 'trending-up', color: 'text-stackmatch-blue' },
        { metric: 'Process Efficiency', improvement: '+45%', icon: 'clock', color: 'text-attention-orange' }
      ],
      readTime: '4 min read',
      publishDate: '2024-01-08'
    },
    {
      id: '3',
      title: 'Financial Services Firm Digitizes Customer Onboarding',
      clientName: 'Mid-Market Bank',
      clientIndustry: 'Financial Services',
      clientSize: '5,000+ employees',
      summary: 'Leveraged advanced platform capabilities to completely digitize their customer onboarding process, reducing time-to-value and improving compliance across all service lines.',
      keyResults: [
        { metric: 'Onboarding Time', improvement: '-70%', icon: 'clock', color: 'text-trust-green' },
        { metric: 'Compliance Score', improvement: '+90%', icon: 'award', color: 'text-stackmatch-blue' },
        { metric: 'Customer Acquisition', improvement: '+30%', icon: 'users', color: 'text-attention-orange' }
      ],
      readTime: '6 min read',
      publishDate: '2023-12-20'
    },
    {
      id: '4',
      title: 'Manufacturing Company Modernizes Operations',
      clientName: 'Global Manufacturing Corp',
      clientIndustry: 'Manufacturing',
      clientSize: '75,000+ employees',
      summary: 'Complete digital transformation enabling remote collaboration and improving operational efficiency across global facilities and supply chain operations.',
      keyResults: [
        { metric: 'Operational Efficiency', improvement: '+50%', icon: 'trending-up', color: 'text-trust-green' },
        { metric: 'Cost Reduction', improvement: '-30%', icon: 'dollar-sign', color: 'text-trust-green' },
        { metric: 'Quality Score', improvement: '+85%', icon: 'award', color: 'text-stackmatch-blue' }
      ],
      readTime: '5 min read',
      publishDate: '2023-12-10'
    }
  ]

  const industries = [
    'Retail & E-commerce',
    'Healthcare',
    'Financial Services',
    'Manufacturing',
    'Technology',
    'Education',
    'Government',
    'Non-profit'
  ]

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/companies/${companyId}/case-studies`)
        if (response.ok) {
          const data = await response.json()
          setCaseStudies(data.caseStudies)
          setFilteredStudies(data.caseStudies)
        } else {
          // Fallback to mock data
          setCaseStudies(mockCaseStudies)
          setFilteredStudies(mockCaseStudies)
        }
      } catch (error) {
        console.error('Error fetching case studies:', error)
        // Fallback to mock data
        setCaseStudies(mockCaseStudies)
        setFilteredStudies(mockCaseStudies)
      } finally {
        setLoading(false)
      }
    }

    fetchCaseStudies()
  }, [companyId])

  // Filter case studies
  useEffect(() => {
    let filtered = caseStudies

    if (searchQuery) {
      filtered = filtered.filter(study =>
        study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.clientIndustry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(study => study.clientIndustry === selectedIndustry)
    }

    setFilteredStudies(filtered)
  }, [caseStudies, searchQuery, selectedIndustry])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending-up': return TrendingUp
      case 'dollar-sign': return DollarSign
      case 'users': return Users
      case 'clock': return Clock
      case 'award': return Award
      default: return TrendingUp
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-slate-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-5 h-5" />
            <Input
              type="text"
              placeholder="Search case studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base border-slate-200 focus:border-stackmatch-blue"
            />
          </div>
          <div className="lg:w-64">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="h-12 border-slate-200 focus:border-stackmatch-blue">
                <Filter className="w-4 h-4 mr-2 text-medium-gray" />
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 text-sm text-medium-gray">
          Showing <span className="font-semibold text-stackmatch-navy">{filteredStudies.length}</span> case studies
        </div>
      </div>

      {/* Case Studies Grid */}
      {filteredStudies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStudies.map((study) => (
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
                  <div className="grid grid-cols-3 gap-2">
                    {study.keyResults.map((result, index) => {
                      const IconComponent = getIcon(result.icon)
                      return (
                        <div key={index} className="bg-slate-50 rounded-lg p-3 text-center">
                          <IconComponent className={`w-4 h-4 mx-auto mb-1 ${result.color}`} />
                          <div className={`font-bold text-sm ${result.color}`}>
                            {result.improvement}
                          </div>
                          <div className="text-xs text-medium-gray">
                            {result.metric}
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
                      Read Full Case Study
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-medium-gray mx-auto mb-4" />
          <div className="text-medium-gray text-lg mb-2">No case studies found</div>
          <div className="text-sm text-medium-gray">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}