"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar, Target, FileText, Users, Clock } from "lucide-react"

export function ProjectPreview() {
  const { data } = useSelector((state: RootState) => state.projectWizard)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Preview</h1>
        <p className="text-muted-foreground">This is how your project will appear to providers</p>
      </div>

      {/* Main Project Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{data.title || "Project Title"}</CardTitle>
              <p className="text-muted-foreground mb-4">{data.summary || "Project summary will appear here"}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted today
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />0 proposals
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {data.timeline || "Timeline not specified"}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {data.budgetMin > 0 && data.budgetMax > 0
                  ? `${formatCurrency(data.budgetMin)} - ${formatCurrency(data.budgetMax)}`
                  : "Budget TBD"}
              </div>
              <p className="text-sm text-muted-foreground">{data.budgetType || "Fixed Price"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tags */}
          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Project Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {data.description || "Project description will appear here..."}
            </p>
          </div>

          {/* Requirements */}
          {data.requirements.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Requirements ({data.requirements.length})
                </h3>
                <div className="space-y-3">
                  {data.requirements.map((req) => (
                    <div key={req.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{req.title}</h4>
                        <Badge
                          variant={
                            req.priority === "HIGH"
                              ? "destructive"
                              : req.priority === "MEDIUM"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {req.priority}
                        </Badge>
                        <Badge variant="outline">{req.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Technical Specifications */}
          {data.technicalSpecs && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Technical Specifications</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{data.technicalSpecs}</p>
              </div>
            </>
          )}

          {/* Preferred Technologies */}
          {data.preferredTechnologies.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Preferred Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {data.preferredTechnologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Success Metrics */}
          {data.outcomes.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Success Metrics
                </h3>
                <div className="space-y-3">
                  {data.outcomes.map((outcome) => (
                    <div key={outcome.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{outcome.metric}</h4>
                        {outcome.unit && <Badge variant="outline">{outcome.unit}</Badge>}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Current: </span>
                          <span>{outcome.currentValue || "Not specified"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Target: </span>
                          <span className="font-medium text-green-600">{outcome.targetValue}</span>
                        </div>
                      </div>
                      {outcome.description && (
                        <p className="text-sm text-muted-foreground mt-2">{outcome.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Project Timeline */}
          {(data.startDate || data.deadline) && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {data.startDate && (
                    <div>
                      <span className="text-muted-foreground">Start Date: </span>
                      <span className="font-medium">{new Date(data.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {data.deadline && (
                    <div>
                      <span className="text-muted-foreground">Deadline: </span>
                      <span className="font-medium">{new Date(data.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Communication Preferences */}
          {data.communicationPreferences && data.communicationPreferences.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Communication Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Preferred Methods: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.communicationPreferences.map((method) => (
                        <Badge key={method} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {data.workingHours && (
                    <div>
                      <span className="text-muted-foreground">Working Hours: </span>
                      <span className="font-medium">{data.workingHours}</span>
                    </div>
                  )}
                </div>
                {data.timezone && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Timezone: </span>
                    <span className="font-medium">{data.timezone}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Attachments */}
          {data.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Project Attachments</h3>
                <div className="space-y-2">
                  {data.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-3 p-2 border rounded">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{attachment.name}</span>
                      <span className="text-xs text-muted-foreground">({attachment.size})</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Provider Questions */}
          {data.providerQuestions.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Questions for Providers</h3>
                <div className="space-y-3">
                  {data.providerQuestions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Q{index + 1}:</span>
                        <span>{question.question}</span>
                        {question.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Response type: {question.type.replace("_", " ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline">Close Preview</Button>
        <Button>Continue Editing</Button>
      </div>
    </div>
  )
}
