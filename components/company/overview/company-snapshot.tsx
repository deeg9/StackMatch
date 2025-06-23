'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Globe, Trophy, Shield, Zap } from 'lucide-react'

interface CompanySnapshotData {
  companyName: string
  aboutUs: string
  keyStrengths: string[]
  certifications: string[]
  globalPresence: string
  specializations: string[]
}

interface CompanySnapshotProps {
  companyId: string
}

export function CompanySnapshot({ companyId }: CompanySnapshotProps) {
  const [data, setData] = useState<CompanySnapshotData | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for different companies
  const mockData: Record<string, CompanySnapshotData> = {
    'salesforce': {
      companyName: 'Salesforce',
      aboutUs: 'Salesforce is the global leader in Customer Relationship Management (CRM), bringing companies and customers together in the digital age. We empower companies to connect with their customers in a whole new way through our integrated CRM platform that gives all departments — including marketing, sales, commerce, and service — a single, shared view of every customer.',
      keyStrengths: ['#1 CRM Platform Globally', 'AI-Powered Einstein Analytics', 'Extensive AppExchange Ecosystem', 'Industry-Leading Innovation'],
      certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant', 'HIPAA Ready', 'FedRAMP Authorized'],
      globalPresence: '150+ countries with 24/7 multilingual support',
      specializations: ['Sales Automation', 'Marketing Cloud', 'Customer Service', 'E-commerce', 'Analytics']
    },
    'microsoft': {
      companyName: 'Microsoft',
      aboutUs: 'Microsoft empowers every person and every organization on the planet to achieve more. Our mission is to enable digital transformation for the era of an intelligent cloud and an intelligent edge. We strive to create local opportunity, growth, and impact in every country around the world.',
      keyStrengths: ['Cloud Computing Leader', 'AI & Machine Learning', 'Enterprise Security', 'Productivity Solutions'],
      certifications: ['SOC 1, 2, 3', 'ISO 27001', 'FedRAMP High', 'GDPR Compliant', 'HITRUST CSF'],
      globalPresence: '190+ countries with comprehensive local support',
      specializations: ['Cloud Infrastructure', 'Productivity Software', 'Business Applications', 'AI Solutions', 'Security']
    },
    'oracle': {
      companyName: 'Oracle',
      aboutUs: 'Oracle offers integrated suites of applications plus secure, autonomous infrastructure in the Oracle Cloud. For more than 40 years, Oracle has provided customers with high-performance, integrated and secure information solutions. Today, Oracle is the world\'s leading database company.',
      keyStrengths: ['Database Technology Leader', 'Autonomous Cloud Infrastructure', 'Integrated Applications', 'Enterprise Security'],
      certifications: ['SOC 1, 2, 3', 'ISO 27001', 'FedRAMP Authorized', 'GDPR Compliant', 'PCI DSS'],
      globalPresence: '175+ countries with local data centers and support',
      specializations: ['Database Management', 'Cloud Infrastructure', 'Enterprise Applications', 'Analytics', 'Security']
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Try API call first
        const response = await fetch(`/api/companies/${companyId}/snapshot`)
        if (response.ok) {
          const apiData = await response.json()
          setData(apiData)
        } else {
          // Fallback to mock data
          const mock = mockData[companyId] || mockData['salesforce']
          setData(mock)
        }
      } catch (error) {
        console.error('Error fetching company snapshot:', error)
        // Fallback to mock data
        const mock = mockData[companyId] || mockData['salesforce']
        setData(mock)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [companyId])

  if (loading || !data) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 bg-slate-200 rounded w-24"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-slate-200 rounded"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-6 h-6 text-stackmatch-blue" />
          <h2 className="text-2xl font-bold text-stackmatch-navy">Company Snapshot</h2>
        </div>
        
        {/* About Us */}
        <div className="mb-8">
          <p className="text-charcoal leading-relaxed text-base">
            {data.aboutUs}
          </p>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Strengths */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-trust-green" />
              <h3 className="font-semibold text-stackmatch-navy">Key Strengths</h3>
            </div>
            <div className="space-y-2">
              {data.keyStrengths.map((strength, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="block w-full justify-start p-2 text-left border-trust-green/30 text-trust-green hover:bg-trust-green/10"
                >
                  <Trophy className="w-3 h-3 mr-2 flex-shrink-0" />
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-stackmatch-blue" />
              <h3 className="font-semibold text-stackmatch-navy">Certifications</h3>
            </div>
            <div className="space-y-2">
              {data.certifications.map((cert, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="block w-full justify-start p-2 text-left border-stackmatch-blue/30 text-stackmatch-blue hover:bg-stackmatch-blue/10"
                >
                  <Shield className="w-3 h-3 mr-2 flex-shrink-0" />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          {/* Specializations & Global Presence */}
          <div className="space-y-6">
            {/* Global Presence */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-attention-orange" />
                <h3 className="font-semibold text-stackmatch-navy">Global Presence</h3>
              </div>
              <Badge 
                variant="outline"
                className="block w-full justify-start p-2 text-left border-attention-orange/30 text-attention-orange hover:bg-attention-orange/10"
              >
                <Globe className="w-3 h-3 mr-2 flex-shrink-0" />
                {data.globalPresence}
              </Badge>
            </div>

            {/* Top Specializations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-medium-gray" />
                <h3 className="font-semibold text-stackmatch-navy">Specializations</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.specializations.slice(0, 3).map((spec, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="text-xs bg-slate-100 text-charcoal"
                  >
                    {spec}
                  </Badge>
                ))}
                {data.specializations.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-medium-gray">
                    +{data.specializations.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}