'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompanyOverview } from './overview/company-overview'
import { ProductsServices } from './products/products-services'
import { CaseStudiesReviews } from './reviews/case-studies-reviews'
import { CompanyInfo } from './company-info/company-info'
import { Resources } from './resources/resources'
import { 
  Building2, 
  Package, 
  Star, 
  Info, 
  FileText, 
  Users, 
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react'

interface CompanyTabsProps {
  companyId: string
}

export function CompanyTabs({ companyId }: CompanyTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    {
      value: 'overview',
      label: 'Overview',
      icon: Building2,
      description: 'Company snapshot and highlights'
    },
    {
      value: 'products',
      label: 'Products & Services',
      icon: Package,
      description: 'Full product catalog and offerings'
    },
    {
      value: 'reviews',
      label: 'Case Studies & Reviews',
      icon: Star,
      description: 'Customer success stories and testimonials'
    },
    {
      value: 'company-info',
      label: 'Company Info',
      icon: Info,
      description: 'Detailed company information'
    },
    {
      value: 'resources',
      label: 'Resources',
      icon: FileText,
      description: 'Documentation and learning materials'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50/50">
          <TabsList className="grid w-full grid-cols-5 bg-transparent p-0 h-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative flex flex-col items-center gap-2 p-4 text-center data-[state=active]:bg-white data-[state=active]:text-stackmatch-blue data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-stackmatch-blue transition-all duration-200 hover:bg-white/50"
                >
                  <IconComponent className="w-5 h-5" />
                  <div>
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div className="text-xs text-medium-gray mt-1 hidden lg:block">
                      {tab.description}
                    </div>
                  </div>
                  
                  {/* Active Tab Indicator */}
                  {activeTab === tab.value && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stackmatch-blue" />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <TabsContent value="overview" className="mt-0 space-y-6">
            <CompanyOverview companyId={companyId} />
          </TabsContent>

          <TabsContent value="products" className="mt-0 space-y-6">
            <ProductsServices companyId={companyId} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 space-y-6">
            <CaseStudiesReviews companyId={companyId} />
          </TabsContent>

          <TabsContent value="company-info" className="mt-0 space-y-6">
            <CompanyInfo companyId={companyId} />
          </TabsContent>

          <TabsContent value="resources" className="mt-0 space-y-6">
            <Resources companyId={companyId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}