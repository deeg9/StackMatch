import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('sb-access-token')?.value
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get the authenticated user by JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real application, you would fetch saved sellers from the database
    // For now, we'll return mock data that matches the component structure
    const savedSellers = [
      {
        id: 'seller-1',
        name: 'Sarah Johnson',
        title: 'Senior Full-Stack Developer & CRM Specialist',
        location: 'San Francisco, CA',
        avatar: '/api/placeholder/80/80',
        rating: 4.9,
        reviewCount: 156,
        isTopRated: true,
        successRate: 98.5,
        isOnline: true,
        responseTime: 'within 2 hours',
        availability: 'Available now',
        timezone: 'PST',
        skills: ['React', 'Node.js', 'Salesforce', 'PostgreSQL'],
        experience: 8,
        specializations: ['CRM Implementation', 'E-commerce Development', 'API Integration'],
        certifications: ['Salesforce Certified', 'AWS Solutions Architect'],
        hourlyRate: { min: 95, max: 150 },
        projectMinimum: 5000,
        pricingModel: 'both',
        projectsCompleted: 127,
        clientSatisfaction: 4.9,
        repeatClientRate: 78,
        portfolioCount: 24,
        savedOn: '2 days ago',
        lastContacted: '1 week ago',
        collections: ['Web Developers', 'For CRM Project'],
        notes: 'Excellent for Salesforce implementations. Very responsive.',
        isVerified: true,
        isPremium: true,
        isRisingTalent: false
      },
      // Add more mock sellers...
    ]

    const collections = [
      { id: 'all', name: 'All Saved Sellers', count: savedSellers.length, color: 'gray' },
      { id: 'web-dev', name: 'Web Developers', count: 1, color: 'blue' },
      { id: 'designers', name: 'Designers', count: 1, color: 'purple' },
      { id: 'mobile-dev', name: 'Mobile Developers', count: 1, color: 'green' },
      { id: 'future', name: 'For Future Projects', count: 2, color: 'orange' },
      { id: 'top-performers', name: 'Top Performers', count: 1, color: 'yellow' }
    ]

    return NextResponse.json({
      savedSellers,
      collections,
      totalCount: savedSellers.length,
      statistics: {
        totalSellers: savedSellers.length,
        newThisMonth: savedSellers.filter(s => s.savedOn.includes('day')).length,
        categoriesRepresented: 5,
        averageRating: 4.8,
        availableNow: savedSellers.filter(s => s.availability.includes('Available')).length,
        onlineNow: savedSellers.filter(s => s.isOnline).length,
        quickResponders: savedSellers.filter(s => s.responseTime.includes('hour')).length,
        contacted: savedSellers.filter(s => s.lastContacted).length,
        topRated: savedSellers.filter(s => s.isTopRated).length,
        verified: savedSellers.filter(s => s.isVerified).length,
        premium: savedSellers.filter(s => s.isPremium).length,
        risingTalent: savedSellers.filter(s => s.isRisingTalent).length
      }
    })
    
  } catch (error) {
    console.error('Saved sellers API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('sb-access-token')?.value
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get the authenticated user by JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sellerId, collections, notes } = body

    // In a real application, you would save the seller to the user's saved list
    // For now, we'll return a success response
    
    return NextResponse.json({ 
      message: 'Seller saved successfully',
      sellerId,
      savedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Save seller API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('sb-access-token')?.value
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get the authenticated user by JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 })
    }

    // In a real application, you would remove the seller from the user's saved list
    // For now, we'll return a success response
    
    return NextResponse.json({ 
      message: 'Seller removed successfully',
      sellerId
    })
    
  } catch (error) {
    console.error('Remove saved seller API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}