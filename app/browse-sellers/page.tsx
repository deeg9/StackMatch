'use client'

import { Suspense } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { PageHeader } from '@/components/ui/page-header'
import { VendorsFiltersSection } from '@/components/browse-sellers/vendors-filters-section'
import { VendorsGrid } from '@/components/browse-sellers/vendors-grid'
import BrowseSellersLoading from './loading'
import { Users } from 'lucide-react'

export default function BrowseSellersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          icon={Users}
          title="Browse Vendors"
          description="Find the perfect vendor for your business"
        />
        
        <div className="mt-8">
          <VendorsFiltersSection />
        </div>

        <div className="mt-8">
          <Suspense fallback={<BrowseSellersLoading />}>
            <VendorsGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}