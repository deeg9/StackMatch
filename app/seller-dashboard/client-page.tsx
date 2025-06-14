"use client"

import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { SellerDashboardStats } from "@/components/seller-dashboard/seller-dashboard-stats"
import { RecentProposalsSection } from "@/components/seller-dashboard/recent-proposals-section"
import { UpcomingDeadlinesSection } from "@/components/seller-dashboard/upcoming-deadlines-section"
import { RecommendedListingsSection } from "@/components/seller-dashboard/recommended-listings-section"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Search } from "lucide-react"
import type { SellerDashboardData } from "./page" // Import the data type

interface SellerDashboardClientPageProps {
  dashboardData: SellerDashboardData
}

const SellerDashboardClientPage = ({ dashboardData }: SellerDashboardClientPageProps) => {
  const router = useRouter()

  const {
    userProfile,
    sellerProfile,
    displayName,
    activeProposalsCount,
    wonListingsCount,
    successRate,
    totalEarned,
    averageRating,
    profileViews,
    recentProposals,
    upcomingDeadlines,
    recommendedListings,
  } = dashboardData

  if (!sellerProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-2xl font-bold mb-4">Seller Profile Required</h1>
        <p className="text-muted-foreground mb-6">
          A seller profile is required to access this page. You may be redirected.
        </p>
        <Button onClick={() => router.push("/onboarding/seller")}>Complete Seller Onboarding</Button>
      </div>
    )
  }

  return (
    <AuthGuard requiredUserType="seller" userProfileId={sellerProfile.user_id}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center gap-3 mb-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userProfile?.avatar_url || undefined} alt={displayName} />
                  <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName}</h1>
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs sm:text-sm rounded-full font-medium">
                  Seller
                </span>
              </div>
              <p className="text-muted-foreground">Track your proposals and discover new listings.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={() => router.push("/seller-profile")} className="w-full sm:w-auto">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
              <Button onClick={() => router.push("/browse-listings")} className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Find Listings
              </Button>
            </div>
          </div>

          <SellerDashboardStats
            activeProposalsCount={activeProposalsCount}
            wonListingsCount={wonListingsCount}
            successRate={successRate}
            totalEarned={totalEarned}
            profileRating={averageRating}
            profileViews={profileViews}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentProposalsSection proposals={recentProposals} />
            </div>
            <div className="lg:col-span-1">
              <UpcomingDeadlinesSection deadlines={upcomingDeadlines} />
            </div>
          </div>

          <RecommendedListingsSection listings={recommendedListings} />
        </div>
      </div>
    </AuthGuard>
  )
}

export default SellerDashboardClientPage
