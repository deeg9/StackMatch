"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle, TestTube, Activity, Zap } from "lucide-react"
import { AlertConfiguration } from "./alert-configuration"

interface PlatformTestResult {
  platform: string
  status: "testing" | "success" | "failed" | "not_tested"
  responseTime: number
  error?: string
  details?: {
    authentication: boolean
    apiAccess: boolean
    dataRetrieval: boolean
    rateLimiting: boolean
  }
  timestamp: string
}

export function VerificationSystemTest() {
  const [healthCheck, setHealthCheck] = useState<any | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const platforms = [
    { id: "salesforce", name: "Salesforce", logo: "/api/placeholder/32/32" },
    { id: "netsuite", name: "NetSuite", logo: "/api/placeholder.svg?height=32&width=32" },
    { id: "aws", name: "AWS Partner", logo: "/api/placeholder.svg?height=32&width=32" },
    { id: "microsoft", name: "Microsoft", logo: "/placeholder.svg?height=32&width=32" },
    { id: "shopify", name: "Shopify", logo: "/placeholder.svg?height=32&width=32" },
  ]

  useEffect(() => {
    // Run initial health check
    runHealthCheck()

    // Set up periodic health checks (every 5 minutes)
    const interval = setInterval(runHealthCheck, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const runHealthCheck = async () => {
    setIsRunningTests(true)

    try {
      const response = await fetch("/api/verification/health-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Health check request failed")
      }

      const result = await response.json()
      setHealthCheck(result)

      // Trigger alerts if necessary
      if (result.overall !== "healthy") {
        triggerAlerts(result)
      }
    } catch (error) {
      console.error("Health check failed:", error)
      // Set a failed state
      setHealthCheck({
        overall: "critical",
        platforms: platforms.map((p) => ({
          platform: p.id,
          status: "failed",
          responseTime: 0,
          error: "Health check request failed",
          timestamp: new Date().toISOString(),
        })),
        lastChecked: new Date().toISOString(),
        nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      })
    } finally {
      setIsRunningTests(false)
    }
  }

  const testSinglePlatform = async (platformId: string) => {
    setSelectedPlatform(platformId)

    try {
      const response = await fetch("/api/verification/test-platform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platformId }),
      })

      if (!response.ok) {
        throw new Error("Platform test request failed")
      }

      const result = await response.json()

      // Update the health check with the new result
      if (healthCheck) {
        const updatedPlatforms = healthCheck.platforms.map((p) => (p.platform === platformId ? result : p))
        setHealthCheck({
          ...healthCheck,
          platforms: updatedPlatforms,
          lastChecked: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error(`Platform test failed for ${platformId}:`, error)
    } finally {
      setSelectedPlatform(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "testing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "not_tested":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "testing":
        return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>
      case "success":
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "not_tested":
        return <Badge variant="secondary">Not Tested</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Unknown</Badge>
    }
  }

  const getOverallHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 1000) return "text-green-600"
    if (responseTime < 3000) return "text-yellow-600"
    return "text-red-600"
  }

  const triggerAlerts = (healthCheck: any) => {
    // Mock alert triggering logic
    console.warn("System health is degraded. Triggering alerts:", healthCheck)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <TestTube className="h-5 w-5 mr-2" />
            Verification System Test
          </h3>
          <p className="text-sm text-muted-foreground">Test and monitor partner platform API connections</p>
        </div>
        <Button onClick={runHealthCheck} disabled={isRunningTests} className="flex items-center">
          {isRunningTests ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
          {isRunningTests ? "Testing..." : "Run Health Check"}
        </Button>
      </div>

      {/* Overall System Health */}
      {healthCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Health
              </span>
              <Badge
                className={`${
                  healthCheck.overall === "healthy"
                    ? "bg-green-100 text-green-800"
                    : healthCheck.overall === "degraded"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {healthCheck.overall.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Checked</p>
                <p className="text-lg font-semibold">{new Date(healthCheck.lastChecked).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Check</p>
                <p className="text-lg font-semibold">{new Date(healthCheck.nextCheck).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platforms Online</p>
                <p className="text-lg font-semibold">
                  {healthCheck.platforms.filter((p) => p.status === "success").length} / {healthCheck.platforms.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Platform Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const result = healthCheck?.platforms.find((p) => p.platform === platform.id)
              const isCurrentlyTesting = selectedPlatform === platform.id

              return (
                <Card key={platform.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={platform.logo || "/placeholder.svg"}
                          alt={platform.name}
                          className="h-8 w-8 rounded"
                        />
                        <div>
                          <h4 className="font-medium">{platform.name}</h4>
                          <p className="text-sm text-muted-foreground">API Connection</p>
                        </div>
                      </div>
                      {result && getStatusIcon(isCurrentlyTesting ? "testing" : result.status)}
                    </div>

                    {result && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Status:</span>
                          {getStatusBadge(isCurrentlyTesting ? "testing" : result.status)}
                        </div>

                        {result.responseTime > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Response Time:</span>
                            <span className={`text-sm font-medium ${getResponseTimeColor(result.responseTime)}`}>
                              {result.responseTime}ms
                            </span>
                          </div>
                        )}

                        {result.error && (
                          <Alert className="mt-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-xs">{result.error}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => testSinglePlatform(platform.id)}
                      disabled={isCurrentlyTesting}
                    >
                      {isCurrentlyTesting ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                      )}
                      Test Connection
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {/* Detailed Test Results */}
          {healthCheck?.platforms.map((result) => {
            const platform = platforms.find((p) => p.id === result.platform)

            return (
              <Card key={result.platform}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <img
                      src={platform?.logo || "/api/placeholder/24/24"}
                      alt={platform?.name}
                      className="h-6 w-6 rounded"
                    />
                    <span>{platform?.name} Test Results</span>
                    {getStatusIcon(result.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Connection Details</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          {getStatusBadge(result.status)}
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span className={getResponseTimeColor(result.responseTime)}>{result.responseTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Tested:</span>
                          <span>{new Date(result.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {result.details && (
                      <div>
                        <h5 className="font-medium mb-3">Test Components</h5>
                        <div className="space-y-2">
                          {Object.entries(result.details).map(([test, passed]) => (
                            <div key={test} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{test.replace(/([A-Z])/g, " $1").trim()}:</span>
                              {passed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {result.error && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{result.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AlertConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  )
}
