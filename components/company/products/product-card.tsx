'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Users, ExternalLink, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  description: string
  keyFeatures: string[]
  pricing: {
    model: string
    startingPrice: string
  }
  rating: number
  userCount: string
  icon: string
  color: string
  bgColor: string
  featured: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-stackmatch-blue/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-stackmatch-blue" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-stackmatch-navy group-hover:text-stackmatch-blue transition-colors">
                {product.name}
              </h3>
              <Badge variant="secondary" className="bg-slate-100 text-charcoal text-xs mt-1">
                {product.category}
              </Badge>
              {product.featured && (
                <Badge className="bg-trust-green text-white text-xs mt-1 ml-2">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Rating & Users */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-stackmatch-navy">{product.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-medium-gray" />
              <span className="text-sm text-medium-gray">{product.userCount} users</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-charcoal leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-stackmatch-navy">Key Features</h4>
            <div className="flex flex-wrap gap-1">
              {product.keyFeatures.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs border-slate-300 text-charcoal">
                  {feature}
                </Badge>
              ))}
              {product.keyFeatures.length > 3 && (
                <Badge variant="outline" className="text-xs border-slate-300 text-medium-gray">
                  +{product.keyFeatures.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-medium-gray">{product.pricing.model}</div>
                <div className="text-sm font-semibold text-stackmatch-navy">
                  Starting at {product.pricing.startingPrice}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-stackmatch-blue hover:text-stackmatch-navy hover:bg-stackmatch-blue/10"
              >
                Learn More
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}