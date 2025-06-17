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

  // Only show navigation for authenticated users
  if (loading) {
    // Return null during loading to avoid flash
    return null
  }

  // Only render the global navigation if user is authenticated
  if (!user) {
    return null
  }

  return (
    <GlobalNavigation
      user={user}
      notificationCount={notificationCount}
      messageCount={messageCount}
    />
  )
}