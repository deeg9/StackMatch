"use client"

import { useState, useEffect } from "react"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { useDispatch } from "react-redux"
import { updateEndorsement } from "@/store/slices/endorsementsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle, Shield, Activity, Zap, Database } from "lucide-react"
import type { Endorsement, PartnerPlatform } from "@/store/slices/endorsementsSlice"
import type { VerificationResult } from "@/lib/verification/verification-service"

interface RealTimeVerificationProps {
  endorsements: Endorsement[]
  platforms: PartnerPlatform[]
  onVerificationComplete?: (endorsementId: string, result: VerificationResult) => void
}

interface VerificationStatus {
  endorsementId: string
  status: "pending" | "verifying" | "completed" | "failed"
  result?: VerificationResult
  progress: number
  error?: string
}

export function RealTimeVerification({ endorsements, platforms, onVerificationComplete }: RealTimeVerificationProps) {
  const dispatch = useDispatch()
  const [verificationStatuses, setVerificationStatuses] = useState<Map<string, VerificationStatus>>(new Map())
  const [isVerifying, setIsVerifying] = useState(false)
  const [autoVerifyEnabled, setAutoVerifyEnabled] = useState(true)
  const [lastVerificationTime, setLastVerificationTime] = useState<Date | null>(null)

  useEffect(() => {
    // Auto-verify on component mount if enabled
    if (autoVerifyEnabled && endorsements.length > 0) {
      handleVerifyAll()
    }
  }, [endorsements, autoVerifyEnabled])

  useEffect(() => {
    // Set up periodic verification (every 24 hours)
    if (autoVerifyEnabled) {
      const interval = setInterval(
        () => {
          handleVerifyAll()
        },
        24 * 60 * 60 * 1000,
      ) // 24 hours

      return () => clearInterval(interval)
    }
  }, [autoVerifyEnabled])

  const handleVerifyEndorsement = async (endorsement: Endorsement) => {
    const platform = platforms.find((p) => p.id === endorsement.platformId)
    if (!platform) return

    setVerificationStatuses(
      (prev) =>
        new Map(
          prev.set(endorsement.id, {
            endorsementId: endorsement.id,
            status: "verifying",
            progress: 0,
          }),
        ),
    )

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setVerificationStatuses((prev) => {
          const current = prev.get(endorsement.id)
          if (current && current.progress < 90) {
            return new Map(
              prev.set(endorsement.id, {
                ...current,
                progress: current.progress + 10,
              }),
            )
          }
          return prev
        })
      }, 200)

      // Call verification API
      const response = await fetch("/api/verification/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endorsementId: endorsement.id,
          platformId: endorsement.platformId,
          certificationId: endorsement.evidence.certificationIds[0],
          partnerEmail: "provider@example.com", // This would come from user profile
        }),
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Verification request failed")
      }

      const result: VerificationResult = await response.json()

      setVerificationStatuses(
        (prev) =>
          new Map(
            prev.set(endorsement.id, {
              endorsementId: endorsement.id,
              status: "completed",
              progress: 100,
              result,
            }),
          ),
      )

      // Update endorsement with verification result
      const updatedEndorsement: Endorsement = {
        ...endorsement,
        isVerified: result.isValid,
        verificationDate: result.lastVerified,
        expiryDate: result.expiryDate || endorsement.expiryDate,
        isActive: result.isValid && result.status === "verified",
        endorsementDetails: {
          ...endorsement.endorsementDetails,
          certificationLevel: result.certificationLevel || endorsement.endorsementDetails.certificationLevel,
          specializations: result.specializations || endorsement.endorsementDetails.specializations,
          projectsCompleted: result.projectCount || endorsement.endorsementDetails.projectsCompleted,
          clientSatisfactionScore: result.satisfactionScore || endorsement.endorsementDetails.clientSatisfactionScore,
        },
      }

      dispatch(updateEndorsement(updatedEndorsement))
      onVerificationComplete?.(endorsement.id, result)
    } catch (error) {
      setVerificationStatuses(
        (prev) =>
          new Map(
            prev.set(endorsement.id, {
              endorsementId: endorsement.id,
              status: "failed",
              progress: 0,
              error: error instanceof Error ? getErrorMessage(error) : "Unknown error",
            }),
          ),
      )
    }
  }

  const handleVerifyAll = async () => {
    setIsVerifying(true)
    setLastVerificationTime(new Date())

    // Initialize all endorsements as pending
    const initialStatuses = new Map<string, VerificationStatus>()
    endorsements.forEach((endorsement) => {
      initialStatuses.set(endorsement.id, {
        endorsementId: endorsement.id,
        status: "pending",
        progress: 0,
      })
    })
    setVerificationStatuses(initialStatuses)

    // Verify endorsements in batches to avoid rate limiting
    const batchSize = 3
    for (let i = 0; i < endorsements.length; i += batchSize) {
      const batch = endorsements.slice(i, i + batchSize)
      await Promise.all(batch.map((endorsement) => handleVerifyEndorsement(endorsement)))

      // Add delay between batches
      if (i + batchSize < endorsements.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    setIsVerifying(false)
  }

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status.status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "verifying":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed":
        return status.result?.isValid ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status.status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "verifying":
        return <Badge className="bg-blue-100 text-blue-800">Verifying...</Badge>
      case "completed":
        return status.result?.isValid ? (
          <Badge className="bg-green-100 text-green-800">Verified</Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800">Invalid</Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getOverallStats = () => {
    const statuses = Array.from(verificationStatuses.values())
    const total = statuses.length
    const verified = statuses.filter((s) => s.status === "completed" && s.result?.isValid).length
    const failed = statuses.filter(
      (s) => s.status === "failed" || (s.status === "completed" && !s.result?.isValid),
    ).length
    const pending = statuses.filter((s) => s.status === "pending" || s.status === "verifying").length

    return { total, verified, failed, pending }
  }

  const stats = getOverallStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Real-Time Verification
          </h3>
          <p className="text-sm text-muted-foreground">Automatically verify endorsements with partner platforms</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setAutoVerifyEnabled(!autoVerifyEnabled)}>
            <Activity className="h-4 w-4 mr-2" />
            Auto-Verify: {autoVerifyEnabled ? "On" : "Off"}
          </Button>
          <Button onClick={handleVerifyAll} disabled={isVerifying} size="sm">
            {isVerifying ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            {isVerifying ? "Verifying..." : "Verify All"}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Verification Info */}
      {lastVerificationTime && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            Last verification completed at {lastVerificationTime.toLocaleString()}
            {autoVerifyEnabled && " • Next automatic verification in 24 hours"}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Verification Status</TabsTrigger>
          <TabsTrigger value="details">Detailed Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          {/* Verification Status List */}
          <div className="space-y-3">
            {endorsements.map((endorsement) => {
              const status = verificationStatuses.get(endorsement.id)
              const platform = platforms.find((p) => p.id === endorsement.platformId)

              return (
                <Card key={endorsement.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={platform?.logo || "/placeholder.svg"}
                          alt={platform?.name}
                          className="h-10 w-10 rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium">{endorsement.title}</h4>
                          <p className="text-sm text-muted-foreground">{platform?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {status && getStatusIcon(status)}
                        {status && getStatusBadge(status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerifyEndorsement(endorsement)}
                          disabled={status?.status === "verifying"}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {status?.status === "verifying" && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Verifying with {platform?.name}...</span>
                          <span>{status.progress}%</span>
                        </div>
                        <Progress value={status.progress} className="h-2" />
                      </div>
                    )}

                    {status?.error && (
                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{status.error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Detailed Results */}
          <div className="space-y-4">
            {Array.from(verificationStatuses.entries())
              .filter(([_, status]) => status.status === "completed" && status.result)
              .map(([endorsementId, status]) => {
                const endorsement = endorsements.find((e) => e.id === endorsementId)
                const platform = platforms.find((p) => p.id === endorsement?.platformId)
                const result = status.result!

                return (
                  <Card key={endorsementId}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <img
                          src={platform?.logo || "/placeholder.svg"}
                          alt={platform?.name}
                          className="h-6 w-6 rounded"
                        />
                        <span>{endorsement?.title}</span>
                        {result.isValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Verification Details</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <Badge variant={result.isValid ? "default" : "destructive"}>{result.status}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Verified:</span>
                              <span>{new Date(result.lastVerified).toLocaleString()}</span>
                            </div>
                            {result.expiryDate && (
                              <div className="flex justify-between">
                                <span>Expires:</span>
                                <span>{new Date(result.expiryDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {result.certificationLevel && (
                              <div className="flex justify-between">
                                <span>Level:</span>
                                <span>{result.certificationLevel}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Performance Metrics</h5>
                          <div className="space-y-2 text-sm">
                            {result.projectCount && (
                              <div className="flex justify-between">
                                <span>Projects:</span>
                                <span>{result.projectCount}</span>
                              </div>
                            )}
                            {result.satisfactionScore && (
                              <div className="flex justify-between">
                                <span>Rating:</span>
                                <span>{result.satisfactionScore}/5.0</span>
                              </div>
                            )}
                            {result.specializations && result.specializations.length > 0 && (
                              <div>
                                <span className="block mb-1">Specializations:</span>
                                <div className="flex flex-wrap gap-1">
                                  {result.specializations.map((spec) => (
                                    <Badge key={spec} variant="outline" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {result.errorMessage && (
                        <Alert className="mt-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{result.errorMessage}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {/* Verification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Automatic Verification</h4>
                  <p className="text-sm text-muted-foreground">Automatically verify endorsements every 24 hours</p>
                </div>
                <Button
                  variant={autoVerifyEnabled ? "default" : "outline"}
                  onClick={() => setAutoVerifyEnabled(!autoVerifyEnabled)}
                >
                  {autoVerifyEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Platform API Status</h4>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={platform.logo || "/placeholder.svg"}
                          alt={platform.name}
                          className="h-6 w-6 rounded"
                        />
                        <span className="text-sm">{platform.name}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
