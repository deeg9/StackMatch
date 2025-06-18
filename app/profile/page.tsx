import { Metadata } from 'next'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import ProfilePageContent from '@/components/profile/profile-page-content'

export const metadata: Metadata = {
  title: 'User Profile | StackMatch',
  description: 'Manage your professional profile, showcase your expertise, and build your reputation on StackMatch',
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavigationWrapper />
      <ProfilePageContent />
    </div>
  )
}