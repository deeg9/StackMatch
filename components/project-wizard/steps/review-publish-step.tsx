"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/store"
import { setLoading, setError } from "@/store/slices/projectWizardSlice"
import { addListing } from "@/store/slices/listingsSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  Eye,
  Globe,
  Lock,
  Users,
  Calendar,
  DollarSign,
  Target,
  FileText,
  AlertCircle,
  Rocket,
} from "lucide-react"

export function ReviewPublishStep() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { data, isLoading, error } = useSelector((state: RootState) => state.projectWizard)
  const { user } = useSelector((state: RootState) => state.auth)
  const [publishSettings, setPublishSettings] = useState({
    visibility: data.visibility || "PUBLIC",
    biddingType: data.biddingType || "SEALED",
    biddingDeadline: data.biddingDeadline || "",
    maxProposals: data.maxProposals || 20,
    autoShortlist: data.autoShortlist || false,
  })

  const handlePublish = async () => {
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      // Create the listing object
      const newListing = {
        id: `listing-${Date.now()}`,
        title: data.title,
        description: data.description,
        summary: data.summary,
        category: data.category,
        subcategory: data.subcategory,
        tags: data.tags,
        budget: data.budgetMax || data.budgetMin,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        budgetType: data.budgetType,
        deadline: data.deadline,
        status: "OPEN" as const,
        businessId: user?.id || "",
        businessName: user?.company || user?.name || "",
        createdAt: new Date().toISOString(),
        bidCount: 0,
        requirements: data.requirements,
        technicalSpecs: data.technicalSpecs,
        constraints: data.constraints,
        preferredTechnologies: data.preferredTechnologies,
        outcomes: data.outcomes,
        successCriteria: data.successCriteria,
        kpis: data.kpis,
        attachments: data.attachments,
        providerQuestions: data.providerQuestions,
        communicationPreferences: data.communicationPreferences,
        workingHours: data.workingHours,
        timezone: data.timezone,
        visibility: publishSettings.visibility,
        biddingType: publishSettings.biddingType,
        biddingDeadline: publishSettings.biddingDeadline,
        maxProposals: publishSettings.maxProposals,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add to listings store
      dispatch(addListing(newListing))

      // Redirect to the new listing
      router.push(`/listings/${newListing.id}?published=true`)
    } catch (err) {
      dispatch(setError("Failed to publish project. Please try again."))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const completionPercentage = Math.round(
    (((data.title ? 1 : 0) +
      (data.description ? 1 : 0) +
      (data.category ? 1 : 0) +
      (data.requirements.length > 0 ? 1 : 0) +
      (data.budgetMin > 0 ? 1 : 0) +
      (data.deadline ? 1 : 0) +
      (data.outcomes.length > 0 ? 1 : 0)) /
      7) *
      100,
  )

  return (
    <div className="space-y-8">
      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Project Summary
          </CardTitle>
          <CardDescription>Review your project details before publishing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Title:</span>
                <p className="font-medium">{data.title || "Not specified"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium">{data.category || "Not specified"}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Summary:</span>
                <p className="font-medium">{data.summary || "Not specified"}</p>
              </div>
            </div>
            {data.tags.length > 0 && (
              <div className="mt-3">
                <span className="text-muted-foreground text-sm">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Budget & Timeline */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Budget & Timeline
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Budget Range:</span>
                <p className="font-medium">
                  {data.budgetMin > 0 && data.budgetMax > 0
                    ? `${formatCurrency(data.budgetMin)} - ${formatCurrency(data.budgetMax)}`
                    : "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Timeline:</span>
                <p className="font-medium">{data.timeline || "Not specified"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Deadline:</span>
                <p className="font-medium">
                  {data.deadline ? new Date(data.deadline).toLocaleDateString() : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Requirements ({data.requirements.length})
            </h4>
            {data.requirements.length > 0 ? (
              <div className="space-y-2">
                {data.requirements.slice(0, 3).map((req) => (
                  <div key={req.id} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {req.priority}
                    </Badge>
                    <span>{req.title}</span>
                  </div>
                ))}
                {data.requirements.length > 3 && (
                  <p className="text-sm text-muted-foreground">+{data.requirements.length - 3} more requirements</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No requirements specified</p>
            )}
          </div>

          <Separator />

          {/* Success Metrics */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Success Metrics ({data.outcomes.length})
            </h4>
            {data.outcomes.length > 0 ? (
              <div className="space-y-2">
                {data.outcomes.slice(0, 3).map((outcome) => (
                  <div key={outcome.id} className="text-sm">
                    <span className="font-medium">{outcome.metric}:</span>
                    <span className="text-muted-foreground ml-2">
                      {outcome.currentValue || "Current"} → {outcome.targetValue} {outcome.unit}
                    </span>
                  </div>
                ))}
                {data.outcomes.length > 3 && (
                  <p className="text-sm text-muted-foreground">+{data.outcomes.length - 3} more metrics</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No success metrics defined</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="h-5 w-5 mr-2" />
            Publishing Settings
          </CardTitle>
          <CardDescription>Configure how your project will be published and how providers can respond</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visibility */}
          <div>
            <Label className="text-base font-medium">Project Visibility</Label>
            <p className="text-sm text-muted-foreground mb-3">Who can see and respond to your project?</p>
            <RadioGroup
              value={publishSettings.visibility}
              onValueChange={(value: "PUBLIC" | "PRIVATE" | "INVITED_ONLY") =>
                setPublishSettings((prev) => ({ ...prev, visibility: value }))
              }
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="PUBLIC" id="public" />
                <div className="flex-1">
                  <Label htmlFor="public" className="font-medium flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Public
                  </Label>
                  <p className="text-sm text-muted-foreground">Visible to all providers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="PRIVATE" id="private" />
                <div className="flex-1">
                  <Label htmlFor="private" className="font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Private
                  </Label>
                  <p className="text-sm text-muted-foreground">Only you can see it</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="INVITED_ONLY" id="invited" />
                <div className="flex-1">
                  <Label htmlFor="invited" className="font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Only
                  </Label>
                  <p className="text-sm text-muted-foreground">Only invited providers</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Bidding Type */}
          <div>
            <Label className="text-base font-medium">Bidding Type</Label>
            <p className="text-sm text-muted-foreground mb-3">How should providers submit their proposals?</p>
            <RadioGroup
              value={publishSettings.biddingType}
              onValueChange={(value: "OPEN" | "SEALED") =>
                setPublishSettings((prev) => ({ ...prev, biddingType: value }))
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="OPEN" id="open-bidding" />
                <div className="flex-1">
                  <Label htmlFor="open-bidding" className="font-medium">
                    Open Bidding
                  </Label>
                  <p className="text-sm text-muted-foreground">Proposals are visible to all</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4">
                <RadioGroupItem value="SEALED" id="sealed-bidding" />
                <div className="flex-1">
                  <Label htmlFor="sealed-bidding" className="font-medium">
                    Sealed Bidding
                  </Label>
                  <p className="text-sm text-muted-foreground">Proposals are private until deadline</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Bidding Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bidding-deadline">Proposal Deadline</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bidding-deadline"
                  type="datetime-local"
                  className="pl-10"
                  value={publishSettings.biddingDeadline}
                  onChange={(e) => setPublishSettings((prev) => ({ ...prev, biddingDeadline: e.target.value }))}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">When should proposal submissions close?</p>
            </div>

            <div>
              <Label htmlFor="max-proposals">Maximum Proposals</Label>
              <Input
                id="max-proposals"
                type="number"
                value={publishSettings.maxProposals}
                onChange={(e) => setPublishSettings((prev) => ({ ...prev, maxProposals: Number(e.target.value) }))}
                min="1"
                max="100"
              />
              <p className="text-sm text-muted-foreground mt-1">Limit the number of proposals you'll receive</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      <Card className={completionPercentage === 100 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {completionPercentage === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
              )}
              <span className="font-medium">Project Completion: {completionPercentage}%</span>
            </div>
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
              {completionPercentage === 100 ? "Ready to Publish" : "Incomplete"}
            </Badge>
          </div>

          {completionPercentage < 100 && (
            <div className="text-sm text-amber-700">
              <p className="mb-2">Consider completing these sections for a better project listing:</p>
              <ul className="space-y-1">
                {!data.title && <li>• Add a project title</li>}
                {!data.description && <li>• Add a project description</li>}
                {!data.category && <li>• Select a category</li>}
                {data.requirements.length === 0 && <li>• Add project requirements</li>}
                {data.budgetMin === 0 && <li>• Set a budget range</li>}
                {!data.deadline && <li>• Set a project deadline</li>}
                {data.outcomes.length === 0 && <li>• Define success metrics</li>}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Publish Button */}
      <div className="flex justify-center">
        <Button size="lg" onClick={handlePublish} disabled={isLoading || completionPercentage < 70} className="px-8">
          <Rocket className="h-4 w-4 mr-2" />
          {isLoading ? "Publishing..." : "Publish Project"}
        </Button>
      </div>

      {completionPercentage < 70 && (
        <p className="text-center text-sm text-muted-foreground">
          Complete at least 70% of the project details to publish
        </p>
      )}
    </div>
  )
}
