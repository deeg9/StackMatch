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

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Get additional profile data based on user type
    let additionalData = {}
    
    if (profile?.user_type === 'seller') {
      // Fetch seller-specific data
      const { data: sellerData } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      additionalData = { sellerProfile: sellerData }
    } else if (profile?.user_type === 'buyer') {
      // Fetch buyer-specific data
      const { data: buyerData } = await supabase
        .from('buyer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      additionalData = { buyerProfile: buyerData }
    }

    // Construct comprehensive profile response
    const profileResponse = {
      id: user.id,
      email: user.email,
      fullName: profile.full_name || user.user_metadata?.full_name || 'User',
      headline: profile.headline || 'Professional',
      location: profile.location || 'Not specified',
      memberSince: new Date(user.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      lastActive: '2 minutes ago', // This would come from real activity tracking
      isOnline: true, // This would come from real presence system
      avatar: profile.avatar_url || user.user_metadata?.avatar_url || '/api/placeholder/150/150',
      userType: profile.user_type,
      
      // Sample data for demo - in production this would come from database
      overallRating: 4.9,
      totalReviews: 127,
      ratingBreakdown: { 5: 98, 4: 23, 3: 4, 2: 1, 1: 1 },
      projectsCompleted: 89,
      successRate: 98.8,
      onTimeDelivery: 96.6,
      repeatClientRate: 78.2,
      totalEarnings: 450000,
      projectsThisMonth: 7,
      responseTime: '< 1 hour',
      profileViews: 234,
      
      verifications: {
        identity: profile.identity_verified || false,
        payment: profile.payment_verified || false,
        email: user.email_confirmed_at ? true : false,
        phone: profile.phone_verified || false
      },
      
      bio: profile.bio || "Professional with extensive experience in the industry.",
      experience: profile.experience_years || 5,
      specializations: profile.specializations || ['Software Development', 'Project Management'],
      industries: profile.industries || ['Technology', 'SaaS'],
      
      skills: profile.skills || [
        { name: 'JavaScript', level: 'Expert' },
        { name: 'React', level: 'Expert' },
        { name: 'Node.js', level: 'Intermediate' },
        { name: 'Project Management', level: 'Expert' }
      ],
      
      languages: profile.languages || [
        { language: 'English', proficiency: 'Native', isNative: true },
        { language: 'Spanish', proficiency: 'Conversational', isNative: false }
      ],
      
      education: profile.education || [
        { institution: 'University', degree: 'Bachelor of Science', year: '2018' }
      ],
      
      certifications: profile.certifications || [
        { name: 'Professional Certification', issuer: 'Industry Body', year: '2023' }
      ],
      
      portfolio: [], // Would fetch from portfolio table
      reviews: [], // Would fetch from reviews table
      workHistory: [], // Would fetch from work_history table
      
      contactInfo: {
        email: user.email,
        phone: profile.phone || '',
        website: profile.website || '',
        linkedin: profile.linkedin_url || '',
        github: profile.github_url || ''
      },
      
      availability: {
        status: profile.availability_status || 'Available',
        hoursPerWeek: profile.hours_per_week || 40,
        workingHours: profile.working_hours || '9:00 AM - 6:00 PM',
        timezone: profile.timezone || 'UTC'
      },
      
      pricing: {
        hourlyRate: {
          min: profile.hourly_rate_min || 50,
          max: profile.hourly_rate_max || 150
        },
        projectMinimum: profile.project_minimum || 1000,
        paymentTerms: profile.payment_terms || 'Net 30'
      },
      
      ...additionalData
    }

    return NextResponse.json(profileResponse)
    
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    
    // Update profile data
    const profileUpdate = {
      full_name: body.fullName,
      headline: body.headline,
      location: body.location,
      bio: body.bio,
      experience_years: body.experience,
      specializations: body.specializations,
      industries: body.industries,
      skills: body.skills,
      languages: body.languages,
      education: body.education,
      certifications: body.certifications,
      phone: body.contactInfo?.phone,
      website: body.contactInfo?.website,
      linkedin_url: body.contactInfo?.linkedin,
      github_url: body.contactInfo?.github,
      availability_status: body.availability?.status,
      hours_per_week: body.availability?.hoursPerWeek,
      working_hours: body.availability?.workingHours,
      timezone: body.availability?.timezone,
      hourly_rate_min: body.pricing?.hourlyRate?.min,
      hourly_rate_max: body.pricing?.hourlyRate?.max,
      project_minimum: body.pricing?.projectMinimum,
      payment_terms: body.pricing?.paymentTerms,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: data 
    })
    
  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}