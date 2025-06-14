"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ScopingQuestion {
  id: string
  question: string
  description?: string
  required: boolean
  category?: string
}

interface ScopingQuestionsProps {
  questions: ScopingQuestion[]
  onQuestionsChange: (questions: ScopingQuestion[]) => void
  categories: string[]
  onNext: () => void
  onBack: () => void
}

export function ScopingQuestions({ questions, onQuestionsChange, categories, onNext, onBack }: ScopingQuestionsProps) {
  const [newQuestion, setNewQuestion] = useState<Partial<ScopingQuestion>>({
    question: "",
    description: "",
    required: true,
    category: categories[0],
  })

  const addQuestion = () => {
    if (!newQuestion.question) return

    const updatedQuestions = [
      ...questions,
      {
        id: `sq-${Date.now()}`,
        question: newQuestion.question,
        description: newQuestion.description,
        required: newQuestion.required || false,
        category: newQuestion.category,
      } as ScopingQuestion,
    ]

    onQuestionsChange(updatedQuestions)
    setNewQuestion({
      question: "",
      description: "",
      required: true,
      category: categories[0],
    })
  }

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id)
    onQuestionsChange(updatedQuestions)
  }

  const updateQuestion = (id: string, field: keyof ScopingQuestion, value: any) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, [field]: value }
      }
      return q
    })
    onQuestionsChange(updatedQuestions)
  }

  // Group questions by category
  const groupedQuestions = questions.reduce(
    (acc, question) => {
      const category = question.category || "General"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(question)
      return acc
    },
    {} as Record<string, ScopingQuestion[]>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scoping Questions</CardTitle>
          <CardDescription>Add questions to help providers understand the scope of your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.length > 0 ? (
            Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-medium flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {category}
                  </Badge>
                  {category} Questions
                </h3>
                {categoryQuestions.map((question) => (
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

                    <div>
                      <Label htmlFor={`description-${question.id}`}>Description (Optional)</Label>
                      <Textarea
                        id={`description-${question.id}`}
                        value={question.description || ""}
                        onChange={(e) => updateQuestion(question.id, "description", e.target.value)}
                        placeholder="Add context or explanation for this question"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`required-${question.id}`}
                          checked={question.required}
                          onCheckedChange={(checked) => updateQuestion(question.id, "required", checked)}
                        />
                        <Label htmlFor={`required-${question.id}`}>Required</Label>
                      </div>

                      <div>
                        <Label htmlFor={`category-${question.id}`} className="mr-2">
                          Category
                        </Label>
                        <select
                          id={`category-${question.id}`}
                          value={question.category}
                          onChange={(e) => updateQuestion(question.id, "category", e.target.value)}
                          className="inline-flex h-9 w-auto rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No scoping questions added yet. Add questions to help providers understand your project requirements.
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

              <div>
                <Label htmlFor="new-description">Description (Optional)</Label>
                <Textarea
                  id="new-description"
                  value={newQuestion.description || ""}
                  onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                  placeholder="Add context or explanation for this question"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-question-required"
                    checked={newQuestion.required}
                    onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, required: checked })}
                  />
                  <Label htmlFor="new-question-required">Required</Label>
                </div>

                <div>
                  <Label htmlFor="new-question-category" className="mr-2">
                    Category
                  </Label>
                  <select
                    id="new-question-category"
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    className="inline-flex h-9 w-auto rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                <p>Scoping questions help providers understand your project better</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </div>
  )
}
