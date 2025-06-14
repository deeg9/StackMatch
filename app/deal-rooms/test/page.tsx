"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DealRoomsTestPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [authResults, setAuthResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testNoAuth = async () => {
    setLoading(true)
    try {
      console.log("🔍 TEST PAGE: Testing no-auth endpoint...")
      const response = await fetch("/api/deal-rooms/test-no-auth")
      const data = await response.json()
      console.log("🔍 TEST PAGE: No-auth response:", data)
      setTestResults(data)
    } catch (error) {
      console.error("🔍 TEST PAGE: No-auth error:", error)
      setTestResults({ error: "Failed to fetch" })
    }
    setLoading(false)
  }

  const testWithAuth = async () => {
    setLoading(true)
    try {
      console.log("🔍 TEST PAGE: Testing with-auth endpoint...")
      const response = await fetch("/api/deal-rooms/simple-fixed")
      const data = await response.json()
      console.log("🔍 TEST PAGE: With-auth response:", data)
      setAuthResults(data)
    } catch (error) {
      console.error("🔍 TEST PAGE: With-auth error:", error)
      setAuthResults({ error: "Failed to fetch" })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Deal Rooms Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Test (No Auth)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testNoAuth} disabled={loading}>
              Test Database Connection
            </Button>
            {testResults && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testWithAuth} disabled={loading}>
              Test With Authentication
            </Button>
            {authResults && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(authResults, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Test Database Connection:</strong> This tests if the database tables exist and can be queried
              (bypasses authentication)
            </li>
            <li>
              <strong>Test With Authentication:</strong> This tests if your login session is working properly
            </li>
            <li>If the first test works but the second doesn't, it's an authentication issue</li>
            <li>If both fail, it's a database structure issue</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
