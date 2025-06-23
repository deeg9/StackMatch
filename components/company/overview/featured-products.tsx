'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  ArrowRight, 
  Star, 
  Users, 
  Zap,
  ExternalLink,
  Shield,
  BarChart,
  Cloud
} from 'lucide-react'

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
  icon: any
  color: string
  bgColor: string
  featured: boolean
}

interface FeaturedProductsProps {
  companyId: string
}

export function FeaturedProducts({ companyId }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Mock products data
  const mockProducts: Record<string, Product[]> = {
    'salesforce': [
      {
        id: '1',
        name: 'Sales Cloud',
        category: 'CRM & Sales',
        description: 'Complete sales force automation platform with AI-powered insights, pipeline management, and sales analytics.',
        keyFeatures: ['Lead Management', 'Opportunity Tracking', 'Sales Forecasting', 'Einstein AI'],
        pricing: { model: 'Per user/month', startingPrice: '$25' },
        rating: 4.8,
        userCount: '150K+',
        icon: BarChart,
        color: 'text-trust-green',
        bgColor: 'bg-trust-green/10',
        featured: true
      },
      {
        id: '2',
        name: 'Service Cloud',
        category: 'Customer Service',
        description: 'Comprehensive customer service platform with omnichannel support, case management, and self-service portals.',
        keyFeatures: ['Case Management', 'Knowledge Base', 'Live Chat', 'Field Service'],
        pricing: { model: 'Per user/month', startingPrice: '$25' },
        rating: 4.7,
        userCount: '125K+',
        icon: Users,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10',
        featured: true
      },
      {
        id: '3',
        name: 'Marketing Cloud',
        category: 'Marketing Automation',
        description: 'Digital marketing platform for creating personalized customer journeys across email, mobile, social, and web.',
        keyFeatures: ['Email Marketing', 'Journey Builder', 'Social Studio', 'Analytics'],
        pricing: { model: 'Custom pricing', startingPrice: 'Contact Sales' },
        rating: 4.6,
        userCount: '80K+',
        icon: Zap,
        color: 'text-attention-orange',
        bgColor: 'bg-attention-orange/10',
        featured: true
      },
      {
        id: '4',
        name: 'Commerce Cloud',
        category: 'E-commerce',
        description: 'Unified e-commerce platform for creating seamless shopping experiences across all digital touchpoints.',
        keyFeatures: ['Storefront Management', 'Order Management', 'Inventory', 'Mobile Commerce'],
        pricing: { model: 'Revenue-based', startingPrice: '1.5%' },
        rating: 4.5,
        userCount: '50K+',
        icon: Package,
        color: 'text-purple-600',
        bgColor: 'bg-purple-600/10',
        featured: true
      }
    ],
    'microsoft': [
      {
        id: '1',
        name: 'Microsoft 365',
        category: 'Productivity Suite',
        description: 'Comprehensive productivity platform including Office apps, Teams collaboration, and cloud storage.',
        keyFeatures: ['Office Apps', 'Teams', 'OneDrive', 'SharePoint'],
        pricing: { model: 'Per user/month', startingPrice: '$6' },
        rating: 4.7,
        userCount: '400M+',
        icon: Package,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10',
        featured: true
      },
      {
        id: '2',
        name: 'Azure Cloud',
        category: 'Cloud Infrastructure',
        description: 'Complete cloud computing platform with 200+ services for building, deploying, and managing applications.',
        keyFeatures: ['Compute', 'Storage', 'Networking', 'AI/ML Services'],
        pricing: { model: 'Pay-as-you-go', startingPrice: 'Usage-based' },
        rating: 4.6,
        userCount: '200M+',
        icon: Cloud,
        color: 'text-trust-green',
        bgColor: 'bg-trust-green/10',
        featured: true
      },
      {
        id: '3',
        name: 'Dynamics 365',
        category: 'Business Applications',
        description: 'Intelligent business applications for sales, marketing, service, finance, and operations.',
        keyFeatures: ['CRM', 'ERP', 'HR', 'Project Management'],
        pricing: { model: 'Per user/month', startingPrice: '$20' },
        rating: 4.5,
        userCount: '25M+',
        icon: BarChart,
        color: 'text-attention-orange',
        bgColor: 'bg-attention-orange/10',
        featured: true
      }
    ],
    'oracle': [
      {
        id: '1',
        name: 'Oracle Database',
        category: 'Database Management',
        description: 'World\'s leading autonomous database with self-driving, self-securing, and self-repairing capabilities.',
        keyFeatures: ['Autonomous Operation', 'Multi-Model', 'In-Memory', 'Machine Learning'],
        pricing: { model: 'OCPU/hour', startingPrice: '$0.0395' },
        rating: 4.6,
        userCount: '430K+',
        icon: Shield,
        color: 'text-trust-green',
        bgColor: 'bg-trust-green/10',
        featured: true
      },
      {
        id: '2',
        name: 'ERP Cloud',
        category: 'Enterprise Resource Planning',
        description: 'Complete cloud ERP suite for finance, procurement, project management, and supply chain.',
        keyFeatures: ['Financial Management', 'Procurement', 'Projects', 'Supply Chain'],
        pricing: { model: 'Per user/month', startingPrice: '$175' },
        rating: 4.5,
        userCount: '25K+',
        icon: BarChart,
        color: 'text-stackmatch-blue',
        bgColor: 'bg-stackmatch-blue/10',
        featured: true
      },
      {
        id: '3',
        name: 'HCM Cloud',
        category: 'Human Capital Management',
        description: 'Comprehensive HR solution for talent management, workforce planning, and employee experience.',
        keyFeatures: ['Core HR', 'Talent Management', 'Workforce Planning', 'Payroll'],
        pricing: { model: 'Per employee/month', startingPrice: '$6' },
        rating: 4.4,
        userCount: '20K+',
        icon: Users,
        color: 'text-attention-orange',
        bgColor: 'bg-attention-orange/10',
        featured: true
      }
    ]
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Try API call first
        const response = await fetch(`/api/companies/${companyId}/products?featured=true`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products)
        } else {
          // Fallback to mock data
          const mock = mockProducts[companyId] || mockProducts['salesforce']
          setProducts(mock)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to mock data
        const mock = mockProducts[companyId] || mockProducts['salesforce']
        setProducts(mock)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [companyId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                  <div className="h-6 bg-slate-200 rounded w-20"></div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-stackmatch-blue" />
          <h2 className="text-2xl font-bold text-stackmatch-navy">Featured Products</h2>
        </div>
        <Button variant="outline" className="border-stackmatch-blue text-stackmatch-blue hover:bg-stackmatch-blue hover:text-white">
          View All Products
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => {
          const IconComponent = product.icon
          return (
            <Card key={product.id} className="border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${product.bgColor} flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${product.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-stackmatch-navy group-hover:text-stackmatch-blue transition-colors">
                        {product.name}
                      </h3>
                      <Badge variant="secondary" className="bg-slate-100 text-charcoal text-xs mt-1">
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-stackmatch-navy">{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-medium-gray" />
                          <span className="text-sm text-medium-gray">{product.userCount} users</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-charcoal leading-relaxed">
                    {product.description}
                  </p>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-stackmatch-navy">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.keyFeatures.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-slate-300 text-charcoal">
                          {feature}
                        </Badge>
                      ))}
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
        })}
      </div>
    </div>
  )
}