import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stackmatch-navy mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-charcoal mb-8">
            Transparent pricing for buyers, sellers, and consultants
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-8">
            <div className="text-medium-gray">
              Pricing structure:
              <ul className="mt-4 text-left space-y-2">
                <li>• 5-15% seller commissions</li>
                <li>• 15-20% consultant fees</li>
                <li>• $500-$5K monthly subscriptions</li>
                <li>• Free tier for small projects</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}