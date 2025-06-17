import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Mock data for now since seller_profiles relationship doesn't exist yet
const mockSellers = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Full-Stack Developer',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    avatar: '/api/placeholder/64/64',
    rating: 4.9,
    reviewCount: 127,
    responseTime: 'Responds within 2 hours',
    isOnline: true,
    isTopRated: true,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    experience: '8+ years',
    startingPrice: 85,
    pricingModel: 'hourly' as const,
    completedProjects: 45,
    successRate: 98,
    portfolioImages: ['/api/placeholder/200/200', '/api/placeholder/200/200', '/api/placeholder/200/200'],
    isVerified: true,
    languages: ['English', 'Mandarin'],
    availability: 'Available Now'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'Mobile App Developer',
    company: 'AppCraft Studio',
    location: 'Austin, TX',
    avatar: '/api/placeholder/64/64',
    rating: 4.8,
    reviewCount: 89,
    responseTime: 'Responds within 1 hour',
    isOnline: true,
    isTopRated: true,
    skills: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'Redux'],
    experience: '6+ years',
    startingPrice: 75,
    pricingModel: 'hourly' as const,
    completedProjects: 32,
    successRate: 96,
    portfolioImages: ['/api/placeholder/200/200', '/api/placeholder/200/200', '/api/placeholder/200/200'],
    isVerified: true,
    languages: ['English', 'Spanish'],
    availability: 'Available Now'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    title: 'UI/UX Designer',
    company: 'DesignCore',
    location: 'New York, NY',
    avatar: '/api/placeholder/64/64',
    rating: 4.9,
    reviewCount: 156,
    responseTime: 'Responds within 30 minutes',
    isOnline: false,
    isTopRated: true,
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    experience: '7+ years',
    startingPrice: 3500,
    pricingModel: 'fixed' as const,
    completedProjects: 78,
    successRate: 99,
    portfolioImages: ['/api/placeholder/200/200', '/api/placeholder/200/200', '/api/placeholder/200/200'],
    isVerified: true,
    languages: ['English'],
    availability: 'Within 1 Week'
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Data Scientist',
    company: 'DataLab Inc',
    location: 'Seattle, WA',
    avatar: '/api/placeholder/64/64',
    rating: 4.7,
    reviewCount: 93,
    responseTime: 'Responds within 4 hours',
    isOnline: true,
    isTopRated: false,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R'],
    experience: '5+ years',
    startingPrice: 95,
    pricingModel: 'hourly' as const,
    completedProjects: 28,
    successRate: 94,
    portfolioImages: ['/api/placeholder/200/200', '/api/placeholder/200/200', '/api/placeholder/200/200'],
    isVerified: true,
    languages: ['English', 'Korean'],
    availability: 'Available Now'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    title: 'Digital Marketing Specialist',
    company: 'GrowthHack Media',
    location: 'Remote',
    avatar: '/api/placeholder/64/64',
    rating: 4.8,
    reviewCount: 134,
    responseTime: 'Responds within 1 hour',
    isOnline: true,
    isTopRated: true,
    skills: ['SEO', 'Google Ads', 'Facebook Ads', 'Analytics', 'Content Strategy'],
    experience: '9+ years',
    startingPrice: 65,
    pricingModel: 'hourly' as const,
    completedProjects: 67,
    successRate: 97,
    portfolioImages: ['/api/placeholder/200/200', '/api/placeholder/200/200', '/api/placeholder/200/200'],
    isVerified: true,
    languages: ['English'],
    availability: 'Within 1 Week'
  },
  {
    id: '6',
    name: 'Ahmed Hassan',
    title: 'Cybersecurity Expert',
    company: 'SecureNet Solutions',
    location: 'Toronto, Canada',
    avatar: '/api/placeholder/64/64',
    rating: 4.9,
    reviewCount: 71,
    responseTime: 'Responds within 2 hours',
    isOnline: false,
    isTopRated: true,
    skills: ['Penetration Testing', 'Security Auditing', 'CISSP', 'Ethical Hacking', 'Risk Assessment'],
    experience: '12+ years',
    startingPrice: 120,
    pricingModel: 'hourly' as const,
    completedProjects: 19,
    successRate: 100,
    portfolioImages: ['/api/placeholder/200/200', '/api/placeholder/200/200', '/api/placeholder/200/200'],
    isVerified: true,
    languages: ['English', 'Arabic'],
    availability: 'Within 1 Month'
  }
]

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const experience = searchParams.get('experience')
    const availability = searchParams.get('availability')
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // For now, return mock data with applied filters
    let filteredSellers = mockSellers

    // Apply filters
    if (category) {
      filteredSellers = filteredSellers.filter(seller => 
        seller.title.toLowerCase().includes(category.toLowerCase()) ||
        seller.skills.some(skill => skill.toLowerCase().includes(category.toLowerCase()))
      )
    }

    if (location && location !== 'remote') {
      filteredSellers = filteredSellers.filter(seller =>
        seller.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredSellers = filteredSellers.filter(seller =>
        seller.name.toLowerCase().includes(searchLower) ||
        seller.title.toLowerCase().includes(searchLower) ||
        seller.company.toLowerCase().includes(searchLower) ||
        seller.skills.some(skill => skill.toLowerCase().includes(searchLower))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filteredSellers.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        filteredSellers.sort((a, b) => a.startingPrice - b.startingPrice)
        break
      case 'price-high':
        filteredSellers.sort((a, b) => b.startingPrice - a.startingPrice)
        break
      case 'response-time':
        filteredSellers.sort((a, b) => {
          const aTime = parseInt(a.responseTime.match(/\d+/)?.[0] || '24')
          const bTime = parseInt(b.responseTime.match(/\d+/)?.[0] || '24')
          return aTime - bTime
        })
        break
      case 'recent':
        // Mock recent activity - shuffle for demo
        filteredSellers = filteredSellers.sort(() => Math.random() - 0.5)
        break
      default: // relevance
        filteredSellers.sort((a, b) => b.rating - a.rating)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSellers = filteredSellers.slice(startIndex, endIndex)

    return NextResponse.json({
      sellers: paginatedSellers,
      pagination: {
        page,
        limit,
        total: filteredSellers.length,
        totalPages: Math.ceil(filteredSellers.length / limit)
      }
    })

  } catch (error) {
    console.error('Unexpected error in sellers API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}