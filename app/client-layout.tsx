"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Provider } from "react-redux"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"
import { store } from "@/store"
import Navigation from "@/components/navigation"
import { useClientAuth } from "@/hooks/useClientAuth"

// Pages where navigation should NEVER be shown (regardless of auth status)
const EXCLUDED_PATHS = [
  "/login",
  "/signup",
  "/auth/callback",
  "/auth/verify-email",
  "/auth/reset-password",
  "/auth/resend-verification",
]

// Onboarding paths where navigation should not be shown
const ONBOARDING_PATHS = ["/onboarding"]

// Public pages where navigation should be shown differently
const PUBLIC_ONLY_PATHS = ["/"]

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading } = useClientAuth()
  const [shouldShowNavigation, setShouldShowNavigation] = useState(false)
  
  console.log("🔧 CLIENT LAYOUT DEBUG: LayoutContent render - pathname:", pathname, "user:", !!user, "loading:", loading)

  useEffect(() => {
    // Don't show navigation while loading
    if (loading) {
      setShouldShowNavigation(false)
      return
    }

    // Never show navigation on excluded paths
    if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
      setShouldShowNavigation(false)
      return
    }

    // Never show navigation on onboarding paths
    if (ONBOARDING_PATHS.some((path) => pathname.startsWith(path))) {
      setShouldShowNavigation(false)
      return
    }

    // For authenticated users, always show navigation except on excluded paths
    if (user) {
      setShouldShowNavigation(true)
      return
    }

    // For unauthenticated users on public paths, show navigation
    if (PUBLIC_ONLY_PATHS.includes(pathname)) {
      setShouldShowNavigation(true)
      return
    }

    // Default: hide navigation for unauthenticated users on non-public paths
    setShouldShowNavigation(false)
  }, [pathname, user, loading])

  return (
    <div className="min-h-screen bg-background">
      {shouldShowNavigation && <Navigation />}
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    console.log("🔧 CLIENT LAYOUT DEBUG: ClientLayout useEffect - setting isClient to true")
    setIsClient(true)
  }, [])

  console.log("🔧 CLIENT LAYOUT DEBUG: ClientLayout render - isClient:", isClient)

  if (!isClient) {
    console.log("🔧 CLIENT LAYOUT DEBUG: Not client-side yet, returning null")
    return null
  }

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </ThemeProvider>
    </Provider>
  )
}
