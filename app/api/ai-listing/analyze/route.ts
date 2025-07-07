import { NextRequest, NextResponse } from 'next/server'

interface AnalyzeRequest {
  companyWebsite?: string
  linkedinPage?: string
  uploadedFiles?: {
    name: string
    size: number
    type: string
  }[]
  categoryName: string
}

interface AIGeneratedRFQ {
  // NEW: Project Overview & Business Context
  projectOverview: {
    projectTitle: string
    primaryChallenges: string
    desiredOutcomes: string
    timelineExpectation: string
  }
  // NEW: Organizational & Operational Details
  organizationalDetails: {
    subsidiaries: string
    locations: string
    geographicScope: string[]
    departments: string
    currentSystems: string
    businessProcesses: string[]
  }
  // NEW: Budget & Timeline Expectations
  budgetTimeline: {
    budgetRange: string
    targetGoLive: string
    internalResources: string[]
  }
  // Existing sections
  coreRequirements: {
    employeeCount: string
    features: string[]
    integrations: string[]
    complianceNeeds: string[]
  }
  technicalSpecs: {
    deployment: string
    scalability: string
    security: string[]
    dataRequirements: string
  }
  // NEW: Additional Questions & Evaluation Criteria
  additionalQuestions: {
    openEndedQuestions: string
    evaluationCriteria: string[]
  }
  // Modified existing sections
  projectDetails: {
    timeline: string
    budget: {
      min: number
      max: number
    }
    priority: string
    successMetrics: string[]
  }
  businessContext: {
    industry: string
    currentPain: string
    expectedOutcomes: string
    stakeholders: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()
    
    // Simulate AI processing delay (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Generate AI-powered RFQ based on category
    const generatedRFQ = generateRFQForCategory(body.categoryName, body)
    
    return NextResponse.json({
      success: true,
      data: generatedRFQ,
      processingTime: 2500,
      confidence: 0.92
    })
    
  } catch (error) {
    console.error('Error analyzing AI listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze listing requirements' },
      { status: 500 }
    )
  }
}

function generateRFQForCategory(categoryName: string, inputData: AnalyzeRequest): AIGeneratedRFQ {
  // Base template that can be customized based on category
  const baseRFQ: AIGeneratedRFQ = {
    // NEW sections
    projectOverview: {
      projectTitle: `New ${categoryName} Implementation`,
      primaryChallenges: 'Manual processes are causing inefficiencies and errors. Limited visibility into operations. Compliance tracking is time-consuming and prone to mistakes.',
      desiredOutcomes: 'Automate key business processes. Improve data accuracy and reporting. Ensure compliance with industry regulations. Reduce operational costs.',
      timelineExpectation: '6-9 months'
    },
    organizationalDetails: {
      subsidiaries: '2-5',
      locations: '2-5',
      geographicScope: ['North America'],
      departments: '6-15',
      currentSystems: 'Mix of spreadsheets, legacy systems, and manual processes',
      businessProcesses: []
    },
    budgetTimeline: {
      budgetRange: '$100K-$250K',
      targetGoLive: 'Within 6 months',
      internalResources: ['Dedicated Project Manager', 'Subject Matter Experts (SMEs) from each relevant department']
    },
    // Existing sections
    coreRequirements: {
      employeeCount: '51-200',
      features: [],
      integrations: [],
      complianceNeeds: []
    },
    technicalSpecs: {
      deployment: 'cloud',
      scalability: 'Need to support growth from current team size to 300+ employees over next 2 years',
      security: [],
      dataRequirements: 'Secure data migration from existing systems with full backup and recovery capabilities'
    },
    // NEW section
    additionalQuestions: {
      openEndedQuestions: 'What is your approach to post-implementation support? How do you handle change management and user adoption? What makes your solution different from competitors?',
      evaluationCriteria: ['Feature Set & Functionality Match', 'Vendor Reputation & Experience', 'Implementation Methodology & Support', 'Overall Cost (Licensing + Implementation)']
    },
    // Modified existing sections
    projectDetails: {
      timeline: 'standard',
      budget: {
        min: 100000,
        max: 250000
      },
      priority: 'high',
      successMetrics: []
    },
    businessContext: {
      industry: 'Technology',
      currentPain: 'Manual processes causing inefficiencies and compliance risks',
      expectedOutcomes: 'Streamlined operations, improved compliance, and better employee experience',
      stakeholders: []
    }
  }

  // Customize based on category
  switch (categoryName.toLowerCase()) {
    case 'hr & payroll':
      return {
        ...baseRFQ,
        projectOverview: {
          ...baseRFQ.projectOverview,
          projectTitle: 'HR & Payroll System Modernization Initiative',
          primaryChallenges: 'Manual HR processes consume 40% of team\'s time. Payroll errors averaging 3-5% monthly. Multiple compliance violations in past year. No centralized employee data.',
          desiredOutcomes: 'Reduce HR administrative time by 50%. Achieve 99.9% payroll accuracy. Full compliance with federal and state regulations. Single source of truth for all employee data.',
          timelineExpectation: '6-9 months'
        },
        organizationalDetails: {
          ...baseRFQ.organizationalDetails,
          currentSystems: 'ADP for payroll (legacy version), Excel for time tracking, Paper files for employee records, QuickBooks for benefits',
          businessProcesses: [
            'Employee Onboarding Automation',
            'Benefit Enrollment Streamlining',
            'Time-off Request & Approval',
            'Performance Review Tracking',
            'Expense Report Processing',
            'Compliance Reporting'
          ]
        },
        budgetTimeline: {
          ...baseRFQ.budgetTimeline,
          budgetRange: '$100K-$250K',
          targetGoLive: 'Within 6 months',
          internalResources: [
            'Dedicated Project Manager',
            'Dedicated IT Support',
            'Subject Matter Experts (SMEs) from each relevant department',
            'Change Management Lead'
          ]
        },
        coreRequirements: {
          ...baseRFQ.coreRequirements,
          features: [
            'Employee Records Management',
            'Payroll Processing',
            'Benefits Administration',
            'Time & Attendance',
            'Recruitment & Hiring',
            'Performance Management'
          ],
          integrations: [
            'Existing Payroll System',
            'Accounting Software',
            'Email/Calendar (Outlook/Gmail)',
            'Single Sign-On (SSO)',
            'Benefits Providers'
          ],
          complianceNeeds: [
            'GDPR Compliance',
            'SOX Compliance',
            'State Labor Laws',
            'Federal Tax Requirements'
          ]
        },
        technicalSpecs: {
          ...baseRFQ.technicalSpecs,
          security: [
            'SOC 2 Compliance',
            'GDPR Compliance',
            'Two-Factor Authentication',
            'Data Encryption',
            'Role-based Access Control',
            'Audit Trails'
          ]
        },
        additionalQuestions: {
          ...baseRFQ.additionalQuestions,
          openEndedQuestions: 'How do you handle multi-state payroll tax compliance? What is your employee self-service portal like? How do you ensure data privacy for sensitive HR information? What is your typical implementation timeline for companies our size?',
          evaluationCriteria: [
            'Compliance Track Record',
            'Feature Set & Functionality Match',
            'Implementation Methodology & Support',
            'User Experience (UX)',
            'Integration Capabilities',
            'Total Cost of Ownership'
          ]
        },
        projectDetails: {
          ...baseRFQ.projectDetails,
          successMetrics: [
            'Reduce manual HR tasks by 50%+',
            'Improve employee satisfaction scores',
            'Ensure 100% compliance with regulations',
            'Streamline onboarding process',
            'Better reporting and analytics'
          ]
        },
        businessContext: {
          ...baseRFQ.businessContext,
          industry: inputData.companyWebsite?.includes('tech') ? 'Technology' : 'Professional Services',
          currentPain: 'Manual HR processes are time-consuming, error-prone, and create compliance risks. Current systems don\'t integrate well.',
          expectedOutcomes: 'Automated HR workflows, centralized employee data, streamlined payroll, and improved compliance reporting',
          stakeholders: [
            'HR Director/Manager',
            'IT Director',
            'CEO/Executive Team',
            'Finance/Accounting',
            'Employees (End Users)'
          ]
        }
      }

    case 'web development':
      return {
        ...baseRFQ,
        projectOverview: {
          ...baseRFQ.projectOverview,
          projectTitle: 'Website Redesign & Digital Transformation Project',
          primaryChallenges: 'Current website has 60% bounce rate. Mobile experience is poor. No e-commerce capabilities. Limited SEO visibility.',
          desiredOutcomes: 'Modern, fast website with <3 second load times. Mobile-first responsive design. Integrated e-commerce. Top 3 search rankings for key terms.',
          timelineExpectation: '3-6 months'
        },
        organizationalDetails: {
          ...baseRFQ.organizationalDetails,
          subsidiaries: '1',
          locations: '1',
          geographicScope: ['North America', 'Global'],
          departments: '1-5',
          currentSystems: 'WordPress (outdated), Manual inventory tracking, Email marketing through MailChimp',
          businessProcesses: [
            'Lead Generation & Capture',
            'Customer Journey Mapping',
            'Content Publishing Workflow',
            'E-commerce Transaction Processing',
            'Analytics & Reporting',
            'SEO Optimization'
          ]
        },
        budgetTimeline: {
          ...baseRFQ.budgetTimeline,
          budgetRange: '$25K-$100K',
          targetGoLive: 'Within 3 months',
          internalResources: [
            'Dedicated Project Manager',
            'Subject Matter Experts (SMEs) from each relevant department'
          ]
        },
        coreRequirements: {
          ...baseRFQ.coreRequirements,
          features: [
            'Responsive Design',
            'Content Management System',
            'E-commerce Functionality',
            'User Authentication',
            'Search Engine Optimization',
            'Analytics Integration'
          ],
          integrations: [
            'Payment Gateways',
            'CRM Systems',
            'Email Marketing Tools',
            'Social Media Platforms',
            'Analytics Platforms'
          ],
          complianceNeeds: [
            'GDPR Compliance',
            'WCAG Accessibility',
            'PCI DSS (if e-commerce)',
            'COPPA (if applicable)'
          ]
        },
        technicalSpecs: {
          ...baseRFQ.technicalSpecs,
          deployment: 'cloud',
          scalability: 'Handle increasing traffic loads and support business growth',
          security: [
            'SSL Certificate',
            'Data Encryption',
            'Regular Security Updates',
            'Backup & Recovery',
            'DDoS Protection'
          ],
          dataRequirements: 'Content migration from existing website with SEO preservation'
        },
        additionalQuestions: {
          ...baseRFQ.additionalQuestions,
          openEndedQuestions: 'What is your approach to SEO optimization? How do you ensure website performance and speed? What CMS options do you recommend? How do you handle ongoing maintenance and updates?',
          evaluationCriteria: [
            'Portfolio & Past Work Quality',
            'Technical Architecture & Security',
            'User Experience (UX)',
            'SEO Expertise',
            'Post-Launch Support',
            'Overall Cost (Design + Development)'
          ]
        },
        projectDetails: {
          ...baseRFQ.projectDetails,
          budget: {
            min: 25000,
            max: 100000
          },
          successMetrics: [
            'Improve website performance',
            'Increase conversion rates',
            'Better user experience',
            'Mobile optimization',
            'SEO improvements'
          ]
        },
        businessContext: {
          ...baseRFQ.businessContext,
          currentPain: 'Outdated website with poor performance, mobile experience, and limited functionality',
          expectedOutcomes: 'Modern, fast, mobile-friendly website that drives business growth and improves user engagement',
          stakeholders: [
            'Marketing Director',
            'IT Director',
            'CEO/Executive Team',
            'Sales Team',
            'Customer Service'
          ]
        }
      }

    case 'mobile development':
      return {
        ...baseRFQ,
        coreRequirements: {
          ...baseRFQ.coreRequirements,
          features: [
            'Native iOS Development',
            'Native Android Development',
            'User Authentication',
            'Push Notifications',
            'Offline Functionality',
            'Analytics Integration'
          ],
          integrations: [
            'Backend APIs',
            'Payment Gateways',
            'Social Media Login',
            'Analytics Platforms',
            'Push Notification Services'
          ],
          complianceNeeds: [
            'App Store Guidelines',
            'Google Play Policies',
            'GDPR Compliance',
            'Data Privacy Laws'
          ]
        },
        technicalSpecs: {
          ...baseRFQ.technicalSpecs,
          deployment: 'App Stores (iOS/Android)',
          scalability: 'Support growing user base and feature expansion',
          security: [
            'Data Encryption',
            'Secure Authentication',
            'API Security',
            'Code Obfuscation',
            'Regular Security Updates'
          ],
          dataRequirements: 'User data synchronization and offline data storage'
        },
        projectDetails: {
          ...baseRFQ.projectDetails,
          budget: {
            min: 35000,
            max: 100000
          },
          successMetrics: [
            'App Store approval',
            'User engagement metrics',
            'App performance',
            'User retention rates',
            'Positive app reviews'
          ]
        },
        businessContext: {
          ...baseRFQ.businessContext,
          currentPain: 'Need mobile presence to reach customers and improve user experience',
          expectedOutcomes: 'Professional mobile apps that enhance customer engagement and drive business growth',
          stakeholders: [
            'Product Manager',
            'Marketing Director',
            'IT Director',
            'CEO/Executive Team',
            'Customer Experience Team'
          ]
        }
      }

    default:
      return baseRFQ
  }
}

// Alternative analysis method for different input types
function analyzeWebsite(url: string): Partial<AIGeneratedRFQ> {
  // In a real implementation, this would analyze the website
  // For now, return some generic insights based on URL patterns
  const insights: Partial<AIGeneratedRFQ> = {}
  
  if (url.includes('shopify') || url.includes('ecommerce')) {
    insights.businessContext = {
      industry: 'E-commerce',
      currentPain: 'Need to optimize online sales and customer experience',
      expectedOutcomes: 'Increased online sales and better customer engagement',
      stakeholders: ['Marketing Team', 'Sales Team', 'IT Team']
    }
  }
  
  return insights
}

function analyzeDocument(fileName: string, fileSize: number): Partial<AIGeneratedRFQ> {
  // In a real implementation, this would analyze document content
  // For now, return insights based on file name patterns
  const insights: Partial<AIGeneratedRFQ> = {}
  
  if (fileName.toLowerCase().includes('requirements') || fileName.toLowerCase().includes('rfp')) {
    insights.projectDetails = {
      timeline: 'standard',
      budget: { min: 25000, max: 75000 },
      priority: 'high',
      successMetrics: ['Meet specified requirements', 'On-time delivery', 'Budget compliance']
    }
  }
  
  return insights
}