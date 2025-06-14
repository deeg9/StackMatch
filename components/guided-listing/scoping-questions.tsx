"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CategoryTemplate } from "@/types/guided-listing-types"

interface ScopingQuestion {
  id: string
  question: string
  category: "technical" | "business" | "timeline" | "budget" | "other"
  importance: "high" | "medium" | "low"
  description?: string
}

interface ScopingQuestionsProps {
  template: CategoryTemplate
  responses: Record<string, any>
  onUpdate: (responses: Record<string, any>) => void
  qualificationContext: Record<string, any>
  questions: ScopingQuestion[]
  onQuestionsChange: (questions: ScopingQuestion[]) => void
  onSave: () => void
  onCancel: () => void
  suggestedQuestions?: ScopingQuestion[]
}

export default function ScopingQuestions({
  template,
  responses,
  onUpdate,
  qualificationContext,
  questions,
  onQuestionsChange,
  onSave,
  onCancel,
  suggestedQuestions = [],
}: ScopingQuestionsProps) {
  const [enhancingField, setEnhancingField] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(suggestedQuestions.length > 0)

  const handleResponseChange = (questionId: string, value: any) => {
    const updatedResponses = {
      ...responses,
      [questionId]: value,
    }
    onUpdate(updatedResponses)
  }

  const handleEnhanceResponse = async (questionId: string) => {
    const currentResponse = responses[questionId]
    if (!currentResponse) return

    setEnhancingField(questionId)

    try {
      const response = await fetch("/api/ai/enhance-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          currentResponse,
          context: {
            category: template.id || template.value,
            relatedResponses: responses,
            qualificationContext,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        handleResponseChange(questionId, data.enhancedResponse)
      }
    } catch (error) {
      console.error("Error enhancing response:", error)
    } finally {
      setEnhancingField(null)
    }
  }

  // Add a new question
  const addQuestion = () => {
    const newQuestion: ScopingQuestion = {
      id: `sq-${Date.now()}`,
      question: "",
      category: "technical",
      importance: "medium",
    }

    onQuestionsChange([...questions, newQuestion])
  }

  // Remove a question
  const removeQuestion = (id: string) => {
    onQuestionsChange(questions.filter((q) => q.id !== id))
  }

  // Update a question
  const updateQuestion = (id: string, updates: Partial<ScopingQuestion>) => {
    onQuestionsChange(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  // Add a suggested question
  const addSuggestedQuestion = (question: ScopingQuestion) => {
    // Check if we already have this question (by comparing the question text)
    const exists = questions.some((q) => q.question === question.question)
    if (!exists) {
      onQuestionsChange([...questions, { ...question, id: `sq-${Date.now()}` }])
    }
  }

  // Get category label
  const getCategoryLabel = (category: ScopingQuestion["category"]) => {
    switch (category) {
      case "technical":
        return "Technical"
      case "business":
        return "Business"
      case "timeline":
        return "Timeline"
      case "budget":
        return "Budget"
      case "other":
        return "Other"
      default:
        return category
    }
  }

  // Get importance label and color
  const getImportanceInfo = (importance: ScopingQuestion["importance"]) => {
    switch (importance) {
      case "high":
        return { label: "High", color: "bg-red-100 text-red-800" }
      case "medium":
        return { label: "Medium", color: "bg-yellow-100 text-yellow-800" }
      case "low":
        return { label: "Low", color: "bg-green-100 text-green-800" }
      default:
        return { label: importance, color: "bg-gray-100 text-gray-800" }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Technical Requirements</h2>
        <p className="text-lg text-slate-400">
          Specify the technical details and scope for your {template.name || template.label} project.
        </p>
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="border rounded-md p-4 bg-blue-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-blue-800">Suggested Questions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showSuggestions ? "Hide" : "Show"} Suggestions
            </Button>
          </div>

          {showSuggestions && (
            <div className="space-y-3">
              {suggestedQuestions.map((question) => (
                <div key={question.id} className="bg-white border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{question.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                        {getCategoryLabel(question.category)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getImportanceInfo(question.importance).color}`}
                      >
                        {getImportanceInfo(question.importance).label} Priority
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addSuggestedQuestion(question)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No scoping questions added yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Add questions to help providers understand your project requirements.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between">
                  <span>Question {index + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)} className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor={`question-${question.id}`}>Question</Label>
                  <Input
                    id={`question-${question.id}`}
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                    placeholder="Enter your question here"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`category-${question.id}`}>Category</Label>
                    <Select
                      value={question.category}
                      onValueChange={(value) =>
                        updateQuestion(question.id, { category: value as ScopingQuestion["category"] })
                      }
                    >
                      <SelectTrigger id={`category-${question.id}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="timeline">Timeline</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`importance-${question.id}`}>Importance</Label>
                    <Select
                      value={question.importance}
                      onValueChange={(value) =>
                        updateQuestion(question.id, { importance: value as ScopingQuestion["importance"] })
                      }
                    >
                      <SelectTrigger id={`importance-${question.id}`}>
                        <SelectValue placeholder="Select importance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${question.id}`}>Additional Context (Optional)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Provide additional context to help providers understand the question better</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id={`description-${question.id}`}
                    value={question.description || ""}
                    onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                    placeholder="Provide additional context or details about this question"
                    className="min-h-[100px]"
                  />
                </div>

                {/* Existing Questions */}
                {question.id === "features" && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe the key features and functionality..."
                      value={responses.features || ""}
                      onChange={(e) => handleResponseChange("features", e.target.value)}
                      className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 resize-none"
                    />
                    {responses.features && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnhanceResponse("features")}
                        disabled={enhancingField === "features"}
                        className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {enhancingField === "features" ? "Enhancing..." : "Enhance with AI"}
                      </Button>
                    )}
                  </div>
                )}

                {question.id === "technical_requirements" && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Share any technical requirements or constraints..."
                      value={responses.technical_requirements || ""}
                      onChange={(e) => handleResponseChange("technical_requirements", e.target.value)}
                      className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 resize-none"
                    />
                    {responses.technical_requirements && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnhanceResponse("technical_requirements")}
                        disabled={enhancingField === "technical_requirements"}
                        className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {enhancingField === "technical_requirements" ? "Enhancing..." : "Enhance with AI"}
                      </Button>
                    )}
                  </div>
                )}

                {question.id === "integrations" && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe existing systems and integration needs..."
                      value={responses.integrations || ""}
                      onChange={(e) => handleResponseChange("integrations", e.target.value)}
                      className="min-h-[100px] bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 resize-none"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Question Button */}
      <div className="flex justify-end items-center gap-2">
        <Button onClick={addQuestion} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Questions</Button>
      </div>

      {/* AI Tip */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Plus className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">AI Tip</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Be specific about your technical needs. Mention preferred technologies, platforms, or any existing
                systems that need integration. This helps providers give you more accurate proposals and timelines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
