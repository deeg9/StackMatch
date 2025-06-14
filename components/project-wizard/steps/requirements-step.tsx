"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import {
  updateData,
  addRequirement,
  updateRequirement,
  removeRequirement,
  addTechnology,
  removeTechnology,
  addSkill,
  removeSkill,
} from "@/store/slices/projectWizardSlice"
import type { ProjectRequirement } from "@/store/slices/projectWizardSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Trash2, Edit, AlertCircle, Code, Settings, Shield } from "lucide-react"

const requirementCategories = [
  "Functional",
  "Technical",
  "Performance",
  "Security",
  "Integration",
  "User Experience",
  "Compliance",
  "Maintenance",
]

const popularTechnologies = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "C#",
  ".NET",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "TypeScript",
  "JavaScript",
  "HTML/CSS",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "GraphQL",
  "REST API",
  "Microservices",
]

const timelineOptions = ["Less than 1 month", "1-3 months", "3-6 months", "6-12 months", "More than 1 year"]

export function RequirementsStep() {
  const dispatch = useDispatch()
  const { data } = useSelector((state: RootState) => state.projectWizard)
  const [newRequirement, setNewRequirement] = useState<Omit<ProjectRequirement, "id">>({
    title: "",
    description: "",
    priority: "MEDIUM",
    category: "Functional",
  })
  const [editingRequirement, setEditingRequirement] = useState<string | null>(null)
  const [newTechnology, setNewTechnology] = useState("")
  const [newSkill, setNewSkill] = useState("")

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateData({ [field]: value }))
  }

  const handleAddRequirement = () => {
    if (newRequirement.title.trim() && newRequirement.description.trim()) {
      dispatch(addRequirement(newRequirement))
      setNewRequirement({
        title: "",
        description: "",
        priority: "MEDIUM",
        category: "Functional",
      })
    }
  }

  const handleUpdateRequirement = (requirement: ProjectRequirement) => {
    dispatch(updateRequirement(requirement))
    setEditingRequirement(null)
  }

  const handleRemoveRequirement = (id: string) => {
    dispatch(removeRequirement(id))
  }

  const handleAddTechnology = (tech: string) => {
    if (tech.trim() && !data.preferredTechnologies.includes(tech.trim())) {
      dispatch(addTechnology(tech.trim()))
      setNewTechnology("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    dispatch(removeTechnology(tech))
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(addSkill(newSkill.trim()))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    dispatch(removeSkill(skill))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      case "LOW":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Technical":
        return <Code className="h-4 w-4" />
      case "Security":
        return <Shield className="h-4 w-4" />
      case "Performance":
        return <Settings className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="requirements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="technical">Technical Specs</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
        </TabsList>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Requirements & Skills</h3>
            <p className="text-muted-foreground mb-4">
              Define specific requirements and skills for your project. Be as detailed as possible to help providers
              understand your needs.
            </p>

            {/* Add New Requirement */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Add New Requirement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="req-title">Requirement Title</Label>
                    <Input
                      id="req-title"
                      value={newRequirement.title}
                      onChange={(e) => setNewRequirement((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., User Authentication System"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="req-category">Category</Label>
                      <Select
                        value={newRequirement.category}
                        onValueChange={(value) => setNewRequirement((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {requirementCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="req-priority">Priority</Label>
                      <Select
                        value={newRequirement.priority}
                        onValueChange={(value: "HIGH" | "MEDIUM" | "LOW") =>
                          setNewRequirement((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="req-description">Description</Label>
                  <Textarea
                    id="req-description"
                    value={newRequirement.description}
                    onChange={(e) => setNewRequirement((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this requirement in detail..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleAddRequirement}
                  disabled={!newRequirement.title.trim() || !newRequirement.description.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </CardContent>
            </Card>

            {/* Requirements List */}
            <div className="space-y-4">
              {data.requirements.map((requirement) => (
                <Card key={requirement.id}>
                  <CardContent className="pt-6">
                    {editingRequirement === requirement.id ? (
                      <EditRequirementForm
                        requirement={requirement}
                        onSave={handleUpdateRequirement}
                        onCancel={() => setEditingRequirement(null)}
                      />
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(requirement.category)}
                            <h4 className="font-semibold">{requirement.title}</h4>
                            <Badge variant={getPriorityColor(requirement.priority) as any}>
                              {requirement.priority}
                            </Badge>
                            <Badge variant="outline">{requirement.category}</Badge>
                          </div>
                          <p className="text-muted-foreground">{requirement.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => setEditingRequirement(requirement.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveRequirement(requirement.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {data.requirements.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No requirements added yet. Add your first requirement above.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <Button onClick={handleAddSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Technical Specifications Tab */}
        <TabsContent value="technical" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Technical Specifications</h3>
            <p className="text-muted-foreground mb-4">
              Provide technical details, architecture preferences, and technology requirements.
            </p>

            <div className="space-y-6">
              <div>
                <Label htmlFor="technical-specs">Technical Specifications</Label>
                <Textarea
                  id="technical-specs"
                  value={data.technicalSpecs}
                  onChange={(e) => handleInputChange("technicalSpecs", e.target.value)}
                  placeholder="Describe technical requirements, architecture preferences, performance needs, scalability requirements, etc."
                  rows={6}
                  className="mt-1"
                />
              </div>

              {/* Preferred Technologies */}
              <div>
                <Label>Preferred Technologies</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Specify technologies, frameworks, or tools you prefer or require.
                </p>

                {/* Current Technologies */}
                {data.preferredTechnologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {data.preferredTechnologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveTechnology(tech)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Technology */}
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add a technology..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTechnology(newTechnology)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddTechnology(newTechnology)}
                    disabled={!newTechnology.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Popular Technologies */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Popular Technologies</CardTitle>
                    <CardDescription className="text-xs">Click to add commonly used technologies</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {popularTechnologies
                        .filter((tech) => !data.preferredTechnologies.includes(tech))
                        .slice(0, 20)
                        .map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleAddTechnology(tech)}
                          >
                            {tech}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Constraints Tab */}
        <TabsContent value="constraints" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Constraints & Limitations</h3>
            <p className="text-muted-foreground mb-4">
              Specify any constraints, limitations, or special considerations for your project.
            </p>

            <div>
              <Label htmlFor="constraints">Project Constraints</Label>
              <Textarea
                id="constraints"
                value={data.constraints}
                onChange={(e) => handleInputChange("constraints", e.target.value)}
                placeholder="Describe any constraints such as:
• Budget limitations
• Technology restrictions
• Compliance requirements
• Integration with existing systems
• Timeline constraints
• Resource limitations
• Geographic restrictions"
                rows={8}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Include any limitations that providers should be aware of when planning their approach.
              </p>
            </div>

            {/* Project Timeline */}
            <div>
              <Label htmlFor="timeline">Project Timeline *</Label>
              <Select value={data.timeline} onValueChange={(value) => dispatch(updateData({ timeline: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Edit Requirement Form Component
function EditRequirementForm({
  requirement,
  onSave,
  onCancel,
}: {
  requirement: ProjectRequirement
  onSave: (req: ProjectRequirement) => void
  onCancel: () => void
}) {
  const [editedReq, setEditedReq] = useState(requirement)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Title</Label>
          <Input
            value={editedReq.title}
            onChange={(e) => setEditedReq((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Category</Label>
            <Select
              value={editedReq.category}
              onValueChange={(value) => setEditedReq((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {requirementCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select
              value={editedReq.priority}
              onValueChange={(value: "HIGH" | "MEDIUM" | "LOW") =>
                setEditedReq((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={editedReq.description}
          onChange={(e) => setEditedReq((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(editedReq)} size="sm">
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  )
}
