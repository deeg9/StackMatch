"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"

export default function AIDeploymentPage() {
  const [checklist, setChecklist] = useState({
    modelTested: false,
    integrationTested: false,
    performanceOptimized: false,
    errorHandlingImplemented: false,
    uiPolished: false,
    accessControlConfigured: false,
    monitoringSetup: false,
    documentationComplete: false,
    securityReviewed: false,
    backupPlanCreated: false,
  })

  const checklistItems = [
    { id: "modelTested", label: "AI Model Tested", description: "Verify model responses are accurate and helpful" },
    {
      id: "integrationTested",
      label: "Integration Tested",
      description: "Confirm data flows correctly between systems",
    },
    {
      id: "performanceOptimized",
      label: "Performance Optimized",
      description: "Response times and token usage optimized",
    },
    {
      id: "errorHandlingImplemented",
      label: "Error Handling",
      description: "Graceful fallbacks for all error scenarios",
    },
    { id: "uiPolished", label: "UI Polish Complete", description: "Animations and visual feedback implemented" },
    { id: "accessControlConfigured", label: "Access Control", description: "Proper permissions and rate limiting" },
    { id: "monitoringSetup", label: "Monitoring Setup", description: "Usage tracking and performance monitoring" },
    { id: "documentationComplete", label: "Documentation", description: "User guides and technical documentation" },
    { id: "securityReviewed", label: "Security Review", description: "Security audit and vulnerability testing" },
    { id: "backupPlanCreated", label: "Backup Plan", description: "Fallback strategies and data recovery" },
  ]

  const toggleItem = (id: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const completedCount = Object.values(checklist).filter(Boolean).length
  const totalCount = Object.keys(checklist).length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  const getDeploymentStatus = () => {
    if (completionPercentage < 50) return "Not Ready"
    if (completionPercentage < 80) return "Almost Ready"
    if (completionPercentage < 100) return "Ready with Caution"
    return "Ready for Deployment"
  }

  const getStatusColor = () => {
    if (completionPercentage < 50) return "destructive"
    if (completionPercentage < 80) return "warning"
    if (completionPercentage < 100) return "default"
    return "success"
  }

  const getStatusIcon = () => {
    if (completionPercentage < 50) return <AlertCircle className="h-4 w-4" />
    if (completionPercentage < 100) return <AlertTriangle className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">AI Listing System Deployment</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Checklist</CardTitle>
              <CardDescription>Complete all items before deploying to production</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm font-medium">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="" />
                </div>
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Checkbox id={item.id} checked={checklist[item.id as keyof typeof checklist]} onCheckedChange={() => toggleItem(item.id as keyof typeof checklist)} />
                    <div className="space-y-1">
                      <label htmlFor={item.id} className="text-sm font-medium">
                        {item.label}
                      </label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Deployment Status</CardTitle>
              <CardDescription>Current status of your AI deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className="text-sm font-medium">{getDeploymentStatus()}</span>
                </div>
                <Badge variant={getStatusColor()}>{completionPercentage}%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
