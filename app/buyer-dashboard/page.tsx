"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { setUser } from "@/store/slices/authSlice"
import { BuyerDashboardStats } from "@/components/buyer-dashboard/buyer-dashboard-stats"
import { RecentListingsSection } from "@/components/buyer-dashboard/recent-listings-section"
import { RecentProposalsSection } from "@/components/buyer-dashboard/recent-proposals-section"
import Link from "next/link"

export default function BuyerDashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [localUser, setLocalUser] = useState<any>(null)

  // Safely get user from Redux store with fallback
  const reduxUser = useSelector((state: RootState) => {
    try {
      return state?.auth?.user || null
    } catch (err) {
      console.warn("Redux state access error:", err)
      return null
    }
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Always check Supabase session first for most up-to-date info
        const supabase = createClient()
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setError(sessionError.message)
          setLoading(false)
          return
        }

        if (!session?.user) {
          router.push("/login")
          return
        }

        // Get user profile to determine user type
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error("Profile fetch error:", profileError)
          setError("Failed to load user profile")
          setLoading(false)
          return
        }

        if (!profile) {
          router.push("/login")
          return
        }

        if (profile.user_type !== "buyer") {
          router.push("/login")
          return
        }

        const userData = {
          id: session.user.id,
          email: session.user.email,
          user_type: profile.user_type,
          full_name: profile.full_name,
          company_name: profile.company_name,
          avatar_url: profile.avatar_url,
        }

        setLocalUser(userData)

        // Update Redux store if it doesn't have the user
        if (!reduxUser) {
          dispatch(setUser(userData))
        }
      } catch (err: any) {
        console.error("Error checking auth:", err)
        setError(err.message || "Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, dispatch, reduxUser])

  // Use either Redux user or local user
  const user = reduxUser || localUser

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-destructive mb-2">Authentication Error</h2>
            <p className="text-destructive/80 mb-4">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to access your dashboard</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">Welcome back, {user?.full_name || "User"}</h1>
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    buyer
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {user?.company_name || "StackMatch"} • Manage your listings and review proposals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/create-listing">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <span className="text-lg">+</span>
                  Create Listing
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <BuyerDashboardStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Listings */}
          <div>
            <RecentListingsSection />
          </div>

          {/* Recent Proposals */}
          <div>
            <RecentProposalsSection />
          </div>
        </div>
      </div>
    </div>
  )
}
