import { Metadata } from 'next'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import SavedSellersPageContent from '@/components/saved-sellers/saved-sellers-page-content'

export const metadata: Metadata = {
  title: 'Saved Sellers | StackMatch',
  description: 'Manage your bookmarked sellers and favorite service providers. Keep track of top talent for your projects.',
}

export default function SavedSellersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavigationWrapper />
      <SavedSellersPageContent />
    </div>
  )
}