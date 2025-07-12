import { AIGeneratedProposal } from '@/types/ai-proposal'
import { AIGeneratedRFQ } from '@/types/ai-listing'

// Mock buyer's original RFQ requirements
export const mockBuyerRequirements: AIGeneratedRFQ = {
  projectOverview: {
    projectTitle: 'HR Management System Upgrade',
    primaryChallenges: 'Our current HR system lacks integration capabilities, has poor user experience, and cannot handle our multi-location workforce effectively. We need a modern solution that can scale with our growth.',
    desiredOutcomes: 'Unified HR platform with employee self-service, automated workflows, real-time analytics, and seamless integration with our existing payroll and benefits providers.',
    timelineExpectation: '6-9 months'
  },
  organizationalDetails: {
    subsidiaries: '2-5',
    locations: '6-10',
    geographicScope: ['North America', 'EMEA'],
    departments: '15+',
    currentSystems: 'Legacy on-premise HR system (10+ years old), separate payroll system, manual benefits administration',
    businessProcesses: ['Recruiting & Onboarding', 'Performance Management', 'Learning & Development', 'Compensation Planning', 'Benefits Administration']
  },
  budgetTimeline: {
    budgetRange: '$250K-$500K',
    targetGoLive: 'Within 6 months',
    internalResources: ['Dedicated Project Manager', 'IT Support', 'SMEs', 'Change Management Lead']
  },
  coreRequirements: {
    employeeCount: '2,500-5,000',
    features: [
      'Core HR Management',
      'Payroll Processing',
      'Time & Attendance Tracking',
      'Benefits Administration',
      'Performance Management',
      'Learning Management System',
      'Recruiting & ATS',
      'Employee Self-Service Portal',
      'Manager Dashboard',
      'Mobile Application',
      'Advanced Analytics & Reporting',
      'Workflow Automation'
    ],
    integrations: [
      'ADP Payroll',
      'Workday Benefits',
      'Microsoft 365',
      'Slack',
      'LinkedIn Recruiter',
      'Background Check Providers'
    ],
    complianceNeeds: ['SOC 2 Type II', 'GDPR', 'CCPA', 'HIPAA']
  },
  technicalSpecs: {
    deployment: 'Cloud-based (SaaS)',
    scalability: 'Must support 100% employee growth over 3 years',
    security: ['SSO/SAML', 'MFA', 'Role-based access control', 'Data encryption at rest and in transit'],
    dataRequirements: 'Real-time synchronization, API access, bulk import/export capabilities'
  },
  additionalQuestions: {
    openEndedQuestions: 'How do you handle data migration from legacy systems? What is your approach to change management and user adoption? Describe your implementation methodology.',
    evaluationCriteria: ['Feature Completeness', 'Total Cost of Ownership', 'Implementation Timeline', 'Vendor Experience', 'User Experience', 'Scalability', 'Support Quality']
  },
  projectDetails: {
    timeline: '6 months',
    budget: {
      min: 250000,
      max: 500000
    },
    priority: 'High',
    successMetrics: ['User adoption rate > 90%', 'Reduction in HR processing time by 50%', 'Employee satisfaction score > 4.5/5', 'Zero critical security incidents']
  },
  businessContext: {
    industry: 'Technology',
    currentPain: 'Disconnected systems, manual processes, poor employee experience, lack of real-time insights',
    expectedOutcomes: 'Streamlined HR operations, improved employee satisfaction, data-driven decision making, reduced administrative burden',
    stakeholders: ['CHRO', 'CTO', 'CFO', 'VP of People Operations', 'Employee Representatives']
  }
}

// Comprehensive mock proposal data
export const mockProposalData: AIGeneratedProposal = {
  // Metadata
  id: 'prop-001',
  listingId: 'rfq-hr-001',
  sellerId: 'vendor-bamboohr',
  createdAt: new Date('2025-01-10T14:30:00'),
  updatedAt: new Date('2025-01-10T14:30:00'),
  status: 'submitted',
  overallMatchScore: 92,

  // Section 1: Basic Details
  basicDetails: {
    proposalTitle: 'BambooHR - Complete HR Platform for Your Growing Organization',
    contactPerson: {
      id: 'contact-001',
      name: 'Sarah Chen',
      email: 'sarah.chen@bamboohr.com',
      role: 'Senior Solutions Architect'
    }
  },

  // Section 2: Corporate Overview
  corporateOverview: {
    companyProfile: {
      mission: 'To set people free to do great work by providing intuitive, efficient HR software',
      size: '1,000+ employees',
      keyDifferentiators: [
        'Industry-leading user experience with 98% customer satisfaction',
        'All-in-one platform eliminating need for multiple vendors',
        'Rapid implementation - average go-live in 60 days',
        'Dedicated customer success team throughout journey'
      ],
      industryExpertise: ['Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail'],
      awards: [
        'Gartner Magic Quadrant Leader 2024',
        'G2 Best HR Software 2024',
        'Forbes Cloud 100'
      ],
      certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant', 'Privacy Shield'],
      clientTestimonials: [
        'BambooHR transformed our HR operations. Implementation was smooth and employee adoption exceeded 95% in the first month. - Tech Innovators Inc.',
        'The integration capabilities and API flexibility made it easy to connect with our existing systems. ROI achieved in 8 months. - Global Manufacturing Corp.'
      ]
    },
    personalizedMessage: `Dear StackMatch team,

We're excited about the opportunity to modernize your HR infrastructure. Having reviewed your requirements, we believe BambooHR is uniquely positioned to address your multi-location workforce challenges while delivering the seamless integrations and user experience you need.

Our platform has successfully served similar technology companies through their growth journey, and we're confident we can exceed your expectations for both implementation timeline and long-term value.`,
    caseStudies: [
      {
        id: 'case-001',
        title: 'TechCorp: 300% Growth Supported with BambooHR',
        url: 'https://bamboohr.com/case-studies/techcorp'
      },
      {
        id: 'case-002',
        title: 'Multi-Location Workforce Success Story',
        url: 'https://bamboohr.com/case-studies/global-workforce'
      }
    ]
  },

  // Section 3: Executive Summary
  executiveSummary: {
    projectUnderstanding: `We understand StackMatch is seeking to replace a 10+ year old legacy HR system with a modern, integrated platform that can support your 2,500-5,000 employees across multiple locations in North America and EMEA. Your key challenges include disconnected systems, manual processes, poor user experience, and lack of real-time insights.`,
    proposedValue: `BambooHR offers a comprehensive, cloud-based HR platform that directly addresses each of your challenges. Our solution provides a unified system for all HR processes, automated workflows to eliminate manual work, an award-winning user interface that drives adoption, and powerful analytics for data-driven decisions. We can deliver full implementation within your 6-month timeline and well within your budget range.`,
    keyBenefits: [
      'Single source of truth for all HR data with real-time synchronization',
      'Reduce HR processing time by 60% through intelligent automation',
      'Industry-best user adoption rates averaging 95% within 30 days',
      'Comprehensive mobile experience for your distributed workforce',
      'Pre-built integrations with ADP, Workday Benefits, and Microsoft 365',
      'Dedicated implementation team ensuring on-time, on-budget delivery'
    ]
  },

  // Section 4: Solution Alignment
  solutionAlignment: {
    features: [
      {
        featureName: 'Core HR Management',
        supportLevel: 'fully',
        approach: 'Comprehensive employee database with customizable fields, org chart visualization, and automated workflows for all HR processes.',
        benefits: 'Centralized employee data, reduced errors, automated compliance tracking',
        evidence: [
          {
            type: 'screenshot',
            url: 'https://bamboohr.com/demos/core-hr'
          }
        ]
      },
      {
        featureName: 'Payroll Processing',
        supportLevel: 'fully',
        approach: 'Native payroll processing for US and Canada, with seamless integration to ADP for other regions. Real-time sync ensures data accuracy.',
        benefits: 'Eliminate dual data entry, reduce payroll errors by 95%, ensure compliance',
        evidence: [
          {
            type: 'demo',
            url: 'https://bamboohr.com/demos/payroll'
          }
        ]
      },
      {
        featureName: 'Time & Attendance Tracking',
        supportLevel: 'fully',
        approach: 'Flexible time tracking with mobile clock-in, geo-fencing, project tracking, and automated overtime calculations.',
        benefits: 'Accurate time data, reduced time theft, simplified compliance reporting',
        evidence: [
          {
            type: 'documentation',
            url: 'https://bamboohr.com/docs/time-tracking'
          }
        ]
      },
      {
        featureName: 'Benefits Administration',
        supportLevel: 'fully',
        approach: 'Open enrollment workflows, benefits eligibility tracking, and direct integration with Workday Benefits for seamless data flow.',
        benefits: 'Streamlined enrollment, reduced HR burden, improved employee satisfaction',
        evidence: [
          {
            type: 'case-study',
            url: 'https://bamboohr.com/cases/benefits-success'
          }
        ]
      },
      {
        featureName: 'Performance Management',
        supportLevel: 'fully',
        approach: 'Continuous performance management with goal tracking, 360 feedback, customizable review cycles, and calibration tools.',
        benefits: 'Improved employee engagement, data-driven development plans, fair evaluations'
      },
      {
        featureName: 'Learning Management System',
        supportLevel: 'fully',
        approach: 'Integrated LMS with course creation tools, compliance tracking, skills mapping, and external content integration.',
        benefits: 'Centralized training, automated compliance, career development paths'
      },
      {
        featureName: 'Recruiting & ATS',
        supportLevel: 'fully',
        approach: 'Full-cycle recruiting with job posting syndication, LinkedIn Recruiter integration, collaborative hiring, and automated workflows.',
        benefits: 'Reduced time-to-hire by 40%, improved candidate experience, better quality hires'
      },
      {
        featureName: 'Employee Self-Service Portal',
        supportLevel: 'fully',
        approach: 'Intuitive portal for employees to manage personal info, request time off, access documents, and complete tasks.',
        benefits: 'Reduced HR inquiries by 70%, improved employee satisfaction, 24/7 access'
      },
      {
        featureName: 'Manager Dashboard',
        supportLevel: 'fully',
        approach: 'Comprehensive dashboard with team insights, approval workflows, performance tracking, and predictive analytics.',
        benefits: 'Empowered managers, faster decision-making, proactive issue resolution'
      },
      {
        featureName: 'Mobile Application',
        supportLevel: 'fully',
        approach: 'Native iOS and Android apps with full functionality, offline capability, and push notifications.',
        benefits: 'Anywhere access, improved engagement, real-time updates'
      },
      {
        featureName: 'Advanced Analytics & Reporting',
        supportLevel: 'fully',
        approach: 'Pre-built reports, custom report builder, real-time dashboards, and predictive analytics with ML insights.',
        benefits: 'Data-driven decisions, trend identification, compliance reporting'
      },
      {
        featureName: 'Workflow Automation',
        supportLevel: 'fully',
        approach: 'Visual workflow builder, pre-built templates, conditional logic, and integration with all modules.',
        benefits: 'Eliminate manual tasks, ensure consistency, improve efficiency'
      }
    ],
    integrations: [
      {
        integrationName: 'ADP Payroll',
        integrationType: 'pre-built',
        details: 'Certified ADP integration with bi-directional sync, real-time updates, and error handling. Used by 500+ mutual clients.'
      },
      {
        integrationName: 'Workday Benefits',
        integrationType: 'pre-built',
        details: 'Native Workday connector for benefits data, enrollment sync, and eligibility updates. Includes automated reconciliation.'
      },
      {
        integrationName: 'Microsoft 365',
        integrationType: 'pre-built',
        details: 'Deep integration including SSO, calendar sync, Teams notifications, and SharePoint document management.'
      },
      {
        integrationName: 'Slack',
        integrationType: 'pre-built',
        details: 'Native Slack app for notifications, approvals, and HR bot for common employee questions.'
      },
      {
        integrationName: 'LinkedIn Recruiter',
        integrationType: 'api-custom',
        details: 'API integration for candidate import, InMail tracking, and pipeline synchronization.'
      },
      {
        integrationName: 'Background Check Providers',
        integrationType: 'pre-built',
        details: 'Integrations with Sterling, HireRight, and Checkr for automated background check workflows.'
      }
    ]
  },

  // Section 5: Pricing & Scoping
  pricingScoping: {
    licensingModel: 'per-user',
    annualLicenseFee: 180000,
    pricingModelDescription: 'Per-employee per-month pricing with volume discounts. Price includes all modules, unlimited support, and regular updates.',
    oneTimeCosts: [
      {
        id: 'impl-001',
        name: 'Implementation & Configuration',
        cost: 45000,
        description: 'Dedicated team for system setup, configuration, and testing'
      },
      {
        id: 'migr-001',
        name: 'Data Migration Services',
        cost: 25000,
        description: 'Complete data migration from legacy system with validation'
      },
      {
        id: 'train-001',
        name: 'Comprehensive Training Program',
        cost: 15000,
        description: 'Admin training, train-the-trainer, and end-user materials'
      },
      {
        id: 'intg-001',
        name: 'Custom Integration Setup',
        cost: 10000,
        description: 'Configuration of all requested integrations and testing'
      }
    ],
    recurringFees: [
      {
        id: 'lic-001',
        name: 'Annual Platform License (3,000 employees)',
        cost: 180000,
        description: '$5/employee/month with enterprise discount applied'
      },
      {
        id: 'supp-001',
        name: 'Premium Support Package',
        cost: 24000,
        description: 'Dedicated success manager, 24/7 support, quarterly reviews'
      }
    ],
    technologyStack: 'Cloud-native architecture on AWS, React frontend, PostgreSQL database, REST APIs, microservices',
    includedModules: [
      'Core HR',
      'Payroll',
      'Time & Attendance',
      'Benefits',
      'Performance',
      'Learning',
      'Recruiting',
      'Analytics'
    ],
    optionalModules: [
      'Advanced Compensation Planning (+$15,000/year)',
      'Workforce Planning & Predictive Analytics (+$20,000/year)',
      'Employee Wellness & Engagement (+$10,000/year)'
    ],
    bauSupportRoles: [
      {
        roleName: 'HR System Administrator',
        recommendedCount: 2,
        responsibilities: 'System configuration, user management, report creation, tier 1 support'
      },
      {
        roleName: 'HRIS Analyst',
        recommendedCount: 1,
        responsibilities: 'Data analysis, process optimization, integration monitoring'
      }
    ],
    trainingDeliveryMethods: ['Virtual instructor-led', 'Self-paced online', 'Documentation', 'Video tutorials'],
    trainingDescription: 'Comprehensive training program including 40 hours of instructor-led sessions, unlimited access to online learning portal, and customized documentation for your processes.',
    trainingCosts: 15000,
    totalProposedCost: 299000 // First year total including one-time costs
  },

  // Section 6: Technical & Security
  technicalSecurity: {
    deploymentApproach: `Cloud-based SaaS deployment on AWS with 99.9% uptime SLA. No on-premise infrastructure required. Multi-region deployment ensures low latency for your EMEA and North American offices. Includes staging environment for testing and monthly release cycles with zero-downtime deployments.`,
    scalabilityResponse: `Our platform is built on elastic cloud infrastructure that automatically scales based on demand. We currently support organizations with 50,000+ employees and can easily accommodate your projected 100% growth. Performance remains consistent with sub-second response times regardless of user count.`,
    securityFeatures: [
      {
        feature: 'Data Encryption',
        explanation: 'AES-256 encryption at rest, TLS 1.3 in transit, with key management via AWS KMS'
      },
      {
        feature: 'Access Control',
        explanation: 'Role-based access with 100+ pre-defined roles, custom role creation, and attribute-based permissions'
      },
      {
        feature: 'Authentication',
        explanation: 'SAML 2.0 SSO support, MFA via authenticator apps, biometric login for mobile'
      },
      {
        feature: 'Audit & Compliance',
        explanation: 'Complete audit trail of all actions, SIEM integration, automated compliance reporting'
      },
      {
        feature: 'Data Residency',
        explanation: 'Data remains in your chosen region (US or EU), with no cross-border transfers'
      }
    ],
    dataMigrationApproach: `Our proven 5-phase migration methodology ensures zero data loss: 1) Data mapping and analysis, 2) Test migration in staging, 3) Validation and reconciliation, 4) Production migration during scheduled window, 5) Post-migration verification. We've successfully migrated 1,000+ clients with 100% data integrity.`,
    architectureOverview: `Microservices architecture deployed on Kubernetes for high availability and scalability. React-based frontend with responsive design. RESTful APIs with GraphQL for complex queries. Event-driven architecture for real-time updates. PostgreSQL with read replicas for performance.`,
    slaDetails: `99.9% uptime guarantee with financial credits for any breach. RPO of 1 hour, RTO of 4 hours. 24/7 monitoring and incident response. Planned maintenance windows with 2-week notice. Dedicated status page and proactive communications.`,
    slaUrl: 'https://bamboohr.com/legal/sla'
  },

  // Section 7: Custom Responses
  customResponses: {
    responses: [
      {
        questionId: 'q001',
        question: 'How do you handle data migration from legacy systems?',
        answer: `We have a dedicated migration team that has successfully completed over 1,000 migrations. Our process includes:

1. Discovery phase to map all data fields and identify transformation needs
2. Custom extraction scripts for your legacy system
3. Data cleansing and standardization
4. Test migration with full validation report
5. User acceptance testing in staging environment
6. Production migration with rollback capability
7. Post-migration audit and reconciliation

We guarantee 100% data integrity and provide detailed migration reports.`
      },
      {
        questionId: 'q002',
        question: 'What is your approach to change management and user adoption?',
        answer: `Our change management methodology focuses on driving adoption through:

1. Executive stakeholder alignment workshops
2. Change champion program development
3. Customized communication plans with templates
4. Role-based training paths for different user groups
5. Gamification and incentive programs
6. Adoption tracking dashboard with actionable insights
7. Ongoing webinars and office hours post-launch

We typically achieve 90%+ adoption within 30 days through this approach.`
      },
      {
        questionId: 'q003',
        question: 'Describe your implementation methodology.',
        answer: `Our FastTrack implementation methodology delivers results in 60-90 days:

Week 1-2: Discovery & Planning
- Requirements validation
- Integration mapping
- Data analysis
- Project plan finalization

Week 3-6: Configuration & Build
- System configuration
- Integration setup
- Workflow automation
- Security configuration

Week 7-8: Migration & Testing
- Data migration execution
- User acceptance testing
- Integration testing
- Performance validation

Week 9-10: Training & Launch
- Administrator training
- End-user training
- Soft launch with pilot group
- Full production launch

Week 11-12: Optimization
- Post-launch support
- Process refinement
- Additional training
- Success metrics review`
      }
    ],
    evaluationCriteriaAlignment: `Our solution strongly aligns with all your evaluation criteria:

• Feature Completeness: 100% coverage of required features with additional capabilities
• Total Cost of Ownership: Transparent pricing with no hidden fees, strong ROI within 12 months
• Implementation Timeline: Proven ability to deliver within your 6-month requirement
• Vendor Experience: 15+ years serving 30,000+ organizations globally
• User Experience: Industry-leading UI/UX with 98% customer satisfaction
• Scalability: Cloud-native architecture supporting unlimited growth
• Support Quality: 24/7 support with <2 hour response time and 96% first-call resolution`
  },

  // Section 8: Supporting Documents
  supportingDocuments: {
    documents: [
      {
        id: 'doc-001',
        name: 'BambooHR_Implementation_Guide.pdf',
        type: 'application/pdf',
        size: 2457600,
        url: '/mock-documents/implementation-guide.pdf'
      },
      {
        id: 'doc-002',
        name: 'Security_Whitepaper_2024.pdf',
        type: 'application/pdf',
        size: 1843200,
        url: '/mock-documents/security-whitepaper.pdf'
      },
      {
        id: 'doc-003',
        name: 'ROI_Calculator_StackMatch.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 524288,
        url: '/mock-documents/roi-calculator.xlsx'
      },
      {
        id: 'doc-004',
        name: 'Customer_References.pdf',
        type: 'application/pdf',
        size: 1048576,
        url: '/mock-documents/references.pdf'
      },
      {
        id: 'doc-005',
        name: 'Product_Demo_Recording.mp4',
        type: 'video/mp4',
        size: 104857600,
        url: '/mock-documents/demo-recording.mp4'
      },
      {
        id: 'doc-006',
        name: 'Integration_Catalog_2024.pdf',
        type: 'application/pdf',
        size: 3145728,
        url: '/mock-documents/integration-catalog.pdf'
      },
      {
        id: 'doc-007',
        name: 'Sample_Contract_Template.pdf',
        type: 'application/pdf',
        size: 786432,
        url: '/mock-documents/contract-template.pdf'
      }
    ]
  },

  // AI Suggestions metadata
  aiSuggestions: {
    'basic-details': {
      suggestions: ['Strong title that clearly states value proposition'],
      tips: ['Contact person has appropriate seniority level'],
      matchScore: 95
    },
    'corporate-overview': {
      suggestions: ['Excellent personalization showing understanding of buyer needs'],
      tips: ['Consider adding more specific metrics from case studies'],
      matchScore: 90
    },
    'executive-summary': {
      suggestions: ['Clear demonstration of problem understanding'],
      tips: ['Strong value proposition with quantifiable benefits'],
      matchScore: 94
    },
    'solution-alignment': {
      suggestions: ['Comprehensive coverage of all requested features'],
      tips: ['Good evidence provided for key capabilities'],
      matchScore: 96
    },
    'pricing-scoping': {
      suggestions: ['Transparent pricing within budget range'],
      tips: ['Consider offering payment terms flexibility'],
      matchScore: 88
    },
    'technical-security': {
      suggestions: ['Strong security posture exceeding requirements'],
      tips: ['Detailed technical architecture provided'],
      matchScore: 92
    },
    'custom-responses': {
      suggestions: ['Thorough responses addressing all concerns'],
      tips: ['Good detail on implementation methodology'],
      matchScore: 91
    },
    'supporting-documents': {
      suggestions: ['Comprehensive document package provided'],
      tips: ['Consider adding industry-specific case studies'],
      matchScore: 90
    }
  }
}

// Mock evaluation data (buyer's team assessment)
export interface ProposalEvaluation {
  proposalId: string
  status: 'new' | 'under-review' | 'shortlisted' | 'awaiting-clarification' | 'rejected' | 'accepted'
  internalScores: {
    technicalFit: number // 1-5
    priceValue: number // 1-5
    vendorExperience: number // 1-5
    implementationApproach: number // 1-5
    supportQuality: number // 1-5
    overallScore: number // calculated average
  }
  teamNotes: {
    id: string
    author: string
    role: string
    content: string
    timestamp: Date
    isPrivate: boolean
  }[]
  clarificationRequests: {
    id: string
    question: string
    status: 'pending' | 'answered'
    response?: string
    askedAt: Date
    respondedAt?: Date
  }[]
}

export const mockProposalEvaluation: ProposalEvaluation = {
  proposalId: 'prop-001',
  status: 'under-review',
  internalScores: {
    technicalFit: 5,
    priceValue: 4,
    vendorExperience: 5,
    implementationApproach: 4,
    supportQuality: 5,
    overallScore: 4.6
  },
  teamNotes: [
    {
      id: 'note-001',
      author: 'Jennifer Martinez',
      role: 'CHRO',
      content: 'Very impressed with the user interface demos. This would be a huge improvement over our current system. The employee self-service features alone would save our HR team hours each week.',
      timestamp: new Date('2025-01-11T09:15:00'),
      isPrivate: true
    },
    {
      id: 'note-002',
      author: 'Michael Chen',
      role: 'CTO',
      content: 'Security architecture looks solid. SOC 2 Type II and ISO 27001 certifications meet our requirements. The API documentation is comprehensive and the integration approach is well thought out.',
      timestamp: new Date('2025-01-11T10:30:00'),
      isPrivate: true
    },
    {
      id: 'note-003',
      author: 'Sarah Thompson',
      role: 'CFO',
      content: 'Pricing is competitive and within budget. The ROI calculator shows breakeven at 8 months which is excellent. Would like to negotiate payment terms - possibly quarterly instead of annual.',
      timestamp: new Date('2025-01-11T14:20:00'),
      isPrivate: true
    }
  ],
  clarificationRequests: [
    {
      id: 'clar-001',
      question: 'Can you provide more details on the data retention policies and how employee data is handled when they leave the organization?',
      status: 'pending',
      askedAt: new Date('2025-01-11T15:00:00')
    }
  ]
}