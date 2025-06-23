'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CaseStudiesGrid } from './case-studies-grid'
import { ReviewsSection } from './reviews-section'
import { Award, Star } from 'lucide-react'

interface CaseStudiesReviewsProps {
  companyId: string
}

export function CaseStudiesReviews({ companyId }: CaseStudiesReviewsProps) {
  const [activeTab, setActiveTab] = useState('case-studies')

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Sub-Tab Navigation */}
        <div className="border-b border-slate-200">
          <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="case-studies"
              className="flex items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:text-stackmatch-blue data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-stackmatch-blue"
            >
              <Award className="w-4 h-4" />
              <span className="font-semibold">Case Studies</span>
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="flex items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:text-stackmatch-blue data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-stackmatch-blue"
            >
              <Star className="w-4 h-4" />
              <span className="font-semibold">Verified Reviews</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value="case-studies" className="mt-6">
          <CaseStudiesGrid companyId={companyId} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsSection companyId={companyId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}