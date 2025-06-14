"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { updateData, addTag, removeTag } from "@/store/slices/projectWizardSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Lightbulb } from "lucide-react"
import { useState } from "react"
import type { ProjectCategory } from "@/types"

const categories: { name: ProjectCategory; subcategories: string[] }[] = [
  {
    name: "Web Development",
    subcategories: [
      "Frontend Development",
      "Backend Development",
      "Full-Stack Development",
      "E-commerce",
      "CMS Development",
    ],
  },
  {
    name: "Mobile Development",
    subcategories: ["iOS Development", "Android Development", "Cross-Platform", "React Native", "Flutter"],
  },
  {
    name: "Enterprise Software",
    subcategories: ["CRM Systems", "ERP Solutions", "Business Intelligence", "Workflow Automation", "Integration"],
  },
  {
    name: "AI/ML",
    subcategories: [
      "Machine Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Data Science",
      "Predictive Analytics",
    ],
  },
  {
    name: "DevOps",
    subcategories: ["CI/CD", "Cloud Infrastructure", "Containerization", "Monitoring", "Security"],
  },
  {
    name: "UI/UX Design",
    subcategories: [
      "User Interface Design",
      "User Experience Design",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
    ],
  },
  {
    name: "Data Analytics",
    subcategories: [
      "Data Visualization",
      "Business Intelligence",
      "Data Engineering",
      "Analytics Dashboards",
      "Reporting",
    ],
  },
  {
    name: "Cloud Infrastructure",
    subcategories: ["AWS", "Azure", "Google Cloud", "Multi-Cloud", "Serverless"],
  },
]

const suggestedTags = [
  "React",
  "Node.js",
  "Python",
  "AWS",
  "Mobile",
  "API",
  "Database",
  "Security",
  "Scalable",
  "Real-time",
  "Analytics",
  "Integration",
  "Automation",
  "Cloud",
  "Responsive",
  "Performance",
  "Testing",
  "Documentation",
  "Support",
  "Training",
]

export function BasicInformationStep() {
  const dispatch = useDispatch()
  const { data } = useSelector((state: RootState) => state.projectWizard)
  const [newTag, setNewTag] = useState("")

  const selectedCategory = categories.find((cat) => cat.name === data.category)

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateData({ [field]: value }))
  }

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !data.tags.includes(tag.trim())) {
      dispatch(addTag(tag.trim()))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    dispatch(removeTag(tag))
  }

  return (
    <div className="space-y-8">
      {/* Project Title & Summary */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., E-commerce Platform with Advanced Analytics"
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Create a clear, descriptive title that summarizes your project
          </p>
        </div>

        <div>
          <Label htmlFor="summary">One-Line Summary *</Label>
          <Input
            id="summary"
            value={data.summary}
            onChange={(e) => handleInputChange("summary", e.target.value)}
            placeholder="e.g., Modern e-commerce platform with real-time analytics and inventory management"
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            A brief, compelling summary that appears in search results
          </p>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={data.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={data.subcategory}
            onValueChange={(value) => handleInputChange("subcategory", value)}
            disabled={!selectedCategory}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {selectedCategory?.subcategories.map((subcategory) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <Label htmlFor="description">Project Description *</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Provide a detailed description of your project, including background, goals, and what you're looking to achieve..."
          rows={6}
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Include your business context, project goals, and any relevant background information
        </p>
      </div>

      {/* Tags */}
      <div>
        <Label>Project Tags</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Add tags to help providers find your project. Include technologies, skills, or keywords.
        </p>

        {/* Current Tags */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveTag(tag)} />
              </Badge>
            ))}
          </div>
        )}

        {/* Add New Tag */}
        <div className="flex gap-2 mb-4">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag(newTag)
              }
            }}
          />
          <Button type="button" variant="outline" onClick={() => handleAddTag(newTag)} disabled={!newTag.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggested Tags */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggested Tags
            </CardTitle>
            <CardDescription className="text-xs">Click to add popular tags relevant to your project</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter((tag) => !data.tags.includes(tag))
                .slice(0, 15)
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center text-blue-800">
            <Lightbulb className="h-4 w-4 mr-2" />
            Tips for a Great Project Description
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be specific about what you want to achieve</li>
            <li>• Include your business context and industry</li>
            <li>• Mention any existing systems or constraints</li>
            <li>• Describe your target users or customers</li>
            <li>• Include examples or references if helpful</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
