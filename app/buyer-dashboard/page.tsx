"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { setUser } from "@/store/slices/authSlice"
import type { User } from "@/types"
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
          // Create a User object with the required fields
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: (typeof profile.full_name === 'string' ? profile.full_name : '') || 
                  (typeof profile.company_name === 'string' ? profile.company_name : '') || 'Unknown',
            userType: profile.user_type === 'buyer' ? 'BUSINESS' : 'PROVIDER',
            createdAt: (typeof profile.created_at === 'string' ? profile.created_at : '') || new Date().toISOString(),
            updatedAt: (typeof profile.updated_at === 'string' ? profile.updated_at : '') || new Date().toISOString(),
          }
          dispatch(setUser(user))
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
    <div className="min-h-screen bg-slate-900">
      {/* Ticker Banner */}
      <div className="bg-slate-800 text-slate-300 py-2 px-4 text-sm overflow-hidden">
        <div className="ticker-container">
          <div className="ticker-content">
            <span className="inline-block mx-8">🚨 Enterprise AWS migration listing awarded to CloudExperts</span>
            <span className="inline-block mx-8">📋 ERP Implementation for Manufacturing due in 24 hours</span>
            <span className="inline-block mx-8">⚡ AI and Machine Learning projects trending with 40% increase</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Welcome back, {user?.full_name || "Christopher Fill"}</h1>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  buyer
                </span>
              </div>
              <p className="text-slate-400">
                StackMatch • Manage your listings and review proposals
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/create-listing">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <span className="text-lg">+</span>
                  Create Listing
                </button>
              </Link>
              <Link href="/deal-rooms">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  📊 Deal Rooms
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Active Listings</p>
                <p className="text-3xl font-bold text-white">4</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Proposals</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Completed Projects</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Listings */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Your Recent Listings</h2>
            
            <div className="space-y-4">
              {/* Listing Item */}
              <div className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">TEST4</h3>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">ACTIVE</span>
                </div>
                <p className="text-slate-400 text-sm mb-2">CRM Software • $50 - $80 • Created 13 days ago</p>
              </div>

              <div className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">TEST3</h3>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">ACTIVE</span>
                </div>
                <p className="text-slate-400 text-sm mb-2">CRM Software • $90 - $90 • Created 13 days ago</p>
              </div>

              <div className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">TEST2</h3>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">ACTIVE</span>
                </div>
                <p className="text-slate-400 text-sm mb-2">CRM Software • $80 - $100 • Created 13 days ago</p>
              </div>

              <div className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">TEST</h3>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">ACTIVE</span>
                </div>
                <p className="text-slate-400 text-sm mb-2">CRM Software • $50 - $60 • Created 13 days ago</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/listings" className="text-blue-400 hover:text-blue-300 text-sm">
                View All Listings →
              </Link>
            </div>
          </div>

          {/* Recent Proposals */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Proposals Received</h2>
            <p className="text-slate-400 text-sm mb-4">Latest proposals submitted to your listings</p>
            
            <div className="space-y-4">
              {/* Proposal Item */}
              <div className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <div>
                      <h3 className="font-medium text-white">TechCorp Solutions</h3>
                      <p className="text-slate-400 text-sm">For: CRM System Implementation</p>
                    </div>
                  </div>
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">SUBMITTED</span>
                </div>
                <p className="text-white font-bold">$45,000.00</p>
                <div className="mt-2 flex gap-2">
                  <button className="text-blue-400 text-sm hover:text-blue-300">👁 View</button>
                </div>
              </div>

              <div className="border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      D
                    </div>
                    <div>
                      <h3 className="font-medium text-white">DevPro Inc</h3>
                      <p className="text-slate-400 text-sm">For: E-commerce Platform Upgrade</p>
                    </div>
                  </div>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">UNDER REVIEW</span>
                </div>
                <p className="text-white font-bold">$32,000.00</p>
                <div className="mt-2 flex gap-2">
                  <button className="text-blue-400 text-sm hover:text-blue-300">👁 View</button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/proposals" className="text-blue-400 hover:text-blue-300 text-sm">
                View All My Proposals →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
