"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import {
  updateData,
  addProviderQuestion,
  updateProviderQuestion,
  removeProviderQuestion,
  addAttachment,
  removeAttachment,
} from "@/store/slices/projectWizardSlice"
import type { ProviderQuestion, ProjectAttachment } from "@/store/slices/projectWizardSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Trash2, Edit, Upload, FileText, Download, MessageSquare, Clock, Globe, Paperclip } from "lucide-react"

const communicationOptions = [
  "Email",
  "Slack",
  "Microsoft Teams",
  "Discord",
  "Video calls",
  "Phone calls",
  "Project management tools",
  "In-person meetings",
]

const timezones = [
  "UTC-12:00 (Baker Island)",
  "UTC-11:00 (American Samoa)",
  "UTC-10:00 (Hawaii)",
  "UTC-09:00 (Alaska)",
  "UTC-08:00 (Pacific Time)",
  "UTC-07:00 (Mountain Time)",
  "UTC-06:00 (Central Time)",
  "UTC-05:00 (Eastern Time)",
  "UTC-04:00 (Atlantic Time)",
  "UTC-03:00 (Argentina)",
  "UTC-02:00 (South Georgia)",
  "UTC-01:00 (Azores)",
  "UTC+00:00 (London, Dublin)",
  "UTC+01:00 (Paris, Berlin)",
  "UTC+02:00 (Cairo, Helsinki)",
  "UTC+03:00 (Moscow, Istanbul)",
  "UTC+04:00 (Dubai, Baku)",
  "UTC+05:00 (Karachi, Tashkent)",
  "UTC+05:30 (Mumbai, Delhi)",
  "UTC+06:00 (Dhaka, Almaty)",
  "UTC+07:00 (Bangkok, Jakarta)",
  "UTC+08:00 (Beijing, Singapore)",
  "UTC+09:00 (Tokyo, Seoul)",
  "UTC+10:00 (Sydney, Melbourne)",
  "UTC+11:00 (Solomon Islands)",
  "UTC+12:00 (New Zealand)",
]

export function AdditionalDetailsStep() {
  const dispatch = useDispatch()
  const { data } = useSelector((state: RootState) => state.projectWizard)
  const [newQuestion, setNewQuestion] = useState<Omit<ProviderQuestion, "id">>({
    question: "",
    type: "TEXT",
    required: false,
    options: [],
  })
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateData({ [field]: value }))
  }

  const handleCommunicationToggle = (option: string, checked: boolean) => {
    const current = data.communicationPreferences || []
    if (checked) {
      if (!current.includes(option)) {
        dispatch(updateData({ communicationPreferences: [...current, option] }))
      }
    } else {
      dispatch(updateData({ communicationPreferences: current.filter((item) => item !== option) }))
    }
  }

  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      dispatch(addProviderQuestion(newQuestion))
      setNewQuestion({
        question: "",
        type: "TEXT",
        required: false,
        options: [],
      })
    }
  }

  const handleUpdateQuestion = (question: ProviderQuestion) => {
    dispatch(updateProviderQuestion(question))
    setEditingQuestion(null)
  }

  const handleRemoveQuestion = (id: string) => {
    dispatch(removeProviderQuestion(id))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const attachment: ProjectAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type,
          url: URL.createObjectURL(file),
        }
        dispatch(addAttachment(attachment))
      })
    }
  }

  const handleRemoveAttachment = (id: string) => {
    dispatch(removeAttachment(id))
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="attachments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="questions">Provider Questions</TabsTrigger>
          <TabsTrigger value="preferences">Communication</TabsTrigger>
        </TabsList>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Paperclip className="h-5 w-5 mr-2" />
              Project Attachments
            </h3>
            <p className="text-muted-foreground mb-6">
              Upload relevant documents, specifications, designs, or reference materials to help providers understand
              your project better.
            </p>

            {/* File Upload Area */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, PNG, JPG, GIF
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </label>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {data.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Uploaded Files</CardTitle>
                  <CardDescription>{data.attachments.length} file(s) uploaded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">{attachment.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveAttachment(attachment.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Upload Tips */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center text-blue-800">
                  <FileText className="h-4 w-4 mr-2" />
                  Helpful Documents to Include
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Project requirements document or RFP</li>
                  <li>• Wireframes, mockups, or design references</li>
                  <li>• Technical specifications or architecture diagrams</li>
                  <li>• Brand guidelines or style guides</li>
                  <li>• Sample data or content examples</li>
                  <li>• Integration documentation for existing systems</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Provider Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Questions for Providers
            </h3>
            <p className="text-muted-foreground mb-6">
              Add custom questions that providers must answer when submitting their proposals. This helps you gather
              specific information relevant to your project.
            </p>

            {/* Add New Question */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Add Custom Question</CardTitle>
                <CardDescription>Create questions to gather specific information from providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="question-text">Question</Label>
                  <Textarea
                    id="question-text"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, question: e.target.value }))}
                    placeholder="e.g., What is your experience with similar projects in our industry?"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="question-type">Response Type</Label>
                    <Select
                      value={newQuestion.type}
                      onValueChange={(value: "TEXT" | "MULTIPLE_CHOICE" | "NUMBER" | "DATE") =>
                        setNewQuestion((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Text Response</SelectItem>
                        <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                        <SelectItem value="NUMBER">Number</SelectItem>
                        <SelectItem value="DATE">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="question-required"
                      checked={newQuestion.required}
                      onCheckedChange={(checked) =>
                        setNewQuestion((prev) => ({ ...prev, required: checked as boolean }))
                      }
                    />
                    <Label htmlFor="question-required">Required question</Label>
                  </div>
                </div>
                {newQuestion.type === "MULTIPLE_CHOICE" && (
                  <div>
                    <Label>Answer Options</Label>
                    <p className="text-sm text-muted-foreground mb-2">Enter each option on a new line</p>
                    <Textarea
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      onChange={(e) =>
                        setNewQuestion((prev) => ({
                          ...prev,
                          options: e.target.value.split("\n").filter((opt) => opt.trim()),
                        }))
                      }
                      rows={3}
                    />
                  </div>
                )}
                <Button onClick={handleAddQuestion} disabled={!newQuestion.question.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
              {data.providerQuestions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    {editingQuestion === question.id ? (
                      <EditQuestionForm
                        question={question}
                        onSave={handleUpdateQuestion}
                        onCancel={() => setEditingQuestion(null)}
                      />
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{question.question}</h4>
                            <Badge variant="outline">{question.type.replace("_", " ")}</Badge>
                            {question.required && <Badge variant="destructive">Required</Badge>}
                          </div>
                          {question.options && question.options.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground mb-1">Options:</p>
                              <div className="flex flex-wrap gap-1">
                                {question.options.map((option, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(question.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(question.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {data.providerQuestions.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No custom questions added yet. Add your first question above.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Communication Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Communication Preferences
            </h3>
            <p className="text-muted-foreground mb-6">
              Specify your preferred communication methods, working hours, and timezone to help providers understand how
              to collaborate with you effectively.
            </p>

            <div className="space-y-6">
              {/* Communication Methods */}
              <div>
                <Label className="text-base font-medium">Preferred Communication Methods</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select all communication methods you're comfortable using
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {communicationOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`comm-${option}`}
                        checked={data.communicationPreferences?.includes(option) || false}
                        onCheckedChange={(checked) => handleCommunicationToggle(option, checked as boolean)}
                      />
                      <Label htmlFor={`comm-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="working-hours">Working Hours</Label>
                  <Input
                    id="working-hours"
                    value={data.workingHours}
                    onChange={(e) => handleInputChange("workingHours", e.target.value)}
                    placeholder="e.g., 9 AM - 5 PM, Monday - Friday"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    When are you typically available for communication?
                  </p>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={data.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Communication Tips */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center text-purple-800">
            <Clock className="h-4 w-4 mr-2" />
            Communication Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Be clear about your availability and response time expectations</li>
            <li>• Specify your preferred communication frequency (daily, weekly, etc.)</li>
            <li>• Include any communication tools your team already uses</li>
            <li>• Consider time zone differences when setting meeting expectations</li>
            <li>• Provide context about your team's communication style</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

// Edit Question Form Component
function EditQuestionForm({
  question,
  onSave,
  onCancel,
}: {
  question: ProviderQuestion
  onSave: (question: ProviderQuestion) => void
  onCancel: () => void
}) {
  const [editedQuestion, setEditedQuestion] = useState(question)

  return (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Textarea
          value={editedQuestion.question}
          onChange={(e) => setEditedQuestion((prev) => ({ ...prev, question: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Response Type</Label>
          <Select
            value={editedQuestion.type}
            onValueChange={(value: "TEXT" | "MULTIPLE_CHOICE" | "NUMBER" | "DATE") =>
              setEditedQuestion((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Text Response</SelectItem>
              <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
              <SelectItem value="NUMBER">Number</SelectItem>
              <SelectItem value="DATE">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            checked={editedQuestion.required}
            onCheckedChange={(checked) => setEditedQuestion((prev) => ({ ...prev, required: checked as boolean }))}
          />
          <Label>Required question</Label>
        </div>
      </div>
      {editedQuestion.type === "MULTIPLE_CHOICE" && (
        <div>
          <Label>Answer Options</Label>
          <Textarea
            value={editedQuestion.options?.join("\n") || ""}
            onChange={(e) =>
              setEditedQuestion((prev) => ({
                ...prev,
                options: e.target.value.split("\n").filter((opt) => opt.trim()),
              }))
            }
            rows={3}
          />
        </div>
      )}
      <div className="flex gap-2">
        <Button onClick={() => onSave(editedQuestion)} size="sm">
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  )
}
