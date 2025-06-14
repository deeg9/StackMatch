"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon, PlusIcon, TrashIcon } from "lucide-react"

interface QualificationQuestion {
  id: string
  question: string
  type: "text" | "longText" | "yesNo" | "multipleChoice"
  required: boolean
  options?: string[]
}

interface QualificationQuestionsProps {
  questions: QualificationQuestion[]
  onQuestionsChange: (questions: QualificationQuestion[]) => void
  onNext: () => void
  onBack: () => void
}

export function QualificationQuestions({ questions, onQuestionsChange, onNext, onBack }: QualificationQuestionsProps) {
  const [newQuestion, setNewQuestion] = useState<Partial<QualificationQuestion>>({
    question: "",
    type: "text",
    required: true,
    options: [""],
  })

  const addQuestion = () => {
    if (!newQuestion.question) return

    const updatedQuestions = [
      ...questions,
      {
        id: `q-${Date.now()}`,
        question: newQuestion.question,
        type: newQuestion.type || "text",
        required: newQuestion.required || false,
        options: newQuestion.type === "multipleChoice" ? newQuestion.options : undefined,
      } as QualificationQuestion,
    ]

    onQuestionsChange(updatedQuestions)
    setNewQuestion({
      question: "",
      type: "text",
      required: true,
      options: [""],
    })
  }

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id)
    onQuestionsChange(updatedQuestions)
  }

  const updateQuestion = (id: string, field: keyof QualificationQuestion, value: any) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, [field]: value }
      }
      return q
    })
    onQuestionsChange(updatedQuestions)
  }

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...(newQuestion.options || []), ""],
    })
  }

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...(newQuestion.options || [])]
    updatedOptions[index] = value
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    })
  }

  const removeOption = (index: number) => {
    const updatedOptions = [...(newQuestion.options || [])]
    updatedOptions.splice(index, 1)
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    })
  }

  const updateExistingOption = (questionId: string, optionIndex: number, value: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId && q.options) {
        const updatedOptions = [...q.options]
        updatedOptions[optionIndex] = value
        return { ...q, options: updatedOptions }
      }
      return q
    })
    onQuestionsChange(updatedQuestions)
  }

  const addExistingOption = (questionId: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, options: [...(q.options || []), ""] }
      }
      return q
    })
    onQuestionsChange(updatedQuestions)
  }

  const removeExistingOption = (questionId: string, optionIndex: number) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId && q.options) {
        const updatedOptions = [...q.options]
        updatedOptions.splice(optionIndex, 1)
        return { ...q, options: updatedOptions }
      }
      return q
    })
    onQuestionsChange(updatedQuestions)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Qualification Questions</CardTitle>
          <CardDescription>Add questions to help qualify potential providers for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className="border rounded-md p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <Label htmlFor={`question-${question.id}`}>Question</Label>
                    <Input
                      id={`question-${question.id}`}
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)} className="ml-2">
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Remove question</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`type-${question.id}`}>Question Type</Label>
                    <select
                      id={`type-${question.id}`}
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, "type", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="text">Short Text</option>
                      <option value="longText">Long Text</option>
                      <option value="yesNo">Yes/No</option>
                      <option value="multipleChoice">Multiple Choice</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id={`required-${question.id}`}
                      checked={question.required}
                      onCheckedChange={(checked) => updateQuestion(question.id, "required", checked)}
                    />
                    <Label htmlFor={`required-${question.id}`}>Required</Label>
                  </div>
                </div>

                {question.type === "multipleChoice" && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateExistingOption(question.id, index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExistingOption(question.id, index)}
                          disabled={question.options?.length === 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Remove option</span>
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addExistingOption(question.id)} className="mt-2">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No qualification questions added yet. Add questions to help qualify potential providers.
            </div>
          )}

          <div className="border rounded-md p-4 space-y-3 mt-6">
            <h3 className="font-medium">Add New Question</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="new-question">Question</Label>
                <Input
                  id="new-question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Enter your question"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-question-type">Question Type</Label>
                  <select
                    id="new-question-type"
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="text">Short Text</option>
                    <option value="longText">Long Text</option>
                    <option value="yesNo">Yes/No</option>
                    <option value="multipleChoice">Multiple Choice</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="new-question-required"
                    checked={newQuestion.required}
                    onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, required: checked })}
                  />
                  <Label htmlFor="new-question-required">Required</Label>
                </div>
              </div>

              {newQuestion.type === "multipleChoice" && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {newQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        disabled={newQuestion.options?.length === 1}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Remove option</span>
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              )}
            </div>

            <Button onClick={addQuestion} disabled={!newQuestion.question} className="w-full mt-2">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Button onClick={onNext}>Continue</Button>
                  <InfoIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Qualification questions are optional but recommended</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </div>
  )
}
