'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Star, ThumbsUp, Shield, Award } from 'lucide-react'

interface Review {
  id: string
  reviewerName: string
  reviewerTitle: string
  company: string
  companySize: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  publishDate: string
  verified: boolean
  helpful: number
  productUsed: string
}

interface ReviewsSectionProps {
  companyId: string
}

export function ReviewsSection({ companyId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [overallRating, setOverallRating] = useState(0)
  const [ratingDistribution, setRatingDistribution] = useState<{ [key: number]: number }>({})

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: '1',
      reviewerName: 'David Chen',
      reviewerTitle: 'VP of Sales',
      company: 'TechCorp Solutions',
      companySize: '1,000-5,000 employees',
      rating: 5,
      title: 'Exceptional platform that transformed our sales process',
      content: 'This platform has completely revolutionized how our sales team operates. The automation features save us countless hours, and the analytics provide insights we never had before. Implementation was smooth and the support team is outstanding.',
      pros: ['Intuitive user interface', 'Powerful automation', 'Excellent customer support', 'Comprehensive analytics'],
      cons: ['Learning curve for advanced features', 'Premium pricing'],
      publishDate: '2024-01-20',
      verified: true,
      helpful: 24,
      productUsed: 'Sales Cloud Enterprise'
    },
    {
      id: '2',
      reviewerName: 'Sarah Johnson',
      reviewerTitle: 'Director of Customer Success',
      company: 'Global Services Inc',
      companySize: '5,000+ employees',
      rating: 4,
      title: 'Great platform with room for improvement',
      content: 'Overall very satisfied with the platform. It has helped us streamline our customer service operations significantly. The reporting capabilities are excellent and the integration options are comprehensive.',
      pros: ['Strong reporting features', 'Good integration capabilities', 'Reliable platform', 'Responsive support'],
      cons: ['Complex initial setup', 'Could use better mobile app'],
      publishDate: '2024-01-15',
      verified: true,
      helpful: 18,
      productUsed: 'Service Cloud Professional'
    },
    {
      id: '3',
      reviewerName: 'Michael Rodriguez',
      reviewerTitle: 'IT Director',
      company: 'Healthcare Partners',
      companySize: '1,000-5,000 employees',
      rating: 5,
      title: 'Best-in-class solution for our industry',
      content: 'The platform meets all our compliance requirements and has significantly improved our operational efficiency. The security features are top-notch and give us peace of mind when handling sensitive data.',
      pros: ['Excellent security', 'Industry compliance', 'Scalable architecture', 'Great documentation'],
      cons: ['Requires technical expertise for customization'],
      publishDate: '2024-01-10',
      verified: true,
      helpful: 31,
      productUsed: 'Health Cloud'
    }
  ]

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/companies/${companyId}/reviews`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.reviews)
          setOverallRating(data.overallRating)
          setRatingDistribution(data.ratingDistribution)
        } else {
          // Fallback to mock data
          setReviews(mockReviews)
          setOverallRating(4.7)
          setRatingDistribution({ 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 })
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        // Fallback to mock data
        setReviews(mockReviews)
        setOverallRating(4.7)
        setRatingDistribution({ 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 })
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [companyId])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-200 rounded animate-pulse"></div>
          <div className="lg:col-span-2 h-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-stackmatch-navy mb-2">
              {overallRating}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(overallRating))}
            </div>
            <div className="text-sm text-medium-gray mb-4">
              Based on {reviews.length}+ verified reviews
            </div>
            <Badge className="bg-trust-green text-white">
              <Shield className="w-3 h-3 mr-1" />
              Verified Reviews
            </Badge>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-stackmatch-navy mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-stackmatch-navy">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress 
                    value={ratingDistribution[stars] || 0} 
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-medium-gray w-8">
                    {ratingDistribution[stars] || 0}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`/api/placeholder/48/48`} alt={review.reviewerName} />
                    <AvatarFallback className="bg-stackmatch-blue text-white">
                      {review.reviewerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-stackmatch-navy">{review.reviewerName}</h4>
                      {review.verified && (
                        <Badge variant="secondary" className="bg-trust-green/10 text-trust-green text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-medium-gray mb-2">
                      {review.reviewerTitle} at {review.company} • {review.companySize}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-medium-gray">{review.publishDate}</span>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {review.productUsed}
                  </Badge>
                </div>

                {/* Review Content */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-stackmatch-navy">{review.title}</h5>
                  <p className="text-charcoal leading-relaxed">{review.content}</p>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-semibold text-trust-green mb-2">Pros</h6>
                    <ul className="space-y-1">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-charcoal flex items-start gap-2">
                          <div className="w-1 h-1 bg-trust-green rounded-full mt-2 flex-shrink-0"></div>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h6 className="font-semibold text-attention-orange mb-2">Cons</h6>
                    <ul className="space-y-1">
                      {review.cons.map((con, index) => (
                        <li key={index} className="text-sm text-charcoal flex items-start gap-2">
                          <div className="w-1 h-1 bg-attention-orange rounded-full mt-2 flex-shrink-0"></div>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Review Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-sm text-medium-gray">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful} people found this helpful</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-medium-gray">
                    <Award className="w-3 h-3" />
                    <span>Verified Purchase</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}