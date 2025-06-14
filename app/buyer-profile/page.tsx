"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { fetchBuyerProfile, clearError } from "@/store/slices/buyerProfileSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import CompanyInformationTab from "@/components/buyer-profile/company-information-tab"
import BudgetTrackingTab from "@/components/buyer-profile/budget-tracking-tab"
import ProjectHistoryTab from "@/components/buyer-profile/project-history-tab"
import PreferredProvidersTab from "@/components/buyer-profile/preferred-providers-tab"
import BuyerVerificationTab from "@/components/buyer-profile/buyer-verification-tab"

export default function BuyerProfilePage() {
  console.log("🔍 BUYER PROFILE PAGE: Component file loaded")

  const dispatch = useAppDispatch()
  const { profile, loading, error, lastFetch } = useAppSelector((state) => state.buyerProfile)
  const { user } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("company-info")

  console.log("🔍 BUYER PROFILE PAGE: Rendering...", {
    hasProfile: !!profile,
    loading,
    error,
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    lastFetch,
    profileData: profile ? "Profile exists" : "No profile",
  })

  useEffect(() => {
    console.log("🔍 BUYER PROFILE PAGE: useEffect triggered")

    if (user && !profile && !loading) {
      console.log("🔍 BUYER PROFILE PAGE: Fetching profile for user:", user.id)
      dispatch(fetchBuyerProfile())
    }
  }, [dispatch, user, profile, loading])

  const handleRefresh = () => {
    console.log("🔍 BUYER PROFILE PAGE: Manual refresh triggered")
    dispatch(clearError())
    dispatch(fetchBuyerProfile())
  }

  const handleClearError = () => {
    dispatch(clearError())
  }

  // Loading state
  if (loading && !profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Profile</h3>
            <p className="text-muted-foreground">Fetching your buyer profile...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Profile Load Error
            </CardTitle>
            <CardDescription>There was an issue loading your buyer profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={handleClearError} variant="ghost">
                Dismiss Error
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>User ID: {user?.id || "Not available"}</p>
              <p>Last Fetch: {lastFetch ? new Date(lastFetch).toLocaleString() : "Never"}</p>
              <p>Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No profile state (user hasn't completed onboarding)
  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>You haven't completed your buyer profile yet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>To access all features, please complete your buyer profile through the onboarding process.</p>

            <div className="flex gap-2">
              <Button onClick={() => (window.location.href = "/onboarding/buyer")}>Complete Onboarding</Button>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state - show profile
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Buyer Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your company information and preferences</p>

        {lastFetch && (
          <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date(lastFetch).toLocaleString()}</p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company-info">Company Info</TabsTrigger>
          <TabsTrigger value="budget-tracking">Budget Tracking</TabsTrigger>
          <TabsTrigger value="project-history">Project History</TabsTrigger>
          <TabsTrigger value="preferred-providers">Preferred Providers</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="company-info">
          {console.log("🔍 BUYER PROFILE PAGE: Rendering CompanyInformationTab")}
          <CompanyInformationTab profile={profile} />
        </TabsContent>

        <TabsContent value="budget-tracking">
          {console.log("🔍 BUYER PROFILE PAGE: Rendering BudgetTrackingTab with profile:", !!profile)}
          <BudgetTrackingTab buyerProfileId={profile?.id || "mock"} />
        </TabsContent>

        <TabsContent value="project-history">
          <ProjectHistoryTab profile={profile} />
        </TabsContent>

        <TabsContent value="preferred-providers">
          <PreferredProvidersTab profile={profile} />
        </TabsContent>

        <TabsContent value="verification">
          <BuyerVerificationTab profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
