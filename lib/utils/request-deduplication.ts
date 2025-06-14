// Simple in-memory cache for pending requests
const pendingRequests = new Map<string, Promise<any>>()

export function deduplicateRequest<T>(key: string, requestFn: () => Promise<T>, timeoutMs = 5000): Promise<T> {
  // Check if request is already pending
  if (pendingRequests.has(key)) {
    console.log(`🔍 DEDUPLICATION: Reusing existing request for key: ${key}`)
    return pendingRequests.get(key)!
  }

  console.log(`🔍 DEDUPLICATION: Creating new request for key: ${key}`)

  // Create new request with cleanup
  const request = requestFn().finally(() => {
    console.log(`🔍 DEDUPLICATION: Cleaning up request for key: ${key}`)
    pendingRequests.delete(key)
  })

  // Store pending request
  pendingRequests.set(key, request)

  // Auto-cleanup after timeout
  setTimeout(() => {
    if (pendingRequests.has(key)) {
      console.log(`🔍 DEDUPLICATION: Auto-cleanup timeout for key: ${key}`)
      pendingRequests.delete(key)
    }
  }, timeoutMs)

  return request
}

// Function to clear all pending requests (useful for testing)
export function clearAllPendingRequests(): void {
  console.log(`🔍 DEDUPLICATION: Clearing ${pendingRequests.size} pending requests`)
  pendingRequests.clear()
}

// Function to get current pending request count
export function getPendingRequestCount(): number {
  return pendingRequests.size
}
