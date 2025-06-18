import { Metadata } from 'next'
import OnboardingFlow from '@/components/onboarding/onboarding-flow'

export const metadata: Metadata = {
  title: 'Complete Your Profile | StackMatch',
  description: 'Complete your professional profile to start connecting with the best talent and opportunities on StackMatch',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <OnboardingFlow />
    </div>
  )
}