"use client"

import { TickerBanner } from "@/components/ticker/ticker-banner"
import { BrowseHeader } from "@/components/browse-listings/browse-header"
import { FiltersSection } from "@/components/browse-listings/filters-section"
import { ListingsGrid } from "@/components/browse-listings/listings-grid"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { fetchListings, updateFilters } from "@/store/slices/listingsSlice"
import { useListingsRealtime } from "@/hooks/useListingsRealtime"

export default function BrowseListingsPage() {
  const dispatch = useAppDispatch()
  const { listings, isLoading, error, filters, pagination } = useAppSelector((state) => state.listings)

  // Set up real-time updates for listings
  useListingsRealtime({
    onUpdate: () => {
      console.log("Refreshing listings due to real-time update")
      dispatch(fetchListings())
    },
  })

  // Fetch listings on component mount and when filters change
  useEffect(() => {
    console.log("🔍 BROWSE LISTINGS: Fetching listings with filters:", filters)
    dispatch(fetchListings())
  }, [dispatch, filters])

  const handleFilterChange = (newFilters: {
    searchTerm: string
    category: string
    budget: string
    location: string
    skills: string[]
  }) => {
    console.log("🔍 BROWSE LISTINGS: Filter change:", newFilters)

    // Map the filter format to match our Redux store
    const mappedFilters = {
      search: newFilters.searchTerm,
      category: newFilters.category || null,
      location: newFilters.location || null,
      skills: newFilters.skills || [],
      // Parse budget range if provided
      budgetMin: newFilters.budget ? parseBudgetMin(newFilters.budget) : null,
      budgetMax: newFilters.budget ? parseBudgetMax(newFilters.budget) : null,
    }

    dispatch(updateFilters(mappedFilters))
  }

  // Helper functions to parse budget ranges
  const parseBudgetMin = (budget: string): number | null => {
    if (!budget || budget === "any") return null
    const match = budget.match(/(\d+)k?/)
    return match ? Number.parseInt(match[1]) * (budget.includes("k") ? 1000 : 1) : null
  }

  const parseBudgetMax = (budget: string): number | null => {
    if (!budget || budget === "any") return null
    if (budget.includes("-")) {
      const parts = budget.split("-")
      if (parts.length === 2) {
        const match = parts[1].match(/(\d+)k?/)
        return match ? Number.parseInt(match[1]) * (parts[1].includes("k") ? 1000 : 1) : null
      }
    }
    return null
  }

  return (
    <AuthGuard requiredUserType="seller" redirectTo="/login">
      <div className="min-h-screen bg-background">
        <TickerBanner
          items={[
            { id: "1", text: "Enterprise AWS migration project awarded to CloudExperts" },
            { id: "2", text: `${listings.length} active projects available for proposals` },
            { id: "3", text: "TechSolutions just won a $50K CRM project with GlobalCorp" },
            { id: "4", text: "New AI/ML project posted - $75K budget" },
          ]}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BrowseHeader />
          <FiltersSection onFilterChange={handleFilterChange} />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">Error loading listings: {error}</p>
              <button
                onClick={() => dispatch(fetchListings())}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-slate-700 rounded mb-3"></div>
                  <div className="h-4 bg-slate-700 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-slate-700 rounded w-16"></div>
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                  </div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-800 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-white mb-2">No Active Listings</h3>
                <p className="text-slate-400 mb-4">
                  There are currently no active project listings available. Check back soon for new opportunities!
                </p>
                <button
                  onClick={() => dispatch(fetchListings())}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Refresh Listings
                </button>
              </div>
            </div>
          ) : (
            <ListingsGrid listings={listings} />
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={!pagination.hasPreviousPage}
                onClick={() => dispatch(updateFilters({ page: pagination.currentPage - 1 }))}
                className="px-4 py-2 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-slate-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => dispatch(updateFilters({ page: pagination.currentPage + 1 }))}
                className="px-4 py-2 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
