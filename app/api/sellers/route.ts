import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Build query for seller profiles
    let query = supabase
      .from('profiles')
      .select(`
        id,
        email,
        created_at,
        user_type,
        seller_profiles (
          company_name,
          business_description,
          website_url,
          location,
          skills,
          experience_years,
          hourly_rate_min,
          hourly_rate_max,
          availability_status,
          response_time_hours,
          total_projects_completed,
          success_rate,
          rating,
          total_reviews,
          is_verified,
          languages,
          portfolio_urls,
          certifications,
          specializations
        )
      `)
      .eq('user_type', 'seller')
      .not('seller_profiles', 'is', null)

    // Apply filters
    if (category) {
      query = query.contains('seller_profiles.specializations', [category])
    }

    if (location && location !== 'remote') {
      query = query.ilike('seller_profiles.location', `%${location}%`)
    }

    if (experience) {
      const yearRanges = {
        'entry': [0, 2],
        'mid': [3, 5],
        'senior': [6, 10],
        'expert': [11, 999]
      }
      const range = yearRanges[experience as keyof typeof yearRanges]
      if (range) {
        query = query.gte('seller_profiles.experience_years', range[0])
        if (range[1] !== 999) {
          query = query.lte('seller_profiles.experience_years', range[1])
        }
      }
    }

    if (availability) {
      const availabilityMap = {
        'immediate': 'available_now',
        'week': 'available_soon',
        'month': 'limited_availability',
        'flexible': 'flexible'
      }
      const mappedAvailability = availabilityMap[availability as keyof typeof availabilityMap]
      if (mappedAvailability) {
        query = query.eq('seller_profiles.availability_status', mappedAvailability)
      }
    }

    if (search) {
      query = query.or(`
        seller_profiles.company_name.ilike.%${search}%,
        seller_profiles.business_description.ilike.%${search}%,
        seller_profiles.skills.cs.{${search}}
      `)
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false, foreignTable: 'seller_profiles' })
        break
      case 'price-low':
        query = query.order('hourly_rate_min', { ascending: true, foreignTable: 'seller_profiles' })
        break
      case 'price-high':
        query = query.order('hourly_rate_max', { ascending: false, foreignTable: 'seller_profiles' })
        break
      case 'response-time':
        query = query.order('response_time_hours', { ascending: true, foreignTable: 'seller_profiles' })
        break
      case 'recent':
        query = query.order('created_at', { ascending: false })
        break
      default: // relevance
        query = query.order('rating', { ascending: false, foreignTable: 'seller_profiles' })
        query = query.order('total_reviews', { ascending: false, foreignTable: 'seller_profiles' })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: sellers, error, count } = await query

    if (error) {
      console.error('Error fetching sellers:', error)
      return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 })
    }

    // Transform data for frontend
    const transformedSellers = sellers?.map(seller => ({
      id: seller.id,
      name: seller.email?.split('@')[0] || 'Anonymous', // Fallback name
      title: seller.seller_profiles?.specializations?.[0] || 'Professional',
      company: seller.seller_profiles?.company_name || 'Independent',
      location: seller.seller_profiles?.location || 'Remote',
      avatar: `/api/placeholder/64/64`, // Placeholder avatar
      rating: seller.seller_profiles?.rating || 4.5,
      reviewCount: seller.seller_profiles?.total_reviews || 0,
      responseTime: `Responds within ${seller.seller_profiles?.response_time_hours || 4} hours`,
      isOnline: Math.random() > 0.3, // Mock online status
      isTopRated: (seller.seller_profiles?.rating || 0) >= 4.8,
      skills: seller.seller_profiles?.skills || [],
      experience: `${seller.seller_profiles?.experience_years || 1}+ years`,
      startingPrice: seller.seller_profiles?.hourly_rate_min || 50,
      pricingModel: 'hourly' as const,
      completedProjects: seller.seller_profiles?.total_projects_completed || 0,
      successRate: seller.seller_profiles?.success_rate || 95,
      portfolioImages: seller.seller_profiles?.portfolio_urls?.slice(0, 3) || [
        '/api/placeholder/200/200',
        '/api/placeholder/200/200',
        '/api/placeholder/200/200'
      ],
      isVerified: seller.seller_profiles?.is_verified || false,
      languages: seller.seller_profiles?.languages || ['English'],
      availability: seller.seller_profiles?.availability_status === 'available_now' 
        ? 'Available Now' 
        : seller.seller_profiles?.availability_status === 'available_soon'
        ? 'Within 1 Week'
        : 'Within 1 Month'
    })) || []

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('user_type', 'seller')
      .not('seller_profiles', 'is', null)

    return NextResponse.json({
      sellers: transformedSellers,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Unexpected error in sellers API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}