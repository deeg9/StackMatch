'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Users,
  Award,
  Shield,
  CheckCircle
} from 'lucide-react'

interface ProposalVendorInfoProps {
  vendor: any
}

export function ProposalVendorInfo({ vendor }: ProposalVendorInfoProps) {
  // Mock additional vendor data - in real app would come from API
  const vendorDetails = {
    website: 'www.crmexperts.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    founded: '2010',
    teamSize: '50-100',
    industries: ['Technology', 'Healthcare', 'Finance', 'Retail'],
    certifications: [
      'ISO 27001 Certified',
      'SOC 2 Type II',
      'GDPR Compliant',
      'Microsoft Gold Partner'
    ],
    keyClients: [
      'Fortune 500 Tech Company',
      'Leading Healthcare Provider',
      'Global Financial Institution'
    ]
  }

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-stackmatch-navy">
            <Building2 className="h-5 w-5 text-stackmatch-blue" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-2xl font-bold text-stackmatch-navy mb-2">
                {vendor.company_name || 'Unknown Company'}
              </h3>
              <p className="text-medium-gray mb-4">
                Leading provider of enterprise CRM solutions with over 10 years of experience 
                delivering transformative technology solutions.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-stackmatch-blue" />
                  <a href={`https://${vendorDetails.website}`} className="text-stackmatch-blue hover:underline">
                    {vendorDetails.website}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-stackmatch-blue" />
                  <span className="text-charcoal">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-stackmatch-blue" />
                  <span className="text-charcoal">{vendorDetails.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-stackmatch-blue" />
                  <span className="text-charcoal">{vendorDetails.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Calendar className="h-6 w-6 text-stackmatch-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-charcoal">{vendorDetails.founded}</p>
                <p className="text-sm text-medium-gray">Founded</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Users className="h-6 w-6 text-trust-green mx-auto mb-2" />
                <p className="text-2xl font-bold text-charcoal">{vendorDetails.teamSize}</p>
                <p className="text-sm text-medium-gray">Team Size</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Award className="h-6 w-6 text-attention-orange mx-auto mb-2" />
                <p className="text-2xl font-bold text-charcoal">127</p>
                <p className="text-sm text-medium-gray">Projects</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Shield className="h-6 w-6 text-information-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-charcoal">95%</p>
                <p className="text-sm text-medium-gray">Success Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industries & Expertise */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-stackmatch-navy">
            Industries & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {vendorDetails.industries.map((industry) => (
              <Badge 
                key={industry}
                variant="outline"
                className="bg-stackmatch-blue/10 text-stackmatch-blue border-stackmatch-blue"
              >
                {industry}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications & Compliance */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-stackmatch-navy">
            Certifications & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vendorDetails.certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-trust-green" />
                <span className="text-charcoal">{cert}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Clients */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-stackmatch-navy">
            Notable Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vendorDetails.keyClients.map((client, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Building2 className="h-5 w-5 text-stackmatch-blue" />
                <span className="text-charcoal font-medium">{client}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-medium-gray mt-4">
            * Client names anonymized for confidentiality
          </p>
        </CardContent>
      </Card>
    </div>
  )
}