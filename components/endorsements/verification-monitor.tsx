"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Database, Wifi, WifiOff } from "lucide-react"

interface VerificationMetrics {
  totalEndorsements: number
  verifiedCount: number
  failedCount: number
  pendingCount: number
  lastVerificationTime: string
  averageVerificationTime: number
  successRate: number
  platformStatus: Record<string, "online" | "offline" | "degraded">
}

export function VerificationMonitor() {
  const [metrics, setMetrics] = useState<VerificationMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting")

  useEffect(() => {
    fetchMetrics()

    // Set up real-time updates
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      setConnectionStatus("connecting")

      // Mock API call - in production this would fetch real metrics
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockMetrics: VerificationMetrics = {
        totalEndorsements: 12,
        verifiedCount: 9,
        failedCount: 1,
        pendingCount: 2,
        lastVerificationTime: new Date().toISOString(),
        averageVerificationTime: 2.3,
        successRate: 85.7,
        platformStatus: {
          salesforce: "online",
          netsuite: "online",
          aws: "degraded",
          microsoft: "online",
          shopify: "offline",
        },
      }

      setMetrics(mockMetrics)
      setConnectionStatus("connected")
    } catch (error) {
      console.error("Failed to fetch verification metrics:", error)
      setConnectionStatus("disconnected")
    } finally {
      setIsLoading(false)
    }
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "connecting":
        return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
    }
  }

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "disconnected":
        return <Badge variant="destructive">Disconnected</Badge>
      case "connecting":
        return <Badge className="bg-yellow-100 text-yellow-800">Connecting...</Badge>
    }
  }

  const getPlatformStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPlatformStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">Online</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading verification status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Unable to load verification metrics. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Verification System Status
            </span>
            <div className="flex items-center space-x-2">
              {getConnectionIcon()}
              {getConnectionBadge()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalEndorsements}</div>
              <div className="text-sm text-muted-foreground">Total Endorsements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.verifiedCount}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.failedCount}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{metrics.pendingCount}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{metrics.successRate}%</span>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <Progress value={metrics.successRate} className="h-3" />
              <div className="text-sm text-muted-foreground">
                {metrics.verifiedCount} of {metrics.totalEndorsements} endorsements verified successfully
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Average Verification Time</span>
                  <span className="text-lg font-bold">{metrics.averageVerificationTime}s</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Verification</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(metrics.lastVerificationTime).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Status */}
      <Card>
        <CardHeader>
          <CardTitle>Platform API Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics.platformStatus).map(([platform, status]) => (
              <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getPlatformStatusIcon(status)}
                  <span className="font-medium capitalize">{platform}</span>
                </div>
                {getPlatformStatusBadge(status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      {metrics.platformStatus.shopify === "offline" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Shopify API is currently offline. Verification for Shopify endorsements may be delayed.
          </AlertDescription>
        </Alert>
      )}

      {metrics.platformStatus.aws === "degraded" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            AWS Partner API is experiencing degraded performance. Verification times may be longer than usual.
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={fetchMetrics}>
          Refresh Status
        </Button>
        <Button>View Detailed Logs</Button>
      </div>
    </div>
  )
}
