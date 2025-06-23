'use client'

import { useState, useEffect } from 'react'
import { VendorCard } from './vendor-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star, TrendingUp, Building2 } from 'lucide-react'

interface Vendor {
  id: string
  companyName: string
  companyLogoUrl: string
  isVerified: boolean
  isTopRated: boolean
  companyBio: string
  featuredProducts: string[]
  industry: string
  location: string
  foundedYear: number
  employeeCount: string
  website: string
  rating: number
  reviewCount: number
  clientCount: number
  headquarters: string
}

export function VendorsGrid() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([])

  // Mock enterprise vendor data
  const mockVendors: Vendor[] = [
    {
      id: 'salesforce',
      companyName: 'Salesforce',
      companyLogoUrl: '/api/placeholder/64/64',
      isVerified: true,
      isTopRated: true,
      companyBio: 'World\'s #1 CRM platform helping businesses connect with customers in a whole new way.',
      featuredProducts: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Commerce Cloud', 'Analytics Cloud'],
      industry: 'Enterprise Software',
      location: 'Global',
      foundedYear: 1999,
      employeeCount: '70,000+',
      website: 'salesforce.com',
      rating: 4.8,
      reviewCount: 12847,
      clientCount: 150000,
      headquarters: 'San Francisco, CA'
    },
    {
      id: 'microsoft',
      companyName: 'Microsoft',
      companyLogoUrl: '/api/placeholder/64/64',
      isVerified: true,
      isTopRated: true,
      companyBio: 'Empowering every person and organization on the planet to achieve more with cloud computing and productivity solutions.',
      featuredProducts: ['Microsoft 365', 'Azure Cloud', 'Teams', 'Power Platform', 'Dynamics 365'],
      industry: 'Cloud Computing',
      location: 'Global',
      foundedYear: 1975,
      employeeCount: '220,000+',
      website: 'microsoft.com',
      rating: 4.7,
      reviewCount: 8923,
      clientCount: 250000,
      headquarters: 'Redmond, WA'
    },
    {
      id: 'oracle',
      companyName: 'Oracle',
      companyLogoUrl: '/api/placeholder/64/64',
      isVerified: true,
      isTopRated: true,
      companyBio: 'Integrated cloud applications and platform services that help organizations modernize their business.',
      featuredProducts: ['Oracle Database', 'ERP Cloud', 'HCM Cloud', 'Cloud Infrastructure', 'Analytics Cloud'],
      industry: 'Database & Cloud',
      location: 'Global',
      foundedYear: 1977,
      employeeCount: '140,000+',
      website: 'oracle.com',
      rating: 4.6,
      reviewCount: 5671,
      clientCount: 430000,
      headquarters: 'Austin, TX'
    },
    {
      id: 'sap',
      companyName: 'SAP',
      companyLogoUrl: '/api/placeholder/64/64',
      isVerified: true,
      isTopRated: false,
      companyBio: 'World leader in enterprise application software, helping companies run better and improve people\'s lives.',
      featuredProducts: ['SAP S/4HANA', 'SuccessFactors', 'Ariba', 'Concur', 'Analytics Cloud'],
      industry: 'Enterprise Software',
      location: 'Global',
      foundedYear: 1972,
      employeeCount: '110,000+',
      website: 'sap.com',
      rating: 4.5,
      reviewCount: 4392,
      clientCount: 440000,
      headquarters: 'Walldorf, Germany'
    },
    {
      id: 'adobe',
      companyName: 'Adobe',
      companyLogoUrl: '/api/placeholder/64/64',
      isVerified: true,
      isTopRated: true,
      companyBio: 'Changing the world through digital experiences with creative and marketing cloud solutions.',
      featuredProducts: ['Creative Cloud', 'Experience Cloud', 'Document Cloud', 'Adobe Analytics', 'Campaign'],
      industry: 'Digital Experience',
      location: 'Global',
      foundedYear: 1982,
      employeeCount: '28,000+',
      website: 'adobe.com',
      rating: 4.9,
      reviewCount: 7234,
      clientCount: 25000,
      headquarters: 'San Jose, CA'
    },
    {
      id: 'workday',
      companyName: 'Workday',
      companyLogoUrl: '/api/placeholder/64/64',
      isVerified: true,
      isTopRated: true,
      companyBio: 'Leading provider of enterprise cloud applications for finance and human resources.',
      featuredProducts: ['Human Capital Management', 'Financial Management', 'Planning', 'Analytics', 'Payroll'],
      industry: 'HR & Finance Software',
      location: 'Global',
      foundedYear: 2005,
      employeeCount: '17,000+',
      website: 'workday.com',
      rating: 4.7,
      reviewCount: 3456,
      clientCount: 10000,
      headquarters: 'Pleasanton, CA'
    },
    {
      id: 'servicenow',
      companyName: 'ServiceNow',
      companyLogoUrl: '/api/placeholder/64/64',
      isVerified: true,
      isTopRated: false,
      companyBio: 'Digital workflows that create great experiences and unlock productivity for employees and customers.',
      featuredProducts: ['IT Service Management', 'HR Service Delivery', 'Security Operations', 'App Engine', 'Platform'],
      industry: 'Digital Workflow',
      location: 'Global',
      foundedYear: 2004,
      employeeCount: '20,000+',
      website: 'servicenow.com',
      rating: 4.6,
      reviewCount: 2891,
      clientCount: 7700,
      headquarters: 'Santa Clara, CA'
    },
    {
      id: 'shopify',
      companyName: 'Shopify',
      companyLogoUrl: '/api/placeholder/64/64',
      isVerified: true,
      isTopRated: true,
      companyBio: 'Commerce platform that lets anyone start, manage, and grow a business online and in-person.',
      featuredProducts: ['Shopify Plus', 'POS System', 'Payments', 'Shipping', 'Marketing Tools'],
      industry: 'E-commerce Platform',
      location: 'Global',
      foundedYear: 2006,
      employeeCount: '12,000+',
      website: 'shopify.com',
      rating: 4.8,
      reviewCount: 9876,
      clientCount: 4000000,
      headquarters: 'Ottawa, Canada'
    }
  ]

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/vendors?page=1&limit=20')
        if (response.ok) {
          const data = await response.json()
          setVendors(data.vendors.length > 0 ? data.vendors : mockVendors)
          setFeaturedVendors((data.vendors.length > 0 ? data.vendors : mockVendors).filter((vendor: Vendor) => vendor.isTopRated).slice(0, 3))
          setTotalPages(data.pagination?.totalPages || Math.ceil(mockVendors.length / 6))
        } else {
          // Fallback to mock data if API fails
          setVendors(mockVendors)
          setFeaturedVendors(mockVendors.filter(vendor => vendor.isTopRated).slice(0, 3))
          setTotalPages(Math.ceil(mockVendors.length / 6))
        }
      } catch (error) {
        console.error('Error fetching vendors:', error)
        // Fallback to mock data
        setVendors(mockVendors)
        setFeaturedVendors(mockVendors.filter(vendor => vendor.isTopRated).slice(0, 3))
        setTotalPages(Math.ceil(mockVendors.length / 6))
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Featured Vendors Skeleton */}
        <div className="bg-gradient-to-r from-stackmatch-navy to-stackmatch-blue rounded-xl p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-64 mb-4"></div>
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
                <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Featured Enterprise Vendors Section */}
      <div className="bg-gradient-to-r from-stackmatch-navy to-stackmatch-blue rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold">Featured Enterprise Vendors</h2>
          <TrendingUp className="w-5 h-5 text-trust-green" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{vendor.companyName}</h3>
                  <p className="text-sm text-white/80">{vendor.industry}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{vendor.rating}</span>
                  <span className="text-sm text-white/70">({vendor.reviewCount})</span>
                </div>
                <div className="text-sm">
                  {vendor.clientCount.toLocaleString()}+ clients
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
        <div className="text-sm text-medium-gray">
          Showing 1-{vendors.length} of 2,847 vendors
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