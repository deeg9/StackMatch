'use client'

import { useState } from 'react'
import { Star, MapPin, Users, Calendar, CheckCircle, Award, Building2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RequestQuoteModal } from './request-quote-modal'
import { QuoteRequestToast } from './quote-request-success'
import { Vendor, QuoteRequestData } from '@/types/quote-request'

interface VendorCardProps {
  vendor: {
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
}

export function VendorCard({ vendor }: VendorCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Convert vendor data to match Vendor type for the modal
  const vendorForModal: Vendor = {
    id: vendor.id,
    name: vendor.companyName,
    logo: vendor.companyLogoUrl,
    description: vendor.companyBio,
    categories: vendor.featuredProducts || [],
    location: vendor.location,
    founded: vendor.foundedYear,
    employeeCount: vendor.employeeCount,
    pricing: {
      tier: 'Contact for pricing',
      startingPrice: 'Custom'
    }
  }

  const handleQuoteSubmit = (quoteData: QuoteRequestData) => {
    // Handle quote submission - this would typically send to an API
    console.log('Quote request submitted:', quoteData)
    
    // Show success toast
    setShowSuccessToast(true)
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white ${
        isHovered ? 'shadow-2xl border-stackmatch-blue/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        {/* Card Header - Company Identity */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={vendor.companyLogoUrl}
                alt={`${vendor.companyName} logo`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    const icon = document.createElement('div')
                    icon.innerHTML = '<svg class="w-8 h-8 text-stackmatch-blue" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4zm2 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm6 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" clip-rule="evenodd"></path></svg>'
                    parent.appendChild(icon)
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-stackmatch-navy hover:text-stackmatch-blue cursor-pointer transition-colors">
                {vendor.companyName}
              </h3>
              {vendor.isVerified && (
                <CheckCircle className="w-5 h-5 text-stackmatch-blue" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-medium-gray">
              <span>{vendor.industry}</span>
              <span>•</span>
              <span>{vendor.employeeCount} employees</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-medium-gray" />
              <span className="text-sm text-medium-gray">{vendor.headquarters}</span>
            </div>
          </div>
        </div>

        {/* Badges & Bio */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-stackmatch-navy">{vendor.rating}</span>
              <span className="text-sm text-medium-gray">({vendor.reviewCount} reviews)</span>
            </div>
            {vendor.isTopRated && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                <Award className="w-3 h-3 mr-1" />
                Top Rated
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-charcoal leading-relaxed mb-3">
            {vendor.companyBio}
          </p>

          <div className="flex items-center justify-between text-xs text-medium-gray">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Founded {vendor.foundedYear}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{vendor.clientCount}+ clients</span>
            </div>
          </div>
        </div>

        {/* Featured Products/Services Section */}
        <div className="mb-6">
          <h4 className="font-semibold text-stackmatch-navy mb-3 text-sm">
            Featured Products & Services
          </h4>
          <div className="space-y-2">
            {vendor.featuredProducts.slice(0, 4).map((product, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-stackmatch-blue rounded-full"></div>
                <span className="text-sm text-charcoal">{product}</span>
              </div>
            ))}
            {vendor.featuredProducts.length > 4 && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-medium-gray rounded-full"></div>
                <span className="text-sm text-medium-gray">
                  +{vendor.featuredProducts.length - 4} more solutions
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Block */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-stackmatch-blue border-stackmatch-blue hover:bg-stackmatch-blue hover:text-white transition-all"
            onClick={() => window.location.href = `/company/${vendor.id}`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          
          <Button
            size="sm"
            className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white transition-all"
            onClick={() => setIsQuoteModalOpen(true)}
          >
            Request Quote
          </Button>
        </div>

        {/* Enterprise Trust Indicators */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-medium-gray">Since</div>
              <div className="text-sm font-semibold text-stackmatch-navy">{vendor.foundedYear}</div>
            </div>
            <div>
              <div className="text-xs text-medium-gray">Clients</div>
              <div className="text-sm font-semibold text-stackmatch-navy">{vendor.clientCount}+</div>
            </div>
            <div>
              <div className="text-xs text-medium-gray">Rating</div>
              <div className="text-sm font-semibold text-stackmatch-navy">{vendor.rating}/5</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Request Quote Modal */}
      <RequestQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        vendor={vendorForModal}
        onSubmit={handleQuoteSubmit}
      />
      
      {/* Success Toast */}
      <QuoteRequestToast
        vendorName={vendor.companyName}
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </Card>
  )
}