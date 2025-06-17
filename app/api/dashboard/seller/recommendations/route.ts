import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Get active listings that the seller hasn't already submitted proposals for
    const { data: existingProposals } = await supabase
      .from('proposals')
      .select('listing_id')
      .eq('seller_id', user.id)

    const existingListingIds = existingProposals?.map(p => p.listing_id) || []

    // Get recommended listings
    const { data: listings, error } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        description,
        budget_min,
        budget_max,
        status,
        project_categories!listings_category_id_fkey (
          name
        ),
        buyer_profiles!listings_buyer_id_fkey (
          company_name,
          is_confidential
        )
      `)
      .eq('status', 'ACTIVE')
      .not('id', 'in', `(${existingListingIds.length > 0 ? existingListingIds.join(',') : 'null'})`)
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (error) {
      console.error('Error fetching recommendations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      )
    }

    // Transform the data to match our frontend expectations
    const transformedListings = listings?.map(listing => {
      const buyerProfile = (listing as any).buyer_profiles
      const category = (listing as any).project_categories
      
      // Generate mock tags based on category and title
      const generateTags = (title: string, categoryName: string) => {
        const tags = []
        if (categoryName) tags.push(categoryName)
        
        // Add technology-based tags based on title keywords
        const techKeywords = {
          'CRM': ['CRM', 'Sales', 'Customer Management'],
          'ERP': ['ERP', 'Enterprise', 'Resource Planning'],
          'Cloud': ['Cloud', 'AWS', 'Azure'],
          'Analytics': ['Analytics', 'Data', 'BI'],
          'HR': ['HR', 'Human Resources', 'Payroll'],
          'E-commerce': ['E-commerce', 'Online Store', 'Retail'],
          'Mobile': ['Mobile', 'iOS', 'Android'],
          'Web': ['Web Development', 'Frontend', 'Backend']
        }
        
        for (const [keyword, relatedTags] of Object.entries(techKeywords)) {
          if (title.toLowerCase().includes(keyword.toLowerCase())) {
            tags.push(...relatedTags.slice(0, 2))
            break
          }
        }
        
        return tags.slice(0, 4) // Limit to 4 tags
      }

      return {
        id: listing.id,
        title: listing.title,
        company: buyerProfile?.is_confidential ? 'Confidential' : (buyerProfile?.company_name || 'Private Company'),
        description: listing.description || 'Project details available upon request.',
        budgetMin: listing.budget_min || 0,
        budgetMax: listing.budget_max || 0,
        tags: generateTags(listing.title || '', category?.name || ''),
        isConfidential: buyerProfile?.is_confidential || false
      }
    }) || []

    return NextResponse.json(transformedListings)
  } catch (error) {
    console.error('Error fetching seller recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}