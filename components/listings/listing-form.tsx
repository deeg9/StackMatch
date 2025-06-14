"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Upload, FileText, Target, AlertTriangle, Calendar, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import type {
  DetailedNeed,
  SuccessMetric,
  Challenge,
  TimelinePhase,
  AttachmentFile,
  ListingFormData,
} from "@/types/listing-types"

interface ListingFormProps {
  initialData?: Partial<ListingFormData> & { id?: string } // Include all fields that can be pre-filled
  onSubmit: (data: ListingFormData, isDraft: boolean) => Promise<void>
  isLoading: boolean
  mode: "create" | "edit"
}

export function ListingForm({ initialData, onSubmit, isLoading, mode }: ListingFormProps) {
  const { toast } = useToast()

  // Basic Information
  const [listingTitle, setListingTitle] = useState("")
  const [budget, setBudget] = useState("") // e.g., "$50k-$80k" or "$70k"
  const [deadline, setDeadline] = useState("") // YYYY-MM-DD
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([])

  // RFP Overview
  const [aboutBusiness, setAboutBusiness] = useState("")
  const [aboutCompany, setAboutCompany] = useState("")

  // Detailed Needs
  const [detailedNeeds, setDetailedNeeds] = useState<DetailedNeed[]>([])
  const [newNeedTitle, setNewNeedTitle] = useState("")
  const [newNeedDescription, setNewNeedDescription] = useState("")

  // Success Metrics
  const [successMetrics, setSuccessMetrics] = useState<SuccessMetric[]>([])

  // Current Challenges
  const [challenges, setChallenges] = useState<Challenge[]>([])

  // Project Timeline
  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>([])

  // Attachments
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  // TODO: For actual file uploads, you'll need a state for File objects
  // const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast({ title: "Error", description: "Failed to load categories.", variant: "destructive" })
      }
    }
    fetchCategories()
  }, [toast])

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setListingTitle(initialData.title || "")

      // Reconstruct budget string if budgetMin/budgetMax are provided
      if (initialData.budgetMin && initialData.budgetMax) {
        if (initialData.budgetMin === initialData.budgetMax) {
          setBudget(`$${Number.parseFloat(initialData.budgetMin) / 1000}k`)
        } else {
          setBudget(
            `$${Number.parseFloat(initialData.budgetMin) / 1000}k-$${Number.parseFloat(initialData.budgetMax) / 1000}k`,
          )
        }
      } else if (initialData.budgetMin) {
        setBudget(`$${Number.parseFloat(initialData.budgetMin) / 1000}k`)
      } else {
        setBudget("")
      }

      setDeadline(initialData.bidDeadline ? initialData.bidDeadline.split("T")[0] : "")
      setTags(initialData.tags || initialData.requiredSkills || [])
      setSelectedCategory(initialData.categoryId || "")
      setAboutBusiness(initialData.aboutBusiness || "")
      setAboutCompany(initialData.aboutCompany || "")
      setDetailedNeeds(initialData.detailedNeeds || [])
      setSuccessMetrics(initialData.successMetrics || [])
      setChallenges(initialData.currentChallenges || [])
      setTimelinePhases(initialData.timelinePhases || [])
      setAttachments(initialData.attachments || [])
    }
  }, [mode, initialData])

  const addTagHandler = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTagHandler = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addDetailedNeedHandler = () => {
    if (newNeedTitle.trim() && newNeedDescription.trim()) {
      const newNeed: DetailedNeed = {
        id: Date.now().toString(), // Temporary ID for client-side
        title: newNeedTitle.trim(),
        description: newNeedDescription.trim(),
      }
      setDetailedNeeds([...detailedNeeds, newNeed])
      setNewNeedTitle("")
      setNewNeedDescription("")
    }
  }

  const removeDetailedNeedHandler = (id: string) => {
    setDetailedNeeds(detailedNeeds.filter((need) => need.id !== id))
  }

  const addSuccessMetricHandler = () => {
    const newMetric: SuccessMetric = {
      id: Date.now().toString(),
      label: "",
      currentValue: "",
      targetValue: "",
      unit: "",
    }
    setSuccessMetrics([...successMetrics, newMetric])
  }

  const updateSuccessMetricHandler = (id: string, field: keyof SuccessMetric, value: string) => {
    setSuccessMetrics(successMetrics.map((metric) => (metric.id === id ? { ...metric, [field]: value } : metric)))
  }

  const removeSuccessMetricHandler = (id: string) => {
    setSuccessMetrics(successMetrics.filter((metric) => metric.id !== id))
  }

  const addChallengeHandler = () => {
    const newChallenge: Challenge = { id: Date.now().toString(), title: "", description: "" }
    setChallenges([...challenges, newChallenge])
  }

  const updateChallengeHandler = (id: string, field: keyof Challenge, value: string) => {
    setChallenges(challenges.map((challenge) => (challenge.id === id ? { ...challenge, [field]: value } : challenge)))
  }

  const removeChallengeHandler = (id: string) => {
    setChallenges(challenges.filter((challenge) => challenge.id !== id))
  }

  const addTimelinePhaseHandler = () => {
    const newPhase: TimelinePhase = {
      id: Date.now().toString(),
      title: "",
      startDate: "",
      endDate: "",
      duration: "",
    }
    setTimelinePhases([...timelinePhases, newPhase])
  }

  const updateTimelinePhaseHandler = (id: string, field: keyof TimelinePhase, value: string) => {
    setTimelinePhases(timelinePhases.map((phase) => (phase.id === id ? { ...phase, [field]: value } : phase)))
  }

  const removeTimelinePhaseHandler = (id: string) => {
    setTimelinePhases(timelinePhases.filter((phase) => phase.id !== id))
  }

  const handleFileUploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random(), // Temporary ID
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        // Store the actual file if you need to upload it
        // fileRef: file
      }))
      setAttachments([...attachments, ...newAttachments])
      // setFilesToUpload(prev => [...prev, ...Array.from(files)]);
      toast({ title: "Files Selected", description: `${newAttachments.length} file(s) ready for form submission.` })
    }
  }

  const removeAttachmentHandler = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id))
    // setFilesToUpload(prev => prev.filter(f => f.name !== attachmentToRemove.name)); // if tracking File objects
  }

  const handleSubmitInternal = async (isDraft: boolean) => {
    if (!listingTitle.trim()) {
      toast({ title: "Validation Error", description: "Project title is required", variant: "destructive" })
      return
    }
    if (!selectedCategory) {
      toast({ title: "Validation Error", description: "Project category is required", variant: "destructive" })
      return
    }

    // Parse budget string (e.g., "$50k-$80k" or "$70k") into budgetMin and budgetMax
    let budgetMinStr: string | undefined = undefined
    let budgetMaxStr: string | undefined = undefined

    if (budget.trim()) {
      const budgetParts = budget.replace(/\$|k/gi, "").split("-")
      if (budgetParts.length === 1 && budgetParts[0].trim()) {
        budgetMinStr = (Number.parseFloat(budgetParts[0].trim()) * 1000).toString()
        budgetMaxStr = budgetMinStr
      } else if (budgetParts.length === 2 && budgetParts[0].trim() && budgetParts[1].trim()) {
        budgetMinStr = (Number.parseFloat(budgetParts[0].trim()) * 1000).toString()
        budgetMaxStr = (Number.parseFloat(budgetParts[1].trim()) * 1000).toString()
      } else if (budgetParts.length === 1 && budgetParts[0].trim().endsWith("+")) {
        budgetMinStr = (Number.parseFloat(budgetParts[0].trim().replace("+", "")) * 1000).toString()
        budgetMaxStr = undefined // Or some very large number if your API requires it
      } else {
        toast({
          title: "Validation Error",
          description: "Budget format is invalid. Use e.g., $50k-$80k, $70k, or $100k+.",
          variant: "destructive",
        })
        return
      }
    }

    const formData: ListingFormData = {
      title: listingTitle,
      description: aboutBusiness || `${listingTitle} - ${aboutCompany}`, // Or handle description more directly
      categoryId: selectedCategory,
      budgetMin: budgetMinStr,
      budgetMax: budgetMaxStr,
      bidDeadline: deadline || undefined, // Ensure it's in a format API expects or undefined
      aboutBusiness,
      aboutCompany,
      successMetrics,
      currentChallenges: challenges,
      timelinePhases,
      tags, // This is `requiredSkills` for the API
      detailedNeeds,
      attachments, // This should be processed if files are actually uploaded
      // projectStartDate, projectDuration, locationPreference, remotePreference - add if needed
    }

    // If attachments involve actual file uploads, handle them here or in the onSubmit prop
    // For example, upload to blob storage, get URLs, then add URLs to formData.attachments

    await onSubmit(formData, isDraft)
  }

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>Company and project overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="listingTitle">Project Title</Label>
            <Input
              id="listingTitle"
              value={listingTitle}
              onChange={(e) => setListingTitle(e.target.value)}
              placeholder="e.g., Integrated Business Solutions for Fast-Growing SaaS"
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Input
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., $50k-$80k, $70k, or $100k+"
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Project Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Project Category</Label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Tags (Required Skills)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a skill/tag..."
                className="bg-slate-800 border-slate-700"
                onKeyPress={(e) => e.key === "Enter" && addTagHandler()}
              />
              <Button onClick={addTagHandler} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-blue-600 hover:bg-blue-700">
                  {tag}
                  <button onClick={() => removeTagHandler(tag)} className="ml-2 hover:text-red-300">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFP Overview */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            RFP Overview
          </CardTitle>
          <CardDescription>Detailed project and company description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="aboutBusiness">About the Business / Project Details</Label>
            <Textarea
              id="aboutBusiness"
              value={aboutBusiness}
              onChange={(e) => setAboutBusiness(e.target.value)}
              placeholder="Describe your business, what you do, the project scope, and your current situation..."
              className="min-h-[100px] bg-slate-800 border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aboutCompany">About the Company (Sidebar Info)</Label>
            <Textarea
              id="aboutCompany"
              value={aboutCompany}
              onChange={(e) => setAboutCompany(e.target.value)}
              placeholder="Brief company description for the listing sidebar..."
              className="min-h-[80px] bg-slate-800 border-slate-700"
            />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Needs */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Detailed Needs / Requirements
          </CardTitle>
          <CardDescription>Specific requirements and needs for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {detailedNeeds.map((need) => (
              <div key={need.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{need.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDetailedNeedHandler(need.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">{need.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h4 className="font-medium">Add New Need/Requirement</h4>
            <div className="space-y-2">
              <Input
                value={newNeedTitle}
                onChange={(e) => setNewNeedTitle(e.target.value)}
                placeholder="Need title (e.g., Inventory Visibility & Forecasting)"
                className="bg-slate-700 border-slate-600"
              />
              <Textarea
                value={newNeedDescription}
                onChange={(e) => setNewNeedDescription(e.target.value)}
                placeholder="Detailed description of this need..."
                className="bg-slate-700 border-slate-600"
              />
              <Button onClick={addDetailedNeedHandler} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Need
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Attachments
          </CardTitle>
          <CardDescription>Upload relevant documents and files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-400 mb-2">Drop files here or click to upload</p>
            <input type="file" multiple onChange={handleFileUploadHandler} className="hidden" id="file-upload-input" />
            <Button variant="outline" asChild>
              <label htmlFor="file-upload-input" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-slate-400">{file.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachmentHandler(file.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Success Looks Like...
          </CardTitle>
          <CardDescription>Define measurable success metrics for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMetrics.map((metric) => (
            <div key={metric.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    value={metric.label}
                    onChange={(e) => updateSuccessMetricHandler(metric.id, "label", e.target.value)}
                    placeholder="Metric name"
                    className="bg-slate-700 border-slate-600"
                  />
                  <Input
                    value={metric.currentValue}
                    onChange={(e) => updateSuccessMetricHandler(metric.id, "currentValue", e.target.value)}
                    placeholder="Current value"
                    className="bg-slate-700 border-slate-600"
                  />
                  <Input
                    value={metric.targetValue}
                    onChange={(e) => updateSuccessMetricHandler(metric.id, "targetValue", e.target.value)}
                    placeholder="Target value"
                    className="bg-slate-700 border-slate-600"
                  />
                  <Input
                    value={metric.unit}
                    onChange={(e) => updateSuccessMetricHandler(metric.id, "unit", e.target.value)}
                    placeholder="Unit (%, weeks, etc.)"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSuccessMetricHandler(metric.id)}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addSuccessMetricHandler} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Success Metric
          </Button>
        </CardContent>
      </Card>

      {/* Current Challenges */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Current Challenges
          </CardTitle>
          <CardDescription>Describe the main challenges you're facing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 space-y-2">
                  <Input
                    value={challenge.title}
                    onChange={(e) => updateChallengeHandler(challenge.id, "title", e.target.value)}
                    placeholder="Challenge title"
                    className="bg-slate-700 border-slate-600"
                  />
                  <Textarea // Changed from Input to Textarea for description
                    value={challenge.description}
                    onChange={(e) => updateChallengeHandler(challenge.id, "description", e.target.value)}
                    placeholder="Challenge description"
                    className="bg-slate-700 border-slate-600 min-h-[60px]"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChallengeHandler(challenge.id)}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addChallengeHandler} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Challenge
          </Button>
        </CardContent>
      </Card>

      {/* Project Timeline */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
          </CardTitle>
          <CardDescription>Define the phases and timeline for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {timelinePhases.map((phase, index) => (
            <div key={phase.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      value={phase.title}
                      onChange={(e) => updateTimelinePhaseHandler(phase.id, "title", e.target.value)}
                      placeholder="Phase title"
                      className="bg-slate-700 border-slate-600"
                    />
                    <Input
                      type="date"
                      value={phase.startDate}
                      onChange={(e) => updateTimelinePhaseHandler(phase.id, "startDate", e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Input
                      type="date"
                      value={phase.endDate}
                      onChange={(e) => updateTimelinePhaseHandler(phase.id, "endDate", e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Input
                      value={phase.duration}
                      onChange={(e) => updateTimelinePhaseHandler(phase.id, "duration", e.target.value)}
                      placeholder="Duration (e.g., 2 weeks)"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimelinePhaseHandler(phase.id)}
                  className="text-red-400 hover:text-red-300 ml-2 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addTimelinePhaseHandler} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Timeline Phase
          </Button>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline" size="lg" onClick={() => handleSubmitInternal(true)} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          onClick={() => handleSubmitInternal(false)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isLoading || !listingTitle.trim()}
        >
          {isLoading
            ? mode === "create"
              ? "Publishing..."
              : "Updating..."
            : mode === "create"
              ? "Publish Listing"
              : "Update Listing"}
        </Button>
      </div>
    </div>
  )
}
