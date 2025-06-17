'use client'

import { useState } from 'react'
import { Star, MapPin, Clock, Heart, MessageCircle, Eye, Award, Shield, Briefcase, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

interface SellerCardProps {
  seller: {
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
}

export function SellerCard({ seller }: SellerCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
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
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-slate-100">
                <AvatarImage src={seller.avatar} alt={seller.name} />
                <AvatarFallback className="bg-stackmatch-blue text-white font-semibold">
                  {seller.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {seller.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-trust-green rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-stackmatch-navy hover:text-stackmatch-blue cursor-pointer transition-colors">
                  {seller.name}
                </h3>
                {seller.isVerified && (
                  <Shield className="w-4 h-4 text-trust-green" />
                )}
              </div>
              <p className="text-charcoal font-medium">{seller.title}</p>
              <p className="text-medium-gray text-sm">{seller.company}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-medium-gray" />
                <span className="text-sm text-medium-gray">{seller.location}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            className="text-medium-gray hover:text-red-500 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        {/* Rating and Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-stackmatch-navy">{seller.rating}</span>
              <span className="text-sm text-medium-gray">({seller.reviewCount})</span>
            </div>
            {seller.isTopRated && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                <Award className="w-3 h-3 mr-1" />
                Top Rated
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-sm text-medium-gray">
            <Clock className="w-3 h-3" />
            <span>{seller.responseTime}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {seller.skills.slice(0, 4).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-stackmatch-blue/10 text-stackmatch-blue text-xs hover:bg-stackmatch-blue/20 transition-colors"
              >
                {skill}
              </Badge>
            ))}
            {seller.skills.length > 4 && (
              <Badge
                variant="outline"
                className="text-xs text-medium-gray border-medium-gray/30"
              >
                +{seller.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Experience and Pricing */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center bg-slate-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Briefcase className="w-4 h-4 text-stackmatch-blue" />
              <span className="text-xs text-medium-gray">Experience</span>
            </div>
            <span className="text-sm font-semibold text-stackmatch-navy">{seller.experience}</span>
          </div>
          
          <div className="text-center bg-slate-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-4 h-4 text-trust-green" />
              <span className="text-xs text-medium-gray">Starting at</span>
            </div>
            <span className="text-sm font-semibold text-stackmatch-navy">
              ${seller.startingPrice}{seller.pricingModel === 'hourly' ? '/hr' : seller.pricingModel === 'fixed' ? '/project' : '/hr'}
            </span>
          </div>
        </div>

        {/* Portfolio Preview */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {seller.portfolioImages.slice(0, 3).map((image, index) => (
              <div key={index} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="flex justify-between items-center text-xs text-medium-gray mb-4">
          <span>{seller.completedProjects} projects completed</span>
          <span>{seller.successRate}% success rate</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-stackmatch-blue border-stackmatch-blue hover:bg-stackmatch-blue hover:text-white transition-all"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Profile
            </Button>
            <Button
              size="sm"
              className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white transition-all"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Contact
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full text-trust-green border-trust-green hover:bg-trust-green hover:text-white transition-all"
          >
            Request Quote
          </Button>
        </div>

        {/* Availability Status */}
        <div className="mt-3 text-center">
          <Badge
            variant={seller.availability === 'Available Now' ? 'default' : 'secondary'}
            className={
              seller.availability === 'Available Now'
                ? 'bg-trust-green text-white'
                : 'bg-attention-orange/10 text-attention-orange'
            }
          >
            {seller.availability}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}