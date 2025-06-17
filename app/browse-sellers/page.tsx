import { Suspense } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { BrowseSellersHeader } from '@/components/browse-sellers/browse-sellers-header'
import { SellersFiltersSection } from '@/components/browse-sellers/sellers-filters-section'
import { SellersGrid } from '@/components/browse-sellers/sellers-grid'
import BrowseSellersLoading from './loading'

export default function BrowseSellersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        <BrowseSellersHeader />
        
        <div className="mt-8">
          <SellersFiltersSection />
        </div>

        <div className="mt-8">
          <Suspense fallback={<BrowseSellersLoading />}>
            <SellersGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}