"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lightbulb, HelpCircle, Info, Plus, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { CategoryTemplate, Question, SubQuestion, QuestionSection } from "@/types/guided-listing-types"

interface QualificationQuestion {
  id: string
  question: string
  type: "text" | "multiline" | "radio" | "checkbox"
  options?: string[]
  required: boolean
  helpText?: string
}

interface QualificationQuestionsProps {
  template: CategoryTemplate
  responses: Record<string, any>
  onUpdate: (responses: Record<string, any>) => void
  questions: QualificationQuestion[]
  onQuestionsChange: (questions: QualificationQuestion[]) => void
  onSave: () => void
  onCancel: () => void
}

export default function QualificationQuestions({
  template,
  responses,
  onUpdate,
  questions,
  onQuestionsChange,
  onSave,
  onCancel,
}: QualificationQuestionsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [newQuestionType, setNewQuestionType] = useState<QualificationQuestion["type"]>("text")

  const handleResponseChange = (questionId: string, value: string) => {
    onUpdate({
      ...responses,
      [questionId]: value,
    })
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const renderSubQuestion = (subQuestion: SubQuestion, parentId: string) => {
    const fullId = `${parentId}_${subQuestion.id}`

    return (
      <div key={subQuestion.id} className="space-y-3 pl-6 border-l-2 border-slate-700">
        <div className="flex items-start gap-3">
          <Label className="text-base font-medium text-white">
            {subQuestion.text}
            {subQuestion.required && <span className="text-red-400 ml-1">*</span>}
          </Label>
          {subQuestion.contextTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400 mt-0.5" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="text-sm">{subQuestion.contextTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {subQuestion.helpText && (
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            {subQuestion.helpText}
          </p>
        )}

        {subQuestion.type === "textarea" ? (
          <Textarea
            placeholder={subQuestion.placeholder}
            value={responses[fullId] || ""}
            onChange={(e) => handleResponseChange(fullId, e.target.value)}
            className="min-h-[100px] bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 resize-none"
          />
        ) : subQuestion.type === "number" ? (
          <Input
            type="number"
            placeholder={subQuestion.placeholder}
            value={responses[fullId] || ""}
            onChange={(e) => handleResponseChange(fullId, e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        ) : (
          <Input
            type="text"
            placeholder={subQuestion.placeholder}
            value={responses[fullId] || ""}
            onChange={(e) => handleResponseChange(fullId, e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        )}
      </div>
    )
  }

  const renderQuestion = (question: Question) => {
    if (question.type === "group") {
      return (
        <div key={question.id} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Label className="text-lg font-medium text-white">
                {question.text}
                {question.required && <span className="text-red-400 ml-1">*</span>}
              </Label>
              <HelpCircle className="h-5 w-5 text-slate-400 mt-0.5" />
            </div>

            {question.helpText && (
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                {question.helpText}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {question.subQuestions?.map((subQuestion) => renderSubQuestion(subQuestion, question.id))}
          </div>

          {question.proTip && (
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-1">ProTip</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{question.proTip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )
    }

    // Regular question rendering
    return (
      <div key={question.id} className="space-y-4">
        <div className="flex items-start gap-3">
          <Label className="text-lg font-medium text-white">
            {question.text}
            {question.required && <span className="text-red-400 ml-1">*</span>}
          </Label>
          {question.contextTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400 mt-0.5" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="text-sm">{question.contextTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <HelpCircle className="h-5 w-5 text-slate-400 mt-0.5" />
        </div>

        {question.helpText && (
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            {question.helpText}
          </p>
        )}

        <Textarea
          placeholder={question.placeholder}
          value={responses[question.id] || ""}
          onChange={(e) => handleResponseChange(question.id, e.target.value)}
          className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 resize-none"
        />

        {question.proTip && (
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-400 mb-1">ProTip</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{question.proTip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderSection = (section: QuestionSection) => {
    const isExpanded = expandedSections.includes(section.id)

    return (
      <div key={section.id} className="space-y-8">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleSection(section.id)}>
            <div className={`w-1 h-8 bg-blue-500 rounded-full ${isExpanded ? "rotate-90" : ""}`}></div>
            <div>
              <h3 className="text-2xl font-bold text-white">{section.title}</h3>
              {section.description && <p className="text-slate-400 mt-1">{section.description}</p>}
            </div>
          </div>

          {section.proTip && (
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-1">ProTip</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{section.proTip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section Questions */}
        {isExpanded && <div className="space-y-8">{section.questions.map(renderQuestion)}</div>}
      </div>
    )
  }

  // Use sections if available, otherwise fall back to individual questions
  const sectionsToRender = template.qualificationSections || []
  const questionsToRender = template.qualificationQuestions || []

  const addQuestion = () => {
    const newQuestion: QualificationQuestion = {
      id: `q-${Date.now()}`,
      question: "",
      type: newQuestionType,
      options: newQuestionType === "radio" || newQuestionType === "checkbox" ? [""] : undefined,
      required: false,
    }

    onQuestionsChange([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    onQuestionsChange(questions.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: string, updates: Partial<QualificationQuestion>) => {
    onQuestionsChange(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const addOption = (questionId: string) => {
    onQuestionsChange(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          return { ...q, options: [...q.options, ""] }
        }
        return q
      }),
    )
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    onQuestionsChange(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          return {
            ...q,
            options: q.options.filter((_, index) => index !== optionIndex),
          }
        }
        return q
      }),
    )
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    onQuestionsChange(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options]
          newOptions[optionIndex] = value
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Understanding Your Needs</h2>
        <p className="text-lg text-slate-400">
          Help us understand your business situation and goals to match you with the right providers.
        </p>
      </div>

      {/* Qualification Questions Management */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Qualification Questions</h2>
        <div className="flex items-center gap-2">
          <select
            className="border rounded p-2 text-sm"
            value={newQuestionType}
            onChange={(e) => setNewQuestionType(e.target.value as QualificationQuestion["type"])}
          >
            <option value="text">Short Text</option>
            <option value="multiline">Long Text</option>
            <option value="radio">Single Choice</option>
            <option value="checkbox">Multiple Choice</option>
          </select>
          <Button onClick={addQuestion} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No qualification questions added yet.</p>
          <p className="text-sm text-gray-400 mt-1">Add questions to help filter out unqualified providers.</p>
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
                  <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`question-${question.id}`}
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      placeholder="Enter your question here"
                      className="flex-1"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Checkbox
                              id={`required-${question.id}`}
                              checked={question.required}
                              onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                            />
                            <Label htmlFor={`required-${question.id}`} className="ml-2 text-sm cursor-pointer">
                              Required
                            </Label>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Make this question mandatory for providers to answer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`help-${question.id}`}>Help Text (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`help-${question.id}`}
                      value={question.helpText || ""}
                      onChange={(e) => updateQuestion(question.id, { helpText: e.target.value })}
                      placeholder="Additional context or instructions"
                      className="flex-1"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Help text provides additional context for the question</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {(question.type === "radio" || question.type === "checkbox") && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          {question.type === "radio" ? (
                            <RadioGroup value={option}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`r-${question.id}-${optionIndex}`} />
                              </div>
                            </RadioGroup>
                          ) : (
                            <Checkbox id={`c-${question.id}-${optionIndex}`} />
                          )}
                          <Input
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(question.id, optionIndex)}
                            disabled={question.options?.length === 1}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addOption(question.id)} className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}

                {question.type === "text" && (
                  <div className="border rounded-md p-3 bg-gray-50">
                    <Label className="text-sm text-gray-500">Preview:</Label>
                    <Input disabled placeholder="Short text answer" className="mt-1 bg-white" />
                  </div>
                )}

                {question.type === "multiline" && (
                  <div className="border rounded-md p-3 bg-gray-50">
                    <Label className="text-sm text-gray-500">Preview:</Label>
                    <Textarea disabled placeholder="Long text answer" className="mt-1 bg-white" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Render Sections */}
      {sectionsToRender.map(renderSection)}

      {/* Fallback: Render Individual Questions */}
      {sectionsToRender.length === 0 && questionsToRender.length > 0 && (
        <div className="space-y-8">{questionsToRender.map(renderQuestion)}</div>
      )}

      {/* General AI Tip */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">AI Tip</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                The more detail you provide, the better we can match you with providers who specialize in your specific
                needs. Don't worry about being too technical - focus on your business goals and current challenges.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Questions</Button>
      </div>
    </div>
  )
}
