"use client"

import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { addProfileView, addEngagementEvent } from "@/store/slices/analyticsSlice"

export function useAnalytics() {
  const dispatch = useDispatch()

  const trackProfileView = useCallback(
    async (profileId: string, metadata?: Record<string, any>) => {
      const viewData = {
        id: `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        viewerId: undefined, // Would be set from auth context
        viewerType: "ANONYMOUS" as const,
        viewerLocation: undefined, // Would be detected from IP
        timestamp: new Date().toISOString(),
        duration: 0, // Would be tracked with page visibility API
        referralSource: "DIRECT" as const,
        deviceType: getDeviceType(),
        pageViewed: "Profile Overview",
        ...metadata,
      }

      dispatch(addProfileView(viewData))

      // Send to analytics API
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "PROFILE_VIEW",
            profileId,
            metadata: viewData,
          }),
        })
      } catch (error) {
        console.error("Failed to track profile view:", error)
      }
    },
    [dispatch],
  )

  const trackEngagement = useCallback(
    async (
      type: "MESSAGE_SENT" | "CONTACT_CLICKED" | "PORTFOLIO_VIEWED" | "REVIEW_READ" | "FOLLOW" | "UNFOLLOW" | "SHARE",
      profileId: string,
      metadata?: Record<string, any>,
    ) => {
      const engagementData = {
        id: `engagement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        userId: undefined, // Would be set from auth context
        userType: "ANONYMOUS" as const,
        timestamp: new Date().toISOString(),
        metadata: metadata || {},
      }

      dispatch(addEngagementEvent(engagementData))

      // Send to analytics API
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "ENGAGEMENT",
            profileId,
            metadata: engagementData,
          }),
        })
      } catch (error) {
        console.error("Failed to track engagement:", error)
      }
    },
    [dispatch],
  )

  const trackConversion = useCallback(
    async (
      type: "BID_RECEIVED" | "PROJECT_AWARDED" | "CONTACT_FORM" | "QUOTE_REQUEST",
      profileId: string,
      value?: number,
      metadata?: Record<string, any>,
    ) => {
      // Send to analytics API
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "CONVERSION",
            profileId,
            metadata: {
              conversionType: type,
              value,
              timestamp: new Date().toISOString(),
              ...metadata,
            },
          }),
        })
      } catch (error) {
        console.error("Failed to track conversion:", error)
      }
    },
    [],
  )

  return {
    trackProfileView,
    trackEngagement,
    trackConversion,
  }
}

function getDeviceType(): "DESKTOP" | "MOBILE" | "TABLET" {
  if (typeof window === "undefined") return "DESKTOP"

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)

  if (isTablet) return "TABLET"
  if (isMobile) return "MOBILE"
  return "DESKTOP"
}
