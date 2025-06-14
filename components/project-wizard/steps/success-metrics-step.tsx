"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import {
  updateData,
  addOutcome,
  updateOutcome,
  removeOutcome,
  addKPI,
  removeKPI,
} from "@/store/slices/projectWizardSlice"
import type { ProjectOutcome } from "@/store/slices/projectWizardSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Trash2, Edit, Target, TrendingUp, BarChart3, CheckCircle } from "lucide-react"

const commonMetrics = [
  "Revenue Growth",
  "Cost Reduction",
  "User Engagement",
  "Conversion Rate",
  "Performance Improvement",
  "Time Savings",
  "User Satisfaction",
  "Market Share",
  "Efficiency Gain",
  "Error Reduction",
]

const commonKPIs = [
  "Monthly Active Users",
  "Customer Acquisition Cost",
  "Return on Investment",
  "Page Load Time",
  "System Uptime",
  "User Retention Rate",
  "Task Completion Rate",
  "Support Ticket Reduction",
  "Sales Conversion Rate",
  "Customer Satisfaction Score",
]

export function SuccessMetricsStep() {
  const dispatch = useDispatch()
  const { data } = useSelector((state: RootState) => state.projectWizard)
  const [newOutcome, setNewOutcome] = useState<Omit<ProjectOutcome, "id">>({
    metric: "",
    currentValue: "",
    targetValue: "",
    unit: "",
    description: "",
  })
  const [editingOutcome, setEditingOutcome] = useState<string | null>(null)
  const [newKPI, setNewKPI] = useState("")

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateData({ [field]: value }))
  }

  const handleAddOutcome = () => {
    if (newOutcome.metric.trim() && newOutcome.targetValue.trim()) {
      dispatch(addOutcome(newOutcome))
      setNewOutcome({
        metric: "",
        currentValue: "",
        targetValue: "",
        unit: "",
        description: "",
      })
    }
  }

  const handleUpdateOutcome = (outcome: ProjectOutcome) => {
    dispatch(updateOutcome(outcome))
    setEditingOutcome(null)
  }

  const handleRemoveOutcome = (id: string) => {
    dispatch(removeOutcome(id))
  }

  const handleAddKPI = (kpi: string) => {
    if (kpi.trim() && !data.kpis.includes(kpi.trim())) {
      dispatch(addKPI(kpi.trim()))
      setNewKPI("")
    }
  }

  const handleRemoveKPI = (kpi: string) => {
    dispatch(removeKPI(kpi))
  }

  return (
    <div className="space-y-8">
      {/* Success Criteria */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Success Criteria
        </h3>
        <p className="text-muted-foreground mb-4">
          Define what success looks like for your project. Clear success criteria help providers understand your goals
          and deliver results that matter.
        </p>

        <div>
          <Label htmlFor="success-criteria">Overall Success Definition</Label>
          <Textarea
            id="success-criteria"
            value={data.successCriteria}
            onChange={(e) => handleInputChange("successCriteria", e.target.value)}
            placeholder="Describe what success looks like for this project. For example:
• Increase online sales by 30% within 6 months
• Reduce manual processing time by 50%
• Improve customer satisfaction scores
• Achieve 99.9% system uptime
• Streamline workflow efficiency"
            rows={6}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Be specific about what you want to achieve and how you'll measure success.
          </p>
        </div>
      </div>

      {/* Measurable Outcomes */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Measurable Outcomes
        </h3>
        <p className="text-muted-foreground mb-4">
          Define specific, measurable outcomes with current and target values.
        </p>

        {/* Add New Outcome */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Add Measurable Outcome</CardTitle>
            <CardDescription>Define a specific metric with current and target values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="outcome-metric">Metric Name</Label>
                <Input
                  id="outcome-metric"
                  value={newOutcome.metric}
                  onChange={(e) => setNewOutcome((prev) => ({ ...prev, metric: e.target.value }))}
                  placeholder="e.g., Revenue Growth"
                />
              </div>
              <div>
                <Label htmlFor="outcome-unit">Unit</Label>
                <Input
                  id="outcome-unit"
                  value={newOutcome.unit}
                  onChange={(e) => setNewOutcome((prev) => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., %, $, users, hours"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="outcome-current">Current Value</Label>
                <Input
                  id="outcome-current"
                  value={newOutcome.currentValue}
                  onChange={(e) => setNewOutcome((prev) => ({ ...prev, currentValue: e.target.value }))}
                  placeholder="e.g., 100000"
                />
              </div>
              <div>
                <Label htmlFor="outcome-target">Target Value</Label>
                <Input
                  id="outcome-target"
                  value={newOutcome.targetValue}
                  onChange={(e) => setNewOutcome((prev) => ({ ...prev, targetValue: e.target.value }))}
                  placeholder="e.g., 150000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="outcome-description">Description</Label>
              <Textarea
                id="outcome-description"
                value={newOutcome.description}
                onChange={(e) => setNewOutcome((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe how this metric will be measured and why it's important..."
                rows={2}
              />
            </div>
            <Button onClick={handleAddOutcome} disabled={!newOutcome.metric.trim() || !newOutcome.targetValue.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Outcome
            </Button>
          </CardContent>
        </Card>

        {/* Quick Add Common Metrics */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Common Metrics</CardTitle>
            <CardDescription className="text-xs">Click to quickly add popular business metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {commonMetrics.map((metric) => (
                <Badge
                  key={metric}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setNewOutcome((prev) => ({ ...prev, metric }))}
                >
                  {metric}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outcomes List */}
        <div className="space-y-4">
          {data.outcomes.map((outcome) => (
            <Card key={outcome.id}>
              <CardContent className="pt-6">
                {editingOutcome === outcome.id ? (
                  <EditOutcomeForm
                    outcome={outcome}
                    onSave={handleUpdateOutcome}
                    onCancel={() => setEditingOutcome(null)}
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <h4 className="font-semibold">{outcome.metric}</h4>
                        {outcome.unit && <Badge variant="outline">{outcome.unit}</Badge>}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Current: </span>
                          <span className="font-medium">{outcome.currentValue || "Not specified"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Target: </span>
                          <span className="font-medium text-green-600">{outcome.targetValue}</span>
                        </div>
                      </div>
                      {outcome.description && <p className="text-muted-foreground text-sm">{outcome.description}</p>}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => setEditingOutcome(outcome.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveOutcome(outcome.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {data.outcomes.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No measurable outcomes defined yet. Add your first outcome above.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Key Performance Indicators (KPIs)
        </h3>
        <p className="text-muted-foreground mb-4">
          List the key metrics you'll track to monitor project success and ongoing performance.
        </p>

        {/* Current KPIs */}
        {data.kpis.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.kpis.map((kpi) => (
              <Badge key={kpi} variant="secondary" className="flex items-center gap-1">
                {kpi}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveKPI(kpi)} />
              </Badge>
            ))}
          </div>
        )}

        {/* Add KPI */}
        <div className="flex gap-2 mb-4">
          <Input
            value={newKPI}
            onChange={(e) => setNewKPI(e.target.value)}
            placeholder="Add a KPI..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddKPI(newKPI)
              }
            }}
          />
          <Button type="button" variant="outline" onClick={() => handleAddKPI(newKPI)} disabled={!newKPI.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Common KPIs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Common KPIs</CardTitle>
            <CardDescription className="text-xs">
              Click to add frequently tracked performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {commonKPIs
                .filter((kpi) => !data.kpis.includes(kpi))
                .map((kpi) => (
                  <Badge
                    key={kpi}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleAddKPI(kpi)}
                  >
                    {kpi}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Metrics Tips */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center text-green-800">
            <Target className="h-4 w-4 mr-2" />
            Success Metrics Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Make metrics specific, measurable, and time-bound</li>
            <li>• Include both business and technical success criteria</li>
            <li>• Consider short-term and long-term goals</li>
            <li>• Define how you'll measure and track each metric</li>
            <li>• Align metrics with your overall business objectives</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

// Edit Outcome Form Component
function EditOutcomeForm({
  outcome,
  onSave,
  onCancel,
}: {
  outcome: ProjectOutcome
  onSave: (outcome: ProjectOutcome) => void
  onCancel: () => void
}) {
  const [editedOutcome, setEditedOutcome] = useState(outcome)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Metric Name</Label>
          <Input
            value={editedOutcome.metric}
            onChange={(e) => setEditedOutcome((prev) => ({ ...prev, metric: e.target.value }))}
          />
        </div>
        <div>
          <Label>Unit</Label>
          <Input
            value={editedOutcome.unit}
            onChange={(e) => setEditedOutcome((prev) => ({ ...prev, unit: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Current Value</Label>
          <Input
            value={editedOutcome.currentValue}
            onChange={(e) => setEditedOutcome((prev) => ({ ...prev, currentValue: e.target.value }))}
          />
        </div>
        <div>
          <Label>Target Value</Label>
          <Input
            value={editedOutcome.targetValue}
            onChange={(e) => setEditedOutcome((prev) => ({ ...prev, targetValue: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={editedOutcome.description}
          onChange={(e) => setEditedOutcome((prev) => ({ ...prev, description: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(editedOutcome)} size="sm">
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  )
}
