"use client"

import { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

interface UseListingsRealtimeProps {
  onUpdate: () => void
}

export function useListingsRealtime({ onUpdate }: UseListingsRealtimeProps) {
  useEffect(() => {
    const supabase = await createClient()

    // Set up the subscription for listings table
    const channel = supabase
      .channel("listings-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "listings",
        },
        (payload) => {
          console.log("Real-time listing update:", payload)
          // Call the callback to refresh listings
          onUpdate()
        },
      )
      .subscribe()

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [onUpdate])
}
