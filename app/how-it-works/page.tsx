import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stackmatch-navy mb-4">
            How StackMatch Works
          </h1>
          <p className="text-xl text-charcoal mb-8">
            Learn how our platform transforms software procurement
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-8">
            <div className="text-medium-gray">
              This page will explain:
              <ul className="mt-4 text-left space-y-2">
                <li>• The three-sided marketplace concept</li>
                <li>• How buyers post projects</li>
                <li>• How sellers submit proposals</li>
                <li>• The role of procurement consultants</li>
                <li>• Deal room collaboration process</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}