"use client"

import { useState, useEffect } from "react"
import SellerCard from "./seller-card"
import { createClient } from "@/lib/supabase/client"
import type { Seller } from "@/types"

export function SellersGrid() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        // Fetch seller profiles with joined data
        const { data, error } = await supabase
          .from("seller_profiles")
          .select(`
            id,
            user_id,
            business_type,
            years_in_business,
            team_size,
            hourly_rate_min,
            hourly_rate_max,
            expertise_areas,
            portfolio_url,
            created_at,
            profiles:user_id (
              full_name,
              company_name,
              avatar_url
            )
          `)
          .limit(12)

        if (error) throw error

        // Transform data to match Seller type
        const transformedSellers: Seller[] = data.map((seller) => {
          // Handle case where profiles might be an array
          const profile = seller.profiles ? (Array.isArray(seller.profiles) ? seller.profiles[0] : seller.profiles) : null;
          
          return {
            id: seller.id,
            user_id: seller.user_id,
            company_name: profile?.company_name || "Company Name",
            description: `${seller.business_type || "Technology"} provider with ${seller.years_in_business || 0}+ years of experience`,
            location: "United States",
            rating: 4.5 + Math.random() * 0.5,
            projects_count: Math.floor(Math.random() * 50) + 10,
            expertise: seller.expertise_areas || ["Web Development", "Mobile Apps", "Cloud Services"],
            response_time: "< 24 hours",
            experience: `${seller.years_in_business || 0}+ years`,
            hourly_rate: `$${seller.hourly_rate_min || 50}-${seller.hourly_rate_max || 150}/hr`,
            is_top_rated: Math.random() > 0.7,
          };
        })

        setSellers(transformedSellers)
      } catch (err: any) {
        console.error("Error fetching sellers:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSellers()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#111827] border border-gray-800 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-700 rounded mb-3"></div>
            <div className="h-3 bg-gray-700 rounded mb-3 w-5/6"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-9 bg-gray-700 rounded flex-1"></div>
              <div className="h-9 bg-gray-700 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error loading sellers: {error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sellers.map((seller) => (
        <SellerCard key={seller.id} seller={seller} />
      ))}
    </div>
  )
}
