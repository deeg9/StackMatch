"use client"

import { useState, useEffect } from "react"
import { useSelector } from "
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"react-redux"
import type { RootState } from "@/store"
import { BuyerDashboardHeader } from "@/components/buyer-dashboard/buyer-dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TickerBanner } from "@/components/ticker/ticker-banner"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, Bug } from "lucide-react"
import Link from "next/link"

export default function SimpleDealRoomsPage() {
  const auth = useSelector((state: RootState) => state.auth)
  const user = auth?.user
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Fetch deal rooms
  useEffect(() => {
    const fetchDealRooms = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("🔍 SIMPLE PAGE: Starting fetch...")

        const response = await fetch(`/api/deal-rooms/simple`)
        console.log("🔍 SIMPLE PAGE: Response status:", response.status)
        console.log("🔍 SIMPLE PAGE: Response ok:", response.ok)

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        console.log("🔍 SIMPLE PAGE: Content type:", contentType)

        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text()
          console.error("🔍 SIMPLE PAGE: Non-JSON response:", textResponse.substring(0, 200))
          throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}`)
        }

        const data = await response.json()
        console.log("🔍 SIMPLE PAGE: Data received:", data)

        setApiResponse(data)

        if (data.error) {
          setError(data.error + (data.details ? `: ${data.details}` : ""))
        }
      } catch (error) {
        console.error("🔍 SIMPLE PAGE: Error:", error)
        setError(error instanceof Error ? getErrorMessage(error) : "Failed to load deal rooms")
        toast({
          title: "Error",
          description: "Failed to load deal rooms. Check console for details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDealRooms()
  }, [toast])

  const runDatabaseCheck = async () => {
    try {
      setDebugInfo({ status: "loading" })
      const response = await fetch("/api/deal-rooms/debug-structure")
      const data = await response.json()
      console.log("🔍 DEBUG STRUCTURE:", data)
      setDebugInfo(data)
      toast({
        title: "Debug Complete",
        description: "Check console for detailed information",
      })
    } catch (e) {
      console.error("Debug failed:", e)
      setDebugInfo({ status: "error", message: e instanceof Error ? e.message : "Unknown error" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <TickerBanner />
        <BuyerDashboardHeader />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
            <p className="ml-4 text-xl">Loading Deal Rooms...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TickerBanner />
      <BuyerDashboardHeader />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Deal Rooms (Simple)</h1>
            <p className="text-slate-400 mt-1">Simplified version for troubleshooting</p>
          </div>
        </div>

        {error && (
          <Card className="mb-6 bg-red-900/20 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-2">Error</h3>
                  <p className="text-red-200 mb-4">{error}</p>
                  <div className="flex gap-3">
                    <Button onClick={() => window.location.reload()} className="bg-red-700 hover:bg-red-800 text-white">
                      Try Again
                    </Button>
                    <Button
                      onClick={runDatabaseCheck}
                      variant="outline"
                      className="border-red-500/30 text-red-300 hover:bg-red-900/30"
                    >
                      <Bug className="mr-2 h-4 w-4" />
                      Run Database Check
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">API Response</h2>
            <div className="bg-slate-900 p-4 rounded-md overflow-auto max-h-60">
              <pre className="text-slate-300 text-sm">{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        {debugInfo && (
          <Card className="mb-6 bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-200 mb-4">Debug Information</h2>
              {debugInfo.status === "loading" ? (
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400 mr-2" />
                  <p>Loading debug information...</p>
                </div>
              ) : (
                <div className="bg-slate-900 p-4 rounded-md overflow-auto max-h-96">
                  <pre className="text-slate-300 text-sm">{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-4">
          <Button onClick={runDatabaseCheck} className="bg-blue-600 hover:bg-blue-700">
            <Bug className="mr-2 h-4 w-4" />
            Run Database Check
          </Button>

          <Link href="/buyer-dashboard">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
