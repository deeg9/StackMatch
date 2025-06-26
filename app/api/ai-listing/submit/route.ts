import { NextRequest, NextResponse } from 'next/server'

interface SubmitListingRequest {
  categoryName: string
  rfqData: {
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
}

interface SubmissionResponse {
  success: boolean
  listingId: string
  estimatedProposals: number
  expectedResponseTime: string
  vendorMatches: {
    total: number
    premium: number
    verified: number
  }
  nextSteps: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitListingRequest = await request.json()
    
    // Validate required fields
    const validation = validateListingData(body.rfqData)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors },
        { status: 400 }
      )
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate listing ID
    const listingId = `LST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Calculate estimated metrics based on RFQ quality and category
    const metrics = calculateSubmissionMetrics(body.categoryName, body.rfqData)
    
    // In a real implementation, this would:
    // 1. Save the listing to the database
    // 2. Trigger vendor matching algorithm
    // 3. Send notifications to matched vendors
    // 4. Create activity logs
    // 5. Update user dashboard
    
    const response: SubmissionResponse = {
      success: true,
      listingId,
      estimatedProposals: metrics.estimatedProposals,
      expectedResponseTime: metrics.expectedResponseTime,
      vendorMatches: metrics.vendorMatches,
      nextSteps: [
        'Your listing is now live in the StackMatch marketplace',
        'Qualified vendors are being notified about your RFQ',
        'You\'ll receive email notifications when proposals arrive',
        'Check your dashboard to track proposal status',
        'Use our comparison tools to evaluate proposals'
      ]
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error submitting AI listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit listing' },
      { status: 500 }
    )
  }
}

function validateListingData(rfqData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Core Requirements validation
  if (!rfqData.coreRequirements?.employeeCount) {
    errors.push('Employee count is required')
  }
  
  if (!rfqData.coreRequirements?.features || rfqData.coreRequirements.features.length === 0) {
    errors.push('At least one core feature must be selected')
  }
  
  // Technical Specs validation
  if (!rfqData.technicalSpecs?.deployment) {
    errors.push('Deployment preference is required')
  }
  
  // Project Details validation
  if (!rfqData.projectDetails?.timeline) {
    errors.push('Project timeline is required')
  }
  
  if (!rfqData.projectDetails?.budget?.min || rfqData.projectDetails.budget.min <= 0) {
    errors.push('Minimum budget must be greater than 0')
  }
  
  if (!rfqData.projectDetails?.budget?.max || rfqData.projectDetails.budget.max <= rfqData.projectDetails.budget.min) {
    errors.push('Maximum budget must be greater than minimum budget')
  }
  
  if (!rfqData.projectDetails?.priority) {
    errors.push('Project priority is required')
  }
  
  // Business Context validation
  if (!rfqData.businessContext?.industry) {
    errors.push('Industry information is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

function calculateSubmissionMetrics(categoryName: string, rfqData: any) {
  // Base metrics
  let estimatedProposals = 5
  let expectedResponseTime = '48-72 hours'
  let premiumVendors = 2
  let verifiedVendors = 8
  
  // Adjust based on category popularity
  const categoryMultipliers: { [key: string]: number } = {
    'hr & payroll': 1.2,
    'web development': 1.5,
    'mobile development': 1.1,
    'design & creative': 1.3,
    'data science': 0.9,
    'digital marketing': 1.4
  }
  
  const multiplier = categoryMultipliers[categoryName.toLowerCase()] || 1.0
  estimatedProposals = Math.round(estimatedProposals * multiplier)
  
  // Adjust based on budget range
  const budgetMin = rfqData.projectDetails?.budget?.min || 0
  const budgetMax = rfqData.projectDetails?.budget?.max || 0
  const avgBudget = (budgetMin + budgetMax) / 2
  
  if (avgBudget > 100000) {
    estimatedProposals += 3
    premiumVendors += 2
    expectedResponseTime = '24-48 hours'
  } else if (avgBudget > 50000) {
    estimatedProposals += 2
    premiumVendors += 1
  } else if (avgBudget < 10000) {
    estimatedProposals = Math.max(3, estimatedProposals - 2)
    premiumVendors = Math.max(1, premiumVendors - 1)
  }
  
  // Adjust based on urgency
  if (rfqData.projectDetails?.timeline === 'urgent') {
    expectedResponseTime = '24-48 hours'
    estimatedProposals += 1
  } else if (rfqData.projectDetails?.timeline === 'strategic') {
    expectedResponseTime = '72-96 hours'
  }
  
  // Adjust based on requirements complexity
  const featuresCount = rfqData.coreRequirements?.features?.length || 0
  const integrationsCount = rfqData.coreRequirements?.integrations?.length || 0
  const securityCount = rfqData.technicalSpecs?.security?.length || 0
  
  const complexityScore = featuresCount + integrationsCount + securityCount
  
  if (complexityScore > 15) {
    estimatedProposals += 2 // More complex projects attract more vendors
    premiumVendors += 1
  } else if (complexityScore < 5) {
    estimatedProposals = Math.max(3, estimatedProposals - 1)
  }
  
  // Cap maximums
  estimatedProposals = Math.min(estimatedProposals, 15)
  premiumVendors = Math.min(premiumVendors, 5)
  verifiedVendors = Math.min(verifiedVendors, estimatedProposals - 1)
  
  return {
    estimatedProposals,
    expectedResponseTime,
    vendorMatches: {
      total: estimatedProposals,
      premium: premiumVendors,
      verified: verifiedVendors
    }
  }
}

// Helper function to generate realistic timeline estimates
function getTimelineEstimate(timeline: string, complexity: number): string {
  const timelineMap: { [key: string]: string[] } = {
    'urgent': ['24-48 hours', '36-60 hours'],
    'standard': ['48-72 hours', '60-84 hours'],
    'flexible': ['72-96 hours', '84-120 hours'],
    'strategic': ['96-120 hours', '120-168 hours']
  }
  
  const options = timelineMap[timeline] || timelineMap['standard']
  return complexity > 10 ? options[1] : options[0]
}

// Helper function to calculate vendor match score
function calculateVendorMatchScore(rfqData: any): number {
  let score = 0.7 // Base score
  
  // Bonus for detailed requirements
  if (rfqData.coreRequirements?.features?.length > 5) score += 0.1
  if (rfqData.technicalSpecs?.scalability?.length > 50) score += 0.05
  if (rfqData.businessContext?.currentPain?.length > 50) score += 0.05
  if (rfqData.projectDetails?.successMetrics?.length > 3) score += 0.1
  
  return Math.min(score, 0.95) // Cap at 95%
}