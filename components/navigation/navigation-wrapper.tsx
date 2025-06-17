'use client'

import { useState, useEffect } from 'react'
import { GlobalNavigation } from './global-navigation'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  userType: 'buyer' | 'seller'
  isVerified: boolean
  isOnline: boolean
  profileCompletion: number
}

export function NavigationWrapper() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [notificationCount, setNotificationCount] = useState(2)
  const [messageCount, setMessageCount] = useState(0)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setUser({
            id: data.id,
            name: data.full_name || 'User',
            email: data.email,
            avatar: data.avatar_url,
            userType: data.user_type || 'buyer',
            isVerified: data.is_verified || false,
            isOnline: true, // Mock online status
            profileCompletion: data.profile_completion || 75
          })
        }
      } catch (error) {
        console.log('No authenticated user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    // Loading skeleton for navigation
    return (
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="ml-3 w-32 h-6 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24 h-4 bg-slate-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-20 h-8 bg-slate-200 rounded animate-pulse"></div>
              <div className="w-24 h-8 bg-slate-200 rounded animate-pulse"></div>
              <div className="w-28 h-8 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <GlobalNavigation
      user={user}
      notificationCount={notificationCount}
      messageCount={messageCount}
    />
  )
}