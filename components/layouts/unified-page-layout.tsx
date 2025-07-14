'use client'

import { ReactNode } from 'react'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { cn } from '@/lib/utils'

interface UnifiedPageLayoutProps {
  children: ReactNode
  className?: string
  showTicker?: boolean
  showNavigation?: boolean
}

export function UnifiedPageLayout({
  children,
  className,
  showTicker = true,
  showNavigation = true
}: UnifiedPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray/20 via-white to-stackmatch-blue/5">
      {showTicker && <TickerBanner />}
      {showNavigation && <NavigationWrapper />}
      
      <main className={cn(
        "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        "py-8 sm:py-12",
        className
      )}>
        {children}
      </main>
    </div>
  )
}