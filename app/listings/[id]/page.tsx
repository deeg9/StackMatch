'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { ListingDetailHeader } from '@/components/listings/listing-detail-header'
import { ListingDetailSidebar } from '@/components/listings/listing-detail-sidebar'
import { ListingDetailTabs } from '@/components/listings/listing-detail-tabs'
import { ListingDetailStats } from '@/components/listings/listing-detail-stats'
import { createClient } from '@/lib/supabase/client'

// Comprehensive mock RFQ data for UI/UX design
const mockRfqData = {
  // Core listing information
  id: 'RFQ-2025-001',
  title: 'HR Management System Upgrade',
  status: 'ACTIVE',
  category: 'HRIS Software',
  created_at: '2025-01-05T10:00:00Z',
  bid_deadline: '2025-01-20T23:59:59Z',
  view_count: 127,
  proposals_count: 6,
  
  // Buyer information
  buyer: {
    id: 'buyer-001',
    full_name: 'Christopher Fill',
    company_name: 'TechCorp Industries',
    avatar_url: '/avatars/christopher-fill.jpg'
  },
  
  // 1. Project Overview & Business Context
  projectOverview: {
    projectTitle: 'HR Management System Upgrade',
    primaryChallenges: 'Our current HR system is outdated and unable to scale with our rapid growth. Manual processes are causing delays in onboarding, performance reviews are inconsistent, and we lack real-time analytics for workforce planning.',
    desiredOutcomes: 'Implement a modern, cloud-based HRIS that automates key HR processes, provides self-service capabilities for employees, enables data-driven decision making, and integrates seamlessly with our existing tech stack.',
    timelineExpectation: 'We aim to have the new system fully operational by Q2 2025, with phased rollout starting in April.'
  },
  
  // 2. Core Requirements
  coreRequirements: {
    employeeCount: '2,500-3,000 employees',
    features: [
      'Employee Self-Service Portal',
      'Automated Onboarding/Offboarding',
      'Performance Management Module',
      'Learning Management System (LMS)',
      'Time & Attendance Tracking',
      'Benefits Administration',
      'Compensation Planning Tools',
      'Advanced Analytics & Reporting',
      'Mobile App for iOS/Android',
      'Document Management'
    ],
    integrations: [
      'ADP Payroll System',
      'Slack for notifications',
      'Microsoft Active Directory',
      'Salesforce CRM',
      'Tableau for advanced analytics'
    ],
    complianceNeeds: [
      'SOC 2 Type II Certified',
      'GDPR Compliant',
      'EEO Reporting',
      'ACA Compliance Tools'
    ]
  },
  
  // 3. Technical Specifications
  technicalSpecs: {
    deployment: 'Cloud-based (SaaS preferred), with option for hybrid deployment',
    scalability: 'Must handle 5,000+ employees within 2 years',
    security: [
      'Multi-factor authentication',
      'Role-based access control',
      'Data encryption at rest and in transit',
      'Regular security audits',
      'SAML 2.0 SSO support'
    ],
    dataRequirements: 'Real-time sync capabilities, API-first architecture, ability to handle 5+ years of historical data migration'
  },
  
  // 4. Budget & Timeline
  budgetTimeline: {
    budgetRange: '$150,000 - $250,000 (Year 1 Total Cost)',
    budgetBreakdown: {
      implementation: '$50,000 - $75,000',
      annualLicense: '$75,000 - $125,000',
      training: '$15,000 - $25,000',
      contingency: '$10,000 - $25,000'
    },
    targetGoLive: 'April 15, 2025',
    phases: [
      { phase: 'Discovery & Planning', duration: '3 weeks', startDate: 'Feb 1, 2025' },
      { phase: 'Data Migration', duration: '4 weeks', startDate: 'Feb 22, 2025' },
      { phase: 'Configuration & Testing', duration: '3 weeks', startDate: 'Mar 22, 2025' },
      { phase: 'Training & Go-Live', duration: '2 weeks', startDate: 'Apr 12, 2025' }
    ],
    internalResources: [
      'Project Manager (50% allocation)',
      'HR Team Lead (75% allocation)',
      'IT Security Analyst (25% allocation)',
      '2 HR Specialists for testing (40% allocation)'
    ]
  },
  
  // 5. Organizational & Operational Details
  organizationalDetails: {
    subsidiaries: '3 subsidiaries across North America',
    locations: 'Headquarters in San Francisco, offices in New York, Chicago, Toronto',
    geographicScope: ['United States', 'Canada'],
    departments: '12 departments including Engineering, Sales, Marketing, Operations',
    currentSystems: 'Legacy on-premise HR system (10+ years old), Excel-based performance tracking',
    businessProcesses: [
      'Quarterly performance reviews',
      'Annual compensation cycles',
      'Weekly new hire onboarding',
      'Monthly compliance reporting'
    ]
  },
  
  // 6. Business Context
  businessContext: {
    industry: 'Technology / Software Development',
    companySize: 'Mid-Market ($250M revenue)',
    growthRate: '35% YoY employee growth',
    currentPain: 'Manual processes causing 20+ hour delays in onboarding, 15% of performance reviews missed deadlines, lack of workforce analytics',
    expectedOutcomes: '50% reduction in onboarding time, 100% on-time performance reviews, real-time workforce analytics dashboard',
    successMetrics: [
      'Time to productivity for new hires reduced by 40%',
      'HR team efficiency improved by 60%',
      'Employee satisfaction with HR services increased to 90%+',
      'Zero compliance violations in first year'
    ]
  },
  
  // 7. Key Stakeholders
  keyStakeholders: [
    { name: 'Sarah Chen', role: 'CHRO', involvement: 'Executive Sponsor' },
    { name: 'Michael Rodriguez', role: 'CTO', involvement: 'Technical Approval' },
    { name: 'Jennifer Smith', role: 'VP of HR Operations', involvement: 'Project Lead' },
    { name: 'David Kim', role: 'IT Director', involvement: 'Technical Implementation' }
  ],
  
  // 8. Additional Requirements & Evaluation
  additionalRequirements: {
    openEndedQuestions: [
      'Describe your implementation methodology and typical timeline',
      'How do you handle data migration from legacy systems?',
      'What ongoing support and training do you provide?',
      'Share 2-3 case studies of similar implementations'
    ],
    evaluationCriteria: [
      { criteria: 'Functional Fit', weight: '30%' },
      { criteria: 'Total Cost of Ownership', weight: '25%' },
      { criteria: 'Implementation Timeline', weight: '20%' },
      { criteria: 'Vendor Experience & References', weight: '15%' },
      { criteria: 'Technical Architecture & Security', weight: '10%' }
    ],
    requiredProposalSections: [
      'Executive Summary',
      'Detailed Solution Overview',
      'Implementation Plan & Timeline',
      'Pricing Breakdown',
      'References & Case Studies',
      'Support & Training Plan'
    ]
  },
  
  // Activity & Q&A Data
  activity: [
    { id: '1', type: 'created', timestamp: '2025-01-05T10:00:00Z', user: 'Christopher Fill', description: 'RFQ created and published' },
    { id: '2', type: 'edited', timestamp: '2025-01-06T14:30:00Z', user: 'Christopher Fill', description: 'Updated budget range and timeline' },
    { id: '3', type: 'question', timestamp: '2025-01-07T09:15:00Z', user: 'Salesforce Rep', description: 'Asked about integration requirements' },
    { id: '4', type: 'answer', timestamp: '2025-01-07T11:00:00Z', user: 'Christopher Fill', description: 'Responded to integration question' },
    { id: '5', type: 'proposal', timestamp: '2025-01-08T16:00:00Z', user: 'Workday', description: 'Submitted proposal' }
  ],
  
  qa: [
    {
      id: 'q1',
      question: 'Are you open to best-of-breed solutions that integrate multiple specialized tools?',
      askedBy: 'BambooHR',
      timestamp: '2025-01-07T09:15:00Z',
      answer: 'We prefer an all-in-one solution but are open to reviewing best-of-breed approaches if they provide superior functionality and seamless integration.',
      answeredBy: 'Christopher Fill',
      answerTimestamp: '2025-01-07T11:00:00Z'
    },
    {
      id: 'q2',
      question: 'Is there flexibility in the go-live date if we can demonstrate additional value?',
      askedBy: 'Workday',
      timestamp: '2025-01-08T10:30:00Z',
      answer: 'We have some flexibility (up to 30 days) if the delay provides significant additional value. Please outline this in your proposal.',
      answeredBy: 'Jennifer Smith',
      answerTimestamp: '2025-01-08T14:15:00Z'
    }
  ],
  
  // Mock proposals for buyer view
  proposals: [
    {
      id: 'prop-001',
      seller_id: 'seller-001',
      status: 'UNDER_REVIEW',
      proposed_budget: 225000,
      profiles: {
        full_name: 'Workday Sales Team',
        company_name: 'Workday',
        avatar_url: '/logos/workday.png'
      }
    },
    {
      id: 'prop-002',
      seller_id: 'seller-002',
      status: 'NEW',
      proposed_budget: 195000,
      profiles: {
        full_name: 'BambooHR Team',
        company_name: 'BambooHR',
        avatar_url: '/logos/bamboohr.png'
      }
    }
  ]
}

interface ListingDetail {
  id: string
  title: string
  status: string
  category: string
  budget_min?: number | null
  budget_max?: number | null
  created_at: string | null
  bid_deadline: string | null
  project_duration?: string | null
  location_preference?: string | null
  remote_preference?: string | null
  description?: string | null
  about_company?: string | null
  about_business?: string | null
  success_metrics?: any
  current_challenges?: any
  timeline_phases?: any
  required_skills?: string[] | null
  tags?: string[] | null
  view_count: number | null
  buyer: {
    id: string
    full_name: string | null
    company_name: string | null
    avatar_url: string | null
  }
  proposals_count: number
  proposals?: any[]
  // Extended fields for RFQ Command Center
  projectOverview?: any
  coreRequirements?: any
  technicalSpecs?: any
  budgetTimeline?: any
  organizationalDetails?: any
  businessContext?: any
  keyStakeholders?: any[]
  additionalRequirements?: any
  activity?: any[]
  qa?: any[]
}

export default function ListingDetailPage() {
  const params = useParams()
  const listingId = params.id as string
  const [activeTab, setActiveTab] = useState('summary')
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<'buyer' | 'seller' | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchListingAndUser = async () => {
      // MOCK DATA FOR UI/UX DESIGN - Comment out real fetch
      // const supabase = createClient()
      
      // Simulate user authentication
      // Set as buyer for demo - change to 'seller' to see seller view
      const mockUserId = 'buyer-001' // Change to 'seller-001' for seller view
      const mockUserType: 'buyer' | 'seller' = 'buyer' // Change to 'seller' for seller view
      
      setCurrentUserId(mockUserId)
      setUserType(mockUserType)
      
      // Simulate loading delay
      setTimeout(() => {
        // Use mock data instead of database fetch
        const transformedListing: ListingDetail = {
          ...mockRfqData,
          proposals: mockUserId === mockRfqData.buyer.id ? mockRfqData.proposals : undefined
        }
        
        setListing(transformedListing)
        setIsLoading(false)
      }, 500) // 500ms simulated loading
    }

    fetchListingAndUser()
  }, [listingId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <TickerBanner />
        <NavigationWrapper />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">Loading listing details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <TickerBanner />
        <NavigationWrapper />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Listing not found</p>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = currentUserId === listing.buyer.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ListingDetailHeader 
          listing={listing}
          isOwner={isOwner}
          userType={userType}
        />
        
        {/* Stats */}
        <ListingDetailStats listing={listing} />
        
        {/* Main Content */}
        <div className="flex gap-8 mt-8">
          {/* Tabs Content */}
          <div className="flex-1">
            <ListingDetailTabs
              listing={listing}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isOwner={isOwner}
              userType={userType}
            />
          </div>
          
          {/* Sidebar */}
          <div className="w-80 hidden xl:block">
            <ListingDetailSidebar 
              listing={listing}
              isOwner={isOwner}
              userType={userType}
            />
          </div>
        </div>
      </div>
    </div>
  )
}