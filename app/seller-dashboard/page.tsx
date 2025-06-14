import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import SellerDashboardClientPage from "./client-page"
import type { UserProfile, SellerProfile, Proposal, Listing } from "@/types"

// Define basic types if not already present in @/types
export interface DashboardProposal extends Proposal {
  client_company_name?: string
}

export interface DashboardListing extends Listing {
  company_name?: string
  budget_min?: number
  budget_max?: number
}

export interface Deadline {
  id: string
  title: string
  due_date: string
  type: "proposal_submission" | "project_milestone"
}

export interface SellerDashboardData {
  userProfile: UserProfile | null
  sellerProfile: SellerProfile | null
  displayName: string
  activeProposalsCount: number
  wonListingsCount: number
  successRate: number
  totalEarned: number
  averageRating: string
  profileViews: number
  recentProposals: DashboardProposal[]
  upcomingDeadlines: Deadline[]
  recommendedListings: DashboardListing[]
}

export default async function SellerDashboardPage() {
  console.log("🔍 DASHBOARD DEBUG: Starting seller dashboard page load...")

  try {
    const cookieStore = cookies()
    console.log("🔍 DASHBOARD DEBUG: Got cookie store")

    // Log all cookies for debugging
    const allCookies = cookieStore.getAll()
    console.log(
      "🔍 DASHBOARD DEBUG: Available cookies:",
      allCookies.map((c) => `${c.name}=${c.value.substring(0, 20)}...`).join(", "),
    )

    // Check for Supabase auth cookies specifically
    const authTokenCookie = cookieStore.get("sb-access-token") || cookieStore.get("supabase-auth-token")
    const refreshTokenCookie = cookieStore.get("sb-refresh-token") || cookieStore.get("supabase-refresh-token")

    console.log("🔍 DASHBOARD DEBUG: Auth token cookie present:", !!authTokenCookie)
    console.log("🔍 DASHBOARD DEBUG: Refresh token cookie present:", !!refreshTokenCookie)

    const supabase = createClient(cookieStore)
    console.log("🔍 DASHBOARD DEBUG: Created Supabase client")

    // Try to get the session first
    console.log("🔍 DASHBOARD DEBUG: About to call getSession()...")
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("🔍 DASHBOARD DEBUG: Session error:", sessionError.message)
      console.error("🔍 DASHBOARD DEBUG: Full session error:", JSON.stringify(sessionError))
    }

    if (sessionData?.session) {
      console.log("🔍 DASHBOARD DEBUG: Session found for user:", sessionData.session.user.email)
    } else {
      console.log("🔍 DASHBOARD DEBUG: No session found, will try getUser() as fallback")
    }

    // Try getUser as a fallback
    console.log("🔍 DASHBOARD DEBUG: About to call getUser()...")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("🔍 DASHBOARD DEBUG: getUser() completed")

    if (authError) {
      console.error("🔍 DASHBOARD DEBUG: Auth error:", authError.message)
      console.error("🔍 DASHBOARD DEBUG: Full auth error:", JSON.stringify(authError))

      // Instead of redirecting immediately, let's try to use the session data if available
      if (!sessionData?.session) {
        console.log("🔍 DASHBOARD DEBUG: No session and auth error, redirecting to login")
        return redirect("/login")
      } else {
        console.log("🔍 DASHBOARD DEBUG: Using session data despite auth error")
        // Continue with session user
      }
    }

    // Use either the user from getUser() or from getSession()
    const currentUser = user || sessionData?.session?.user

    if (!currentUser) {
      console.error("🔍 DASHBOARD DEBUG: No user found from any method, redirecting to login")
      return redirect("/login")
    }

    console.log(`🔍 DASHBOARD DEBUG: User found: ${currentUser.id} (${currentUser.email})`)

    // Initialize default values to prevent errors
    let userProfileData: UserProfile | null = null
    let sellerProfileData: SellerProfile | null = null
    let activeProposalsCount = 0
    const wonListingsCount = 0
    const totalSubmittedProposalsCount = 0
    const totalEarned = 0
    const reviews: any[] = []
    const recentProposalsData: any[] = []

    try {
      console.log("🔍 DASHBOARD DEBUG: Fetching user profile...")
      // Fetch the user's general profile
      const { data: userProfile, error: userProfileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", currentUser.id)
        .single()

      if (userProfileError) {
        console.error("🔍 DASHBOARD DEBUG: User profile error:", userProfileError.message)
      } else {
        console.log("🔍 DASHBOARD DEBUG: User profile fetched successfully:", JSON.stringify(userProfile))
        userProfileData = userProfile
      }

      console.log("🔍 DASHBOARD DEBUG: Fetching seller profile...")
      // Fetch the seller-specific profile with only basic columns that should exist
      const { data: sellerProfile, error: sellerProfileError } = await supabase
        .from("seller_profiles")
        .select("id, user_id")
        .eq("user_id", currentUser.id)
        .single()

      if (sellerProfileError) {
        console.error("🔍 DASHBOARD DEBUG: Seller profile error:", sellerProfileError.message)
        console.error("🔍 DASHBOARD DEBUG: Full seller profile error:", JSON.stringify(sellerProfileError))

        // If it's a "no rows" error, redirect to onboarding
        if (sellerProfileError.code === "PGRST116") {
          console.log("🔍 DASHBOARD DEBUG: No seller profile found, redirecting to onboarding...")
          return redirect("/onboarding/seller")
        } else {
          // For other errors, let's try to continue with minimal data
          console.log("🔍 DASHBOARD DEBUG: Seller profile query failed, but continuing with minimal data...")
          sellerProfileData = { id: "unknown", user_id: currentUser.id } as SellerProfile
        }
      } else if (!sellerProfile) {
        console.error("🔍 DASHBOARD DEBUG: No seller profile found, redirecting to onboarding")
        return redirect("/onboarding/seller")
      } else {
        console.log("🔍 DASHBOARD DEBUG: Seller profile fetched successfully:", JSON.stringify(sellerProfile))
        sellerProfileData = sellerProfile as SellerProfile
      }

      const sellerProfileId = sellerProfileData?.id

      if (sellerProfileId && sellerProfileId !== "unknown") {
        console.log(`🔍 DASHBOARD DEBUG: Starting stats queries for seller profile ID: ${sellerProfileId}`)

        // Fetch stats data with error handling - simplified queries first
        try {
          console.log("🔍 DASHBOARD DEBUG: Fetching active proposals count...")

          // IMPORTANT: Use seller_id instead of seller_profile_id to match the actual column name
          console.log("🔍 DASHBOARD DEBUG: Using seller_id column for proposals query")

          const { count: activeCount, error: activeError } = await supabase
            .from("proposals")
            .select("*", { count: "exact", head: true })
            .eq("seller_id", sellerProfileId)

          if (activeError) {
            console.error("🔍 DASHBOARD DEBUG: Active proposals query error:", activeError.message)
            console.error("🔍 DASHBOARD DEBUG: Full active proposals error:", JSON.stringify(activeError))

            // Try an alternative approach - just get all proposals and count them
            console.log("🔍 DASHBOARD DEBUG: Trying alternative proposals query...")

            const { data: proposalsData, error: altError } = await supabase
              .from("proposals")
              .select("id")
              .eq("seller_id", sellerProfileId)

            if (altError) {
              console.error("🔍 DASHBOARD DEBUG: Alternative proposals query error:", altError.message)
              console.error("🔍 DASHBOARD DEBUG: Full alternative error:", JSON.stringify(altError))
            } else {
              activeProposalsCount = proposalsData?.length || 0
              console.log(`🔍 DASHBOARD DEBUG: Active proposals count (alternative method): ${activeProposalsCount}`)
            }
          } else {
            activeProposalsCount = activeCount || 0
            console.log(`🔍 DASHBOARD DEBUG: Active proposals count: ${activeProposalsCount}`)
          }

          // Try to fetch a few recent proposals for display
          console.log("🔍 DASHBOARD DEBUG: Fetching recent proposals...")
          const { data: recentProposals, error: recentError } = await supabase
            .from("proposals")
            .select("id, listing_id, status, proposed_budget, submitted_at, created_at")
            .eq("seller_id", sellerProfileId)
            .order("created_at", { ascending: false })
            .limit(5)

          if (recentError) {
            console.error("🔍 DASHBOARD DEBUG: Recent proposals query error:", recentError.message)
          } else {
            console.log(`🔍 DASHBOARD DEBUG: Fetched ${recentProposals?.length || 0} recent proposals`)
            recentProposalsData.push(...(recentProposals || []))
          }
        } catch (error) {
          console.error("🔍 DASHBOARD DEBUG: Error fetching active proposals:", error)
          console.error("🔍 DASHBOARD DEBUG: Error details:", error instanceof Error ? error.message : "Unknown error")
        }
      } else {
        console.log("🔍 DASHBOARD DEBUG: No valid seller profile ID, skipping stats queries...")
      }

      // Skip other complex queries for now to isolate the issue
      console.log("🔍 DASHBOARD DEBUG: Skipping other stats queries for debugging...")
    } catch (error) {
      console.error("🔍 DASHBOARD DEBUG: Error in data fetching block:", error)
      // Continue with default values
    }

    const successRate = 0 // Simplified for debugging
    const averageRating = "N/A"
    const recentProposals = recentProposalsData.map((p) => ({
      ...p,
      client_company_name: "Unknown Client", // We'll fetch this later when needed
    })) as DashboardProposal[]
    const upcomingDeadlines: Deadline[] = []
    const recommendedListings: DashboardListing[] = []

    // Use user profile data for display name since seller profile might not have company_name
    const displayName = userProfileData?.full_name || currentUser.email || "Seller"

    console.log(`🔍 DASHBOARD DEBUG: Display name: ${displayName}`)

    const dashboardData: SellerDashboardData = {
      userProfile: userProfileData,
      sellerProfile: sellerProfileData,
      displayName,
      activeProposalsCount,
      wonListingsCount: 0,
      successRate,
      totalEarned: 0,
      averageRating,
      profileViews: 0,
      recentProposals,
      upcomingDeadlines,
      recommendedListings,
    }

    console.log("🔍 DASHBOARD DEBUG: About to render SellerDashboardClientPage...")
    return <SellerDashboardClientPage dashboardData={dashboardData} />
  } catch (error) {
    console.error("🔍 DASHBOARD DEBUG: Uncaught error in seller dashboard:", error)
    console.error("🔍 DASHBOARD DEBUG: Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return redirect("/login")
  }
}
