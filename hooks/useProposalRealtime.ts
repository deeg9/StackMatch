"use client"

import { useEffect } from "react"
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime"
import type { Proposal } from "@/types/proposal-types"

interface UseProposalRealtimeProps {
  listingId: string
  sellerId?: string
  onProposalUpdate?: (proposal: Proposal) => void
  onProposalStatusChange?: (proposalId: string, status: string) => void
  onMilestoneUpdate?: (proposalId: string, milestones: any[]) => void
}

export function useProposalRealtime({
  listingId,
  sellerId,
  onProposalUpdate,
  onProposalStatusChange,
  onMilestoneUpdate,
}: UseProposalRealtimeProps) {
  const { subscribe, unsubscribe } = useSupabaseRealtime()

  useEffect(() => {
    if (!listingId) return

    // Subscribe to proposal changes for this listing
    const proposalChannel = subscribe(
      "proposals",
      {
        event: "*",
        schema: "public",
        table: "proposals",
        filter: `listing_id=eq.${listingId}`,
      },
      (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload

        switch (eventType) {
          case "INSERT":
            if (newRecord && onProposalUpdate) {
              onProposalUpdate(newRecord as Proposal)
            }
            break
          case "UPDATE":
            if (newRecord && oldRecord) {
              // Check if status changed
              if (newRecord.status !== oldRecord.status && onProposalStatusChange) {
                onProposalStatusChange(newRecord.id, newRecord.status)
              }
              // General proposal update
              if (onProposalUpdate) {
                onProposalUpdate(newRecord as Proposal)
              }
            }
            break
          case "DELETE":
            // Handle proposal deletion if needed
            break
        }
      },
    )

    // Subscribe to milestone changes if we have a seller ID
    let milestoneChannel: string | null = null
    if (sellerId) {
      milestoneChannel = subscribe(
        "proposal_milestones",
        {
          event: "*",
          schema: "public",
          table: "proposal_milestones",
        },
        (payload) => {
          const { eventType, new: newRecord } = payload

          if (eventType === "UPDATE" || eventType === "INSERT") {
            // Fetch updated milestones for the proposal
            if (newRecord?.proposal_id && onMilestoneUpdate) {
              // This would typically trigger a refetch of milestones
              // For now, we'll just pass the proposal ID
              onMilestoneUpdate(newRecord.proposal_id, [])
            }
          }
        },
      )
    }

    // Cleanup subscriptions
    return () => {
      unsubscribe(proposalChannel)
      if (milestoneChannel) {
        unsubscribe(milestoneChannel)
      }
    }
  }, [listingId, sellerId, onProposalUpdate, onProposalStatusChange, onMilestoneUpdate, subscribe, unsubscribe])

  return {
    // Could return additional utilities if needed
  }
}
