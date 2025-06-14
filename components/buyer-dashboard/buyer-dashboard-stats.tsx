"use client"

import { useEffect, useState } from "react"
import { FileText, Users, TrendingUp, DollarSign } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  activeListings: number
  totalProposals: number
  successRate: number
  totalInvested: number
}

export function BuyerDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    totalProposals: 0,
    successRate: 0,
    totalInvested: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)

        console.log("🔍 STATS: Fetching dashboard statistics...")

        const { data: user } = await createClient().auth.getUser()

        if (!user || !user.user) {
          console.error("🔍 STATS: User not authenticated")
          setIsLoading(false)
          return
        }

        console.log("🔍 STATS: User ID:", user.user.id)

        // Fetch active listings count
        const { count: activeListingsCount, error: listingsError } = await createClient()
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("buyer_id", user.user.id)
          .eq("status", "ACTIVE")

        if (listingsError) {
          console.error("🔍 STATS: Error fetching active listings:", listingsError)
        }

        // Fetch total proposals count for user's listings
        const { count: totalProposalsCount, error: proposalsError } = await createClient()
          .from("proposals")
          .select(
            `
            *,
            listings!inner(buyer_id)
          `,
            { count: "exact", head: true },
          )
          .eq("listings.buyer_id", user.user.id)

        if (proposalsError) {
          console.error("🔍 STATS: Error fetching proposals:", proposalsError)
        }

        // Fetch completed projects count
        const { count: completedCount, error: completedError } = await createClient()
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("buyer_id", user.user.id)
          .eq("status", "COMPLETED")

        if (completedError) {
          console.error("🔍 STATS: Error fetching completed projects:", completedError)
        }

        // Calculate success rate
        const totalListings = await createClient()
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("buyer_id", user.user.id)

        const successRate =
          totalListings.count && totalListings.count > 0
            ? Math.round(((completedCount || 0) / totalListings.count) * 100)
            : 0

        // Calculate total invested (sum of budgets from completed projects)
        const { data: completedProjects, error: investedError } = await createClient()
          .from("listings")
          .select("budget_min, budget_max")
          .eq("buyer_id", user.user.id)
          .eq("status", "COMPLETED")

        let totalInvested = 0
        if (!investedError && completedProjects) {
          totalInvested = completedProjects.reduce((sum, project) => {
            const budget = project.budget_max || project.budget_min || 0
            return sum + budget
          }, 0)
        }

        console.log("🔍 STATS: Statistics calculated:", {
          activeListings: activeListingsCount || 0,
          totalProposals: totalProposalsCount || 0,
          successRate,
          totalInvested,
        })

        setStats({
          activeListings: activeListingsCount || 0,
          totalProposals: totalProposalsCount || 0,
          successRate,
          totalInvested,
        })
      } catch (error) {
        console.error("🔍 STATS: Error fetching statistics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 animate-pulse h-32 rounded-xl"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Listings */}
      <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-600/20 rounded-lg">
            <FileText className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.activeListings}</p>
          <p className="text-slate-400 text-sm">Active Listings</p>
        </div>
      </div>

      {/* Total Proposals */}
      <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-600/20 rounded-lg">
            <Users className="h-6 w-6 text-green-400" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.totalProposals}</p>
          <p className="text-slate-400 text-sm">Total Proposals</p>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-600/20 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
          <p className="text-slate-400 text-sm">Success Rate</p>
          <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.successRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Total Invested */}
      <div className="bg-[#0f172a] rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-yellow-600/20 rounded-lg">
            <DollarSign className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalInvested)}</p>
          <p className="text-slate-400 text-sm">Total Invested</p>
        </div>
      </div>
    </div>
  )
}
