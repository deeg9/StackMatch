"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import type { RootState } from "@/store"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DealRoom {
  id: string
  room_name: string
  status: string
  created_at: string
  updated_at: string
  last_activity_at: string
  listing_id: string
  proposal_id: string
}

interface UseDealRoomsOptions {
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  enableRealtime?: boolean
}

export function useDealRooms(options: UseDealRoomsOptions = {}) {
  const { status = "all", sortBy = "last_activity_at", sortOrder = "desc", enableRealtime = true } = options

  const auth = useSelector((state: RootState) => state.auth)
  const user = auth?.user
  const supabase = createClientComponentClient()

  const [dealRooms, setDealRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch deal rooms
  const fetchDealRooms = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        status,
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/deal-rooms?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch deal rooms")
      }

      setDealRooms(data.dealRooms)
    } catch (error) {
      console.error("Error fetching deal rooms:", error)
      setError(error instanceof Error ? getErrorMessage(error) : "Failed to load deal rooms")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchDealRooms()
    }
  }, [user, status, sortBy, sortOrder])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!enableRealtime || !user) return

    const channel = supabase
      .channel("deal_rooms_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deal_rooms",
        },
        (payload) => {
          console.log("Deal room change:", payload)
          // Refetch data when changes occur
          fetchDealRooms()
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deal_room_messages",
        },
        (payload) => {
          console.log("Deal room message change:", payload)
          // Update last activity when new messages are added
          fetchDealRooms()
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deal_room_activities",
        },
        (payload) => {
          console.log("Deal room activity change:", payload)
          // Update when new activities are logged
          fetchDealRooms()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [enableRealtime, user, supabase])

  const refetch = () => {
    fetchDealRooms()
  }

  return {
    dealRooms,
    loading,
    error,
    refetch,
  }
}
