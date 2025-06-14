"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Undo, Eye, Save, Send, Plus, X } from "lucide-react"
import { updateFormField, undoFieldChange, enhanceField } from "@/store/slices/aiListingSlice"
import { AIFieldEnhancer } from "./ai-field-enhancer"
import type { RootState } from "@/store"
import type { ListingFormData } from "@/types/listing-types"

interface EnhancedListingFormProps {
  onSubmit: (isDraft: boolean) => Promise<void>
  isLoading: boolean
}

export function EnhancedListingForm({ onSubmit, isLoading }: EnhancedListingFormProps) {
  const dispatch = useDispatch()
  const [showPreview, setShowPreview] = useState(false)

  const {
    formData,
    aiPopulatedFields,
    highlightedFields,
    fieldVersionHistory,
    enhancementSuggestions,
    activeEnhancement,
    formCompletionPercentage,
  } = useSelector((state: RootState) => state.aiListing)

  // Mock categories - in real app, fetch from API
  const categories = [
    { id: "web-development", name: "Web Development" },
    { id: "mobile-development", name: "Mobile Development" },
    { id: "software-development", name: "Software Development" },
    { id: "data-analysis", name: "Data Analysis" },
    { id: "design", name: "Design" },
    { id: "marketing", name: "Marketing" },
    { id: "consulting", name: "Consulting" },
  ]

  const handleFieldChange = (field: keyof ListingFormData, value: any) => {
    dispatch(updateFormField({ field: field as string, value, isAIGenerated: false }))
  }

  const handleUndo = (field: string) => {
    dispatch(undoFieldChange(field))
  }

  const handleEnhanceField = (field: string, currentValue: string) => {
    dispatch(
      enhanceField({
        sessionId: "", // Will be filled by the thunk
        fieldName: field,
        currentValue,
        enhancementType: "field_improvement",
      }),
    )
  }

  const isFieldAIPopulated = (field: string) => aiPopulatedFields.has(field)
  const isFieldHighlighted = (field: string) => highlightedFields.has(field)
  const hasFieldHistory = (field: string) => fieldVersionHistory[field]?.length > 0

  const getFieldClassName = (field: string) => {
    let className = "transition-all duration-300"
    if (isFieldHighlighted(field)) {
      className += " ring-2 ring-blue-400 ring-opacity-50 bg-blue-50/5"
    }
    if (isFieldAIPopulated(field)) {
      className += " border-blue-400/50"
    }
    return className
  }

  const addArrayItem = (field: keyof ListingFormData, newItem: string) => {
    const currentArray = (formData[field] as string[]) || []
    handleFieldChange(field, [...currentArray, newItem])
  }

  const removeArrayItem = (field: keyof ListingFormData, index: number) => {
    const currentArray = (formData[field] as string[]) || []
    handleFieldChange(
      field,
      currentArray.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Details</h3>
          <p className="text-sm text-slate-400">
            Fill out your project information. AI-populated fields are highlighted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <ListingPreview formData={formData} />
      ) : (
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Project Title *</Label>
                  <div className="flex items-center gap-1">
                    {isFieldAIPopulated("title") && (
                      <Badge variant="secondary" className="text-xs">
                        AI
                      </Badge>
                    )}
                    {hasFieldHistory("title") && (
                      <Button variant="ghost" size="sm" onClick={() => handleUndo("title")}>
                        <Undo className="h-3 w-3" />
                      </Button>
                    )}
                    <AIFieldEnhancer
                      fieldName="title"
                      currentValue={formData.title || ""}
                      onEnhance={handleEnhanceField}
                      isProcessing={activeEnhancement === "title"}
                    />
                  </div>
                </div>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="Enter a clear, descriptive title for your project"
                  className={getFieldClassName("title")}
                />
                {enhancementSuggestions.title && (
                  <p className="text-xs text-blue-400">{enhancementSuggestions.title}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId || ""}
                  onValueChange={(value) => handleFieldChange("categoryId", value)}
                >
                  <SelectTrigger className={getFieldClassName("categoryId")}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="aboutBusiness">Project Description *</Label>
                  <div className="flex items-center gap-1">
                    {isFieldAIPopulated("aboutBusiness") && (
                      <Badge variant="secondary" className="text-xs">
                        AI
                      </Badge>
                    )}
                    {hasFieldHistory("aboutBusiness") && (
                      <Button variant="ghost" size="sm" onClick={() => handleUndo("aboutBusiness")}>
                        <Undo className="h-3 w-3" />
                      </Button>
                    )}
                    <AIFieldEnhancer
                      fieldName="aboutBusiness"
                      currentValue={formData.aboutBusiness || ""}
                      onEnhance={handleEnhanceField}
                      isProcessing={activeEnhancement === "aboutBusiness"}
                    />
                  </div>
                </div>
                <Textarea
                  id="aboutBusiness"
                  value={formData.aboutBusiness || ""}
                  onChange={(e) => handleFieldChange("aboutBusiness", e.target.value)}
                  placeholder="Describe what you need help with..."
                  rows={4}
                  className={getFieldClassName("aboutBusiness")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget & Timeline */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Budget & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget Range */}
                <div className="space-y-2">
                  <Label>Budget Range *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.budgetMin || ""}
                      onChange={(e) => handleFieldChange("budgetMin", Number.parseInt(e.target.value))}
                      placeholder="Min"
                      className={getFieldClassName("budgetMin")}
                    />
                    <Input
                      type="number"
                      value={formData.budgetMax || ""}
                      onChange={(e) => handleFieldChange("budgetMax", Number.parseInt(e.target.value))}
                      placeholder="Max"
                      className={getFieldClassName("budgetMax")}
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline">Project Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.bidDeadline || ""}
                    onChange={(e) => handleFieldChange("bidDeadline", e.target.value)}
                    className={getFieldClassName("bidDeadline")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Requirements */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Detailed Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tags & Technologies</Label>
                  <AIFieldEnhancer
                    fieldName="tags"
                    currentValue={(formData.tags || []).join(", ")}
                    onEnhance={handleEnhanceField}
                    isProcessing={activeEnhancement === "tags"}
                  />
                </div>
                <TagInput
                  tags={formData.tags || []}
                  onAddTag={(tag) => addArrayItem("tags", tag)}
                  onRemoveTag={(index) => removeArrayItem("tags", index)}
                  placeholder="Add technologies, skills, or keywords"
                  className={getFieldClassName("tags")}
                />
              </div>

              {/* Detailed Needs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Specific Requirements</Label>
                  <AIFieldEnhancer
                    fieldName="detailedNeeds"
                    currentValue={(formData.detailedNeeds || []).join("\n")}
                    onEnhance={handleEnhanceField}
                    isProcessing={activeEnhancement === "detailedNeeds"}
                  />
                </div>
                <ArrayInput
                  items={formData.detailedNeeds || []}
                  onAddItem={(item) => addArrayItem("detailedNeeds", item)}
                  onRemoveItem={(index) => removeArrayItem("detailedNeeds", index)}
                  placeholder="Add a specific requirement"
                  className={getFieldClassName("detailedNeeds")}
                />
              </div>

              {/* Success Metrics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Success Metrics & KPIs</Label>
                  <AIFieldEnhancer
                    fieldName="successMetrics"
                    currentValue={(formData.successMetrics || []).join("\n")}
                    onEnhance={handleEnhanceField}
                    isProcessing={activeEnhancement === "successMetrics"}
                  />
                </div>
                <ArrayInput
                  items={formData.successMetrics || []}
                  onAddItem={(item) => addArrayItem("successMetrics", item)}
                  onRemoveItem={(index) => removeArrayItem("successMetrics", index)}
                  placeholder="Add a success metric or KPI"
                  className={getFieldClassName("successMetrics")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="aboutCompany">About Your Company</Label>
                  <AIFieldEnhancer
                    fieldName="aboutCompany"
                    currentValue={formData.aboutCompany || ""}
                    onEnhance={handleEnhanceField}
                    isProcessing={activeEnhancement === "aboutCompany"}
                  />
                </div>
                <Textarea
                  id="aboutCompany"
                  value={formData.aboutCompany || ""}
                  onChange={(e) => handleFieldChange("aboutCompany", e.target.value)}
                  placeholder="Tell providers about your company..."
                  rows={3}
                  className={getFieldClassName("aboutCompany")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <div className="text-sm text-slate-400">Form is {formCompletionPercentage}% complete</div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onSubmit(true)} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => onSubmit(false)} disabled={isLoading || formCompletionPercentage < 60}>
                <Send className="h-4 w-4 mr-2" />
                Publish Listing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Components
function TagInput({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder,
  className,
}: {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (index: number) => void
  placeholder: string
  className?: string
}) {
  const [inputValue, setInputValue] = useState("")

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onAddTag(inputValue.trim())
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={className}
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button type="button" onClick={() => onRemoveTag(index)} className="ml-1 hover:text-red-400">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function ArrayInput({
  items,
  onAddItem,
  onRemoveItem,
  placeholder,
  className,
}: {
  items: string[]
  onAddItem: (item: string) => void
  onRemoveItem: (index: number) => void
  placeholder: string
  className?: string
}) {
  const [inputValue, setInputValue] = useState("")

  const handleAddItem = () => {
    if (inputValue.trim()) {
      onAddItem(inputValue.trim())
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddItem()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={className}
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-slate-700 rounded">
              <span className="flex-1 text-sm">{item}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveItem(index)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ListingPreview({ formData }: { formData: Partial<ListingFormData> }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle>{formData.title || "Untitled Project"}</CardTitle>
        {formData.categoryId && <Badge variant="outline">{formData.categoryId}</Badge>}
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.aboutBusiness && (
          <div>
            <h4 className="font-medium mb-2">Project Description</h4>
            <p className="text-slate-300">{formData.aboutBusiness}</p>
          </div>
        )}

        {(formData.budgetMin || formData.budgetMax) && (
          <div>
            <h4 className="font-medium mb-2">Budget</h4>
            <p className="text-slate-300">
              ${formData.budgetMin?.toLocaleString() || "0"} - ${formData.budgetMax?.toLocaleString() || "TBD"}
            </p>
          </div>
        )}

        {formData.tags && formData.tags.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {formData.detailedNeeds && formData.detailedNeeds.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Requirements</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {formData.detailedNeeds.map((need, index) => (
                <li key={index}>{need}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
