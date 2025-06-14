"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface TestCase {
  id: string
  name: string
  description: string
  userInput: string
  expectedStage: string
  expectedFields: string[]
  category: "conversation" | "field_mapping" | "validation" | "enhancement"
}

const TEST_CASES: TestCase[] = [
  {
    id: "intro_web_project",
    name: "Introduction - Web Project",
    description: "User describes a web development project",
    userInput:
      "I need help building a customer portal for my SaaS business. Customers should be able to view their usage, download reports, and manage their account settings.",
    expectedStage: "project_basics",
    expectedFields: ["title", "categoryId"],
    category: "conversation",
  },
  {
    id: "project_basics_ecommerce",
    name: "Project Basics - E-commerce",
    description: "User provides details for an e-commerce project",
    userInput:
      "I run a boutique clothing store and need an online store. I want customers to browse products, add to cart, checkout with Stripe, and track orders. Budget is around $25,000.",
    expectedStage: "requirements_gathering",
    expectedFields: ["title", "categoryId", "aboutBusiness", "budgetMin"],
    category: "field_mapping",
  },
  {
    id: "requirements_inventory",
    name: "Requirements - Inventory System",
    description: "User describes inventory management requirements",
    userInput:
      "I need real-time inventory tracking, barcode scanning, low stock alerts, supplier management, and integration with QuickBooks. We have 3 warehouses and 50+ products.",
    expectedStage: "technical_details",
    expectedFields: ["detailedNeeds", "tags"],
    category: "field_mapping",
  },
  {
    id: "budget_validation",
    name: "Budget Validation",
    description: "Test budget validation and guidance",
    userInput: "My budget is $500 for a complete e-commerce platform with custom features",
    expectedStage: "budget_discussion",
    expectedFields: [],
    category: "validation",
  },
  {
    id: "field_enhancement",
    name: "Field Enhancement",
    description: "Test field enhancement functionality",
    userInput: "Enhance this title: 'Website for business'",
    expectedStage: "project_basics",
    expectedFields: ["title"],
    category: "enhancement",
  },
]

export function AITestingDashboard() {
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null)
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [customInput, setCustomInput] = useState("")

  const runTest = async (testCase: TestCase) => {
    setIsRunning(true)
    setSelectedTest(testCase)

    try {
      const response = await fetch("/api/ai-listing/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: `test_${testCase.id}_${Date.now()}`,
          message: testCase.userInput,
          currentFormState: {},
          stage: "introduction",
        }),
      })

      const result = await response.json()

      // Analyze results
      const analysis = analyzeTestResult(testCase, result)

      setTestResults((prev) => ({
        ...prev,
        [testCase.id]: {
          ...result,
          analysis,
          timestamp: new Date().toISOString(),
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testCase.id]: {
          error: error instanceof Error ? error.message : "Unknown error",
          analysis: { passed: false, issues: ["API call failed"] },
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setIsRunning(false)
    }
  }

  const runCustomTest = async () => {
    if (!customInput.trim()) return

    setIsRunning(true)

    try {
      const response = await fetch("/api/ai-listing/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: `custom_test_${Date.now()}`,
          message: customInput,
          currentFormState: {},
          stage: "introduction",
        }),
      })

      const result = await response.json()

      setTestResults((prev) => ({
        ...prev,
        custom: {
          ...result,
          userInput: customInput,
          timestamp: new Date().toISOString(),
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        custom: {
          error: error instanceof Error ? error.message : "Unknown error",
          userInput: customInput,
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setIsRunning(false)
    }
  }

  const analyzeTestResult = (testCase: TestCase, result: any) => {
    const issues: string[] = []
    let passed = true

    // Check if response has required structure
    if (!result.response?.message) {
      issues.push("Missing response message")
      passed = false
    }

    // Check stage progression
    if (result.response?.stage !== testCase.expectedStage) {
      issues.push(`Expected stage '${testCase.expectedStage}', got '${result.response?.stage}'`)
      passed = false
    }

    // Check field extraction
    const extractedFields = Object.keys(result.response?.fieldUpdates || {})
    const missingFields = testCase.expectedFields.filter((field) => !extractedFields.includes(field))
    if (missingFields.length > 0) {
      issues.push(`Missing expected fields: ${missingFields.join(", ")}`)
      passed = false
    }

    // Check response quality
    if (result.response?.message && result.response.message.length < 50) {
      issues.push("Response message too short")
      passed = false
    }

    return { passed, issues, extractedFields }
  }

  const getTestCategoryCounts = () => {
    const counts = { conversation: 0, field_mapping: 0, validation: 0, enhancement: 0 }
    TEST_CASES.forEach((test) => counts[test.category]++)
    return counts
  }

  const getPassedTestsCount = () => {
    return Object.values(testResults).filter((result) => result.analysis?.passed).length
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Listing Assistant Testing</h1>
          <p className="text-slate-400">Test and validate AI conversation functionality</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {getPassedTestsCount()}/{Object.keys(testResults).length} Passed
          </Badge>
          <Badge variant="outline">{TEST_CASES.length} Total Tests</Badge>
        </div>
      </div>

      <Tabs defaultValue="predefined" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predefined">Predefined Tests</TabsTrigger>
          <TabsTrigger value="custom">Custom Testing</TabsTrigger>
          <TabsTrigger value="results">Results Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="predefined" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEST_CASES.map((testCase) => {
              const result = testResults[testCase.id]
              const status = result?.analysis?.passed ? "passed" : result?.error ? "failed" : "pending"

              return (
                <Card key={testCase.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{testCase.name}</CardTitle>
                      {status === "passed" && <CheckCircle className="h-4 w-4 text-green-400" />}
                      {status === "failed" && <XCircle className="h-4 w-4 text-red-400" />}
                      {status === "pending" && <AlertCircle className="h-4 w-4 text-slate-400" />}
                    </div>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {testCase.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-slate-400">{testCase.description}</p>
                    <div className="text-xs">
                      <strong>Input:</strong>
                      <p className="mt-1 p-2 bg-slate-700 rounded text-slate-300">
                        {testCase.userInput.slice(0, 100)}...
                      </p>
                    </div>
                    <div className="text-xs">
                      <strong>Expected:</strong>
                      <p className="text-slate-400">Stage: {testCase.expectedStage}</p>
                      <p className="text-slate-400">Fields: {testCase.expectedFields.join(", ") || "None"}</p>
                    </div>
                    {result && (
                      <div className="text-xs">
                        <strong>Result:</strong>
                        <p className="text-slate-400">Stage: {result.response?.stage || "N/A"}</p>
                        <p className="text-slate-400">
                          Fields: {Object.keys(result.response?.fieldUpdates || {}).join(", ") || "None"}
                        </p>
                        {result.analysis?.issues && result.analysis.issues.length > 0 && (
                          <div className="mt-1">
                            <p className="text-red-400">Issues:</p>
                            <ul className="text-red-400 list-disc list-inside">
                              {result.analysis.issues.map((issue: string, i: number) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    <Button size="sm" onClick={() => runTest(testCase)} disabled={isRunning} className="w-full">
                      <Play className="h-3 w-3 mr-1" />
                      Run Test
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Custom Test Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter a custom message to test the AI response..."
                rows={4}
                className="bg-slate-700 border-slate-600"
              />
              <Button onClick={runCustomTest} disabled={isRunning || !customInput.trim()}>
                <Play className="h-4 w-4 mr-2" />
                Test Custom Input
              </Button>

              {testResults.custom && (
                <div className="mt-4 p-4 bg-slate-700 rounded">
                  <h4 className="font-medium mb-2">Custom Test Result</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Input:</strong>
                      <p className="text-slate-300">{testResults.custom.userInput}</p>
                    </div>
                    {testResults.custom.response && (
                      <>
                        <div>
                          <strong>AI Response:</strong>
                          <p className="text-slate-300">{testResults.custom.response.message}</p>
                        </div>
                        <div>
                          <strong>Stage:</strong>
                          <p className="text-slate-300">{testResults.custom.response.stage}</p>
                        </div>
                        <div>
                          <strong>Field Updates:</strong>
                          <pre className="text-slate-300 bg-slate-800 p-2 rounded text-xs">
                            {JSON.stringify(testResults.custom.response.fieldUpdates, null, 2)}
                          </pre>
                        </div>
                      </>
                    )}
                    {testResults.custom.error && (
                      <div>
                        <strong className="text-red-400">Error:</strong>
                        <p className="text-red-400">{testResults.custom.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(getTestCategoryCounts()).map(([category, count]) => (
              <Card key={category} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-slate-400 capitalize">{category.replace("_", " ")}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(testResults).map(([testId, result]) => (
                  <div key={testId} className="p-4 bg-slate-700 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{testId}</h4>
                      <Badge variant={result.analysis?.passed ? "default" : "destructive"}>
                        {result.analysis?.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}
                      </p>
                      {result.response && (
                        <>
                          <p>
                            <strong>Stage:</strong> {result.response.stage}
                          </p>
                          <p>
                            <strong>Confidence:</strong> {result.response.confidence}
                          </p>
                          <p>
                            <strong>Fields Updated:</strong>{" "}
                            {Object.keys(result.response.fieldUpdates || {}).join(", ") || "None"}
                          </p>
                        </>
                      )}
                      {result.analysis?.issues && result.analysis.issues.length > 0 && (
                        <div>
                          <strong className="text-red-400">Issues:</strong>
                          <ul className="text-red-400 list-disc list-inside ml-4">
                            {result.analysis.issues.map((issue: string, i: number) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
