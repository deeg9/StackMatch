"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface ValidationResult {
  success: boolean
  checks: {
    coreTablesExist: boolean
    dealRoomsStructure: boolean
    queryTest: boolean
    notificationTable: boolean
    performanceIndexes: boolean
  }
  details: any
  recommendations: string[]
}

interface QueryTestResult {
  success: boolean
  tests: {
    basicQuery: { success: boolean; count: number; error?: string }
    complexQuery: { success: boolean; count: number; error?: string }
    notificationQuery: { success: boolean; count: number; error?: string }
    activityQuery: { success: boolean; count: number; error?: string }
    groupingQuery: { success: boolean; count: number; error?: string }
  }
  summary: {
    total: number
    successful: number
    failed: number
  }
}

export default function DatabaseValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [queryTestResult, setQueryTestResult] = useState<QueryTestResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const runValidation = async () => {
    setIsValidating(true)
    try {
      const response = await fetch("/api/deal-rooms/validate-database")
      const result = await response.json()
      setValidationResult(result)
    } catch (error) {
      console.error("Validation failed:", error)
      setValidationResult({
        success: false,
        checks: {
          coreTablesExist: false,
          dealRoomsStructure: false,
          queryTest: false,
          notificationTable: false,
          performanceIndexes: false,
        },
        details: {},
        recommendations: ["Failed to connect to validation endpoint"],
      })
    } finally {
      setIsValidating(false)
    }
  }

  const runQueryTests = async () => {
    setIsTesting(true)
    try {
      const response = await fetch("/api/deal-rooms/test-queries")
      const result = await response.json()
      setQueryTestResult(result)
    } catch (error) {
      console.error("Query testing failed:", error)
      setQueryTestResult({
        success: false,
        tests: {
          basicQuery: { success: false, count: 0, error: "Connection failed" },
          complexQuery: { success: false, count: 0, error: "Connection failed" },
          notificationQuery: { success: false, count: 0, error: "Connection failed" },
          activityQuery: { success: false, count: 0, error: "Connection failed" },
          groupingQuery: { success: false, count: 0, error: "Connection failed" },
        },
        summary: { total: 5, successful: 0, failed: 5 },
      })
    } finally {
      setIsTesting(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phase 0: Database Validation</CardTitle>
          <CardDescription>Validate database structure and core queries for deal rooms functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={runValidation} disabled={isValidating} variant="outline">
              {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Validate Database Structure
            </Button>

            <Button onClick={runQueryTests} disabled={isTesting} variant="outline">
              {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Core Queries
            </Button>
          </div>

          {validationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(validationResult.success)}
                  Database Structure Validation
                  <Badge variant={validationResult.success ? "default" : "destructive"}>
                    {validationResult.success ? "PASSED" : "FAILED"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(validationResult.checks.coreTablesExist)}
                    <span>Core tables exist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(validationResult.checks.dealRoomsStructure)}
                    <span>Deal rooms table structure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(validationResult.checks.queryTest)}
                    <span>Basic query test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(validationResult.checks.notificationTable)}
                    <span>Notification table</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(validationResult.checks.performanceIndexes)}
                    <span>Performance indexes</span>
                  </div>
                </div>

                {validationResult.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      Recommendations
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {validationResult.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {queryTestResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(queryTestResult.success)}
                  Core Query Testing
                  <Badge variant={queryTestResult.success ? "default" : "destructive"}>
                    {queryTestResult.summary.successful}/{queryTestResult.summary.total} PASSED
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(queryTestResult.tests.basicQuery.success)}
                    <span>Basic deal rooms query</span>
                    <Badge variant="outline">{queryTestResult.tests.basicQuery.count} records</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(queryTestResult.tests.complexQuery.success)}
                    <span>Complex join query</span>
                    <Badge variant="outline">{queryTestResult.tests.complexQuery.count} records</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(queryTestResult.tests.notificationQuery.success)}
                    <span>Notification query</span>
                    <Badge variant="outline">{queryTestResult.tests.notificationQuery.count} records</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(queryTestResult.tests.activityQuery.success)}
                    <span>Activity log query</span>
                    <Badge variant="outline">{queryTestResult.tests.activityQuery.count} records</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(queryTestResult.tests.groupingQuery.success)}
                    <span>Grouping query</span>
                    <Badge variant="outline">{queryTestResult.tests.groupingQuery.count} records</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
