import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'

export default function BrowseListingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stackmatch-navy mb-4">
            Browse Project Listings
          </h1>
          <p className="text-xl text-charcoal mb-8">
            Coming soon - Discover available projects to bid on
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-8">
            <div className="text-medium-gray">
              This page will feature:
              <ul className="mt-4 text-left space-y-2">
                <li>• Project listings from buyers</li>
                <li>• Advanced filtering and search</li>
                <li>• Budget and timeline information</li>
                <li>• Proposal submission system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}