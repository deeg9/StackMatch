"use client"

import { useRef, useCallback, useEffect } from "react"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"

// Global request cache to deduplicate across components
const globalRequestCache = new Map<string, Promise<any>>()

// Track global request count for debugging
let globalRequestCount = 0

/**
 * Hook for safely making API requests with deduplication and timeout handling
 */
export function useSafeRequest() {
  // Track component mounted state
  const isMounted = useRef(true)

  // Track in-progress requests for this component instance
  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map())

  // Component instance ID for debugging
  const instanceId = useRef(Math.random().toString(36).substring(2, 8))

  // Cleanup function to cancel all pending requests
  const cancelAllRequests = useCallback(() => {
    console.log(`🔍 SAFE REQUEST [${instanceId.current}]: Cancelling ${pendingRequests.current.size} pending requests`)
    pendingRequests.current.clear()
  }, [])

  // Safe fetch with deduplication, timeout, and cancellation support
  const safeFetch = useCallback(
    async (url: string, options?: RequestInit, timeoutMs = 10000, deduplicate = true): Promise<any> => {
      const requestId = ++globalRequestCount
      const cacheKey = `${url}-${JSON.stringify(options?.body || {})}-${options?.method || "GET"}`

      console.log(`🔍 SAFE REQUEST [${instanceId.current}] #${requestId}: Starting request to ${url}`)

      // Check if component is still mounted
      if (!isMounted.current) {
        console.log(`🔍 SAFE REQUEST [${instanceId.current}] #${requestId}: Component unmounted, aborting`)
        throw new Error("Component unmounted")
      }

      // Check global cache if deduplication is enabled
      if (deduplicate && globalRequestCache.has(cacheKey)) {
        console.log(`🔍 SAFE REQUEST [${instanceId.current}] #${requestId}: Reusing cached request for ${url}`)
        return globalRequestCache.get(cacheKey) as Promise<any>
      }

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          console.log(`🔍 SAFE REQUEST [${instanceId.current}] #${requestId}: Request timed out after ${timeoutMs}ms`)
          reject(new Error(`Request to ${url} timed out after ${timeoutMs}ms`))
          // Remove from caches on timeout
          globalRequestCache.delete(cacheKey)
          pendingRequests.current.delete(cacheKey)
        }, timeoutMs)
      })

      // Create the fetch promise
      const fetchPromise = fetch(url, {
        ...options,
        credentials: options?.credentials || "include",
      })
        .then(async (response) => {
          console.log(
            `🔍 SAFE REQUEST [${instanceId.current}] #${requestId}: Response received with status ${response.status}`,
          )

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          console.log(`🔍 SAFE REQUEST [${instanceId.current}] #${requestId}: Response parsed successfully`)
          return data
        })
        .catch((error) => {
          console.error(`🔍 SAFE REQUEST [${instanceId.current}] #${requestId}: Request failed:`, getErrorMessage(error))
          throw error
        })
        .finally(() => {
          // Clean up caches when done
          console.log(`🔍 SAFE REQUEST [${instanceId.current}] #${requestId}: Cleaning up caches`)
          globalRequestCache.delete(cacheKey)
          pendingRequests.current.delete(cacheKey)
        })

      // Race between fetch and timeout
      const resultPromise = Promise.race([fetchPromise, timeoutPromise])

      // Store in caches
      if (deduplicate) {
        globalRequestCache.set(cacheKey, resultPromise)
      }
      pendingRequests.current.set(cacheKey, resultPromise)

      return resultPromise
    },
    [],
  )

  // Set up cleanup on unmount
  useEffect(() => {
    console.log(`🔍 SAFE REQUEST [${instanceId.current}]: Component mounted`)

    return () => {
      console.log(`🔍 SAFE REQUEST [${instanceId.current}]: Component unmounting`)
      isMounted.current = false
      cancelAllRequests()
    }
  }, [cancelAllRequests])

  return {
    safeFetch,
    cancelAllRequests,
    isMounted,
    instanceId: instanceId.current,
  }
}

// Export utility functions for debugging
export function getGlobalRequestCacheInfo() {
  return {
    cacheSize: globalRequestCache.size,
    totalRequests: globalRequestCount,
  }
}

export function clearGlobalRequestCache() {
  console.log(`🔍 SAFE REQUEST: Clearing global request cache (${globalRequestCache.size} entries)`)
  globalRequestCache.clear()
}
