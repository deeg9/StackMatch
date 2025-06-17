'use client'

import { useState, useEffect } from 'react'
import { SellerCard } from './seller-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star, TrendingUp } from 'lucide-react'

interface Seller {
  id: string
  name: string
  title: string
  company: string
  location: string
  avatar: string
  rating: number
  reviewCount: number
  responseTime: string
  isOnline: boolean
  isTopRated: boolean
  skills: string[]
  experience: string
  startingPrice: number
  pricingModel: 'hourly' | 'fixed' | 'both'
  completedProjects: number
  successRate: number
  portfolioImages: string[]
  isVerified: boolean
  languages: string[]
  availability: string
}

export function SellersGrid() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [featuredSellers, setFeaturedSellers] = useState<Seller[]>([])

  // Mock data for demonstration
  const mockSellers: Seller[] = [
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
      pricingModel: 'hourly',
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
      pricingModel: 'hourly',
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
      pricingModel: 'fixed',
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
      pricingModel: 'hourly',
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
      pricingModel: 'hourly',
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
      pricingModel: 'hourly',
      completedProjects: 19,
      successRate: 100,
      portfolioImages: ['/api/placeholder/200/200', '/api/placeholder/200/200', '/api/placeholder/200/200'],
      isVerified: true,
      languages: ['English', 'Arabic'],
      availability: 'Within 1 Month'
    }
  ]

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/sellers?page=1&limit=20')
        if (response.ok) {
          const data = await response.json()
          setSellers(data.sellers.length > 0 ? data.sellers : mockSellers)
          setFeaturedSellers((data.sellers.length > 0 ? data.sellers : mockSellers).filter((seller: Seller) => seller.isTopRated).slice(0, 3))
          setTotalPages(data.pagination?.totalPages || Math.ceil(mockSellers.length / 6))
        } else {
          // Fallback to mock data if API fails
          setSellers(mockSellers)
          setFeaturedSellers(mockSellers.filter(seller => seller.isTopRated).slice(0, 3))
          setTotalPages(Math.ceil(mockSellers.length / 6))
        }
      } catch (error) {
        console.error('Error fetching sellers:', error)
        // Fallback to mock data
        setSellers(mockSellers)
        setFeaturedSellers(mockSellers.filter(seller => seller.isTopRated).slice(0, 3))
        setTotalPages(Math.ceil(mockSellers.length / 6))
      } finally {
        setLoading(false)
      }
    }

    fetchSellers()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Featured Sellers Skeleton */}
        <div className="bg-gradient-to-r from-stackmatch-navy to-stackmatch-blue rounded-xl p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 rounded-lg p-4 h-32"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                  <div className="h-6 bg-slate-200 rounded w-20"></div>
                  <div className="h-6 bg-slate-200 rounded w-18"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Featured Sellers Section */}
      <div className="bg-gradient-to-r from-stackmatch-navy to-stackmatch-blue rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold">Featured Top Sellers</h2>
          <TrendingUp className="w-5 h-5 text-trust-green" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredSellers.map((seller) => (
            <div key={seller.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
                <div>
                  <h3 className="font-semibold">{seller.name}</h3>
                  <p className="text-sm text-white/80">{seller.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{seller.rating}</span>
                  <span className="text-sm text-white/70">({seller.reviewCount})</span>
                </div>
                <div className="text-sm">
                  ${seller.startingPrice}{seller.pricingModel === 'hourly' ? '/hr' : '/project'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <SellerCard key={seller.id} seller={seller} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
        <div className="text-sm text-medium-gray">
          Showing 1-{sellers.length} of 2,847 sellers
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className={currentPage === i + 1 ? "bg-stackmatch-blue" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}