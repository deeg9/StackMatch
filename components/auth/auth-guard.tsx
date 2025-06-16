"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/slices/authSlice"
import { createClient } from "@/utils/supabase/client"

interface AuthGuardProps {
  children: React.ReactNode
  requiredUserType?: "buyer" | "seller"
  redirectTo?: string
}

export function AuthGuard({ children, requiredUserType, redirectTo = "/login" }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔍 AUTH GUARD: Starting auth check...")
        console.log("🔍 AUTH GUARD: Required user type:", requiredUserType)

        const supabase = createClient()
        console.log("🔍 AUTH GUARD: Supabase client created")

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("🔍 AUTH GUARD: Session check completed:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          sessionError: sessionError?.message,
        })

        if (sessionError || !session || !session.user) {
          console.log("🔍 AUTH GUARD: No valid session, redirecting to login")
          router.push(redirectTo)
          return
        }

        const user = session.user
        console.log("🔍 AUTH GUARD: User found:", user.email)

        // Fetch user profile
        console.log("🔍 AUTH GUARD: Fetching profile...")
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        console.log("🔍 AUTH GUARD: Profile fetch result:", {
          hasProfile: !!profile,
          userType: profile?.user_type,
          error: profileError?.message,
        })

        if (profileError || !profile) {
          console.error("🔍 AUTH GUARD: Profile error:", profileError)
          router.push(redirectTo)
          return
        }

        // Update Redux store
        dispatch(
          setUser({
            id: profile.id as string,
            email: profile.email as string,
            name: (profile.full_name || profile.company_name || profile.email) as string,
            userType: (profile.user_type as "BUSINESS" | "PROVIDER" | "ADMIN") || "BUSINESS",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        )

        console.log("🔍 AUTH GUARD: Redux store updated")

        // Check user type requirements
        if (!requiredUserType) {
          console.log("🔍 AUTH GUARD: No user type required, allowing access")
          setIsAuthorized(true)
          return
        }

        if (requiredUserType === "buyer") {
          console.log("🔍 AUTH GUARD: Checking buyer requirements...")

          if (profile.user_type !== "buyer") {
            console.log("🔍 AUTH GUARD: User is not a buyer, redirecting")
            router.push("/onboarding/buyer")
            return
          }

          // Check for buyer profile
          const { data: buyerProfile, error: buyerError } = await supabase
            .from("buyer_profiles")
            .select("id")
            .eq("user_id", user.id)
            .single()

          console.log("🔍 AUTH GUARD: Buyer profile check:", {
            hasProfile: !!buyerProfile,
            error: buyerError?.message,
          })

          if (buyerError || !buyerProfile) {
            console.log("🔍 AUTH GUARD: No buyer profile, redirecting to onboarding")
            router.push("/onboarding/buyer")
            return
          }

          console.log("🔍 AUTH GUARD: Buyer authorized!")
          setIsAuthorized(true)
        } else if (requiredUserType === "seller") {
          console.log("🔍 AUTH GUARD: Checking seller requirements...")

          const { data: sellerProfile, error: sellerError } = await supabase
            .from("seller_profiles")
            .select("id")
            .eq("user_id", user.id)
            .single()

          console.log("🔍 AUTH GUARD: Seller profile check:", {
            hasProfile: !!sellerProfile,
            error: sellerError?.message,
          })

          if (sellerError || !sellerProfile) {
            console.log("🔍 AUTH GUARD: No seller profile, redirecting to onboarding")
            router.push("/onboarding/seller")
            return
          }

          console.log("🔍 AUTH GUARD: Seller authorized!")
          setIsAuthorized(true)
        }
      } catch (error) {
        console.error("🔍 AUTH GUARD: Unexpected error:", error)
        router.push(redirectTo)
      } finally {
        console.log("🔍 AUTH GUARD: Setting loading to false")
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requiredUserType, redirectTo, router, dispatch])

  console.log("🔍 AUTH GUARD: Render state:", { isLoading, isAuthorized })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-slate-400">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
